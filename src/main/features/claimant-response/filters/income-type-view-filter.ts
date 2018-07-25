export namespace IncomeTypeViewFilter {
  export function render (value: string): string {
    switch (value) {
      case 'JOB' :
        return 'Income from your job'
      case 'UNIVERSAL_CREDIT' :
        return 'Universal Credit'
      case 'JOB_SEEKERS_ALLOWANCE_INCOME_BASES' :
        return 'Jobseeker’s Allowance (income based)'
      case 'JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED' :
        return 'Jobseeker’s Allowance (contribution based)'
      case 'INCOME_SUPPORT' :
        return 'Income Support'
      case 'WORKING_TAX_CREDIT' :
        return 'Working Tax Credit'
      case 'CHILD_TAX_CREDIT' :
        return 'Child Tax Credit'
      case 'CHILD_BENEFIT' :
        return 'Child Benefit'
      case 'COUNCIL_TAX_SUPPORT' :
        return 'Council Tax Support'
      case 'PENSION' :
        return 'Pension (paid to you)'
      case 'OTHER' :
        return 'Other'
    }
  }
}
