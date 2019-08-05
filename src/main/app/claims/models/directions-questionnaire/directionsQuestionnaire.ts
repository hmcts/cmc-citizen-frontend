import { RequireSupport } from 'claims/models/directions-questionnaire/requireSupport'

import { CourtLocationType, HearingLocation } from 'claims/models/directions-questionnaire/hearingLocation'
import { Witness } from 'claims/models/directions-questionnaire/witness'
import { ExpertReport } from 'claims/models/directions-questionnaire/expertReport'
import { ExpertRequest } from 'claims/models/directions-questionnaire/expertRequest'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { UnavailableDate } from 'claims/models/directions-questionnaire/unavailableDate'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { LocalDate } from 'forms/models/localDate'

export interface DirectionsQuestionnaire {
  requireSupport?: RequireSupport,
  hearingLocation?: HearingLocation,
  witness?: Witness,
  expertReports?: ExpertReport[],
  unavailableDates?: UnavailableDate[],
  expertRequest?: ExpertRequest
}

export namespace DirectionsQuestionnaire {

  export function deserialize (directionsQuestionnaire: DirectionsQuestionnaireDraft): DirectionsQuestionnaire {
    if (!directionsQuestionnaire) {
      return undefined
    }

    return {
      requireSupport: directionsQuestionnaire.supportRequired && {
        languageInterpreter: directionsQuestionnaire.supportRequired.languageInterpreted,
        signLanguageInterpreter: directionsQuestionnaire.supportRequired.signLanguageInterpreted,
        hearingLoop: directionsQuestionnaire.supportRequired.hearingLoopSelected ? YesNoOption.YES : YesNoOption.NO,
        disabledAccess: directionsQuestionnaire.supportRequired.disabledAccessSelected ? YesNoOption.YES : YesNoOption.NO,
        otherSupport: directionsQuestionnaire.supportRequired.otherSupport
      },
      hearingLocation: {
        courtName: directionsQuestionnaire.hearingLocation &&
        directionsQuestionnaire.hearingLocation.courtAccepted &&
        directionsQuestionnaire.hearingLocation.courtAccepted.option === YesNoOption.YES ?
          directionsQuestionnaire.hearingLocation.courtName : directionsQuestionnaire.hearingLocation.alternativeCourtName,
        hearingLocationSlug: (directionsQuestionnaire.hearingLocationSlug && directionsQuestionnaire.hearingLocationSlug.length) ? directionsQuestionnaire.hearingLocationSlug : undefined,
        courtAddress: undefined,
        locationOption: directionsQuestionnaire.hearingLocation &&
        directionsQuestionnaire.hearingLocation.alternativeCourtName &&
        directionsQuestionnaire.hearingLocation.alternativeCourtName.length ?
          CourtLocationType.ALTERNATE_COURT : CourtLocationType.SUGGESTED_COURT,
        exceptionalCircumstancesReason: directionsQuestionnaire.exceptionalCircumstances ?
          directionsQuestionnaire.exceptionalCircumstances.reason : undefined
      },
      witness: directionsQuestionnaire.selfWitness && {
        selfWitness: directionsQuestionnaire.selfWitness.option.option as YesNoOption,
        noOfOtherWitness: directionsQuestionnaire.otherWitnesses ? directionsQuestionnaire.otherWitnesses.howMany : undefined
      },
      expertReports: directionsQuestionnaire.expertReports && directionsQuestionnaire.expertReports.rows
        && directionsQuestionnaire.expertReports.rows.map(row => ({
          expertName: row.expertName,
          expertReportDate: row.reportDate ? LocalDate.fromObject(row.reportDate).asString() : undefined
        })),
      unavailableDates: directionsQuestionnaire.availability &&
        directionsQuestionnaire.availability.unavailableDates.map(unavailableDate => ({
          unavailableDate: unavailableDate ? LocalDate.fromObject(unavailableDate).asString() : undefined
        })),
      expertRequest: directionsQuestionnaire.expertEvidence && {
        expertEvidenceToExamine: directionsQuestionnaire.expertEvidence.whatToExamine,
        reasonForExpertAdvice: directionsQuestionnaire.whyExpertIsNeeded.explanation
      }
    }
  }

  export function fromObject (directionsQuestionnaire: DirectionsQuestionnaire): DirectionsQuestionnaire {
    if (!directionsQuestionnaire) {
      return undefined
    }

    return directionsQuestionnaire
  }
}
