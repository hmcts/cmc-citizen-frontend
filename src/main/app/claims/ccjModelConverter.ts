import { DraftCCJ } from 'ccj/draft/DraftCCJ'
// import { Moment } from 'moment'
// import { PartyType } from 'app/common/partyType'
// import { IndividualDetails } from 'forms/models/individualDetails'
// import { PartyDetails } from 'forms/models/partyDetails'
// import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
// import { Individual } from 'claims/models/details/theirs/individual'
// import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
// import { SoleTrader } from 'claims/models/details/theirs/soleTrader'
// import { CompanyDetails } from 'forms/models/companyDetails'
// import { Company } from 'claims/models/details/theirs/company'
// import { OrganisationDetails } from 'forms/models/organisationDetails'
// import { Organisation } from 'claims/models/details/theirs/organisation'
// import { Defendant } from 'drafts/models/defendant'
// import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
// import { Address } from 'claims/models/address'
// import { Address as AddressForm } from 'forms/models/address'

// class RepaymentPlan {
//
//   public remainingAmount: number
//   public firstPayment: number
//   public installmentAmount: number
//   public firstPaymentDate: Moment
//   public paymentSchedule: string
// }
//
// class CountyCourtJudgment {
//
//   public defendant: TheirDetails
//   public paidAmount: number
//   public paymentOption: string
//   public repaymentPlan: RepaymentPlan
//   public payBySetDate: Moment
// }
//
// function convertAddress (addressForm: AddressForm): Address {
//   const address = new Address()
//   Object.assign(address, addressForm)
//
//   return address
// }
//
// function convertDefendantDetails (defendant: Defendant): TheirDetails {
//   const defendantDetails: PartyDetails = defendant.partyDetails
//   switch (defendantDetails.type) {
//     case PartyType.INDIVIDUAL.value:
//       const individualDetails = defendantDetails as IndividualDetails
//
//       return new Individual(
//         individualDetails.name,
//         convertAddress(individualDetails.address),
//         defendant.email.address
//       )
//
//     case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
//       const soleTraderDetails: SoleTraderDetails = defendantDetails as SoleTraderDetails
//
//       return new SoleTrader(
//         soleTraderDetails.name,
//         convertAddress(soleTraderDetails.address),
//         defendant.email.address,
//         soleTraderDetails.businessName
//       )
//
//     case PartyType.COMPANY.value:
//       const companyDetails = defendantDetails as CompanyDetails
//
//       return new Company(
//         companyDetails.name,
//         convertAddress(companyDetails.address),
//         defendant.email.address,
//         companyDetails.contactPerson
//       )
//     case PartyType.ORGANISATION.value:
//       const organisationDetails = defendantDetails as OrganisationDetails
//
//       return new Organisation(
//         organisationDetails.name,
//         convertAddress(organisationDetails.address),
//         defendant.email.address,
//         organisationDetails.contactPerson
//       )
//     default:
//       throw Error('Something went wrong, No defendant type is set')
//   }
// }

export class CCJModelConverter {

  static convert (draftCcj: DraftCCJ): object {

    // const ccj: CountyCourtJudgment = new CountyCourtJudgment()
    console.log(draftCcj)
    return {
      'defendant': {
        'type': 'individual',
        'title': 'Dr.',
        'name': 'John Smith',
        'address': {
          'line1': '52',
          'line2': 'Down Street',
          'city': 'Manchester',
          'postcode': 'DF1 3LJ'
        },
        'serviceAddress': {
          'line1': '52',
          'line2': 'Down Street',
          'city': 'Manchester',
          'postcode': 'DF1 3LJ'
        },
        'email': 'j.smith@example.com'
      },
      'paymentOption': 'INSTALMENTS',
      'paidAmount': 0,
      'repaymentPlan': {
        'remainingAmount': 1000,
        'firstPayment': 100,
        'instalmentAmount': 100,
        'firstPaymentDate': '2100-10-10',
        'paymentSchedule': 'EACH_WEEK'
      }
    }

    // console.log(draftCcj)
    //
    // ccj.defendant = convertDefendantDetails(draftCcj.defendant)
    // ccj.paidAmount = draftCcj.paidAmount.amount || 0
    // ccj.paymentOption = draftCcj.paymentOption.option.value
    // if (draftCcj.paymentOption.option === PaymentType.INSTALMENTS) {
    //   const plan: RepaymentPlan = new RepaymentPlan()
    //   Object.assign(plan, draftCcj.repaymentPlan)
    //   plan.firstPaymentDate = draftCcj.repaymentPlan.firstPaymentDate.toMoment()
    //   plan.paymentSchedule = draftCcj.repaymentPlan.paymentSchedule.value
    //   ccj.payBySetDate = undefined
    // }
    // if (draftCcj.paymentOption.option === PaymentType.FULL) {
    //   ccj.payBySetDate = draftCcj.payBySetDate.date.toMoment()
    //   ccj.repaymentPlan = undefined
    // }
    //
    // return ccj
  }
}
