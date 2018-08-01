import * as express from 'express'

import { TaskList } from 'shared/components/task-list/model'

import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('router/claimant-response/check-and-send')

export abstract class AbstractAllTasksCompletedGuard {
  abstract buildTaskList (res: express.Response): TaskList

  abstract buildRedirectPath (req: express.Request, res: express.Response): string

  requestHandler (): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const taskList: TaskList = this.buildTaskList(res)

      if (taskList.completed) {
        return next()
      }

      const redirectPath = this.buildRedirectPath(req, res)
      logger.debug(`State guard: check and send page is disabled until all tasks are completed - redirecting to ${redirectPath}`)
      res.redirect(redirectPath)
    }
  }
}
