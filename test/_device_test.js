// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var assert = require('chai').assert;
var Device = require('../lib/device.js');

var simpleDeviceJson = JSON.stringify({ deviceId: 'testDevice', generationId:'123456789012345678', etag:'' });

var testDeviceObject = { 
  deviceId: 'fullDevice',
  generationId:'635756100743433650',
  etag:554111,
  connectionState:'Disconnected',
  status:'Enabled',
  statusReason:'Some Reason',
  connectionStateUpdatedTime:'2015-08-20T18:08:49.9738417',
  statusUpdatedTime:'0001-01-01T00:00:00',
  lastActivityTime:'2015-08-26T01:00:51.6950626',
  cloudToDeviceMessageCount:4,
  isManaged:true,
  authentication: {
    symmetricKey: {
      primaryKey:"aBcd+eFg9h3jKl2MNO4pQrS90TUVxYzabcdefGH6iJK=",
      secondaryKey:"ZaBcd+eFg9h3jKl2MNO4pQrS90TUVxYzabcdefGH6iJ="
    }
  },
  deviceProperties: {
    batteryLevel:'90',
    batteryStatus:"good",
    currentTime:'2015-08-26T01:00:51.6950626',
    defaultMaxPeriod:'50',
    defaultMinPeriod:'1',
    deviceDescription:'devDesc',
    firmwarePackage: 'firmwarePackage',
    firmwarePackageName: 'firmwarePackageName',
    firmwarePackageUri: 'http://firmwarePackage.uri',
    firmwarePackageVersion: 'v2',
    firmwareUpdateResult: 'booyah',
    firmwareUpdateState: 'WA',
    firmwareVersion: 'v2',
    hardwareVersion: '0xF00',
    manufacturer: 'Contoso',
    memoryFree: '42',
    memoryTotal: '4242',
    modelNumber: '3',
    registrationLifetime: 'registrationLifetime',
    serialNumber: '1337',
    timezone: 'PST',
    utcOffset: 'UTC-7'
  }
};

var deviceName = 'testDevice';
var newDeviceName = 'newDeviceName';
var newStatusReason = 'Status Reason';

function throwsRedefineError(device, fieldName, descriptor) {
  assert.throws(function () {
    Object.defineProperty(device, fieldName, descriptor);
  }, TypeError, 'Cannot redefine property: '+fieldName);
}

