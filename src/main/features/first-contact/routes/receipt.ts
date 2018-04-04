import * as express from 'express'
import { Paths } from 'first-contact/paths'
import { ErrorHandling } from 'common/errorHandling'
import { ClaimReferenceMatchesGuard } from 'first-contact/guards/claimReferenceMatchesGuard'
import { ClaimantRequestedCCJGuard } from 'first-contact/guards/claimantRequestedCCJGuard'
import { PdfGenerator } from 'services/pdfGenerator'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.receiptReceiver.uri,
    ClaimReferenceMatchesGuard.requestHandler,
    ClaimantRequestedCCJGuard.requestHandler,
    ErrorHandling.apply(PdfGenerator.requestHandler))
