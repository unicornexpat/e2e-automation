#Node.js samples

## prerequisites

Upgrade Mocha to the latest version:

```
npm install -g -f mocha
```

Install local packages:

```
npm install
```

### to run tests locally

Install appium and start the appium server for your device, please refer to:

- http://appium.io
- https://github.com/appium/appium/blob/master/README.md

### to run tests using Sauce Labs cloud

[Sign up here](https://saucelabs.com/signup/trial)

Configure your environment:

```
export SAUCE_USERNAME=<SAUCE_USERNAME>
export SAUCE_ACCESS_KEY=<SAUCE_ACCESS_KEY>
```

If you also want to use Sauce Connect (secure tunelling):

- [Read the doc here](https://saucelabs.com/docs/connect)
- Install and start the Sauce Connect client 

## running tests

###iOS

####local:

```
mocha mobile-main.js
```

####using Sauce Labs:

```
SAUCE=1 mocha mobile-main.js
```

####using Sauce Labs + Sauce Connect:

```
SAUCE=1 mocha ios-local-server.js
```

###Android

####local:

```
mocha android-main.js
```

####using Sauce Labs:

```
SAUCE=1 mocha android-main.js
```

####using Sauce Labs + Sauce Connect

```
SAUCE=1 mocha android-local-server.js
```

###Node.js 0.11 + Generator with Yiewd

prerequisite: switch to node > 0.11
