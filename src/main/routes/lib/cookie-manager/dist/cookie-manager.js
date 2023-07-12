var ManifestHandler = /** @class */ (function () {
    function ManifestHandler(config) {
        this.config = config;
    }
    ManifestHandler.prototype.getCategoryByCookieName = function (cookieName) {
        var _a;
        if (cookieName === this.config.userPreferences.cookieName) {
            return { name: '__internal', optional: false, matchBy: 'exact' };
        }
        return (_a = this.getCategories().filter(function (category) {
            return category.cookies.some(function (cookie) {
                switch (category.matchBy) {
                    case 'exact':
                        return cookieName === cookie;
                    case 'includes':
                        return cookieName.includes(cookie);
                    case 'startsWith':
                    default:
                        return cookieName.startsWith(cookie);
                }
            });
        })[0]) !== null && _a !== void 0 ? _a : {
            name: ManifestHandler.DEFAULTS.UNDEFINED_CATEGORY_NAME,
            optional: true
        };
    };
    ManifestHandler.prototype.getCategories = function () {
        return this.config.cookieManifest
            .map(function (category) {
            var _a, _b;
            return ({
                name: category.categoryName,
                cookies: category.cookies,
                optional: (_a = category.optional) !== null && _a !== void 0 ? _a : true,
                matchBy: (_b = category.matchBy) !== null && _b !== void 0 ? _b : 'startsWith'
            });
        });
    };
    ManifestHandler.DEFAULTS = {
        UNDEFINED_CATEGORY_NAME: 'un-categorized'
    };
    return ManifestHandler;
}());

var CookieHandler = /** @class */ (function () {
    function CookieHandler(config, manifestHandler, userPreferences) {
        this.config = config;
        this.manifestHandler = manifestHandler;
        this.userPreferences = userPreferences;
    }
    CookieHandler.prototype.processCookies = function () {
        if (this.config.additionalOptions.deleteUndefinedCookies) {
            this._processUnCategorizedCookies();
        }
        this._processNonConsentedCookies();
    };
    CookieHandler.prototype._processNonConsentedCookies = function () {
        var _this = this;
        console.debug('Deleting non-consented cookies');
        CookieHandler.getAllCookies()
            .filter(function (cookie) {
            var category = _this.manifestHandler.getCategoryByCookieName(cookie.name);
            return category.name !== ManifestHandler.DEFAULTS.UNDEFINED_CATEGORY_NAME &&
                category.optional &&
                !_this.userPreferences.getPreferences()[category.name];
        })
            .forEach(function (cookie) { return CookieHandler.deleteCookie(cookie); });
    };
    CookieHandler.prototype._processUnCategorizedCookies = function () {
        var _this = this;
        console.debug('Deleting non-categorized cookies');
        CookieHandler.getAllCookies()
            .filter(function (cookie) { return _this.manifestHandler.getCategoryByCookieName(cookie.name).name === ManifestHandler.DEFAULTS.UNDEFINED_CATEGORY_NAME; })
            .forEach(function (cookie) { return CookieHandler.deleteCookie(cookie); });
    };
    CookieHandler.getAllCookies = function () {
        return decodeURIComponent(document.cookie)
            .split(';')
            .map(function (cookie) { return cookie.trim(); })
            .filter(function (cookie) { return cookie.length; })
            .map(function (cookie) {
            var cookieComponents = cookie.split(/=(.*)/).map(function (component) { return component.trim(); });
            return { name: cookieComponents[0], value: cookieComponents[1] };
        });
    };
    CookieHandler.getCookie = function (name) {
        return CookieHandler.getAllCookies().filter(function (cookie) { return cookie.name === name; })[0];
    };
    CookieHandler.saveCookie = function (cookie, expiry, secure) {
        var date = new Date();
        date.setDate(date.getDate() + expiry);
        var cookieString = cookie.name + '=';
        cookieString += typeof cookie.value === 'object' ? JSON.stringify(cookie.value) : cookie.value;
        cookieString += expiry ? ';expires=' + date.toUTCString() : '';
        cookieString += secure ? ';secure' : '';
        cookieString += ';path=/;';
        document.cookie = cookieString;
        console.debug("Saved '".concat(cookie.name, "' cookie"));
    };
    CookieHandler.deleteCookie = function (cookie) {
        console.debug('Deleting cookie: ' + cookie.name);
        var hostname = window.location.hostname;
        var upperDomain = hostname.substring(hostname.indexOf('.'));
        var expires = new Date(-1).toUTCString();
        [hostname, '.' + hostname, upperDomain, '.' + upperDomain].forEach(function (domain) {
            document.cookie = cookie.name + '=;expires=' + expires + ';domain=' + domain + ';path=/;';
        });
    };
    return CookieHandler;
}());

