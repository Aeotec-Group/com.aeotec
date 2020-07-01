'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

// Documentation see:
// https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/6052990299/original/ES%20-%20Home%20Energy%20Meter%20Gen5.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJ2JSYZ7O3I4JO6DA%2F20190309%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20190309T102337Z&X-Amz-Expires=300&X-Amz-Signature=7cd6a30fa8ed79f0ec7b1afa8b987f78582c01120d0676ce0d2b8b82024c634f&X-Amz-SignedHeaders=Host&response-content-type=application%2Fpdf

class AeotecHomeEnergyDevice extends ZwaveDevice {

	onMeshInit() {
		this.registerCapability('measure_power', 'METER', {
            getParserV4: () => ({
                'Sensor Type': 'Electric meter',
                'Properties1': {
                    'Scale': 2,
                }
            }),
            reportParserV4: report => {
                if (report.hasOwnProperty('Properties2') &&
                    report.Properties2.hasOwnProperty('Scale bits 10') &&
                    report.Properties2['Scale bits 10'] === 2 &&
                    report.Properties1.hasOwnProperty('Scale bit 2') &&
                    report.Properties1['Scale bit 2'] === false) {
                    return report['Meter Value (Parsed)'];
                }
                return null;
            }
		});

        this.registerCapability('meter_power', 'METER', {
            getParserV4: () => ({
                'Sensor Type': 'Electric meter',
                'Properties1': {
                    'Scale': 0,
                }
            }),
            reportParserV4: report => {
                if (report.hasOwnProperty('Properties2') &&
                    report.Properties2.hasOwnProperty('Scale bits 10') &&
                    report.Properties2['Scale bits 10'] === 0 &&
                    report.Properties1.hasOwnProperty('Scale bit 2') &&
                    report.Properties1['Scale bit 2'] === false) {
                    return report['Meter Value (Parsed)'];
                }
                return null;
            }
        });

        this.registerCapability('measure_voltage', 'METER', {
            getParserV4: () => ({
                'Sensor Type': 'Electric meter',
                'Properties1': {
                    'Scale': 4,
                }
            }),
            reportParserV4: report => {
                if (report.hasOwnProperty('Properties2') &&
                    report.Properties2.hasOwnProperty('Scale bits 10') &&
                    report.Properties2['Scale bits 10'] === 0 &&
                    report.Properties1.hasOwnProperty('Scale bit 2') &&
                    report.Properties1['Scale bit 2'] === true) {
                    return report['Meter Value (Parsed)'];
                }
                return null;
            }
        });

        this.registerCapability('measure_current', 'METER', {
            getParserV4: () => ({
                'Sensor Type': 'Electric meter',
                'Properties1': {
                    'Scale': 5,
                }
            }),
            reportParserV4: report => {
                if (report.hasOwnProperty('Properties2') &&
                    report.Properties2.hasOwnProperty('Scale bits 10') &&
                    report.Properties2['Scale bits 10'] === 1 &&
                    report.Properties1.hasOwnProperty('Scale bit 2') &&
                    report.Properties1['Scale bit 2'] === true ) {
                    return report['Meter Value (Parsed)'];
                }
                return null;
            }
        });
    }

}

module.exports = AeotecHomeEnergyDevice;
