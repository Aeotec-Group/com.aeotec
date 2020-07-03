'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class DSC27 extends ZwaveDevice {
	
	onMeshInit() {
        this.registerCapability('onoff', 'SWITCH_BINARY');
        this.registerCapability('dim', 'SWITCH_MULTILEVEL');

        this.registerReportListener('BASIC', 'BASIC_SET', (report) => {
          this.setCapabilityValue('onoff', !!report.Value);
        });
    }

}

module.exports = DSC27;