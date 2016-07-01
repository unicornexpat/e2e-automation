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
mkdir mochaIosRest
mkdir mochaAndroidRest
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
mitmproxy --setheader :~q:X-THEHUTSRV:230 &

echo entering sleep
sleep 70
echo exiting sleep

#sh ./deployment/scripts/jenkins/elysium-ios-rest.sh &
sh ./deployment/scripts/jenkins/elysium-android-rest.sh &
wait_for_background_tasks
