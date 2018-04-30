import * as express from 'express'
import { Paths } from 'claim/paths'

import { ErrorHandling } from 'common/errorHandling'
import { ClaimMiddleware } from 'claims/claimMiddleware'

import { ClaimIssueReceiptPDFGenerator } from 'services/claimIssueReceiptPdfGenerator'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.receiptReceiver.uri,
    ClaimMiddleware.retrieveByExternalId,
    ErrorHandling.apply(ClaimIssueReceiptPDFGenerator.requestHandler))
