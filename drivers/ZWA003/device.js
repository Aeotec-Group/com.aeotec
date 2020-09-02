'use strict';

const { ZwaveDevice } = require('homey-meshdriver');

class ZW130 extends ZwaveDevice {

  onMeshInit() {
    // TODO: add battery type (INTERNAL) to driver.compose
    this._batteryTrigger = this.getDriver().batteryTrigger;
    this._sceneTrigger = this.getDriver().sceneTrigger;
    this._dimTrigger = this.getDriver().dimTrigger;

    this.registerCapability('measure_battery', 'BATTERY');

    this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', report => {
      if (report['Properties1'] !== undefined
        && report.Properties1['Key Attributes'] !== undefined
        && report['Scene Number'] !== undefined) {
        const data = {
          button: report['Scene Number'].toString(),
          scene: report.Properties1['Key Attributes'],
        };
        this._sceneTrigger.trigger(this, null, data);
      }
    });
    this.registerReportListener('CONFIGURATION', 'CONFIGURATION_REPORT', report => {
      if (report['Parameter Number'] !== undefined
        && report['Configuration Value'] !== undefined) {
        if (report['Parameter Number'] === 9) {
          const data = {
            button: report['Configuration Value'][0].toString(),
            scene: (report['Configuration Value'][1] === 1) ? 'Key Slide Up' : 'Key Slide Down',
          };
          this._sceneTrigger.trigger(this, null, data);
        }
        if (report['Parameter Number'] === 10) {
          let value = Math.round(report['Configuration Value'][2] / 2) / 100;
          if (value < 0.5) value = Math.max(value - 0.05, 0);
          const token = {
            dim: value,
          };
          const data = {
            button: report['Configuration Value'][0].toString(),
          };
          this._dimTrigger.trigger(this, token, data);
        }
      }
    });
  }

  // eslint-disable-next-line consistent-return
  async onSettings(oldSettings, newSettings, changedKeys) {
    await super.onSettings(oldSettings, newSettings, changedKeys);

    if (changedKeys.includes('rgb_name')
      || changedKeys.includes('rgb_r')
      || changedKeys.includes('rgb_g')
      || changedKeys.includes('rgb_b')) {
      this.log('color changed');

      if (newSettings.rgb_name === 'custom'
        && newSettings['rgb_r'] !== undefined
        && newSettings['rgb_g'] !== undefined
        && newSettings['rgb_b'] !== undefined) {
        this.log('custom color');
        return this.configurationSet({
          index: 5,
          size: 4,
        }, Buffer.from([newSettings.rgb_r, newSettings.rgb_g, newSettings.rgb_b, 0]));
      }
      this.log('listed color');

      const valueArray = newSettings.rgb_name.split(',');
      const multiplier = newSettings.rgb_name_level / 100 || 1;

      return this.configurationSet({
        index: 5,
        size: 4,
      }, Buffer.from([
        Math.round(valueArray[0] * multiplier),
        Math.round(valueArray[1] * multiplier),
        Math.round(valueArray[2] * multiplier), 0]));
    }

    this.log(changedKeys);
  }

  sceneRunListener(args, state) {
    if (!args) return Promise.reject(new Error('No arguments provided'));
    if (!state) return Promise.reject(new Error('No state provided'));

    if (args.button !== undefined
      && state.button !== undefined
      && args.scene !== undefined
      && state.scene !== undefined) {
      return (args.button === state.button && args.scene === state.scene);
    }
    return Promise.reject(new Error('Button or scene undefined in args or state'));
  }

  dimRunListener(args, state) {
    if (!args) return Promise.reject(new Error('No arguments provided'));
    if (!state) return Promise.reject(new Error('No state provided'));

    if (args.button !== undefined && state.button !== undefined) {
      return (args.button === state.button);
    }
    return Promise.reject(new Error('Button undefined in args or state'));
  }

}

module.exports = ZW130;
