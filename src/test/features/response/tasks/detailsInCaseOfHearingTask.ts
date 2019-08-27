/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { DetailsInCaseOfHearingTask } from 'response/tasks/detailsInCaseOfHearingTask'
import { ResponseDraft } from 'response/draft/responseDraft'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { SelfWitness } from 'directions-questionnaire/forms/models/selfWitness'
import { ExpertRequired } from 'directions-questionnaire/forms/models/expertRequired'
import { ExpertReports } from 'directions-questionnaire/forms/models/expertReports'
import { PermissionForExpert } from 'directions-questionnaire/forms/models/permissionForExpert'
import { ExpertEvidence } from 'directions-questionnaire/forms/models/expertEvidence'
import { OtherWitnesses } from 'directions-questionnaire/forms/models/otherWitnesses'
import { Availability } from 'directions-questionnaire/forms/models/availability'
import { SupportRequired } from 'directions-questionnaire/forms/models/supportRequired'
import { WhyExpertIsNeeded } from 'directions-questionnaire/forms/models/whyExpertIsNeeded'
import { Claim } from 'claims/models/claim'
import * as claimStoreMock from '../../../http-mocks/claim-store'

describe('Details In case of hearing task', () => {
  it('should not be completed when all directions questionnaire are not filled', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })

    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false
  })

  it('should not be completed when only hearing location selected', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })
    directionsQuestionnaireDraft.hearingLocation.courtName = 'London'

    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false
  })

  it('should not be completed when only hearing location and self witness filled', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })
    directionsQuestionnaireDraft.hearingLocation.courtName = 'London'
    directionsQuestionnaireDraft.selfWitness = new SelfWitness().deserialize({ option: 'yes' })

    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false
  })

  it('should not be completed when expert reports are not selected', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })
    directionsQuestionnaireDraft.hearingLocation.courtName = 'London'
    directionsQuestionnaireDraft.selfWitness = new SelfWitness().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertRequired = new ExpertRequired().deserialize({ option: 'yes' })

    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false
  })

  it('should not be completed when permission for expert is not selected', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })
    directionsQuestionnaireDraft.hearingLocation.courtName = 'London'
    directionsQuestionnaireDraft.selfWitness = new SelfWitness().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertRequired = new ExpertRequired().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertReports = new ExpertReports().deserialize({ declared: false, rows: [] })

    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false
  })

  it('should not be completed when export evidence is not selected', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })
    directionsQuestionnaireDraft.hearingLocation.courtName = 'London'
    directionsQuestionnaireDraft.selfWitness = new SelfWitness().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertRequired = new ExpertRequired().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertReports = new ExpertReports().deserialize({ declared: false, rows: [] })
    directionsQuestionnaireDraft.permissionForExpert = new PermissionForExpert().deserialize({ option: { option: 'yes' } })

    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false
  })

  it('should not be completed when export evidence is not selected', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })
    directionsQuestionnaireDraft.hearingLocation.courtName = 'London'
    directionsQuestionnaireDraft.selfWitness = new SelfWitness().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertRequired = new ExpertRequired().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertReports = new ExpertReports().deserialize({ declared: false, rows: [] })
    directionsQuestionnaireDraft.permissionForExpert = new PermissionForExpert().deserialize({ option: { option: 'yes' } })

    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false
  })

  it('should not be completed when `why expert is needed` is not selected', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })
    directionsQuestionnaireDraft.hearingLocation.courtName = 'London'
    directionsQuestionnaireDraft.selfWitness = new SelfWitness().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertRequired = new ExpertRequired().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertReports = new ExpertReports().deserialize({ declared: false, rows: [] })
    directionsQuestionnaireDraft.permissionForExpert = new PermissionForExpert().deserialize({ option: { option: 'yes' } })
    directionsQuestionnaireDraft.expertEvidence = new ExpertEvidence().deserialize({
      expertEvidence: { option: 'yes' },
      whatToExamine: 'documents'
    })
    directionsQuestionnaireDraft.whyExpertIsNeeded = new WhyExpertIsNeeded()
    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false
  })

  it('should not be completed when availability is not selected', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })
    directionsQuestionnaireDraft.hearingLocation.courtName = 'London'
    directionsQuestionnaireDraft.selfWitness = new SelfWitness().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertRequired = new ExpertRequired().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertReports = new ExpertReports().deserialize({ declared: false, rows: [] })
    directionsQuestionnaireDraft.permissionForExpert = new PermissionForExpert().deserialize({ option: { option: 'yes' } })
    directionsQuestionnaireDraft.expertEvidence = new ExpertEvidence().deserialize({
      expertEvidence: { option: 'yes' },
      whatToExamine: 'documents'
    })
    directionsQuestionnaireDraft.whyExpertIsNeeded = new WhyExpertIsNeeded().deserialize({ explanation: 'report document' })
    directionsQuestionnaireDraft.otherWitnesses = new OtherWitnesses().deserialize({
      otherWitnesses: { option: 'yes' },
      howMany: 1
    })

    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false
  })

  it('should not be completed when other support is selected but not filled', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })
    directionsQuestionnaireDraft.hearingLocation.courtName = 'London'
    directionsQuestionnaireDraft.selfWitness = new SelfWitness().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertRequired = new ExpertRequired().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertReports = new ExpertReports().deserialize({ declared: false, rows: [] })
    directionsQuestionnaireDraft.permissionForExpert = new PermissionForExpert().deserialize({ option: { option: 'yes' } })
    directionsQuestionnaireDraft.expertEvidence = new ExpertEvidence().deserialize({
      expertEvidence: { option: 'yes' },
      whatToExamine: 'documents'
    })
    directionsQuestionnaireDraft.whyExpertIsNeeded = new WhyExpertIsNeeded().deserialize({ explanation: 'report document' })
    directionsQuestionnaireDraft.otherWitnesses = new OtherWitnesses().deserialize({
      otherWitnesses: { option: 'yes' },
      howMany: 1
    })
    directionsQuestionnaireDraft.availability = new Availability().deserialize({
      hasUnavailableDates: false,
      unavailableDates: []
    })
    directionsQuestionnaireDraft.supportRequired = new SupportRequired().deserialize({
      otherSupportSelected: true,
      otherSupport: ''
    })

    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false
  })

  it('should not be completed when language selected is selected but not filled', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })
    directionsQuestionnaireDraft.hearingLocation.courtName = 'London'
    directionsQuestionnaireDraft.selfWitness = new SelfWitness().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertRequired = new ExpertRequired().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertReports = new ExpertReports().deserialize({ declared: false, rows: [] })
    directionsQuestionnaireDraft.permissionForExpert = new PermissionForExpert().deserialize({ option: { option: 'yes' } })
    directionsQuestionnaireDraft.expertEvidence = new ExpertEvidence().deserialize({
      expertEvidence: { option: 'yes' },
      whatToExamine: 'documents'
    })
    directionsQuestionnaireDraft.whyExpertIsNeeded = new WhyExpertIsNeeded().deserialize({ explanation: 'report document' })
    directionsQuestionnaireDraft.otherWitnesses = new OtherWitnesses().deserialize({
      otherWitnesses: { option: 'yes' },
      howMany: 1
    })
    directionsQuestionnaireDraft.availability = new Availability().deserialize({
      hasUnavailableDates: false,
      unavailableDates: []
    })
    directionsQuestionnaireDraft.supportRequired = new SupportRequired().deserialize({
      otherSupportSelected: true,
      otherSupport: 'supporting documents',
      languageSelected: true,
      languageInterpreted: ''
    })

    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false
  })

  it('should not be completed when signLanguage selected is selected but not filled', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })
    directionsQuestionnaireDraft.hearingLocation.courtName = 'London'
    directionsQuestionnaireDraft.selfWitness = new SelfWitness().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertRequired = new ExpertRequired().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertReports = new ExpertReports().deserialize({ declared: false, rows: [] })
    directionsQuestionnaireDraft.permissionForExpert = new PermissionForExpert().deserialize({ option: { option: 'yes' } })
    directionsQuestionnaireDraft.expertEvidence = new ExpertEvidence().deserialize({
      expertEvidence: { option: 'yes' },
      whatToExamine: 'documents'
    })
    directionsQuestionnaireDraft.whyExpertIsNeeded = new WhyExpertIsNeeded().deserialize({ explanation: 'report document' })
    directionsQuestionnaireDraft.otherWitnesses = new OtherWitnesses().deserialize({
      otherWitnesses: { option: 'yes' },
      howMany: 1
    })
    directionsQuestionnaireDraft.availability = new Availability().deserialize({
      hasUnavailableDates: false,
      unavailableDates: []
    })
    directionsQuestionnaireDraft.supportRequired = new SupportRequired().deserialize({
      otherSupportSelected: true,
      otherSupport: 'supporting documents',
      languageSelected: true,
      languageInterpreted: 'language documents',
      signLanguageSelected: true,
      signLanguageInterpreted: ''
    })

    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.false
  })

  it('should be completed when expert required and all other fields are filled', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })
    directionsQuestionnaireDraft.hearingLocation.courtName = 'London'
    directionsQuestionnaireDraft.selfWitness = new SelfWitness().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertRequired = new ExpertRequired().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertReports = new ExpertReports().deserialize({ declared: false, rows: [] })
    directionsQuestionnaireDraft.permissionForExpert = new PermissionForExpert().deserialize({ option: { option: 'yes' } })
    directionsQuestionnaireDraft.expertEvidence = new ExpertEvidence().deserialize({
      expertEvidence: { option: 'yes' },
      whatToExamine: 'documents'
    })
    directionsQuestionnaireDraft.whyExpertIsNeeded = new WhyExpertIsNeeded().deserialize({ explanation: 'report document' })
    directionsQuestionnaireDraft.otherWitnesses = new OtherWitnesses().deserialize({
      otherWitnesses: { option: 'yes' },
      howMany: 1
    })
    directionsQuestionnaireDraft.availability = new Availability().deserialize({
      hasUnavailableDates: false,
      unavailableDates: []
    })
    directionsQuestionnaireDraft.supportRequired = new SupportRequired().deserialize({
      otherSupportSelected: true,
      otherSupport: 'supporting documents',
      languageSelected: true,
      languageInterpreted: 'language documents',
      signLanguageSelected: true,
      signLanguageInterpreted: 'sign language documents '
    })

    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.true
  })

  it('should be completed when expert is not required and all other fields are filled', () => {
    const draft = new ResponseDraft()
    const directionsQuestionnaireDraft = new DirectionsQuestionnaireDraft()
    const claim: Claim = new Claim().deserialize({
      ...claimStoreMock.sampleClaimObj, ...{ features: ['admissions', 'directionsQuestionnaire'] }
    })
    directionsQuestionnaireDraft.hearingLocation.courtName = 'London'
    directionsQuestionnaireDraft.selfWitness = new SelfWitness().deserialize({ option: 'yes' })
    directionsQuestionnaireDraft.expertRequired = new ExpertRequired().deserialize({ option: 'no' })
    directionsQuestionnaireDraft.otherWitnesses = new OtherWitnesses().deserialize({
      otherWitnesses: { option: 'yes' },
      howMany: 1
    })
    directionsQuestionnaireDraft.availability = new Availability().deserialize({
      hasUnavailableDates: false,
      unavailableDates: []
    })
    directionsQuestionnaireDraft.supportRequired = new SupportRequired().deserialize({
      otherSupportSelected: true,
      otherSupport: 'supporting documents',
      languageSelected: true,
      languageInterpreted: 'language documents',
      signLanguageSelected: true,
      signLanguageInterpreted: 'sign language documents '
    })

    expect(DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)).to.be.true
  })
})
