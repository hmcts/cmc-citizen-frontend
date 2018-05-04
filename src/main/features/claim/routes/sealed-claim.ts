import * as express from 'express'
import { Paths } from 'claim/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { ClaimMiddleware } from 'claims/claimMiddleware'

import { SealedClaimPdfGenerator } from 'services/sealedClaimPdfGenerator'
import { IsDefendantInCaseGuard } from 'guards/isDefendantInCaseGuard'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.sealedClaimPdfReceiver.uri,
    ClaimMiddleware.retrieveByExternalId,
    IsDefendantInCaseGuard.check(),
    ErrorHandling.apply(SealedClaimPdfGenerator.requestHandler))
