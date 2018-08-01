import { RoutablePath } from 'shared/router/routablePath'

export class Paths {
  static readonly taskListPage = new RoutablePath('/task-list')
  static readonly incompleteTaskListPage = new RoutablePath('/task-list/remaining-tasks')
}
