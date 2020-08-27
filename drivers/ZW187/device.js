
'use strict';

const { ZwaveDevice } = require('homey-meshdriver');

class AeotecRecessedDoorSensor7 extends ZwaveDevice {

  onMeshInit() {
    this.registerCapability('alarm_contact', 'NOTIFICATION');
    this.registerCapability('measure_battery', 'BATTERY');
    this.enableDebug();
    this.printNode();
  }

}

module.exports = AeotecRecessedDoorSensor7;
