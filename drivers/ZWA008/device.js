'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-meshdriver');

class ZWA008 extends ZwaveDevice {

  onMeshInit() {
    // this.enableDebug();
    // this.printNode();
    this.registerCapability('alarm_contact', 'NOTIFICATION');
    this.registerCapability('alarm_tamper', 'NOTIFICATION');
    this.registerCapability('measure_battery', 'BATTERY');
    if (this.hasCapability('info_tilt')) {
      this.registerCapability('info_tilt', 'SENSOR_BINARY', {
        report: 'SENSOR_BINARY_REPORT',
        reportParser: report => {
          if (report && report['Sensor Type'] === 'Tilt') {
            if (report['Sensor Value'] === 'idle') {
              this._flowTriggerNoTiltInfo.trigger(this).catch(this.error);
              return false;
            }


            if (report['Sensor Value'] === 'detected an event') {
              this._flowTriggerTiltInfo.trigger(this).catch(this.error);
              if (this.getSetting('no_alarm_if_tilt') === 1) {
                this.setCapabilityValue('alarm_contact', false).catch(this.error);
              }
              return true;
            }
          }
          return null;
        },
      });
    }

    this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', report => {
      if (report['Properties1'] !== undefined
          && report.Properties1['Key Attributes'] !== undefined
          && report['Scene Number'] !== undefined) {
        const state = {
          scene: report.Properties1['Key Attributes'],
        };

        if (report['Scene Number'] === 1) {
          this._flowTriggerInput.trigger(this, null, state);
        }
      }
    });


    this._flowTriggerTiltInfo = new Homey.FlowCardTriggerDevice('tilt_info_on').register();
    this._flowTriggerNoTiltInfo = new Homey.FlowCardTriggerDevice('tilt_info_off').register();

    this._flowTriggerInput = new Homey.FlowCardTriggerDevice('binary_contact_trigger').register()
      .registerRunListener((args, state) => {
        return args.device.inputFlowListener(args, state);
      });


    new Homey.FlowCardCondition('is_tilted')
      .register()
      .registerRunListener((args, state) => {
        const tiltInfo = args.device.getCapabilityValue('tilt_info');
        return Promise.resolve(tiltInfo);
      });

    this.DisableTamperContactFlow = new Homey.FlowCardAction('disabletampercontact').register().registerRunListener((args, state) => {
      return this.setCapabilityValue('alarm_tamper', false);
    });
  }

  inputFlowListener(args, state) {
    return (state.scene === args.scene);
  }

}
module.exports = ZWA008;
