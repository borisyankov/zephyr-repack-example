import type {FederationRuntimePlugin} from '@module-federation/enhanced/runtime';

function log(eventName: string, obj: Record<string, unknown>) {
  console.log(eventName, JSON.stringify(obj, null, 2));
}

const runtimePlugin: () => FederationRuntimePlugin = function () {
  return {
    name: 'my-runtime-plugin',
    beforeInit(args) {
      log('beforeInit', args);
      return args;
    },
    beforeRequest(args) {
      log('beforeRequest', args);
      return args;
    },
    afterResolve(args) {
      console.log('afterResolve', args);
      return args;
    },
    onLoad(args) {
      log('onLoad: ', args);
      return args;
    },
    async loadShare(args) {
      console.log('loadShare', args);
    },
    async beforeLoadShare(args) {
      log('beforeloadShare', args);
      return args;
    },
  };
};
export default runtimePlugin;
