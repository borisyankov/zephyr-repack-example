// import {getSharedDependencies} from 'mobile-sdk';

import {RemotesLocal} from './mock-zephyr-api.mjs';

export default {
  name: 'MobileHost',
  dts: false,
  remotes: Object.entries(RemotesLocal).map(([key, value]) => ({
    name: key,
    entry: value,
  })),
  // shared: getSharedDependencies({eager: true}),
  // runtimePlugins: [path.resolve(__dirname, './src/custom-runtime-plugin.ts')],
};
