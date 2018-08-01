import * as express from 'express'
import { TaskList } from 'shared/components/task-list/model/task-list'

import { Paths } from 'shared/components/task-list/paths'

export abstract class AbstractIncompleteTaskListPage {
  constructor (private heading: string) {}

  abstract buildTaskList (res: express.Response): TaskList

  abstract buildTaskListPath (req: express.Request, res: express.Response): string

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(path + Paths.incompleteTaskListPage.uri,
        ...guards,
        (req: express.Request, res: express.Response) => {
          res.render('components/task-list/incomplete-task-list', {
            heading: this.heading,
            taskList: this.buildTaskList(res),
            taskListUri: this.buildTaskListPath(req, res)
          })
        }
      )
  }
}
