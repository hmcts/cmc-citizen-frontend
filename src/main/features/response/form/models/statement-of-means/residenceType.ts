export class ResidenceType {
  static readonly OWN_HOME = new ResidenceType('OWN_HOME', 'Home you own yourself (or pay a mortgage on)')
  static readonly JOINT_OWN_HOME = new ResidenceType('JOINT_OWN_HOME', 'Jointly-owned home (or jointly mortgaged home)')
  static readonly PRIVATE_RENTAL = new ResidenceType('PRIVATE_RENTAL', 'Private rental')
  static readonly COUNCIL_OR_HOUSING_ASSN_HOME = new ResidenceType('COUNCIL_OR_HOUSING_ASSN_HOME', 'Council or housing association home')
  static readonly OTHER = new ResidenceType('OTHER', 'Other')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static valueOf (value: string): ResidenceType {
    return ResidenceType.all().filter(type => type.value === value).pop()
  }

  static all (): ResidenceType[] {
    return [
      ResidenceType.OWN_HOME,
      ResidenceType.JOINT_OWN_HOME,
      ResidenceType.PRIVATE_RENTAL,
      ResidenceType.COUNCIL_OR_HOUSING_ASSN_HOME,
      ResidenceType.OTHER
    ]
  }

  static except (residenceType: ResidenceType): ResidenceType[] {
    if (residenceType === undefined) {
      throw new Error('Residence type is required')
    }
    return ResidenceType.all().filter(item => item !== residenceType)
  }
}
