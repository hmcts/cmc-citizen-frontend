
export function calculateCourtOrderAmount(
    defendantMonthlyInstalment: number, 
    claimantMonthlyInstalment: number, 
    defendantMonthlyDisposableIncome: number): number {
        if (defendantMonthlyInstalment >= defendantMonthlyDisposableIncome) {
            return defendantMonthlyInstalment
        }

        if (claimantMonthlyInstalment <= defendantMonthlyDisposableIncome) {
            return claimantMonthlyInstalment
        }

        return defendantMonthlyDisposableIncome
}
