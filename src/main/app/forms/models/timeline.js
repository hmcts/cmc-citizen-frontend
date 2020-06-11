"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multiRowForm_1 = require("forms/models/multiRowForm");
const timelineRow_1 = require("forms/models/timelineRow");
exports.INIT_ROW_COUNT = 4;
exports.MAX_ROW_COUNT = 100;
class Timeline extends multiRowForm_1.MultiRowForm {
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new Timeline(value.rows ? value.rows.map(timelineRow_1.TimelineRow.fromObject) : []);
    }
    createEmptyRow() {
        return timelineRow_1.TimelineRow.empty();
    }
    getInitialNumberOfRows() {
        return exports.INIT_ROW_COUNT;
    }
    getMaxNumberOfRows() {
        return exports.MAX_ROW_COUNT;
    }
}
exports.Timeline = Timeline;
