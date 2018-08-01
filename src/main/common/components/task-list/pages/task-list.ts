import * as express from 'express'

import { Paths } from '../paths'

import { TaskList } from 'main/common/components/task-list/model/task-list'

export abstract class AbstractTaskListPage {
  constructor (private heading: string) {}

  abstract buildTaskList (res: express.Response): TaskList

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(path + Paths.taskListPage.uri,
        ...guards,
        (req: express.Request, res: express.Response) => {
          res.render('components/task-list/task-list',
            {
              heading: this.heading,
              taskList: this.buildTaskList(res)
            })
        }
      )
  }
}
