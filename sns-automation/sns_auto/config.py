"""Loading of the YAML configs and workspace paths."""
from __future__ import annotations

from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
CONFIG_DIR = ROOT / "config"
WORKSPACE = ROOT / "workspace"
RESEARCH_DIR = WORKSPACE / "research"
PLANS_DIR = WORKSPACE / "plans"
DRAFTS_DIR = WORKSPACE / "drafts"


def load_yaml(name: str) -> dict:
    path = CONFIG_DIR / name
    if not path.exists():
        return {}
    with path.open(encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def load_all() -> dict:
    return {
        "brand": load_yaml("brand.yaml"),
        "references": load_yaml("references.yaml"),
        "trends": load_yaml("trends.yaml"),
    }


def ensure_dirs() -> None:
    for d in (RESEARCH_DIR, PLANS_DIR, DRAFTS_DIR):
        d.mkdir(parents=True, exist_ok=True)


def latest(directory: Path, pattern: str) -> Path | None:
    files = sorted(directory.glob(pattern))
    return files[-1] if files else None
