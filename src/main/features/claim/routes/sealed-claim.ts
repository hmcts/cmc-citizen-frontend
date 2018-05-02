import * as express from 'express'
import { Paths } from 'claim/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { ClaimMiddleware } from 'claims/claimMiddleware'

import { SealedClaimPdfGenerator } from 'services/sealedClaimPdfGenerator'
import { OnlyDefendantCanDoItGuard } from 'claim/guards/onlyDefendantCanDoItGuard'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.sealedClaimPdf.uri,
    ClaimMiddleware.retrieveByExternalId,
    OnlyDefendantCanDoItGuard.requestHandler(),
    ErrorHandling.apply(SealedClaimPdfGenerator.requestHandler))
