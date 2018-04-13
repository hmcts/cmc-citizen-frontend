import * as express from 'express'

import { Paths } from 'first-contact/paths'

import { ErrorHandling } from 'common/errorHandling'
import { ClaimReferenceMatchesGuard } from 'first-contact/guards/claimReferenceMatchesGuard'
import { ClaimantRequestedCCJGuard } from 'first-contact/guards/claimantRequestedCCJGuard'

import { ClaimIssueReceiptPDFGenerator } from 'services/claimIssueReceiptPdfGenerator'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.receiptReceiver.uri,
    ClaimReferenceMatchesGuard.requestHandler,
    ClaimantRequestedCCJGuard.requestHandler,
    ErrorHandling.apply(ClaimIssueReceiptPDFGenerator.requestHandler))
