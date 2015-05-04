[![Build Status](https://travis-ci.org/mkay581/device-manager.svg?branch=master)](https://travis-ci.org/mkay581/device-manager)

# Device Manager

## Usage

A library that detects information about a current user's device in browsers.

### Check user's current browser

```javascript
DeviceManager.isBrowser('chrome');

```

### Find out if user is on a certain operating system

```javascript
DeviceManager.isOS('android');

```

### Device checking

```javascript
// when user is on a mobile device
DeviceManager.isMobile();
=> true

```

