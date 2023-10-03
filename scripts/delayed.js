// eslint-disable-next-line import/no-cycle
import { loadScript, sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
loadScript('https://assets.adobedtm.com/14cfd3eeb81a/f0b1093513a5/launch-0886674550c7.min.js', { async: true });
