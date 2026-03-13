from __future__ import annotations

import importlib.util
import pathlib


# absolute project root
_PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[3]

SDK_LOCAL_PATHS = [
    _PROJECT_ROOT / "aibot-python-sdk",
    _PROJECT_ROOT / "vendor" / "aibot-python-sdk",
]


def get_project_root() -> pathlib.Path:
    return _PROJECT_ROOT


def ensure_local_sdk_on_path() -> None:
    """Ensure a local checkout of aibot-python-sdk is importable."""
    import sys

    for path in SDK_LOCAL_PATHS:
        if path.exists() and str(path) not in sys.path:
            sys.path.insert(0, str(path))


def check_sdk_available() -> bool:
    return importlib.util.find_spec("aibot") is not None
