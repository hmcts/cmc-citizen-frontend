"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const i18next = require("i18next");
const postProcessor = require("i18next-sprintf-postprocessor");
const middleware = require("i18next-express-middleware");
const backend_1 = require("./backend");
/**
 * Module that enables i18n support for Express.js applications
 */
class I18Next {
    static enableFor(app) {
        i18next
            .use(backend_1.Backend)
            .use(postProcessor)
            .use(middleware.LanguageDetector)
            .init({
            backend: {
                loadPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.po')
            },
            detection: {
                order: ['querystring', 'cookie'],
                lookupQuerystring: 'lang',
                lookupCookie: 'lang',
                caches: ['cookie']
            },
            interpolation: {
                escapeValue: false // Escaping is already handled by Nunjucks
            },
            whitelist: ['en', 'cy'],
            fallbackLng: 'en',
            nsSeparator: false,
            keySeparator: false
        });
        app.use(middleware.handle(i18next));
        return i18next;
    }
}
exports.I18Next = I18Next;
