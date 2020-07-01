'use strict';

const { ZwaveDevice } = require('homey-meshdriver');
const POLL_INTERVAL = 5*60*1000 // 5 minutes

class ZW132 extends ZwaveDevice {
	
	onMeshInit() {
		this.registerCapability('onoff', 'BASIC');
		this.registerCapability('measure_power', 'METER');
		this.registerCapability('meter_power', 'METER', {
			getOpts: {
				getOnStart: true,
				pollInterval: POLL_INTERVAL // The device does not activly pushed meter_power values, so request them.
			}
		});

	}
	
}

module.exports = ZW132;
