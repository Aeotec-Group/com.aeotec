'use strict';

const { ZwaveDevice } = require('homey-meshdriver');

const SIREN_TIMEOUT = 10 * 1000;
const TAMPER_TIMEOUT = 30 * 1000;

class AeotecDoorbellSixDevice extends ZwaveDevice {

  onMeshInit() {
    this.printNode();
    this.enableDebug();

    this.currentSiren = 1;
    this.defaultSiren = Number(this.getSetting('default_sound'));

    this.registerCapabilityListener('onoff.siren', (args, opts) => {
      if (this.sirenTimeout) clearTimeout(this.sirenTimeout);
      this.sirenTimeout = setTimeout(() => {
        this.setCapabilityValue('onoff.siren', false);
      }, SIREN_TIMEOUT);

      return this.setSiren({
        sirenNumber: this.defaultSiren,
        sirenState: !!args,
      });
    });

    this.registerReportListener('NOTIFICATION', 'NOTIFICATION_REPORT', report => {
      if (report['Notification Type'] && report['Notification Status']) {
        if (report['Notification Type'] === 'Siren') {
          // Trigger doorbell rang flow
          const currentSirenValue = this.getCapabilityValue('onoff.siren');
          if (!currentSirenValue && !!report['Notification Status (Raw)']) {
            this.getDriver().triggerDoorbellRangFlow(this);
          }
          this.setCapabilityValue('onoff.siren', !!report['Notification Status (Raw)']);

          if (this.sirenTimeout) clearTimeout(this.sirenTimeout);
          this.sirenTimeout = setTimeout(() => {
            this.setCapabilityValue('onoff.siren', false);
          }, SIREN_TIMEOUT);
        }

        if (report['Notification Type'] === 'Home Security') {
          this.setCapabilityValue('alarm_tamper', !!report['Notification Status (Raw)']);

          if (this.tamperTimeout) clearTimeout(this.tamperTimeout);
          this.tamperTimeout = setTimeout(() => {
            this.setCapabilityValue('alarm_tamper', false);
          }, TAMPER_TIMEOUT);
        }
      }
    });
  }

  async setSiren({ sirenNumber = 1, sirenState }) {
    this.currentSiren = sirenNumber;
    this.log('Turning siren', sirenNumber, sirenState);
    return this.node.MultiChannelNodes[`${sirenNumber}`].CommandClass.COMMAND_CLASS_BASIC.BASIC_SET({
      Value: sirenState,
    });
  }

  async resetSiren() {
    this.setCapabilityValue('onoff.siren', false);
    return this.node.MultiChannelNodes[`${this.currentSiren}`].CommandClass.COMMAND_CLASS_BASIC.BASIC_SET({
      Value: false,
    });
  }

  async onSettings(oldSettings, newSettings, changedKeys) {
    this.log(changedKeys);

    if (changedKeys.includes('default_sound')) {
      if (Number(newSettings['default_sound']) < 9 && Number(newSettings['default_sound']) > 0) {
        this.log('Changing default sound');
        this.defaultSiren = newSettings['default_sound'];
      }
    }

    return Promise.resolve(newSettings);
  }

}

module.exports = AeotecDoorbellSixDevice;
