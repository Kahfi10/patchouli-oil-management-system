#!/usr/bin/env python3
"""
Application Developer Skill - Health & Quality Audit Script
Validates project structure, security configs, package locks, and hygiene.
"""

import sys
import os
import json
from pathlib import Path

def audit_directory(base_path: Path):
    print("=" * 60)
    print(f"Auditing Application Project: {base_path}")
    print("=" * 60)

    issues = []
    checks_passed = 0

    # 1. Environment check
    env_file = base_path / ".env"
    env_example = base_path / ".env.example"
    if env_file.exists():
        checks_passed += 1
        print(" [PASS] .env file exists.")
    else:
        issues.append("Missing .env file for local environment config.")

    if not env_example.exists():
        issues.append("Missing .env.example template for onboarding.")
    else:
        checks_passed += 1
        print(" [PASS] .env.example template found.")

    # 2. Package manifest check
    pkg_file = base_path / "package.json"
    pyproject_file = base_path / "pyproject.toml"
    go_mod_file = base_path / "go.mod"

    if pkg_file.exists():
        checks_passed += 1
        print(" [PASS] Node.js project detected (package.json).")
        try:
            with open(pkg_file, "r", encoding="utf-8") as f:
                pkg_data = json.load(f)
            scripts = pkg_data.get("scripts", {})
            for script_name in ["test", "build", "lint"]:
                if script_name in scripts:
                    print(f" [PASS] Script '{script_name}' configured in package.json.")
                    checks_passed += 1
                else:
                    issues.append(f"Missing '{script_name}' script in package.json.")
        except Exception as e:
            issues.append(f"Failed to parse package.json: {e}")
    elif pyproject_file.exists():
        checks_passed += 1
        print(" [PASS] Python project detected (pyproject.toml).")
    elif go_mod_file.exists():
        checks_passed += 1
        print(" [PASS] Go project detected (go.mod).")
    else:
        issues.append("No primary project manifest found (package.json, pyproject.toml, or go.mod).")

    # 3. Git hygiene
    gitignore = base_path / ".gitignore"
    if gitignore.exists():
        checks_passed += 1
        print(" [PASS] .gitignore exists.")
        with open(gitignore, "r", encoding="utf-8") as f:
            content = f.read()
            if ".env" not in content:
                issues.append(".env is NOT ignored in .gitignore! Security hazard.")
            else:
                checks_passed += 1
                print(" [PASS] .env is properly ignored in .gitignore.")
    else:
        issues.append("Missing .gitignore file.")

    # Summary
    print("-" * 60)
    print(f"Checks Passed: {checks_passed}")
    if issues:
        print(f"Issues Detected ({len(issues)}):")
        for idx, issue in enumerate(issues, 1):
            print(f"  {idx}. [WARN] {issue}")
        return 1
    else:
        print(" All basic architecture and security checks PASSED!")
        return 0

if __name__ == "__main__":
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    sys.exit(audit_directory(target))
