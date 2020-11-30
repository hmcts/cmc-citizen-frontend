import { expect } from 'chai'
import { paginationData } from '../routes/index'
import { formPaginationToDisplay } from 'dashboard/helpers/paginationBuilder'
import { ActorType } from 'claims/models/claim-states/actor-type'
import * as samplePaginationObject from 'test/data/entity/pagination'

const defaultPage = 1
const selectedPage = 2

describe('Pagination builder', () => {
    describe('Given required valid input page parameters', () => {

        it('should return valid pageination number for a user', () => {
            expect(formPaginationToDisplay(paginationData, defaultPage, ActorType.CLAIMANT)['items']).to.have.length(paginationData.totalPages)
        })

        it('should return valid pagination details for claimant', () => {
            expect(formPaginationToDisplay(paginationData, defaultPage, ActorType.CLAIMANT)).to.eql(samplePaginationObject.paginationObjectForClaimant)
        })

        it('should return valid pagination details for defendant', () => {
            expect(formPaginationToDisplay(paginationData, defaultPage, ActorType.DEFENDANT)).to.eql(samplePaginationObject.paginationObjectForDefendant)
        })

        it('should return valid pagination details for claimant', () => {
            expect(formPaginationToDisplay(paginationData, selectedPage, ActorType.CLAIMANT)).to.eql(samplePaginationObject.paginationObjectForClaimantforPage)
        })
    })
})