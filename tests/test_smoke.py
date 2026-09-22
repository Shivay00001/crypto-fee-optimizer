"""Smoke test: entry points exist and JS files parse cleanly."""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).parent.parent


def test_entry_point_exists():
    assert (ROOT / "index.html").exists(), "index.html missing"


def test_package_json_scripts_reference_existing_files():
    pkg = json.loads((ROOT / "package.json").read_text())
    for name, cmd in pkg.get("scripts", {}).items():
        for token in cmd.split():
            if token.endswith((".js", ".ts", ".html")) and not token.startswith("-"):
                assert (ROOT / token).exists(), f"script {name!r} references missing {token}"


def test_js_files_parse():
    js_files = sorted((ROOT / "js").glob("*.js"))
    assert js_files, "no js files found"
    for f in js_files:
        r = subprocess.run(["node", "--check", str(f)], capture_output=True, text=True)
        assert r.returncode == 0, f"{f.name}: {r.stderr}"
