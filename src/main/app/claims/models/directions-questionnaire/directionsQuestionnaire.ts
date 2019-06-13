import { RequireSupport } from 'claims/models/directions-questionnaire/requireSupport'
import { HearingLocation } from 'claims/models/directions-questionnaire/hearingLocation'
import { Witness } from 'claims/models/directions-questionnaire/witness'
import { ExpertReportRows } from 'claims/models/directions-questionnaire/expertReport'
import { ExpertRequest } from 'claims/models/directions-questionnaire/expertRequest'
import { UnavailableDate } from 'claims/models/directions-questionnaire/unavailableDate'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { YesNoOption } from 'models/yesNoOption'

export interface DirectionsQuestionnaire {
  requireSupport?: RequireSupport,
  hearingLocation?: HearingLocation,
  witness?: Witness,
  expertReportRows?: ExpertReportRows,
  unavailableDates?: UnavailableDate,
  expertRequest?: ExpertRequest
}

export namespace DirectionsQuestionnaire {

  export function deserialize (directionsQuestionnaire: DirectionsQuestionnaireDraft): DirectionsQuestionnaire {
    return {
      requireSupport: directionsQuestionnaire.supportRequired && {
        languageInterpreter: directionsQuestionnaire.supportRequired.languageInterpreted,
        signLanguageInterpreter: directionsQuestionnaire.supportRequired.signLanguageInterpreted,
        hearingLoop: directionsQuestionnaire.supportRequired.hearingLoopSelected ? YesNoOption.YES : YesNoOption.NO,
        disabledAccess: directionsQuestionnaire.supportRequired.disabledAccessSelected ? YesNoOption.YES : YesNoOption.NO,
        otherSupport: directionsQuestionnaire.supportRequired.otherSupport
      },
      hearingLocation: {
        courtName: directionsQuestionnaire.hearingLocation ? directionsQuestionnaire.hearingLocation : undefined,
        hearingLocationSlug: undefined,
        courtAddress: undefined,
        locationOption: undefined,
        exceptionalCircumstancesReason: directionsQuestionnaire.exceptionalCircumstances ?
          directionsQuestionnaire.exceptionalCircumstances.reason : undefined
      },
      witness: directionsQuestionnaire.selfWitness && {
        selfWitness: directionsQuestionnaire.selfWitness.option ,
        noOfOtherWitness: directionsQuestionnaire.otherWitnesses ? directionsQuestionnaire.otherWitnesses.howMany : undefined
      },
      expertReportRows: directionsQuestionnaire.expertReports && {
        expertReports: directionsQuestionnaire.expertReports.rows.map(row => ({
          expertName: row.expertName,
          expertReportDate: row.reportDate
        }))
      },
      unavailableDates: directionsQuestionnaire.availability && {
        unavailableDate: directionsQuestionnaire.availability.unavailableDates
      },
      expertRequest: directionsQuestionnaire.expertEvidence && {
        expertEvidenceToExamine: directionsQuestionnaire.expertEvidence.expertEvidence.option,
        reasonForExpertAdvice: directionsQuestionnaire.expertEvidence.whatToExamine
      }
    }
  }
}
