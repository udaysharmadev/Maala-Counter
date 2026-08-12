import { WebPlugin } from '@capacitor/core';
export class VolumeButtonsWeb extends WebPlugin {
    async isWatching() {
        throw new Error('VolumeButtons is not supported on web');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async watchVolume(_options, _callback) {
        throw new Error('VolumeButtons is not supported on web');
    }
    async clearWatch() {
        throw new Error('VolumeButtons is not supported on web');
    }
}
//# sourceMappingURL=web.js.map