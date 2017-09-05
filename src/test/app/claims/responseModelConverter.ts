import { expect } from 'chai'

import { ResponseModelConverter } from 'app/claims/responseModelConverter'

import { ResponseDraft } from 'response/draft/responseDraft'
import { responseDraft as draftTemplate } from '../../data/draft/responseDraft'
import { companyDetails, individualDetails, organisationDetails, soleTraderDetails } from '../../data/draft/partyDetails'

import { ResponseData } from 'response/draft/responseData'
import { response as entityTemplate } from '../../data/entity/response'
import { company, individual, organisation, soleTrader } from '../../data/entity/party'

describe('ResponseModelConverter', () => {
  [[individualDetails, individual], [soleTraderDetails, soleTrader], [companyDetails, company], [organisationDetails, organisation]]
    .forEach(entry => {
      const [partyDetails, party] = entry
      it(`should convert response submitted by ${partyDetails.type}`, () => {
        const responseDraft = new ResponseDraft().deserialize({
          ...draftTemplate, defendantDetails: { ...draftTemplate.defendantDetails, partyDetails: partyDetails }
        })
        const response = new ResponseData().deserialize({ ...entityTemplate, defendant: party })

        expect(ResponseModelConverter.convert(responseDraft)).to.deep.equal(response)
      })
    })
})
