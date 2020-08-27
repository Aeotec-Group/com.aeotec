'use strict';

const { ZwaveDevice } = require('homey-meshdriver');

class AeotecTriSensorDevice extends ZwaveDevice {

  onMeshInit() {
    this._cancellationTimeout = this.getSetting('tamper_cancellation');

    this.registerCapability('measure_battery', 'BATTERY');

    this.registerCapability('alarm_motion', 'SENSOR_BINARY');


    this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_luminance', 'SENSOR_MULTILEVEL');


    this.registerSetting('201', value => {
      return Buffer.from([Math.round(value * 10), 1]);
    });
  }

  onSettings(oldSettings, newSettings, changedKeys) {
    if (changedKeys.includes('tamper_cancellation')) {
      this._cancellationTimeout = this.getSetting('tamper_cancellation');
    }

    return super.onSettings(oldSettings, newSettings, changedKeys);
  }

}

module.exports = AeotecTriSensorDevice;
