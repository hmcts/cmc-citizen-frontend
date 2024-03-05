import { NextFunction, Request, Response } from 'express'
import { GTMArgs } from '@analytics/google-tag-manager'
import { RoutablePath } from 'shared/router/routablePath'

export function injectGtm (req: Request, res: Response, next: NextFunction): void {

  const gtmArgs: GTMArgs = {
    id: 'GTM-MRTZLBZ&nojscript=true',
    dataLayer: {
      pageType: new RoutablePath('/*', false)
    }
  }
  res.locals.gtmScriptId = gtmArgs.id
  next()
}
