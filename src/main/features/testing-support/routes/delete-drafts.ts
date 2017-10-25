import * as express from 'express'
import { Paths } from 'testing-support/paths'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'common/draft/draftService'
import DraftClaim from 'drafts/models/draftClaim'
import { Draft } from 'models/draft'
import { DraftStoreClientFactory } from 'common/draft/draftStoreClientFactory'
import DraftStoreClient from 'common/draft/draftStoreClient'
import { DraftDocument } from 'models/draftDocument'
import { ResponseDraft } from 'response/draft/responseDraft'
import { DraftCCJ } from 'ccj/draft/draftCCJ'

function getAction (req: express.Request): string {
  return Object.keys(req.body.action)[0]
}

async function getDraft<T extends DraftDocument> (userAuthToken: string,
                                                  type: string,
                                                  deserializeFn: (value: any) => T = (value) => value): Promise<Draft<T>[]> {
  const draftClaimClient: DraftStoreClient<T> = await DraftStoreClientFactory.create<T>()
  return draftClaimClient.find({
    type: type,
    limit: '100'
  }, userAuthToken, deserializeFn)
}

export default express.Router()
  .get(Paths.deleteDraftsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      res.render(Paths.deleteDraftsPage.associatedView)
    })
  )
  .post(Paths.deleteDraftsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {

      const userAuthToken: string = res.locals.user.bearerToken

      const action: string = getAction(req)
      switch (action) {
        case 'claim':
          const draftClaims: Draft<DraftClaim>[] = await getDraft(userAuthToken, 'claim', (value: any): DraftClaim => {
            return new DraftClaim().deserialize(value)
          })
          draftClaims.forEach((async draft => await DraftService.delete(draft, userAuthToken)))
          break
        case 'response':
          const responseDrafts: Draft<ResponseDraft>[] = await getDraft(userAuthToken, 'response', (value: any): ResponseDraft => {
            return new ResponseDraft().deserialize(value)
          })
          responseDrafts.forEach((async draft => await DraftService.delete(draft, userAuthToken)))
          break
        case 'ccj':
          const ccjDraft: Draft<DraftCCJ>[] = await getDraft(userAuthToken, 'ccj', (value: any): DraftCCJ => {
            return new DraftCCJ().deserialize(value)
          })
          ccjDraft.forEach((async draft => await DraftService.delete(draft, userAuthToken)))
          break
        default:
          throw new Error(`Unknown action: ${action}`)
      }

      res.redirect(Paths.indexPage.uri)
    })
  )
