"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MoneyConverter {
    static convertPenniesToPounds(amount) {
        return amount / 100;
    }
    static convertPoundsToPennies(amount) {
        return Math.round(amount * 100);
    }
}
exports.MoneyConverter = MoneyConverter;
