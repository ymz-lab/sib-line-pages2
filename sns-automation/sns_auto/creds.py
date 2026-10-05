"""Per-brand credentials.

Each brand reads `<NAME>_<BRAND>` (e.g. IG_ACCESS_TOKEN_COMPANY). The unsuffixed
name is accepted only for the student group, which used it before brands existed,
so one brand's token can never be used for the other brand's account.
"""
from __future__ import annotations

import os

BRANDS = ("company", "student")


def env(name: str, brand: str) -> str | None:
    value = os.environ.get(f"{name}_{brand.upper()}")
    if value:
        return value
    return os.environ.get(name) if brand == "student" else None