var EventProcessor = /** @class */ (function () {
    function EventProcessor() {
        console.log("**********************************something is being loaded here******************************************");
    }
    /**
    * Adds a callback/event listener to the specified event, which will be called when the event occurs.
    *
    * @param {string} eventName - The event to listen for.
    * @param {Function} callback - The function to be called when the event is emitted.
    * @return {EventToken} - Object which acts as unique identifier for added listener,
    * to be passed to the `off` function to remove the added listener.
    */
    EventProcessor.on = function (eventName, callback) {
        if (typeof eventName !== 'string') {
            console.error('Event not provided');
            return;
        }
        if (typeof callback !== 'function') {
            console.error('No callback function provided');
            return;
        }
        eventName = eventName.toLowerCase();
        var token = Math.random().toString(16).slice(2);
        if (!EventProcessor._handlerMap.has(eventName)) {
            EventProcessor._handlerMap.set(eventName, new Map());
        }
        EventProcessor._handlerMap.get(eventName).set(token, callback);
        return { type: eventName, token: token };
    };
    /**
    * Removes the listener identified by the eventToken parameter.
    *
    * @param {EventToken} eventToken - The EventToken of the callback/listener to remove.
    */
    EventProcessor.off = function (eventToken) {
        var type;
        var token;
        try {
            type = eventToken.type.toLowerCase();
            token = eventToken.token;
        }
        catch (e) {
            console.error('Missing or malformed event token provided');
            return;
        }
        if (EventProcessor._handlerMap.has(type)) {
            EventProcessor._handlerMap.get(type).delete(token);
        }
    };
    EventProcessor.emit = function (type, data) {
        type = type.toLowerCase();
        console.debug('Event fired: ' + type);
        if (EventProcessor._handlerMap.has(type)) {
            EventProcessor._handlerMap.get(type).forEach(function (value) { return value(data); });
        }
    };
    EventProcessor._handlerMap = new Map();
    return EventProcessor;
}());

