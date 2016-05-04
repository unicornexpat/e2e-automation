#!/bin/bash
set -e
#set -o verbose

# Fetch code
git clone git@gitlab.io.thehut.local:elysium/elysium-e2e-mobile.git
cd elysium-e2e-mobile

# Executing tests
npm --version
npm install
mkdir reports
mkdir screenshot


function wait_for_background_tasks {
    FAIL=0
    for job in `jobs -p`;do
        wait $job || let "FAIL+=1"
    done

    if [ "$FAIL" != "0" ];then
        echo "--FAIL! ($FAIL)"
        exit 1
    fi
}

sh ./deployment/scripts/jenkins/elysium-ios-main.sh &
sh ./deployment/scripts/jenkins/elysium-android-main.sh &
wait_for_background_tasks
