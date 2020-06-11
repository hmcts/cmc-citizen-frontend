"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hooks_1 = require("test/hooks");
function attachDefaultHooks(app) {
    hooks_1.attachDefaultHooks();
    before(() => {
        app.locals.csrf = 'dummy-token';
    });
    afterEach(function (done) {
        app.listen(done).close(done);
    });
}
exports.attachDefaultHooks = attachDefaultHooks;
