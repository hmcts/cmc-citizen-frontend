declare class EventProcessor {
    static _handlerMap: Map<any, any>;
    /**
    * Adds a callback/event listener to the specified event, which will be called when the event occurs.
    *
    * @param {string} eventName - The event to listen for.
    * @param {Function} callback - The function to be called when the event is emitted.
    * @return {EventToken} - Object which acts as unique identifier for added listener,
    * to be passed to the `off` function to remove the added listener.
    */
    static on(eventName: string, callback: Function): {
        type: string;
        token: string;
    };
    /**
    * Removes the listener identified by the eventToken parameter.
    *
    * @param {EventToken} eventToken - The EventToken of the callback/listener to remove.
    */
    static off(eventToken: any): void;
    static emit(type: string, data?: any): void;
}

interface UserPreferences {
    cookieName: string;
    cookieExpiry: number;
    cookieSecure: boolean;
}
interface PreferencesForm {
    class: string;
}
interface CookieBanner {
    class: string;
    showWithPreferencesForm: boolean;
    actions: {
        name: string;
        buttonClass: string;
        confirmationClass?: string;
        consent?: string[] | boolean;
    }[];
}
interface CookieManifest {
    categoryName: string;
    optional?: boolean;
    matchBy?: string;
    cookies: string[];
}
interface AdditionalOptions {
    disableCookieBanner: boolean;
    disableCookiePreferencesForm: boolean;
    deleteUndefinedCookies: boolean;
    defaultConsent: boolean;
}
interface CookieManagerConfig {
    userPreferences: Partial<UserPreferences>;
    preferencesForm: Partial<PreferencesForm>;
    cookieBanner: Partial<CookieBanner>;
    cookieManifest: CookieManifest[];
    additionalOptions: Partial<AdditionalOptions>;
}

/**
 * Initializes the @hmcts-cookie/manager library using the provided config.
 *
 * @param {CookieManagerConfig} providedConfig - Config for the library to use.
 */
declare function init(providedConfig: Partial<CookieManagerConfig>): void;
declare const _default: {
    on: typeof EventProcessor.on;
    off: typeof EventProcessor.off;
    init: typeof init;
};

export { _default as default };
