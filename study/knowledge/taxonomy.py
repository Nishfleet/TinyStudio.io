"""Rejection reasons for pipeline B.

The taxonomy is the filter. Every rejection is logged under one of these names,
and once a name accumulates a recognisable machine-readable form, that form gets
promoted into the automated screen. Automating the gate before knowing what it
rejects is how the garbage gets in, so this list is the thing that grows.

`auto` marks a reason the screen may apply on its own. Everything else needs a
person, and the screen must not pretend otherwise.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class Reason:
    name: str
    level: str  # source | claim | relevance
    test: str
    auto: bool


REASONS = (
    # Source level. These kill the source before any claim is extracted.
    Reason("SELLING", "source",
           "The content funnels to something the author sells.", True),
    Reason("VENDOR-GOSPEL", "source",
           "A platform's claim about how well its own product performs.", False),
    Reason("INCENTIVE-CONFLICT", "source",
           "If the claim is true, the author's product becomes necessary.", False),
    Reason("UNTRACEABLE", "source",
           "No accountable author, or the primary source cannot be archived.", True),

    # Claim level.
    Reason("OUTCOME-ONLY", "claim",
           "Delete the numbers and nothing is left.", False),
    Reason("FAKE-MECHANISM", "claim",
           "Mechanism-shaped words naming no checkable system behaviour.", False),
    Reason("NO-METHOD-NUMBER", "claim",
           "A quantity with no population, timeframe or measurement tool.", True),
    Reason("DASHBOARD-ORPHAN", "claim",
           "Performance screenshot with no account context.", True),
    Reason("SURVIVOR", "claim",
           "A tactic reported only by its winners, with no denominator.", False),
    Reason("ECHO", "claim",
           "The corroborating sources share a citation ancestor.", False),
    Reason("ANECDOTE-AS-LAW", "claim",
           "One account's experience worded as a general rule.", False),
    Reason("UNFALSIFIABLE-AS-WRITTEN", "claim",
           "No observation could disprove it.", False),
    Reason("EXPIRED", "claim",
           "Predates a known change to the mechanic it describes.", True),

    # Relevance level. True, sourced, and useless to this buyer.
    Reason("WRONG-POPULATION", "relevance",
           "Depends on volume or purchase-cycle properties our buyers lack.", False),
    Reason("INACTIONABLE", "relevance",
           "Changes no appraisal section and no retainer work item.", False),
)

BY_NAME = {r.name: r for r in REASONS}
AUTO_REASONS = tuple(r.name for r in REASONS if r.auto)


def validate(names):
    """Reject unknown reason names loudly. A typo'd reason is a lost pattern."""
    unknown = [n for n in names if n not in BY_NAME]
    if unknown:
        raise ValueError(f"unknown rejection reason(s): {', '.join(unknown)}")
    return list(names)
