#!/usr/bin/env bash
# exit on error
set -o errexit

echo "--- Upgrading PIP ---"
python -m pip install --upgrade pip

echo "--- Installing Python Requirements ---"
pip install -r requirements.txt

echo "--- Installing Playwright Chromium Dependencies (Required for PDF Generation) ---"
playwright install chromium
playwright install-deps chromium
