export interface CreateOptions {
    integration?: string;
    [key: string]: any;
}

export interface DetectOptions {
    [key: string]: any;
}

export type Callback = () => void;

export interface TapfiliateInstance {
    init: (
        accountId: string,
        createOptions?: CreateOptions,
        createCallback?: Callback,
        detectOptions?: DetectOptions,
        detectCallback?: Callback
    ) => void;
    [key: string]: (...args: any[]) => void;
}

declare global {
    interface Window {
        __tap?: ((...args: any[]) => void) & {
            q?: any[];
        };
        TapfiliateObject?: string;
    }
}

declare const Tap: TapfiliateInstance;
export default Tap;