import * as express from 'express'
import DraftStoreClient from 'common/draft/draftStoreClient'
import User from 'idam/user'

export class DraftMiddleware<T> {
  client: DraftStoreClient<T>

  constructor (public draftType: string, public deserializeFn: (value: any) => T = (value) => value) {
    if (!draftType || draftType.trim() === '') {
      throw new Error('Draft type is required to instantiate middleware')
    }
    this.client = new DraftStoreClient<T>(draftType)
  }

  async retrieve (res: express.Response, next: express.NextFunction): Promise<void> {
    if (res.locals.isLoggedIn) {
      try {
        let draft: any = await this.client.retrieve(res.locals.user.id, this.deserializeFn)
        if (!draft) {
          draft = this.deserializeFn(undefined)
        }
        this.setUserData(draft, res.locals.user)
        res.locals.user[`${this.draftType}Draft`] = draft
        next()
      } catch (err) {
        next(err)
      }
    } else {
      next()
    }
  }

  save (res: express.Response, next: express.NextFunction): Promise<void> {
    return this.client
      .save(res.locals.user.id, res.locals.user[`${this.draftType}Draft`])
  }

  delete (res: express.Response, next: express.NextFunction): Promise<void> {
    return this.client
      .delete(res.locals.user.id)
  }

  private setUserData (draft: any, user: User) {
    draft.userEmail = user.email
    draft.userName = `${user.forename} ${user.surname}`
  }
}
