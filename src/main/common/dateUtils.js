"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
function isAfter4pm() {
    return momentFactory_1.MomentFactory.currentDateTime().hour() > 15;
}
exports.isAfter4pm = isAfter4pm;
