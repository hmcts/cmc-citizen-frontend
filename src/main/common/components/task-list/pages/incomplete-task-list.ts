import * as express from 'express'

import { TaskList } from 'main/common/components/task-list/model'

import { Paths } from 'main/common/components/task-list/paths'

export abstract class AbstractIncompleteTaskListPage {
  constructor (private heading: string) {}

  abstract buildTaskList (res: express.Response): TaskList

  abstract buildTaskListPath (req: express.Request, res: express.Response): string

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(path + Paths.incompleteTaskListPage.uri,
        ...guards,
        (req: express.Request, res: express.Response) => {
          res.render('components/task-list/pages/incomplete-task-list', {
            heading: this.heading,
            taskList: this.buildTaskList(res),
            taskListUri: this.buildTaskListPath(req, res)
          })
        }
      )
  }
}
