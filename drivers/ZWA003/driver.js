'use strict';

const Homey = require('homey');

class ZWA003Driver extends Homey.Driver {
    onInit() {
        super.onInit();

        this.batteryTrigger = new Homey.FlowCardTriggerDevice('ZWA003_battery_full').register();
        this.sceneTrigger = new Homey.FlowCardTriggerDevice('ZWA003_scene').register().registerRunListener((args, state) => {
            return args.device.sceneRunListener(args, state);
        });
            }
}

module.exports = ZWA003Driver;
