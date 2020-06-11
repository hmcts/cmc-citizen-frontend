"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class YesNoOption {
    constructor(option) {
        this.option = option;
    }
    static fromObject(input) {
        if (!input) {
            return input;
        }
        if (input === 'yes') {
            return YesNoOption.YES;
        }
        else if (input === 'no') {
            return YesNoOption.NO;
        }
        else {
            return undefined;
        }
    }
    static all() {
        return [
            YesNoOption.YES,
            YesNoOption.NO
        ];
    }
}
exports.YesNoOption = YesNoOption;
YesNoOption.YES = new YesNoOption('yes');
YesNoOption.NO = new YesNoOption('no');
