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
      hearingLocation: toHearingLocation(directionsQuestionnaire),
      witness: directionsQuestionnaire.selfWitness && {
        selfWitness: directionsQuestionnaire.selfWitness.option.option as YesNoOption,
        noOfOtherWitness: directionsQuestionnaire.otherWitnesses ? directionsQuestionnaire.otherWitnesses.howMany : undefined
      },
      expertReports: (directionsQuestionnaire.expertReports && directionsQuestionnaire.expertReports.rows.length > 0) ?
        directionsQuestionnaire.expertReports.rows.map(row => ({
          expertName: row.expertName,
          expertReportDate: row.reportDate ? LocalDate.fromObject(row.reportDate).asString() : undefined
        })) : undefined,
      unavailableDates: directionsQuestionnaire.availability &&
        directionsQuestionnaire.availability.unavailableDates.map(unavailableDate => ({
          unavailableDate: unavailableDate ? LocalDate.fromObject(unavailableDate).asString() : undefined
        })),
      expertRequest: (directionsQuestionnaire.expertEvidence.expertEvidence &&
        directionsQuestionnaire.expertEvidence.expertEvidence.option === YesNoOption.YES) ? {
          expertEvidenceToExamine: directionsQuestionnaire.expertEvidence.whatToExamine,
          reasonForExpertAdvice: directionsQuestionnaire.whyExpertIsNeeded.explanation
        } : undefined
    }
  }

  function toHearingLocation (directionsQuestionnaire: DirectionsQuestionnaireDraft): HearingLocation {

    if (directionsQuestionnaire.hearingLocation.courtName === undefined &&
      directionsQuestionnaire.hearingLocation.alternativeCourtName === undefined) {
      return undefined
    }
    return {
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
    }
  }

  export function fromObject (directionsQuestionnaire: DirectionsQuestionnaire): DirectionsQuestionnaire {
    if (!directionsQuestionnaire) {
      return undefined
    }

    return directionsQuestionnaire
  }
}
