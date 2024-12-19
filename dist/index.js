const handler = {
    get: function (target, name) {
        if (typeof window === "undefined") {
            return;
        }
        return target.hasOwnProperty(name) ? target[name] : (...args) => {
            if (window == undefined || !window.__tap) {
                return;
            }
            window.__tap(name, ...args);
        };
    }
};
const target = {
    init: (accountId, createOptions = { integration: "npm-module" }, createCallback, detectOptions = {}, detectCallback) => {
        if (window.__tap)
            return;
        (function (t, a, p) {
            t.TapfiliateObject = a;
            t[a] = t[a] || function () {
                (t[a].q = t[a].q || []).push(arguments);
            };
        })(window, "__tap", null);
        const script = document.createElement("script");
        script.src = "https://script.tapfiliate.com/tapfiliate.js";
        script.type = "text/javascript";
        script.async = true;
        document.getElementsByTagName("head")[0].appendChild(script);
        script.addEventListener("error", function () {
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
const Tap = new Proxy(target, handler);
export default Tap;
