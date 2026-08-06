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

# Review windows are chosen defaults, not measured facts. Platform mechanics rot
# on platform release cycles; how buyers behave moves far more slowly.
VOLATILITY_WINDOWS = {
    "platform-mechanic": 182,
    "tooling": 365,
    "human-behavior": 730,
}

REQUIRED = (
    "id", "claim", "mechanism", "disproof", "applies_when", "does_not_apply",
    "changes", "source", "corroboration", "confidence", "volatility",
)


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


def contest(record_a, record_b):
    """A contradiction benches both claims until a human settles it.

    Silently holding two contradictory claims means the audit writer uses
    whichever they read last.
    """
    for record in (record_a, record_b):
        record["confidence"] = "contested"
        record["client_facing"] = False
    return record_a, record_b
