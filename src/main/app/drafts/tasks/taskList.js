"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TaskList {
    constructor(name, tasks) {
        this.name = name;
        this.tasks = tasks;
        this.name = name;
        this.tasks = tasks;
    }
    isCompleted() {
        return this.tasks
            .map((item) => {
            return item.completed;
        })
            .every((completedState) => completedState === true);
    }
}
exports.TaskList = TaskList;
