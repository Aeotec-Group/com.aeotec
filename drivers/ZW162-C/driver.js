'use strict';

const Homey = require('homey');

class AeotecDoorbellSixDriver extends Homey.Driver {

  onInit() {
    super.onInit();

    this.alarmOnFlow = new Homey.FlowCardAction('ZW162-turn_alarm_on')
      .register()
      .registerRunListener(async (args, state) => {
        if (typeof args.sound !== 'string') return new Error('Sound should be a string');
        return args.device.setSiren({ sirenNumber: args.sound, sirenState: true });
      });
    this.alarmOffFlow = new Homey.FlowCardAction('ZW162-turn_alarm_off')
      .register()
      .registerRunListener(async (args, state) => {
        return args.device.resetSiren();
      });

    this.triggerDoorbellRang = new Homey.FlowCardTriggerDevice('ZW162-doorbell-rang').register();
  }

  triggerDoorbellRangFlow(device) {
    this.triggerDoorbellRang
      .trigger(device, {}, {})
      .catch(err => this.error('Error: could not trigger doorbell rang flow', err));
  }

}

module.exports = AeotecDoorbellSixDriver;
