import * as Repack from '@callstack/repack';
import {RsdoctorRspackPlugin} from '@rsdoctor/rspack-plugin';
import rspack from '@rspack/core';
import {getSharedDependencies} from 'mobile-sdk';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {withZephyr} from 'zephyr-repack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USE_ZEPHYR = Boolean(process.env.ZC);

/**
 * More documentation, installation, usage, motivation and differences with Metro is available at:
 * https://github.com/callstack/repack/blob/main/README.md
 *
 * The API documentation for the functions and plugins used in this file is available at:
 * https://re-pack.dev
 */

/**
 * Webpack configuration.
 * You can also export a static object or a function returning a Promise.
 *
 * @param env Environment options passed from either Webpack CLI or React Native Community CLI
 *            when running with `react-native start/bundle`.
 */
export default env => {
  const {mode, platform = process.env.PLATFORM} = env;

  const config = {
    mode,
    context: __dirname,
    entry: './index.js',
    experiments: {
      incremental: mode === 'development',
    },
    resolve: {
      ...Repack.getResolveOptions(),
    },
    output: {
      uniqueName: 'mobile-host',
    },
    module: {
      rules: [
        ...Repack.getJsTransformRules(),
        ...Repack.getAssetTransformRules(),
      ],
    },
    plugins: [
      new Repack.RepackPlugin(),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'MobileHost',
        dts: false,
        remotes: {
          MobileCart: `MobileCart@http://localhost:9000/${platform}/MobileCart.container.js.bundle`,
          MobileInventory: `MobileInventory@http://localhost:9001/${platform}/MobileInventory.container.js.bundle`,
          MobileCheckout: `MobileCheckout@http://localhost:9002/${platform}/MobileCheckout.container.js.bundle`,
          MobileOrders: `MobileOrders@http://localhost:9003/${platform}/MobileOrders.container.js.bundle`,
        },
        shared: getSharedDependencies({eager: true}),
      }),
      new rspack.IgnorePlugin({
        resourceRegExp: /^@react-native-masked-view/,
      }),
    ],
  };

  if (process.env.RSDOCTOR) {
    config.plugins.push(
      new RsdoctorRspackPlugin({
        supports: {
          generateTileGraph: true,
        },
      }),
    );
  }

  if (USE_ZEPHYR) {
    return withZephyr()(config);
  }

  return config;
};
