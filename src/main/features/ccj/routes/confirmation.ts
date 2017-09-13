import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'
import { CCJClient } from 'claims/ccjClient'

export default express.Router()
  .get(Paths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const { externalId } = req.params

      const ccj = await CCJClient.retrieve(externalId)

      res.render(Paths.confirmationPage.associatedView,
        {
          defendantName: ccj['defendantName'],
          judgmentDeadline: ccj['judgmentDeadline'],
          judgmentDownloadPath: Paths.downloadJudgmentReceiver
        })
    }))
