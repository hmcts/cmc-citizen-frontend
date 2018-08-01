export interface ITaskListBuilder<Data> {
  build (data: Data): TaskList
}

export class TaskList {
  constructor (public sections: TaskListSection[]) {}

  get completed (): boolean {
    return this.sections.every((section: TaskListSection) => section.completed === true)
  }

  get tasks (): Task[] {
    return this.sections.reduce((tasks: Task[], section: TaskListSection): Task[] => {
      tasks.push(...section.tasks)
      return tasks
    }, [])
  }

  get remainingTasks (): Task[] {
    return this.sections.reduce((tasks: Task[], section: TaskListSection): Task[] => {
      tasks.push(...section.remainingTasks)
      return tasks
    }, [])
  }
}

export class TaskListSection {
  constructor (public name: string, public tasks: Task[]) {}

  get completed (): boolean {
    return this.tasks.every((task: Task) => task.completed === undefined || task.completed === true)
  }

  get remainingTasks (): Task[] {
    return this.tasks.filter((task: Task) => task.completed === false)
  }
}

export class Task {
  constructor (public name: string, public url: string, public completed: boolean) {}
}
