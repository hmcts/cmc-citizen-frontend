import * as express from 'express'
import { PostcodeInfoResponse } from '@hmcts/os-places-client'

import { Paths as AppPaths } from 'paths'
import { Logger } from '@hmcts/nodejs-logging'
import { ClientFactory } from 'postcode-lookup/clientFactory'

const postcodeClient = ClientFactory.createPostcodeInfoClient()
const logger = Logger.getLogger('postcode-lookup')

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.postcodeLookupProxy.uri, (req, res) => {
    if (!req.query.postcode || !req.query.postcode.trim()) {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Postcode not provided'
        }
      })
    }
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
