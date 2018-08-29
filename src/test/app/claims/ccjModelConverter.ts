import { expect } from 'chai'
import { CCJModelConverter } from 'claims/ccjModelConverter'

// Claim Data
import { claimData as entityTemplate } from 'test/data/entity/claimData'

// Claimant-Response Draft and Data
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import {
    fullAdmissionClaimantAcceptedPayImmediatelyDraft
} from 'test/data/draft/claimantResponseDraft'

// CCJ Draft and Data
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import {
    fullAdmissionClaimantAcceptedPayImmediatelyData
} from 'test/data/entity/ccjData'

// import { company, individual, organisation, soleTrader } from 'test/data/draft/partyDetails'
// import { company, individual, organisation, soleTrader } from 'test/data/entity/party'

function prepareDraftClaimantResponse (draftTemplate: any, partyDetails: object): DraftClaimantResponse {
  return new DraftClaimantResponse().deserialize({
  })
}

function prepareCCJData (template, party: object): CountyCourtJudgment {
  return CountyCourtJudgment.deserialize({
  })
}

function preparePartialCCJData (template, party: object): CountyCourtJudgment {
  return CountyCourtJudgment.deserialize({
  })
}

// Will require a prepareCCJDraft

function convertObjectLiteralToJSON (value: object): object {
  return JSON.parse(JSON.stringify(value))
}
