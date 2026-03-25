#!/bin/bash
# sync-to-drive.sh
# Syncs /agency-os/ markdown files to the Google Drive "Agency OS" folder.
# Requires: rclone configured with a remote named "gdrive"
# Install rclone: https://rclone.org/install/
# Configure: rclone config -> add Google Drive remote named "gdrive"
# Drive folder ID: 1APO-OiP2I0CEXZg9l-Kj6lvxZnZd1ToY

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DRIVE_FOLDER="gdrive:Agency OS"

echo "[sync-to-drive] Syncing $REPO_ROOT/agency-os -> $DRIVE_FOLDER"

rclone sync \
  "$REPO_ROOT/agency-os" \
  "$DRIVE_FOLDER" \
  --include "*.md" \
  --verbose \
  --log-level INFO

if [ $? -eq 0 ]; then
  echo "[sync-to-drive] Sync complete: $(date)"
else
  echo "[sync-to-drive] Sync FAILED: $(date)"
  exit 1
fi
