import * as config from 'config'
import * as express from 'express'
import { PostcodeInfoClient, PostcodeInfoResponse } from '@hmcts/postcodeinfo-client'

import { Paths as AppPaths } from 'app/paths'
import { request } from 'client/request'
import { Logger } from '@hmcts/nodejs-logging'

const postcodeClient = new PostcodeInfoClient(config.get<string>('postcodeLookup.apiKey'), request)
const logger = Logger.getLogger('postcode-lookup')

function writeResponse (res: express.Response, status: number, message: string) {
  res.status(status).json({
    error: {
      status: status,
      message: message
    }
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.postcodeLookupProxy.uri, (req: express.Request, res: express.Response) => {
    if (!req.query.postcode) {
      writeResponse(res, 400, 'Missing postcode')
      return
    }

    postcodeClient.lookupPostcode(req.query.postcode)
      .then((postcodeInfoResponse: PostcodeInfoResponse) => res.json(postcodeInfoResponse))
      .catch(err => {
        logger.error(err.stack)
        writeResponse(res, 500, err.message)
      })
  })
