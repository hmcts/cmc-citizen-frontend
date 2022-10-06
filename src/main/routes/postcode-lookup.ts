import * as express from 'express'
import { AddressInfoResponse } from '@hmcts/os-places-client'

import { Paths as AppPaths } from 'paths'
import { Logger } from '@hmcts/nodejs-logging'
import { ClientFactory } from 'postcode-lookup/clientFactory'
import { trackCustomEvent } from 'logging/customEventTracker'

const osPlacesClient = ClientFactory.createOSPlacesClient()
const logger = Logger.getLogger('postcode-lookup')

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.postcodeLookupProxy.uri, (req, res) => {
    const postcode = req.query.postcode as string
    if (!postcode || !postcode.trim()) {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Postcode not provided'
        }
      })
    }
    osPlacesClient.lookupByPostcodeAndDataSet(postcode, 'DPA,LPI')
      .then((addressInfoResponse: AddressInfoResponse) => {
        addressInfoResponse.addresses
          = addressInfoResponse.addresses.filter((addresses, index, self) =>
            index === self.findIndex((t) =>
              (t.formattedAddress === addresses.formattedAddress)
            )
          )
        res.json(addressInfoResponse)
      })
      .catch(err => {
        if (err.message === 'Authentication failed') {
          trackCustomEvent(`Ordnance Survey keys stopped working`, { error: err })
        }
        logger.error('Response Address Information not valid \n', err.stack)
        res.status(422).json({
          error: {
            status: 422,
            message: 'AddressInfoResponse: \n' + err.message
          }
        })
      })
  })
