'use strict';

const { ZwaveDevice } = require('homey-meshdriver');

class DSB29 extends ZwaveDevice {

  onMeshInit() {
    this.registerCapability('alarm_contact', 'BASIC');
    this.registerCapability('measure_batttery', 'BATTERY');
  }

}

module.exports = DSB29;
