'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class ZW141V2 extends ZwaveDevice {
	
	onMeshInit() {
        this.registerCapability('onoff', 'SWITCH_BINARY');
        this.registerCapability('windowcoverings_set', 'SWITCH_MULTILEVEL');

        this.registerReportListener('BASIC', 'BASIC_REPORT', (report) => {
		  this.setCapabilityValue('onoff', !!report.Value);
        });
		
		this.registerReportListener('SWITCH_MULTILEVEL', 'SWITCH_MULTILEVEL_REPORT', (report) => {
          this.setCapabilityValue('windowcoverings_set', !!report.Value);
        });
    }

}

module.exports = ZW141V2;