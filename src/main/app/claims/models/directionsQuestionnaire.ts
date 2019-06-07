import { YesNoOption } from 'claims/models/response/core/yesNoOption'

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
    public hearingLoop?: YesNoOption,
    public disabledAccess?: YesNoOption,
    public otherSupportRequired?: string,
    public expertReportsRows?: ReportRow[],
    public expertEvidenceToExamine?: string,
    public whyExpertIsNeeded?: string
  ) {
  }

  deserialize (input: any): DirectionsQuestionnaire {
    if (input) {
      this.selfWitness = input.selfWitness
      if (input.howManyOtherWitness) {
        this.howManyOtherWitness = input.howManyOtherWitness
      }
      this.hearingLocation = input.hearingLocation
      if (input.hearingLocationSlug) {
        this.hearingLocationSlug = input.hearingLocationSlug
      }
      if (input.exceptionalCircumstancesReason) {
        this.exceptionalCircumstancesReason = input.exceptionalCircumstancesReason
      }
      if (input.unavailableDates) {
        this.unavailableDates = input.unavailableDates
      }
      if (input.availableDate) {
        this.availableDate = input.availableDate
      }
      if (input.languageInterpreted) {
        this.languageInterpreted = input.languageInterpreted
      }
      if (input.signLanguageInterpreted) {
        this.signLanguageInterpreted = input.signLanguageInterpreted
      }
      if (input.hearingLoopSelected) {
        this.hearingLoop = input.hearingLoopSelected
      }
      if (input.disabledAccessSelected) {
        this.disabledAccess = input.disabledAccessSelected
      }
      if (input.otherSupportRequired) {
        this.otherSupportRequired = input.otherSupportRequired
      }
      if (input.expertReportsRows) {
        this.expertReportsRows = input.expertReportsRows
      }
      if (input.expertEvidenceToExamine) {
        this.expertEvidenceToExamine = input.expertEvidenceToExamine
      }
      if (input.whyExpertIsNeeded) {
        this.whyExpertIsNeeded = input.whyExpertIsNeeded
      }
    }

    return this
  }

  fromObject (directionsQuestionnaire: any): DirectionsQuestionnaire {
    this.selfWitness = directionsQuestionnaire.selfWitness.option.option
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
      this.hearingLoop = YesNoOption.YES
    }

    if (directionsQuestionnaire.supportRequired.disabledAccessSelected) {
      this.disabledAccess = YesNoOption.YES
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
