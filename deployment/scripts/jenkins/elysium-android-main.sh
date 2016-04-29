#!/bin/bash
set -e
#set -o verbose

npm run e2e-android-main
wait
npm run e2e-get-result