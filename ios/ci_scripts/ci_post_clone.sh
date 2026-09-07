#!/usr/bin/env bash
# Xcode Cloud post-clone script.
#
# The ios/ directory is not checked into git (see .gitignore) — it is
# regenerated from app.json by `expo prebuild`. Xcode Cloud runs this script
# right after cloning, so the workspace exists by the time Xcode needs it.

set -euo pipefail

export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
brew install node
node -v

cd "$CI_PRIMARY_REPOSITORY_PATH"

npm ci
npx expo prebuild --platform ios --no-install

cd ios
pod install

# Older Xcode Cloud workflows for this app reference tspbibleapp.xcworkspace;
# expose the generated workspace under that name too so both paths build.
if [ ! -e tspbibleapp.xcworkspace ]; then
  cp -R SacredScroll.xcworkspace tspbibleapp.xcworkspace
fi
