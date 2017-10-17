import * as express from 'express'
import { RoutablePath } from 'common/router/routablePath'

export interface AuthenticationRedirect {
  forPin (req: express.Request, res: express.Response, claimReference: string): string

  forLogin (req: express.Request, res: express.Response, receiver?: RoutablePath): string

  forUplift (req: express.Request, res: express.Response): string

  getStateCookie (req: express.Request): string
}
