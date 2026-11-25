import { assetUrl } from './assetUrl';

/** Content media paths may be absolute URLs or paths inside /public. */
export const mediaUrl = (src: string): string => (/^https?:\/\//.test(src) ? src : assetUrl(src));
