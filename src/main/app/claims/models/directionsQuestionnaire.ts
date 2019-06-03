export class DirectionsQuestionnaire {

  constructor (
    public yesNoOption?: boolean,
    public howManyOtherWitness?: number,
    public hearingLocation?: string,
    public hearingLocationSlug?: string,
    public exceptionalCircumstancesReason?: string,
    public unavailableDates?: [],
    public availableDate?: string,
    public languageInterpreted?: string,
    public signLanguageInterpreted?: string,
    public hearingLoopSelected?: string,
    public disabledAccessSelected?: string,
    public otherSupportRequired?: string,
    public expertReportsRows?: [],
    public expertEvidenceToExamine?: string,
    public whyExpertIsNeeded?: string
  ) {
  }

  deserialize (input: any): DirectionsQuestionnaire {
    if (input) {
      this.yesNoOption = input.yesNoOption,
        this.howManyOtherWitness = input.howManyOtherWitness,
        this.hearingLocation = input.hearingLocationnull,
        this.hearingLocationSlug = input.hearingLocationSlug,
        this.exceptionalCircumstancesReason = input.exceptionalCircumstancesReason,
        this.unavailableDates = input.unavailableDates,
        this.availableDate = input.availableDate,
        this.languageInterpreted = input.languageInterpreted,
        this.signLanguageInterpreted = input.signLanguageInterpreted,
        this.hearingLoopSelected = input.hearingLoopSelected,
        this.disabledAccessSelected = input.disabledAccessSelected,
        this.otherSupportRequired = input.otherSupportRequired,
        this.expertReportsRows = input.expertReportsRows,
        this.expertEvidenceToExamine = input.expertEvidenceToExamine,
        this.whyExpertIsNeeded = input.whyExpertIsNeeded
    }

    return this
  }
}
