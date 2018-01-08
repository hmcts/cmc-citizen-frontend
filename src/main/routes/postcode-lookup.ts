import * as config from 'config'
import * as express from 'express'
import { PostcodeInfoClient, PostcodeInfoResponse } from '@hmcts/postcodeinfo-client'

import { Paths as AppPaths } from 'app/paths'
import { request } from 'client/request'
import { Logger } from '@hmcts/nodejs-logging'

const postcodeClient = new PostcodeInfoClient(config.get<string>('postcodeLookup.apiKey'), request)
const logger = Logger.getLogger('postcode-lookup')

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.postcodeLookupProxy.uri, (req, res) => {
    postcodeClient.lookupPostcode(req.query.postcode)
      .then((postcodeInfoResponse: PostcodeInfoResponse) => res.json(postcodeInfoResponse))
      .catch(err => {
        logger.error(err.stack)
        res.status(500).json({
          error: {
            status: 500,
            message: err.message
          }
        })
      })
  })
