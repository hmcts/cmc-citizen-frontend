"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function makeSureThereIsAtLeastOneRow(model) {
    if (model && model.rows.length === 0) {
        model.appendRow();
    }
}
exports.makeSureThereIsAtLeastOneRow = makeSureThereIsAtLeastOneRow;
