'use strict';

const { ZwaveDevice } = require('homey-meshdriver');

class ZW141 extends ZwaveDevice {

  onMeshInit() {
    //  this.registerCapability('dim', 'SWITCH_MULTILEVEL');
    this.registerCapability('windowcoverings_set', 'SWITCH_MULTILEVEL');
    // this.registerReportListener('SWITCH_MULTILEVEL', 'SWITCH_MULTILEVEL_REPORT', (report) => {
    //         this.setCapabilityValue('windowcoverings_set', !!report.Value);
    //       });
  }

}

module.exports = ZW141;
