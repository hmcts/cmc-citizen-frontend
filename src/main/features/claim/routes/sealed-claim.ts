import * as express from 'express'
import { Paths } from 'claim/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { ClaimMiddleware } from 'claims/claimMiddleware'

import { SealedClaimPdfGenerator } from 'services/sealedClaimPdfGenerator'
import { OnlyDefendantLinkedToClaimCanDoIt } from 'guards/onlyDefendantLinkedToClaimCanDoIt'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.sealedClaimPdfReceiver.uri,
    ClaimMiddleware.retrieveByExternalId,
    OnlyDefendantLinkedToClaimCanDoIt.check(),
    ErrorHandling.apply(SealedClaimPdfGenerator.requestHandler))
