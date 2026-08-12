import { WebPlugin } from '@capacitor/core';
import type { CallbackID, GetIsWatchingResult, VolumeButtonsOptions, VolumeButtonsPlugin, VolumeButtonsCallback } from './definitions';
export declare class VolumeButtonsWeb extends WebPlugin implements VolumeButtonsPlugin {
    isWatching(): Promise<GetIsWatchingResult>;
    watchVolume(_options: VolumeButtonsOptions, _callback: VolumeButtonsCallback): Promise<CallbackID>;
    clearWatch(): Promise<void>;
}
