export interface AllowanceItem {
  item: string
  weekly: number
  monthly: number
}
export interface Allowance {
  personal: AllowanceItem[]
  dependant: AllowanceItem[]
  pensioner: AllowanceItem[]
  disability: AllowanceItem[]
}
