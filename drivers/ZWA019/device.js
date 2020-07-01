'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

const TAMPER_TIMEOUT = 30*1000;

class ZWA019 extends ZwaveDevice {
	
	onMeshInit() {
		this.registerCapability('measure_battery', 'BATTERY');
		this.registerCapability('alarm_tamper', 'NOTIFICATION');
		this.registerCapability('alarm_water', 'NOTIFICATION');
		this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
		this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
	}
	
}

module.exports = ZWA019;