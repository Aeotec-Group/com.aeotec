'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class ZW141V3 extends ZwaveDevice {
	
	onMeshInit() {
        
        this.registerCapability('dim', 'SWITCH_MULTILEVEL');

       
    }

}

module.exports = ZW141V3;