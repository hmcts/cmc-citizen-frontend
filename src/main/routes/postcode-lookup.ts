import * as express from 'express'
import { AddressInfoResponse } from '@hmcts/os-places-client'

import { Logger } from '@hmcts/nodejs-logging'
import { ClientFactory } from 'postcode-lookup/clientFactory'
import { trackCustomEvent } from 'logging/customEventTracker'

const osPlacesClient = ClientFactory.createOSPlacesClient()
const logger = Logger.getLogger('postcode-lookup')

/* tslint:disable:no-default-export */
export default express.Router()
  .get('/', (req, res) => {
    if (!req.query.postcode || !req.query.postcode.trim()) {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Postcode not provided'
        }
      })
    }
    osPlacesClient.lookupByPostcode(req.query.postcode)
      .then((addressInfoResponse: AddressInfoResponse) => res.json(addressInfoResponse))
      .catch(err => {
        if (err.message === 'Authentication failed') {
          trackCustomEvent(`Ordnance Survey keys stopped working`, { error: err })
        }
        logger.error(err.stack)
        res.status(500).json({
          error: {
            status: 500,
            message: err.message
          }
        })
      })
  })
