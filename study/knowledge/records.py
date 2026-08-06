"""Record shapes and the client-facing rule for pipeline B.

Two storage states matter and they are not the same bar:

  accepted      worth keeping in the vault
  client_facing may appear in a document with a human signature on it

`client_facing` is computed, never hand-set. That is the whole safety property:
no reviewer can tick a box that puts an uncorroborated or stale claim in front
of a paying client.
"""

from datetime import date, timedelta

CORROBORATION = ("first-party", "two-source", "single-source-pending")
CONFIDENCE = ("verified", "reported", "contested")

# Review windows follow the observed decay tiers. The durability test: who would
# have to be wrong for this to stop being true? If the answer is one vendor's
# product manager, it expires fast. If it is decades of replication, it does not.
# Measured magnitudes are the trap: they rebound, so a stale figure can be wrong
# in either direction, not merely out of date.
VOLATILITY_WINDOWS = {
    "feature-surface": 182,       # where a button is, which report exists
    "policy-control": 365,        # match-type semantics, crawler controls; often reverses
    "measured-magnitude": 365,    # CTR curves, referral share; non-monotonic, rebounds
    "structural": 1460,           # auction mechanics, incrementality vs correlation
    "empirical-generalisation": 3650,
}

# `quote` is the verbatim text as published. `claim` is our restatement of it and
# is always derived. The gate runs on the quote, never on the restatement.
#
# The failure this prevents: a model normalises a claim slightly stronger than the
# source wrote it, and from then on the gate, the corroboration check and the
# confidence all attach to the paraphrase. The record reads as internally
# consistent, so a reviewer approves it, and a client document ends up citing a
# real source that does not quite say that. Catching it requires rereading the
# original, which is the first step any review workflow erodes.
REQUIRED = (
    "id", "quote", "claim", "mechanism", "disproof", "applies_when",
    "does_not_apply", "changes", "source", "corroboration", "confidence",
    "volatility",
)

# Fields that invalidate a human approval if they change. Editing any of them on
# an approved claim demotes it, which is what keeps "nothing unreviewed reaches a
# client" true over time rather than only on the day it was approved.
APPROVAL_BINDING = ("quote", "claim", "mechanism", "source", "corroboration")


def review_by(volatility, captured):
    if volatility not in VOLATILITY_WINDOWS:
        raise ValueError(f"unknown volatility class: {volatility}")
    return captured + timedelta(days=VOLATILITY_WINDOWS[volatility])


def is_client_facing(record, today=None):
    """Corroborated, verified, in date. Any one missing and it stays internal."""
    today = today or date.today()
    if record.get("corroboration") not in ("first-party", "two-source"):
        return False
    if record.get("confidence") != "verified":
        return False
    stamp = record.get("review_by")
    if not stamp:
        return False
    if isinstance(stamp, str):
        stamp = date.fromisoformat(stamp)
    return stamp >= today


def validate(record):
    """Structural check only. Whether a mechanism is real is a human judgement."""
    problems = [f"missing field: {f}" for f in REQUIRED if not record.get(f)]
    if record.get("corroboration") not in CORROBORATION:
        problems.append(f"corroboration must be one of {CORROBORATION}")
    if record.get("confidence") not in CONFIDENCE:
        problems.append(f"confidence must be one of {CONFIDENCE}")
    if record.get("volatility") not in VOLATILITY_WINDOWS:
        problems.append(f"volatility must be one of {tuple(VOLATILITY_WINDOWS)}")
    source = record.get("source") or {}
    for field in ("url", "archived_url", "author", "tier", "published", "captured"):
        if not source.get(field):
            problems.append(f"missing source.{field}")
    # An unarchived source is untraceable the moment the URL rots, which is
    # exactly when a client asks "says who?".
    return problems


def renderable(record):
    """The only text a client document may render.

    Documents quote the source verbatim. A restatement can drift; the published
    words cannot.
    """
    if record.get("state") != "approved":
        raise ValueError(f"not approved for client use: {record.get('id')}")
    return record["quote"]


def demote_if_edited(approved, incoming):
    """Any change to the evidence a human signed off on sends it back to review."""
    changed = [f for f in APPROVAL_BINDING if approved.get(f) != incoming.get(f)]
    if changed:
        incoming = dict(incoming, state="pending", client_facing=False,
                        demoted_because=changed)
    return incoming


def contest(record_a, record_b):
    """A contradiction benches both claims until a human settles it.

    Silently holding two contradictory claims means the audit writer uses
    whichever they read last.
    """
    for record in (record_a, record_b):
        record["confidence"] = "contested"
        record["client_facing"] = False
    return record_a, record_b
