export enum ResidenceType {
  OWN_HOME = 'OWN_HOME',
  JOINT_OWN_HOME = 'JOINT_OWN_HOME',
  PRIVATE_RENTAL = 'PRIVATE_RENTAL',
  COUNCIL_OR_HOUSING_ASSN_HOME = 'COUNCIL_OR_HOUSING_ASSN_HOME',
  OTHER = 'OTHER'
}

export interface Residence {
  type: ResidenceType
  otherDetail: string
}
