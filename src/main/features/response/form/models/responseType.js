"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseType {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
    }
    static all() {
        return [
            ResponseType.FULL_ADMISSION,
            ResponseType.PART_ADMISSION,
            ResponseType.DEFENCE
        ];
    }
    static except(responseType) {
        if (responseType === undefined) {
            throw new Error('Response type is required');
        }
        return ResponseType.all().filter(item => item !== responseType);
    }
    static valueOf(value) {
        return ResponseType.all().filter(item => item.value === value).pop();
    }
}
exports.ResponseType = ResponseType;
ResponseType.FULL_ADMISSION = new ResponseType('FULL_ADMISSION', 'I admit all of the claim');
ResponseType.PART_ADMISSION = new ResponseType('PART_ADMISSION', 'I admit part of the claim');
ResponseType.DEFENCE = new ResponseType('DEFENCE', 'I reject all of the claim');