var UserPreferences = /** @class */ (function () {
    function UserPreferences(config, manifestHandler) {
        this.config = config;
        this.manifestHandler = manifestHandler;
    }
    UserPreferences.prototype.processPreferences = function () {
        var preferencesCookie = this.getPreferenceCookie();
        if (preferencesCookie) {
            this.setPreferences(this._loadPreferencesFromCookie());
        }
        else {
            this.setPreferences(this._loadPreferenceDefaults());
        }
    };
    UserPreferences.prototype.getPreferences = function () {
        if (!this.preferences) {
            console.error('User preferences not loaded/set, call .processPreferences() first');
            return {};
        }
        return this.preferences;
    };
    UserPreferences.prototype.setPreferences = function (preferences) {
        console.debug('Setting preferences to: ' + JSON.stringify(preferences));
        this.preferences = preferences;
        EventProcessor.emit('UserPreferencesSet', (preferences));
    };
    UserPreferences.prototype.getPreferenceCookie = function () {
        return CookieHandler.getCookie(this.config.userPreferences.cookieName);
    };
    UserPreferences.prototype.savePreferencesToCookie = function () {
        var cookieValue = {};
        var preferences = this.getPreferences();
        Object.keys(preferences).forEach(function (key) { cookieValue[key] = preferences[key] ? 'on' : 'off'; });
        var preferencesCookie = { name: this.config.userPreferences.cookieName, value: cookieValue };
        CookieHandler.saveCookie(preferencesCookie, this.config.userPreferences.cookieExpiry, this.config.userPreferences.cookieSecure);
        EventProcessor.emit('UserPreferencesSaved', (cookieValue));
    };
    UserPreferences.prototype._loadPreferencesFromCookie = function () {
        var cookiePreferences;
        var preferenceCookie = this.getPreferenceCookie();
        try {
            console.debug('Loading preferences from cookie');
            cookiePreferences = JSON.parse(preferenceCookie.value);
        }
        catch (e) {
            console.error("Unable to parse user preference cookie \"".concat(preferenceCookie.name, "\" as JSON."));
            CookieHandler.deleteCookie(preferenceCookie);
            return this._loadPreferenceDefaults();
        }
        if (typeof cookiePreferences !== 'object') {
            console.debug('User preferences cookie is malformed, deleting old user preferences cookie.');
            CookieHandler.deleteCookie(preferenceCookie);
            return this._loadPreferenceDefaults();
        }
        if (this.manifestHandler.getCategories()
            .filter(function (category) { return category.optional; })
            .some(function (category) { return !Object.keys(cookiePreferences).includes(category.name); })) {
            console.debug('User preferences cookie is missing categories, deleting old user preferences cookie.');
            CookieHandler.deleteCookie(preferenceCookie);
            return this._loadPreferenceDefaults();
        }
        var preferences = {};
        Object.keys(cookiePreferences).forEach(function (key) { preferences[key] = cookiePreferences[key] === 'on'; });
        EventProcessor.emit('UserPreferencesLoaded', (cookiePreferences));
        return preferences;
    };
    UserPreferences.prototype._loadPreferenceDefaults = function () {
        var _this = this;
        console.debug('Loading preferences from defaults');
        var preferences = {};
        var cookiePreferences = {};
        this.manifestHandler.getCategories()
            .filter(function (category) { var _a; return (_a = category.optional) !== null && _a !== void 0 ? _a : true; })
            .forEach(function (category) {
            preferences[category.name] = _this.config.additionalOptions.defaultConsent;
            cookiePreferences[category.name] = _this.config.additionalOptions.defaultConsent ? 'on' : 'off';
        });
        EventProcessor.emit('UserPreferencesLoaded', (cookiePreferences));
        return preferences;
    };
    return UserPreferences;
}());

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};
function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}
function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

