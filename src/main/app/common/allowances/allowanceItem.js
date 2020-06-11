"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AllowanceItem {
    constructor(item, weekly, monthly) {
        this.item = item;
        this.weekly = weekly;
        this.monthly = monthly;
    }
    deserialize(input) {
        if (input) {
            this.item = input.item;
            this.weekly = input.weekly;
            this.monthly = input.monthly;
        }
        return this;
    }
}
exports.AllowanceItem = AllowanceItem;