describe('Device', function () {
  describe('#enumerable', function() {
    it('is enumerable', function () {
      var device = new Device(simpleDeviceJson);

      var allProps = [];
      for (var prop in device) {
        if (device.hasOwnProperty(prop)) {
          allProps.push(prop.toString());
        }
      }
      assert.include(allProps, 'deviceId');
      assert.include(allProps, 'generationId');
      assert.include(allProps, 'etag');
      assert.include(allProps, 'connectionState');
      assert.include(allProps, 'status');
      assert.include(allProps, 'statusReason');
      assert.include(allProps, 'connectionStateUpdatedTime');
      assert.include(allProps, 'statusUpdatedTime');
      assert.include(allProps, 'lastActivityTime');
      assert.include(allProps, 'cloudToDeviceMessageCount');
      assert.include(allProps, 'authentication');
    });
  });

  describe('#constructor', function () {
    it('creates a Device with the given id', function () {
      var device = new Device(simpleDeviceJson);
      assert.equal(device.deviceId, deviceName);
    });

    it('throws if \'deviceId\' is falsy', function () {
      function throwsReferenceError(ctorArg) {
        assert.throws(function () {
          return new Device(ctorArg);
        }, ReferenceError);
      }
      throwsReferenceError(JSON.stringify({ deviceId: '' }));
    });

    var verifyDeviceProperties = function(actual, expected) {
      var auth = actual.authentication;
      var devProp = actual.deviceProperties;
      
      assert.equal(actual.deviceId, expected.deviceId);
      assert.equal(actual.generationId, expected.generationId);
      assert.equal(actual.etag, expected.etag);
      assert.equal(actual.connectionState, expected.connectionState);
      assert.equal(actual.status, expected.status);
      assert.equal(actual.statusReason, expected.statusReason);
      assert.equal(actual.connectionStateUpdatedTime, expected.connectionStateUpdatedTime);
      assert.equal(actual.statusUpdatedTime, expected.statusUpdatedTime);
      assert.equal(actual.lastActivityTime, expected.lastActivityTime);
      assert.equal(actual.cloudToDeviceMessageCount, expected.cloudToDeviceMessageCount);
      assert.equal(actual.isManaged, expected.isManaged);

      assert.equal(auth.symmetricKey.primaryKey, expected.authentication.symmetricKey.primaryKey);
      assert.equal(auth.symmetricKey.secondaryKey, expected.authentication.symmetricKey.secondaryKey);
            
      assert.equal(devProp.batteryLevel, expected.deviceProperties.batteryLevel);
      assert.equal(devProp.batteryStatus, expected.deviceProperties.batteryStatus);
      assert.equal(devProp.currentTime, expected.deviceProperties.currentTime);
      assert.equal(devProp.defaultMaxPeriod, expected.deviceProperties.defaultMaxPeriod);
      assert.equal(devProp.defaultMinPeriod, expected.deviceProperties.defaultMinPeriod);
      assert.equal(devProp.deviceDescription, expected.deviceProperties.deviceDescription);
      assert.equal(devProp.firmwarePackage, expected.deviceProperties.firmwarePackage);
      assert.equal(devProp.firmwarePackageName, expected.deviceProperties.firmwarePackageName);
      assert.equal(devProp.firmwarePackageUri, expected.deviceProperties.firmwarePackageUri);
      assert.equal(devProp.firmwarePackageVersion, expected.deviceProperties.firmwarePackageVersion);
      assert.equal(devProp.firmwareUpdateResult, expected.deviceProperties.firmwareUpdateResult);
      assert.equal(devProp.firmwareUpdateState, expected.deviceProperties.firmwareUpdateState);
      assert.equal(devProp.firmwareVersion, expected.deviceProperties.firmwareVersion);
      assert.equal(devProp.hardwareVersion, expected.deviceProperties.hardwareVersion);
      assert.equal(devProp.manufacturer, expected.deviceProperties.manufacturer);
      assert.equal(devProp.memoryFree, expected.deviceProperties.memoryFree);
      assert.equal(devProp.memoryTotal, expected.deviceProperties.memoryTotal);
      assert.equal(devProp.modelNumber, expected.deviceProperties.modelNumber);
      assert.equal(devProp.registrationLifetime, expected.deviceProperties.registrationLifetime);
      assert.equal(devProp.serialNumber, expected.deviceProperties.serialNumber);
      assert.equal(devProp.timezone, expected.deviceProperties.timezone);
      assert.equal(devProp.utcOffset, expected.deviceProperties.utcOffset);
    };

    it('correctly creates a device from JSON', function() {
      var deviceJsonString = JSON.stringify(testDeviceObject);
      var deviceResult = new Device(deviceJsonString);
      verifyDeviceProperties(deviceResult, testDeviceObject);
    });

    it('correctly creates a device from a duck-typed object', function() {
      var deviceResult = new Device(testDeviceObject);
      verifyDeviceProperties(deviceResult, testDeviceObject);
    });
  });

  describe('#deviceId', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      
      throwsRedefineError(device, 'deviceId', { configurable: true });
      throwsRedefineError(device, 'deviceId', { enumerable: false });
      throwsRedefineError(device, 'deviceId', { set: function () { } });
      throwsRedefineError(device, 'deviceId', { get: function () { return deviceName; } });
      throwsRedefineError(device, 'deviceId', { value: 'world' });

      assert.doesNotThrow(function () {
        Object.defineProperty(device, 'deviceId', { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.deviceId;
      }, TypeError, 'Cannot delete property \'deviceId\' of #<Device>');
      
      device.deviceId = newDeviceName;
      assert.equal(device.deviceId, newDeviceName);
    });
  });

  describe('#generationId', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      
      throwsRedefineError(device, 'generationId', { configurable: true });
      throwsRedefineError(device, 'generationId', { enumerable: false });
      throwsRedefineError(device, 'generationId', { set: function () { } });
      throwsRedefineError(device, 'generationId', { get: function () { return deviceName; } });
      throwsRedefineError(device, 'generationId', { value: 'world' });

      assert.doesNotThrow(function () {
        Object.defineProperty(device, 'generationId', { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.generationId;
      }, TypeError, 'Cannot delete property \'generationId\' of #<Device>');
    });
  });

  describe('#etag', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      
      throwsRedefineError(device, 'etag', { configurable: true });
      throwsRedefineError(device, 'etag', { enumerable: false });
      throwsRedefineError(device, 'etag', { set: function () { } });
      throwsRedefineError(device, 'etag', { get: function () { return deviceName; } });
      throwsRedefineError(device, 'etag', { value: 'world' });

      assert.doesNotThrow(function () {
        Object.defineProperty(device, 'etag', { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.etag;
      }, TypeError, 'Cannot delete property \'etag\' of #<Device>');
    });
  });

  describe('#connectionState', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      
      throwsRedefineError(device, 'connectionState', { configurable: true });
      throwsRedefineError(device, 'connectionState', { enumerable: false });
      throwsRedefineError(device, 'connectionState', { set: function () { } });
      throwsRedefineError(device, 'connectionState', { get: function () { return deviceName; } });
      throwsRedefineError(device, 'connectionState', { value: 'world' });

      assert.doesNotThrow(function () {
        Object.defineProperty(device, 'connectionState', { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.connectionState;
      }, TypeError, 'Cannot delete property \'connectionState\' of #<Device>');
    });
  });

  describe('#status', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      var fieldName = 'statusReason';

      throwsRedefineError(device, fieldName, { configurable: true });
      throwsRedefineError(device, fieldName, { enumerable: false });
      throwsRedefineError(device, fieldName, { set: function () { } });
      throwsRedefineError(device, fieldName, { get: function () { return deviceName; } });
      assert.throws(function () {
        Object.defineProperty(device, fieldName, { value: 'NotEnabledOrDisabled' });
        }, TypeError, 'Cannot redefine property: status');
      assert.doesNotThrow(function () {
        Object.defineProperty(device, fieldName, { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.status;
      }, TypeError, 'Cannot delete property \'status\' of #<Device>');

      assert.throws(function () {
        device.status = 'invalidStatus';
      }, RangeError, 'status is neither Enabled or Disabled');
      
    });
    
    it('Assignments allowed to enable and disabled', function() {
      var device = new Device(simpleDeviceJson);
      assert.doesNotThrow(function() {
        device.status = 'Enabled';
        device.status = 'Disabled';
        device.status = 'enabled';
        device.status = 'disabled';
      });
    });
  });
  
  describe('#statusReason', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      var fieldName = 'statusReason';
      
      throwsRedefineError(device, fieldName, { configurable: true });
      throwsRedefineError(device, fieldName, { enumerable: false });
      throwsRedefineError(device, fieldName, { set: function () { } });
      throwsRedefineError(device, fieldName, { get: function () { return deviceName; } });
      throwsRedefineError(device, fieldName, { value: 'world' });

      assert.doesNotThrow(function () {
        Object.defineProperty(device, fieldName, { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.statusReason;
      }, TypeError, 'Cannot delete property \'statusReason\' of #<Device>');
      
      device.statusReason = newStatusReason;
      assert.equal(device.statusReason, newStatusReason); 
    });
  });
  
  describe('#connectionStateUpdatedTime', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      var fieldName = 'connectionStateUpdatedTime';
      
      throwsRedefineError(device, fieldName, { configurable: true });
      throwsRedefineError(device, fieldName, { enumerable: false });
      throwsRedefineError(device, fieldName, { set: function () { } });
      throwsRedefineError(device, fieldName, { get: function () { return deviceName; } });
      throwsRedefineError(device, fieldName, { value: 'world' });

      assert.doesNotThrow(function () {
        Object.defineProperty(device, fieldName, { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.connectionStateUpdatedTime;
      }, TypeError, 'Cannot delete property \'connectionStateUpdatedTime\' of #<Device>');
    });
  });
  
  describe('#statusUpdatedTime', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      var fieldName = 'statusUpdatedTime';
      
      throwsRedefineError(device, fieldName, { configurable: true });
      throwsRedefineError(device, fieldName, { enumerable: false });
      throwsRedefineError(device, fieldName, { set: function () { } });
      throwsRedefineError(device, fieldName, { get: function () { return deviceName; } });
      throwsRedefineError(device, fieldName, { value: 'world' });

      assert.doesNotThrow(function () {
        Object.defineProperty(device, fieldName, { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.statusUpdatedTime;
      }, TypeError, 'Cannot delete property \'statusUpdatedTime\' of #<Device>');
    });
  });
  
  describe('#lastActivityTime', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      var fieldName = 'lastActivityTime';
      
      throwsRedefineError(device, fieldName, { configurable: true });
      throwsRedefineError(device, fieldName, { enumerable: false });
      throwsRedefineError(device, fieldName, { set: function () { } });
      throwsRedefineError(device, fieldName, { get: function () { return deviceName; } });
      throwsRedefineError(device, fieldName, { value: 'world' });

      assert.doesNotThrow(function () {
        Object.defineProperty(device, fieldName, { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.lastActivityTime;
      }, TypeError, 'Cannot delete property \'lastActivityTime\' of #<Device>');
    });
  });

  describe('#cloudToDeviceMessageCount', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      var fieldName = 'cloudToDeviceMessageCount';
      
      throwsRedefineError(device, fieldName, { configurable: true });
      throwsRedefineError(device, fieldName, { enumerable: false });
      throwsRedefineError(device, fieldName, { set: function () { } });
      throwsRedefineError(device, fieldName, { get: function () { return deviceName; } });
      throwsRedefineError(device, fieldName, { value: 'world' });

      assert.doesNotThrow(function () {
        Object.defineProperty(device, fieldName, { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.cloudToDeviceMessageCount;
      }, TypeError, 'Cannot delete property \'cloudToDeviceMessageCount\' of #<Device>');
    });
  });

  describe('#authentication', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      var fieldName = 'authentication';
      
      throwsRedefineError(device, fieldName, { configurable: true });
      throwsRedefineError(device, fieldName, { enumerable: false });
      throwsRedefineError(device, fieldName, { set: function () { } });
      throwsRedefineError(device, fieldName, { get: function () { return deviceName; } });
      throwsRedefineError(device, fieldName, { value: 'world' });

      assert.doesNotThrow(function () {
        Object.defineProperty(device, fieldName, { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.authentication;
      }, TypeError, 'Cannot delete property \'authentication\' of #<Device>');
    });
  });
  
  describe('#isManaged', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      var fieldName = 'isManaged';
      
      throwsRedefineError(device, fieldName, { configurable: true });
      throwsRedefineError(device, fieldName, { enumerable: false });
      throwsRedefineError(device, fieldName, { set: function () { } });
      throwsRedefineError(device, fieldName, { get: function () { return deviceName; } });
      throwsRedefineError(device, fieldName, { value: 'world' });

      assert.doesNotThrow(function () {
        Object.defineProperty(device, fieldName, { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.isManaged;
      }, TypeError, 'Cannot delete property \'isManaged\' of #<Device>');
    });
  });
  
  describe('#serviceProperties', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      var fieldName = 'serviceProperties';
      
      throwsRedefineError(device, fieldName, { configurable: true });
      throwsRedefineError(device, fieldName, { enumerable: false });
      throwsRedefineError(device, fieldName, { set: function () { } });
      throwsRedefineError(device, fieldName, { get: function () { return deviceName; } });
      throwsRedefineError(device, fieldName, { value: 'world' });

      assert.doesNotThrow(function () {
        Object.defineProperty(device, fieldName, { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.serviceProperties;
      }, TypeError, 'Cannot delete property \'serviceProperties\' of #<Device>');
    });
  });
  
  describe('#deviceProperties', function () { 
    it('cannot be configured or deleted', function () {
      var device = new Device(simpleDeviceJson);
      var fieldName = 'deviceProperties';
      
      throwsRedefineError(device, fieldName, { configurable: true });
      throwsRedefineError(device, fieldName, { enumerable: false });
      throwsRedefineError(device, fieldName, { set: function () { } });
      throwsRedefineError(device, fieldName, { get: function () { return deviceName; } });
      throwsRedefineError(device, fieldName, { value: 'world' });

      assert.doesNotThrow(function () {
        Object.defineProperty(device, fieldName, { enumerable: true }); // redefine to same value is ok
      });

      assert.throws(function () {
        delete device.deviceProperties;
      }, TypeError, 'Cannot delete property \'deviceProperties\' of #<Device>');
    });
  });
});
