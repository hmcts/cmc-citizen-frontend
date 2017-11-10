export class TaskListItem {
  name: string
  startPageUrl: string
  completed: boolean

  constructor (name: string, startPageUrl: string, completed: boolean) {
    this.name = name
    this.startPageUrl = startPageUrl
    this.completed = completed
  }
}
