"""Evidence lineage for pipeline B.

Three sources agreeing is not three independent sources supporting a claim.
Counting citations cannot tell the difference, so this collapses sources that
share an origin into a single lineage and counts lineages instead.

The test case this exists to catch is in sources.json under `calibration_test`:
several sites published detailed, internally consistent, mutually corroborating
analysis of a platform update that never happened. Every one of them traces to
the same invented premise. A citation count passes it. A lineage count does not.
"""

from collections import defaultdict


class Lineage:
    """Sources grouped by earliest identifiable evidence.

    `origin` is whatever a source was traced back to: a study, a document, a
    dataset, a panel, or another source. Unknown origin is not treated as
    independence, which is the mistake that makes fabrications look corroborated.
    """

    def __init__(self):
        self._origin = {}      # source url -> origin key
        self._owner = {}       # source url -> owning entity, if any
        self._panel = {}       # source url -> measurement panel, if any

    def add(self, url, origin=None, owner=None, panel=None):
        self._origin[url] = origin
        if owner:
            self._owner[url] = owner
        if panel:
            self._panel[url] = panel
        return self

    def _key(self, url):
        """Shared origin, shared owner or shared panel all mean one lineage.

        Provenance is tracked at the data-source level, not the publisher level:
        two outlets running on the same measurement panel are one piece of
        evidence wearing two mastheads.
        """
        if self._panel.get(url):
            return ("panel", self._panel[url])
        if self._origin.get(url):
            return ("origin", self._origin[url])
        if self._owner.get(url):
            return ("owner", self._owner[url])
        return ("untraced", url)

    def groups(self):
        out = defaultdict(list)
        for url in self._origin:
            out[self._key(url)].append(url)
        return dict(out)

    def independent_count(self):
        """Lineages, not sources. Untraced sources each count as their own
        lineage but are reported separately so they never silently pass."""
        return len(self.groups())

    def untraced(self):
        return [u for u in self._origin if self._key(u)[0] == "untraced"]

    def corroboration(self, first_party=False):
        """The corroboration status this evidence actually supports.

        Untraced provenance never reaches two-source on its own. It goes to a
        human, because an unknown origin is exactly where a laundered figure or
        a fabricated premise hides.
        """
        if first_party:
            return "first-party"
        traced = [k for k in self.groups() if k[0] != "untraced"]
        if len(traced) >= 2:
            return "two-source"
        return "single-source-pending"

    def needs_human(self):
        """Any untraced source forces review rather than a machine verdict."""
        return bool(self.untraced())
