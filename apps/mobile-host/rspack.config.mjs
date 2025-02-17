import {createRequire} from 'node:module';
import * as Repack from '@callstack/repack';
import {RsdoctorRspackPlugin} from '@rsdoctor/rspack-plugin';
import rspack from '@rspack/core';
import {getSharedDependencies} from 'mobile-sdk';
import path from 'node:path';
import {withZephyr} from 'zephyr-repack-plugin';
import {ReanimatedPlugin} from '@callstack/repack-plugin-reanimated';
import {NativeWindPlugin} from '@callstack/repack-plugin-nativewind';

const dirname = Repack.getDirname(import.meta.url);
const {resolve} = createRequire(import.meta.url);

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
  const {
    mode = 'development',
    context = dirname,
    entry = './index.js',
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    reactNativePath = resolve('react-native'),
  } = env;

  if (!platform) {
    throw new Error('Missing platform');
  }

  const config = {
    mode,
    /**
     * This should be always `false`, since the Source Map configuration is done
     * by `SourceMapDevToolPlugin`.
     */
    devtool: false,
    context,
    entry,
    resolve: {
      /**
       * `getResolveOptions` returns additional resolution configuration for React Native.
       * If it's removed, you won't be able to use `<file>.<platform>.<ext>` (eg: `file.ios.js`)
       * convention and some 3rd-party libraries that specify `react-native` field
       * in their `package.json` might not work correctly.
       */
      ...Repack.getResolveOptions(platform),

      /**
       * Uncomment this to ensure all `react-native*` imports will resolve to the same React Native
       * dependency. You might need it when using workspaces/monorepos or unconventional project
       * structure. For simple/typical project you won't need it.
       */
      // alias: {
      //   'react-native': reactNativePath,
      // },
    },
    /**
     * Configures output.
     * It's recommended to leave it as it is unless you know what you're doing.
     * By default Webpack will emit files into the directory specified under `path`. In order for the
     * React Native app use them when bundling the `.ipa`/`.apk`, they need to be copied over with
     * `Repack.OutputPlugin`, which is configured by default inside `Repack.RepackPlugin`.
     */
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      path: path.join(dirname, 'build/generated', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      publicPath: Repack.getPublicPath({platform, devServer}),
      uniqueName: 'mobile-host',
    },
    /** Configures optimization of the built bundle. */
    optimization: {
      /** Enables minification based on values passed from React Native Community CLI or from fallback. */
      minimize,
      /** Configure minimizer to process the bundle. */
      chunkIds: 'named',
    },
    module: {
      rules: [
        Repack.REACT_NATIVE_LOADING_RULES,
        Repack.NODE_MODULES_LOADING_RULES,
        Repack.FLOW_TYPED_MODULES_LOADING_RULES,
        /** Additional rule to enable HMR for local workspace packages */
        {
          test: /\.[jt]sx?$/,
          include: [/mobile-core/],
          use: 'builtin:react-refresh-loader',
        },
        /** Here you can adjust loader that will process your files. */
        {
          test: /\.[jt]sx?$/,
          exclude: [/node_modules/],
          type: 'javascript/auto',
          use: {
            loader: 'builtin:swc-loader',
            /** @type {import('@rspack/core').SwcLoaderOptions} */
            options: {
              env: {
                targets: {
                  'react-native': '0.74',
                },
              },
              assumptions: {
                setPublicClassFields: true,
                privateFieldsAsProperties: true,
              },
              jsc: {
                externalHelpers: true,
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: mode === 'development',
                    refresh: mode === 'development' && Boolean(devServer),
                  },
                },
              },
            },
          },
        },
        /** Run React Native codegen, required for utilizing new architecture */
        Repack.REACT_NATIVE_CODEGEN_RULES,
        /**
         * This loader handles all static assets (images, video, audio and others), so that you can
         * use (reference) them inside your application.
         *
         * If you want to handle specific asset type manually, filter out the extension
         * from `ASSET_EXTENSIONS`, for example:
         * ```
         * Repack.ASSET_EXTENSIONS.filter((ext) => ext !== 'svg')
         * ```
         */
        {
          test: Repack.getAssetExtensionsRegExp([
            'lottie',
            ...Repack.ASSET_EXTENSIONS,
          ]),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
              inline: true,
            },
          },
        },
      ],
    },
    plugins: [
      /**
       * Configure other required and additional plugins to make the bundle
       * work in React Native and provide good development experience with
       * sensible defaults.
       *
       * `Repack.RepackPlugin` provides some degree of customization, but if you
       * need more control, you can replace `Repack.RepackPlugin` with plugins
       * from `Repack.plugins`.
       */
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath,
        },
      }),
      /**
       * This plugin is nessessary to make Module Federation work.
       */
      new Repack.plugins.ModuleFederationPluginV2({
        /**
         * The name of the module is used to identify the module in URLs resolver and imports.
         */
        name: 'MobileHost',
        dts: false,
        remotes: {
          MobileCart: `MobileCart@http://localhost:9000/${platform}/MobileCart.container.js.bundle`,
          MobileInventory: `MobileInventory@http://localhost:9001/${platform}/MobileInventory.container.js.bundle`,
          MobileCheckout: `MobileCheckout@http://localhost:9002/${platform}/MobileCheckout.container.js.bundle`,
          MobileOrders: `MobileOrders@http://localhost:9003/${platform}/MobileOrders.container.js.bundle`,
        },
        /**
         * Shared modules are shared in the share scope.
         * React, React Native and React Navigation should be provided here because there should be only one instance of these modules.
         * Their names are used to match requested modules in this compilation.
         */
        shared: {
          ...getSharedDependencies({eager: true}),
          'react-native-css-interop/': {
            singleton: true,
            eager: true,
            requiredVersion: '*',
          },
        },
      }),
      // silence missing @react-native-masked-view optionally required by @react-navigation/elements
      new rspack.IgnorePlugin({
        resourceRegExp: /^@react-native-masked-view/,
      }),
      new ReanimatedPlugin(),
      new NativeWindPlugin(),
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
