import { Serializable } from 'models/serializable'
import { Residence } from 'response/form/models/statement-of-means/residence'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { Employers } from 'response/form/models/statement-of-means/employers'
import { SelfEmployed } from 'response/form/models/statement-of-means/selfEmployed'
import { Dependants } from 'response/form/models/statement-of-means/dependants'
import { Education } from 'response/form/models/statement-of-means/education'
import { Maintenance } from 'response/form/models/statement-of-means/maintenance'
import { FeatureToggles } from 'utils/featureToggles'
import { ResponseDraft } from 'response/draft/responseDraft'
import { ResponseType } from 'response/form/models/responseType'
import { RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'

export class StatementOfMeans implements Serializable<StatementOfMeans> {
  residence?: Residence
  dependants?: Dependants
  maintenance?: Maintenance
  education?: Education
  employment?: Employment
  employers?: Employers
  selfEmployed?: SelfEmployed

  static isApplicableFor (responseDraft?: ResponseDraft): boolean {
    if (!FeatureToggles.isEnabled('statementOfMeans')) {
      return false
    }
    if (!responseDraft) {
      throw new Error('Response draft has to be provided as input')
    }
    return this.isResponseApplicable(responseDraft) && !responseDraft.defendantDetails.partyDetails.isBusiness()
  }

  private static isResponseApplicable (responseDraft: ResponseDraft) {
    return responseDraft.response.type === ResponseType.OWE_ALL_PAID_NONE
      || (responseDraft.response.type === ResponseType.OWE_SOME_PAID_NONE
        && responseDraft.rejectPartOfClaim
        && responseDraft.rejectPartOfClaim.option === RejectPartOfClaimOption.AMOUNT_TOO_HIGH
      )
  }

  deserialize (input: any): StatementOfMeans {
    if (input) {
      this.residence = new Residence().deserialize(input.residence)
      this.dependants = new Dependants().deserialize(input.dependants)
      this.education = new Education().deserialize(input.education)
      this.maintenance = new Maintenance().deserialize(input.maintenance)
      this.employment = new Employment().deserialize(input.employment)
      this.employers = new Employers().deserialize(input.employers)
      this.selfEmployed = new SelfEmployed().deserialize(input.selfEmployed)
    }
    return this
  }
}
