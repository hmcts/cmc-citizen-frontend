import { TaskList } from 'drafts/tasks/taskList'

export class TaskStatus {
  static getTaskStatus (tasks: TaskList[] = []): {completed: number, total: number} {
    const status = tasks.reduce((accumulator, taskList) => {

      if (taskList) {
        const completed = taskList.tasks.filter((task) => task.completed)
        // add all available tasks
        accumulator.total += taskList.tasks.length

        // add all completed tasks
        accumulator.completed += completed.length
      }
      return accumulator
    }, { completed: 0, total: 0 })

    return status
  }
}
