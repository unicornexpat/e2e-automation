#!/bin/bash
set -e
#set -o verbose

# Fetch code
git clone git@gitlab.io.thehut.local:elysium/elysium-e2e-mobile.git
cd elysium-e2e-mobile

# Executing tests
npm --version
npm install
npm run e2e-mobile-index
wait
npm run e2e-get-result
