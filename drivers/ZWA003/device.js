'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class ZWA003 extends ZwaveDevice {

	onMeshInit() {
		// TODO: add battery type (INTERNAL) to driver.compose
        this._batteryTrigger = this.getDriver().batteryTrigger;
        this._sceneTrigger = this.getDriver().sceneTrigger;
        this.registerCapability('measure_battery', 'BATTERY');

		this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', (report) => {
			if (report.hasOwnProperty('Properties1') &&
				report.Properties1.hasOwnProperty('Key Attributes') &&
				report.hasOwnProperty('Scene Number')) {
				const data = {
					button: report['Scene Number'].toString(),
					scene: report.Properties1['Key Attributes'],
				};
				this._sceneTrigger.trigger(this, null, data);
			}
		});
		
	}

	async onSettings(oldSettings, newSettings, changedKeys) {
		super.onSettings(oldSettings, newSettings, changedKeys);

		if (changedKeys.includes('rgb_name')
			|| changedKeys.includes('rgb_r')
			|| changedKeys.includes('rgb_g')
			|| changedKeys.includes('rgb_b')) {
            this.log('color changed');

            if (newSettings.rgb_name === 'custom'
                && newSettings.hasOwnProperty('rgb_r')
                && newSettings.hasOwnProperty('rgb_g')
                && newSettings.hasOwnProperty('rgb_b')) {
            	this.log('custom color');
                return await this.configurationSet({
                    index: 5,
                    size: 4,
                }, new Buffer([newSettings.rgb_r, newSettings.rgb_g, newSettings.rgb_b, 0]));
            }
            this.log('listed color');

            const valueArray = newSettings.rgb_name.split(',');
            const multiplier = newSettings.rgb_name_level / 100 || 1;

            return await this.configurationSet({
                index: 5,
                size: 4,
            }, new Buffer([Math.round(valueArray[0] * multiplier), Math.round(valueArray[1] * multiplier), Math.round(valueArray[2] * multiplier), 0]));
        }

        this.log(changedKeys);
    }

	sceneRunListener(args, state) {
		if (!args) return Promise.reject('No arguments provided');
		if (!state) return Promise.reject('No state provided');

		if (args.hasOwnProperty('button') &&
			state.hasOwnProperty('button') &&
			args.hasOwnProperty('scene') &&
			state.hasOwnProperty('scene')) {
        		return (args.button === state.button && args.scene === state.scene);
		} return Promise.reject('Button or scene undefined in args or state');
	}

	dimRunListener(args, state) {
		if (!args) return Promise.reject('No arguments provided');
		if (!state) return Promise.reject('No state provided');

		if (args.hasOwnProperty('button') &&
			state.hasOwnProperty('button')) {
        		return (args.button === state.button);
		} return Promise.reject('Button undefined in args or state');
	}
}

module.exports = ZWA003;
