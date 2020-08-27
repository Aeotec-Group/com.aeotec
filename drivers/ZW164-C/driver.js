'use strict';

const Homey = require('homey');

class AeotecSirenSixDeviceDriver extends Homey.Driver {

  onInit() {
    super.onInit();

    this.alarmOnFlow = new Homey.FlowCardAction('ZW168-turn_alarm_on')
      .register()
      .registerRunListener(async (args, state) => {
        if (typeof args.sound !== 'string') return new Error('Sound should be a string');
        return args.device.setSiren({ sirenNumber: args.sound, sirenState: true });
      });
    this.alarmOffFlow = new Homey.FlowCardAction('ZW168-turn_alarm_off')
      .register()
      .registerRunListener(async (args, state) => {
        return args.device.resetSiren();
      });
  }

}

module.exports = AeotecSirenSixDeviceDriver;
