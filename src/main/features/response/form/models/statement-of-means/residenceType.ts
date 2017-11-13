export class ResidenceType {
  static readonly OWN_HOME = new ResidenceType('OWN_HOME', 'Home you own yourself (including if you have a mortgage)')
  static readonly JOINT_OWN_HOME = new ResidenceType('JOINT_OWN_HOME', 'Jointly-owned home (including if you have a mortgage)')
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
    const type: ResidenceType = ResidenceType.all().filter(type => type.value === value).pop()
    if (!type) {
      throw new Error(`Given value '${value}' does not denote a known residence type`)
    }
    return type
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
}
