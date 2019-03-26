import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { Individual } from 'claims/models/details/theirs/individual'
import { SoleTrader } from 'claims/models/details/theirs/soleTrader'
import { Company } from 'claims/models/details/theirs/company'
import { Organisation } from 'claims/models/details/theirs/organisation'
import { PartyType } from 'common/partyType'
import { MomentFormatter } from 'utils/momentFormatter'
import { MomentFactory } from 'shared/momentFactory'

export class TheirDetailsMapper {
  static createTheirDetails (party: TheirDetails, email: string): object {
    return {
      type: this.partyTypeAsString(party),
      fullName: party.name,
      ...this.splitNames(party),
      contactPerson: this.contactPerson(party),
      businessName: this.businessName(party),
      address: {
        lineOne: party.address.line1,
        lineTwo: party.address.line2,
        lineThree: party.address.line3,
        townOrCity: party.address.city,
        postcode: party.address.postcode
      },
      dateOfBirth: this.dateOfBirth(party),
      email: email
    }
  }

  static partyTypeAsString (partyDetails: TheirDetails): string {
    if (partyDetails && partyDetails.type) {
      switch (partyDetails.type) {
        case PartyType.INDIVIDUAL.value:
          return PartyType.INDIVIDUAL.name
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          return PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.name
        case PartyType.COMPANY.value:
          return PartyType.COMPANY.name
        case PartyType.ORGANISATION.value:
          return PartyType.ORGANISATION.name
        default:
          return undefined
      }
    }
  }

  private static splitNames (partyDetails: TheirDetails): object {
    if (partyDetails && partyDetails.type) {
      switch (partyDetails.type) {
        case PartyType.INDIVIDUAL.value:
          const individual = partyDetails as Individual
          return {
            title: individual.title,
            firstName: individual.firstName,
            lastName: individual.lastName
          }
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          const soleTrader = partyDetails as SoleTrader
          return {
            title: soleTrader.title,
            firstName: soleTrader.firstName,
            lastName: soleTrader.lastName
          }
      }
    }
    return undefined
  }

  private static businessName (partyDetails: TheirDetails): any {
    if (partyDetails && partyDetails.type) {
      switch (partyDetails.type) {
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          return (partyDetails as SoleTrader).businessName
      }
    }
    return undefined
  }

  private static contactPerson (partyDetails: TheirDetails): any {
    if (partyDetails && partyDetails.type) {
      switch (partyDetails.type) {
        case PartyType.COMPANY.value:
          return (partyDetails as Company).contactPerson
        case PartyType.ORGANISATION.value:
          return (partyDetails as Organisation).contactPerson
      }
    }
    return undefined
  }

  private static dateOfBirth (partyDetails: TheirDetails): any {
    if (partyDetails && partyDetails.type) {
      switch (partyDetails.type) {
        case PartyType.INDIVIDUAL.value:
          const dateOfBirth = (partyDetails as Individual).dateOfBirth
          if (dateOfBirth) {
            return MomentFormatter.formatLongDate(MomentFactory.parse(dateOfBirth))
          } else {
            return undefined
          }
      }
    }
    return undefined
  }
}
