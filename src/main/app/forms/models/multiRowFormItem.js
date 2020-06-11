"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MultiRowFormItem {
    isEmpty() {
        return Object.values(this).every(value => value === undefined);
    }
    isAtLeastOneFieldPopulated() {
        return !this.isEmpty();
    }
}
exports.MultiRowFormItem = MultiRowFormItem;
