#!/bin/bash
set -e
#set -o verbose

npm run e2e-ios-rest
wait
npm run e2e-get-result
