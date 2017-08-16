import TaskListItem from 'app/drafts/tasks/taskListItem'

export default class TaskList {
  constructor (public position: number, public name: string, public tasks: TaskListItem[]) {
    this.name = name
    this.position = position
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
