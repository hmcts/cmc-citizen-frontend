export interface ITaskListBuilder<Data> {
  build (data: Data): TaskList
}

export class TaskList {
  constructor (public sections: Section[]) {}

  get completed (): boolean {
    return this.sections.every((section: Section) => section.completed === true)
  }
}

export class Section {
  constructor (public name: string, public tasks: Task[]) {}

  get completed (): boolean {
    return this.tasks.every((task: Task) => task.completed === true)
  }
}

export class Task {
  constructor (public name: string, public url: string, public completed: boolean) {}
}