var CookieBannerHandler = /** @class */ (function () {
    function CookieBannerHandler(config, userPreferencesHandler, cookieHandler) {
        this.config = config;
        this.userPreferencesHandler = userPreferencesHandler;
        this.cookieHandler = cookieHandler;
    }
    CookieBannerHandler.prototype.init = function () {
        var _this = this;
        if (this.userPreferencesHandler.getPreferenceCookie())
            return;
        if (document.readyState === 'loading') {
            console.debug('DOM is not ready; adding event to bind to banner when ready.');
            document.addEventListener('DOMContentLoaded', function () { return _this.init(); });
            return;
        }
        if (!this._getBannerNode())
            return;
        if (document.getElementsByClassName(this.config.preferencesForm.class)[0] && !this.config.cookieBanner.showWithPreferencesForm)
            return;
        this._setupEventListeners();
        this._getBannerNode().hidden = false;
        EventProcessor.emit('CookieBannerInitialized');
    };
    CookieBannerHandler.prototype._setupEventListeners = function () {
        var _this = this;
        var actions = this.config.cookieBanner.actions || [];
        actions.forEach(function (action) {
            var e_1, _a;
            try {
                for (var _b = __values(_this._getBannerNode().querySelectorAll('.' + action.buttonClass)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var button = _c.value;
                    button.addEventListener('click', function (event) {
                        _this._clickEventHandler(event, action.name, action.confirmationClass, action.consent);
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    };
    CookieBannerHandler.prototype._clickEventHandler = function (event, name, confirmationClass, consent) {
        var e_2, _a;
        event.preventDefault();
        EventProcessor.emit('CookieBannerAction', name);
        if (confirmationClass) {
            try {
                for (var _b = __values(this._getBannerNode().children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    child.hidden = !child.classList.contains(confirmationClass);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        else {
            this._getBannerNode().hidden = true;
        }
        if (consent !== undefined) {
            var preferences_1 = this.userPreferencesHandler.getPreferences();
            // If set to TRUE (consent all) or FALSE (reject all)
            if (typeof consent === 'boolean') {
                Object.keys(preferences_1).forEach(function (category) { preferences_1[category] = consent; });
            }
            // If is array of categories
            if (Array.isArray(consent)) {
                consent.forEach(function (category) { preferences_1[category] = true; });
            }
            this._updatePreferences(preferences_1);
        }
    };
    CookieBannerHandler.prototype._updatePreferences = function (preferences) {
        this.userPreferencesHandler.setPreferences(preferences);
        this.userPreferencesHandler.savePreferencesToCookie();
        this.cookieHandler.processCookies();
    };
    CookieBannerHandler.prototype._getBannerNode = function () {
        return document.querySelector('.' + this.config.cookieBanner.class);
    };
    return CookieBannerHandler;
}());

var PreferencesFormHandler = /** @class */ (function () {
    function PreferencesFormHandler(config, userPreferencesHandler, cookieHandler) {
        this.config = config;
        this.userPreferencesHandler = userPreferencesHandler;
        this.cookieHandler = cookieHandler;
    }
    PreferencesFormHandler.prototype.init = function () {
        var _this = this;
        if (document.readyState === 'loading') {
            console.debug('DOM is not ready; adding event to bind to preference form when ready.');
            document.addEventListener('DOMContentLoaded', function () { return _this.init(); });
            return;
        }
        if (!this._getPreferencesForm()) {
            return;
        }
        this._setupEventListeners();
        this._configureFormRadios();
        EventProcessor.emit('PreferenceFormInitialized');
    };
    PreferencesFormHandler.prototype._getPreferencesForm = function () {
        return document.getElementsByClassName(this.config.preferencesForm.class)[0];
    };
    PreferencesFormHandler.prototype._setupEventListeners = function () {
        var _this = this;
        this._getPreferencesForm().addEventListener('submit', function (event) { return _this._submitEventHandler(event); });
    };
    PreferencesFormHandler.prototype._submitEventHandler = function (event) {
        var e_1, _a;
        event.preventDefault();
        var preferences = {};
        try {
            for (var _b = __values(event.target.querySelectorAll('input[type="radio"]:checked')), _c = _b.next(); !_c.done; _c = _b.next()) {
                var radio = _c.value;
                var name_1 = radio.getAttribute('name');
                var value = radio.getAttribute('value');
                preferences[name_1] = value === 'on';
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        EventProcessor.emit('PreferenceFormSubmitted', (preferences));
        this._updatePreferences(preferences);
    };
    PreferencesFormHandler.prototype._updatePreferences = function (preferences) {
        this.userPreferencesHandler.setPreferences(preferences);
        this.userPreferencesHandler.savePreferencesToCookie();
        this.cookieHandler.processCookies();
    };
    PreferencesFormHandler.prototype._configureFormRadios = function () {
        var preferences = this.userPreferencesHandler.getPreferences();
        for (var key in preferences) {
            var checkboxValue = preferences[key] ? 'on' : 'off';
            var checkbox = this._getPreferencesForm().querySelector("input[name=".concat(key, "][value=").concat(checkboxValue, "]"));
            if (checkbox) {
                checkbox.checked = true;
            }
        }
    };
    return PreferencesFormHandler;
}());

var isString = function (property) { return typeof property === 'string' && property.trim() !== ''; };
var isBoolean = function (property) { return typeof property === 'boolean'; };
var isNumber = function (property) { return typeof property === 'number' && !isNaN(property); };
var isUndefined = function (property) { return property === undefined; };
var isArray = function (property) { return Array.isArray(property) && property.length; };
var isArrayOfType = function (property, type) { return isArray(property) && property.every(function (value) { return type(value); }); };
var ConfigHandler = /** @class */ (function () {
    function ConfigHandler() {
        this.configTypes = {
            userPreferences: {
                cookieName: isString,
                cookieExpiry: isNumber,
                cookieSecure: isBoolean
            },
            preferencesForm: {
                class: isString
            },
            cookieBanner: {
                class: isString,
                showWithPreferencesForm: isBoolean,
                actions: {
                    name: isString,
                    buttonClass: isString,
                    confirmationClass: { OR: [isUndefined, isString] },
                    consent: { OR: [isUndefined, isBoolean, function (property) { return isArrayOfType(property, isString); }] }
                }
            },
            additionalOptions: {
                disableCookieBanner: isBoolean,
                disableCookiePreferencesForm: isBoolean,
                deleteUndefinedCookies: isBoolean,
                defaultConsent: isBoolean
            },
            cookieManifest: {
                categoryName: isString,
                optional: { OR: [isUndefined, isBoolean] },
                matchBy: { OR: [isUndefined, function (property) { return isString(property) && ['exact', 'startsWith', 'includes'].indexOf(property) !== -1; }] },
                cookies: function (property) { return isArrayOfType(property, isString); }
            }
        };
    }
    ConfigHandler.prototype.typeOfTester = function (value, testers) {
        if (typeof testers === 'function')
            return testers(value);
        if (testers.AND) {
            return testers.AND.every(function (testFunction) { return testFunction(value); });
        }
        else {
            return testers.OR.some(function (testFunction) { return testFunction(value); });
        }
    };
    ConfigHandler.prototype.validateUserPreferencesConfig = function (configuration) {
        for (var key in this.configTypes.userPreferences) {
            if (!this.typeOfTester(configuration[key], this.configTypes.userPreferences[key]))
                throw new ConfigError(key);
        }
    };
    ConfigHandler.prototype.validateAdditionalOptionsConfig = function (configuration) {
        for (var key in this.configTypes.additionalOptions) {
            if (!this.typeOfTester(configuration[key], this.configTypes.additionalOptions[key]))
                throw new ConfigError(key);
        }
    };
    ConfigHandler.prototype.validatePreferencesFormConfig = function (configuration) {
        for (var key in this.configTypes.preferencesForm) {
            if (!this.typeOfTester(configuration[key], this.configTypes.preferencesForm[key]))
                throw new ConfigError(key);
        }
    };
    ConfigHandler.prototype.validateCookieBannerConfig = function (configuration) {
        var _this = this;
        var _a = this.configTypes.cookieBanner, actions = _a.actions, options = __rest(_a, ["actions"]);
        for (var key in options) {
            if (!this.typeOfTester(configuration[key], this.configTypes.cookieBanner[key]))
                throw new ConfigError(key);
        }
        configuration.actions.forEach(function (action) {
            for (var key in actions) {
                if (!_this.typeOfTester(action[key], _this.configTypes.cookieBanner.actions[key]))
                    throw new ConfigError(key);
            }
        });
    };
    ConfigHandler.prototype.validateCookieManifestConfig = function (configuration) {
        var _this = this;
        configuration.forEach(function (cookieCategory) {
            for (var key in _this.configTypes.cookieManifest) {
                if (!_this.typeOfTester(cookieCategory[key], _this.configTypes.cookieManifest[key]))
                    throw new ConfigError(key);
            }
        });
    };
    ConfigHandler.prototype.validateConfig = function (configuration) {
        this.validateUserPreferencesConfig(configuration.userPreferences);
        this.validateAdditionalOptionsConfig(configuration.additionalOptions);
        this.validatePreferencesFormConfig(configuration.preferencesForm);
        this.validateCookieBannerConfig(configuration.cookieBanner);
        this.validateCookieManifestConfig(configuration.cookieManifest);
    };
    ConfigHandler.prototype.mergeConfigurations = function (providedConfig) {
        var _a;
        var finalConfig = __assign({}, ConfigHandler.defaultConfig);
        if (Object.keys(providedConfig).length) {
            finalConfig.userPreferences = __assign(__assign({}, ConfigHandler.defaultConfig.userPreferences), providedConfig.userPreferences);
            finalConfig.additionalOptions = __assign(__assign({}, ConfigHandler.defaultConfig.additionalOptions), providedConfig.additionalOptions);
            finalConfig.preferencesForm = __assign(__assign({}, ConfigHandler.defaultConfig.preferencesForm), providedConfig.preferencesForm);
            finalConfig.cookieBanner = __assign(__assign({}, ConfigHandler.defaultConfig.cookieBanner), providedConfig.cookieBanner);
            finalConfig.cookieManifest = (_a = providedConfig.cookieManifest) !== null && _a !== void 0 ? _a : ConfigHandler.defaultConfig.cookieManifest;
            this.validateConfig(finalConfig);
        }
        return finalConfig;
    };
    ConfigHandler.defaultConfig = {
        userPreferences: {
            cookieName: 'cookie-preferences',
            cookieExpiry: 365,
            cookieSecure: false
        },
        preferencesForm: {
            class: 'cookie-preferences-form'
        },
        cookieBanner: {
            class: 'cookie-banner',
            showWithPreferencesForm: false,
            actions: [
                {
                    name: 'accept',
                    buttonClass: 'cookie-banner-accept-button',
                    confirmationClass: 'cookie-banner-accept-message',
                    consent: true
                },
                {
                    name: 'reject',
                    buttonClass: 'cookie-banner-reject-button',
                    confirmationClass: 'cookie-banner-reject-message',
                    consent: false
                },
                {
                    name: 'hide',
                    buttonClass: 'cookie-banner-hide-button'
                }
            ]
        },
        cookieManifest: [],
        additionalOptions: {
            disableCookieBanner: false,
            disableCookiePreferencesForm: false,
            deleteUndefinedCookies: true,
            defaultConsent: false
        }
    };
    return ConfigHandler;
}());
var ConfigError = /** @class */ (function (_super) {
    __extends(ConfigError, _super);
    function ConfigError(property) {
        var _this = _super.call(this, "Configuration property '".concat(property, "' is malformed, missing or has an unexpected value.")) || this;
        _this.name = 'ConfigError';
        return _this;
    }
    return ConfigError;
}(Error));

/**
 * Initializes the @hmcts-cookie/manager library using the provided config.
 *
 * @param {CookieManagerConfig} providedConfig - Config for the library to use.
 */
function init(providedConfig) {
    console.debug('CookieManager initializing...');
    var config;
    try {
        config = new ConfigHandler().mergeConfigurations(providedConfig);
    }
    catch (e) {
        console.error(e);
        console.error('Invalid config supplied to CookieManager, disabling...');
        return;
    }
    var manifestHandler = new ManifestHandler(config);
    var userPreferences = new UserPreferences(config, manifestHandler);
    var cookieHandler = new CookieHandler(config, manifestHandler, userPreferences);
    userPreferences.processPreferences();
    if (!config.additionalOptions.disableCookieBanner) {
        new CookieBannerHandler(config, userPreferences, cookieHandler).init();
    }
    if (!config.additionalOptions.disableCookiePreferencesForm) {
        new PreferencesFormHandler(config, userPreferences, cookieHandler).init();
    }
    EventProcessor.emit('CookieManagerLoaded');
    cookieHandler.processCookies();
}
var on = EventProcessor.on;
var off = EventProcessor.off;
var cookieManager = { on: on, off: off, init: init };

module.exports = { cookieManager }
