"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csrf = require("csurf");
class CsrfProtection {
    enableFor(app) {
        app.use(csrf({
            cookie: {
                key: '_csrf',
                secure: true,
                httpOnly: true
            }
        }));
        app.use((req, res, next) => {
            res.locals.csrf = req.csrfToken();
            next();
        });
    }
}
exports.CsrfProtection = CsrfProtection;
