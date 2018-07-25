export namespace ExpenseTypeViewFilter {
  export function render (value: string): string {
    switch (value) {
      case 'MORTGAGE' :
        return 'mortgage'
      case 'RENT' :
        return 'rent'
      case 'COUNCIL_TAX' :
        return 'Council Tax'
      case 'GAS' :
        return 'gas'
      case 'ELECTRICITY' :
        return 'electricity'
      case 'WATER' :
        return 'water'
      case 'TRAVEL' :
        return 'travel'
      case 'SCHOOL_COSTS' :
        return 'school costs'
      case 'FOOD_HOUSEKEEPING' :
        return 'food and housekeeping'
      case 'TV_AND_BROADBAND' :
        return 'TV and broadband'
      case 'HIRE_PURCHASES' :
        return 'hire purchases'
      case 'MOBILE_PHONE' :
        return 'mobile phone'
      case 'MAINTENANCE_PAYMENTS' :
        return 'maintenance'
      case 'OTHER' :
        return 'other'
    }
  }
}
