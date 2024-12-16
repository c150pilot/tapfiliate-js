import {Callback, CreateOptions, DetectOptions, TapfiliateInstance} from "../index";

const handler: ProxyHandler<any> = {
  get: function(target: any, name: string) {
    if (typeof window === "undefined") {
      return;
    }

    return target.hasOwnProperty(name) ? target[name] : (...args: any[]) => {
      if (window == undefined || !window.__tap) {
        return;
      }
      window.__tap(name, ...args);
    };
  }
};

const target = {
  init: (
      accountId: string,
      createOptions: CreateOptions = { integration: "npm-module" },
      createCallback?: Callback,
      detectOptions: DetectOptions = {},
      detectCallback?: Callback
  ): void => {
    if (window.__tap) return;

    (function(t: Window, a: string, p: any) {
      t.TapfiliateObject = a;
      (t as any)[a] = (t as any)[a] || function() {
        ((t as any)[a].q = (t as any)[a].q || []).push(arguments);
      };
    })(window, "__tap", null);

    const script = document.createElement("script");
    script.src = "https://script.tapfiliate.com/tapfiliate.js";
    script.type = "text/javascript";
    script.async = true;

    document.getElementsByTagName("head")[0].appendChild(script);

    script.addEventListener("error", function() {
      throw new Error(`${this.src} failed to load.`);
    });

    if (!window.__tap) {
      return;
    }

    // @ts-ignore
    window.__tap("create", accountId, createOptions, createCallback);
    // @ts-ignore
    window.__tap("detect", detectOptions, detectCallback);
  }
};

const Tap = new Proxy(target, handler) as TapfiliateInstance;

export default Tap;