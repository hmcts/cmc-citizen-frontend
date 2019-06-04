import { YesNoOption } from 'models/yesNoOption'

import { LocalDate } from 'forms/models/localDate'
import { ReportRow } from 'directions-questionnaire/forms/models/reportRow'

export class DirectionsQuestionnaire {

  constructor (
    public selfWitness?: YesNoOption,
    public howManyOtherWitness?: number,
    public hearingLocation?: string,
    public hearingLocationSlug?: string,
    public exceptionalCircumstancesReason?: string,
    public unavailableDates?: LocalDate[],
    public availableDate?: string,
    public languageInterpreted?: string,
    public signLanguageInterpreted?: string,
    public hearingLoopSelected?: YesNoOption,
    public disabledAccessSelected?: YesNoOption,
    public otherSupportRequired?: string,
    public expertReportsRows?: ReportRow[],
    public expertEvidenceToExamine?: string,
    public whyExpertIsNeeded?: string
  ) {
  }

  deserialize (input: any): DirectionsQuestionnaire {
    if (input) {
      this.selfWitness = input.yesNoOption,
        this.howManyOtherWitness = input.howManyOtherWitness,
        this.hearingLocation = input.hearingLocation,
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

  fromObject (directionsQuestionnaire: any): DirectionsQuestionnaire {
    this.selfWitness = directionsQuestionnaire.selfWitness.option
    if (directionsQuestionnaire.otherWitnesses.otherWitnesses === 'yes') {
      this.howManyOtherWitness = directionsQuestionnaire.otherWitnesses.howMany
    }
    this.hearingLocation = directionsQuestionnaire.hearingLocation
    if (directionsQuestionnaire.exceptionalCircumstances.exceptionalCircumstances) {
      this.exceptionalCircumstancesReason = directionsQuestionnaire.exceptionalCircumstances.reason
    }
    if (directionsQuestionnaire.availability.hasUnavailableDates) {
      this.unavailableDates = directionsQuestionnaire.availability.unavailableDates
    }

    if (directionsQuestionnaire.supportRequired.languageSelected) {
      this.languageInterpreted = directionsQuestionnaire.supportRequired.signLanguageInterpreted
    }

    if (directionsQuestionnaire.supportRequired.signLanguageSelected) {
      this.signLanguageInterpreted = directionsQuestionnaire.supportRequired.signLanguageInterpreted
    }

    if (directionsQuestionnaire.supportRequired.hearingLoopSelected) {
      this.hearingLoopSelected = new YesNoOption('yes')
    }

    if (directionsQuestionnaire.supportRequired.disabledAccessSelected) {
      this.disabledAccessSelected = new YesNoOption('yes')
    }

    if (directionsQuestionnaire.supportRequired.otherSupportSelected) {
      this.otherSupportRequired = directionsQuestionnaire.supportRequired.otherSupport
    }
    if (directionsQuestionnaire.expertReports.declared) {
      this.expertReportsRows = directionsQuestionnaire.expertReports.rows
    }
    if (directionsQuestionnaire.expertEvidence.expertEvidence) {
      this.expertEvidenceToExamine = directionsQuestionnaire.expertEvidence.whatToExamine
    }
    if (directionsQuestionnaire.whyExpertIsNeeded.explanation) {
      this.whyExpertIsNeeded = directionsQuestionnaire.whyExpertIsNeeded.explanation
    }

    return this
  }
}
