export enum AgeGroupType {
  UNDER_11 = 'UNDER_11',
  BETWEEN_11_AND_15 = 'BETWEEN_11_AND_15',
  BETWEEN_16_AND_19 = 'BETWEEN_16_AND_19'
}

export interface Child {
  ageGroupType: AgeGroupType
  numberOfChildren: number
  numberOfChildrenLivingWithYou?: number
}

export interface OtherDependants {
  numberOfPeople: number
  details: string
  anyDisabled: boolean
}

export interface Dependant {
  children: Child[]
  otherDependants: OtherDependants
  anyDisabledChildren: boolean
}
