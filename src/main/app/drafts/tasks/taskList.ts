import { TaskListItem } from 'drafts/tasks/taskListItem'

export class TaskList {
  constructor (public name: string, public tasks: TaskListItem[]) {
    this.name = name
    this.tasks = tasks
  }

  isCompleted (): boolean {
    return this.tasks
      .map((item: TaskListItem) => {
        return item.completed
      })
      .every((completedState: boolean) => completedState === true)
  }
}
