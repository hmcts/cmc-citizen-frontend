"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const claim_1 = require("claims/models/claim");
const claim_store_1 = require("test/http-mocks/claim-store");
const full_defence_transitions_1 = require("dashboard/claims-state-machine/full-defence-transitions");
const responseType_1 = require("claims/models/response/responseType");
const defenceType_1 = require("claims/models/response/defenceType");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const freeMediation_1 = require("forms/models/freeMediation");
const momentFactory_1 = require("shared/momentFactory");
describe('State Machine for the dashboard status before response', () => {
    describe('given the claim with full defence already paid defendant response', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { response: {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    defenceType: defenceType_1.DefenceType.ALREADY_PAID
                } }));
            let claimState = full_defence_transitions_1.fullDefenceTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('fd-already-paid');
        });
    });
    describe('given the claim with full defence already paid Claimant rejected to defendant response', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { response: {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    defenceType: defenceType_1.DefenceType.ALREADY_PAID,
                    paymentDeclaration: {
                        paidDate: '01-01-2019',
                        paidAmount: 100,
                        explanation: 'test'
                    }
                }, claimantResponse: {
                    type: claimantResponseType_1.ClaimantResponseType.REJECTION
                } }));
            let claimState = full_defence_transitions_1.fullDefenceTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('fd-already-paid-reject');
        });
    });
    describe('given the claim with full defence reject with mediation', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { response: {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    freeMediation: freeMediation_1.FreeMediationOption.YES
                } }));
            let claimState = full_defence_transitions_1.fullDefenceTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('fd-reject-with-mediation');
        });
    });
    describe('given the claim with full defence reject without mediation', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { response: {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    freeMediation: freeMediation_1.FreeMediationOption.NO
                } }));
            let claimState = full_defence_transitions_1.fullDefenceTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('fd-reject-without-mediation');
        });
    });
    describe('given the claim with full defence offers settlement with mediation', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { response: {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    freeMediation: freeMediation_1.FreeMediationOption.YES
                }, settlement: {
                    partyStatements: [
                        {
                            type: 'OFFER',
                            madeBy: 'DEFENDANT',
                            offer: {
                                content: 'test',
                                completionDate: momentFactory_1.MomentFactory.parse('2019-05-01')
                            }
                        }
                    ]
                } }));
            let claimState = full_defence_transitions_1.fullDefenceTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('fd-settlement-offer-with-mediation');
        });
    });
    describe('given the claim with full defence offers settlement without mediation', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { response: {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    freeMediation: freeMediation_1.FreeMediationOption.NO
                }, settlement: {
                    partyStatements: [
                        {
                            type: 'OFFER',
                            madeBy: 'DEFENDANT',
                            offer: {
                                content: 'test',
                                completionDate: momentFactory_1.MomentFactory.parse('2019-05-01')
                            }
                        }
                    ]
                } }));
            let claimState = full_defence_transitions_1.fullDefenceTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('fd-settlement-offer-without-mediation');
        });
    });
    describe('given the claim with full defence reject offers settlement without mediation ', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { response: {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    freeMediation: freeMediation_1.FreeMediationOption.NO
                }, settlement: {
                    partyStatements: [
                        {
                            madeBy: 'CLAIMANT',
                            type: 'REJECTION'
                        },
                        {
                            type: 'OFFER',
                            madeBy: 'DEFENDANT',
                            offer: {
                                content: 'test',
                                completionDate: momentFactory_1.MomentFactory.parse('2019-05-01')
                            }
                        }
                    ]
                } }));
            let claimState = full_defence_transitions_1.fullDefenceTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('fd-settlement-offer-reject-without-mediation');
        });
    });
    describe('given the claim with full defence reject offers settlement with mediation ', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { response: {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    freeMediation: freeMediation_1.FreeMediationOption.YES
                }, settlement: {
                    partyStatements: [
                        {
                            madeBy: 'CLAIMANT',
                            type: 'REJECTION'
                        },
                        {
                            type: 'OFFER',
                            madeBy: 'DEFENDANT',
                            offer: {
                                content: 'test',
                                completionDate: momentFactory_1.MomentFactory.parse('2019-05-01')
                            }
                        }
                    ]
                } }));
            let claimState = full_defence_transitions_1.fullDefenceTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('fd-settlement-offer-reject-with-mediation');
        });
    });
    describe('given the claim with full defence made agreement with mediation ', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { response: {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    freeMediation: freeMediation_1.FreeMediationOption.YES
                }, settlement: {
                    partyStatements: [
                        {
                            madeBy: 'CLAIMANT',
                            type: 'ACCEPTATION'
                        },
                        {
                            type: 'OFFER',
                            madeBy: 'DEFENDANT',
                            offer: {
                                content: 'test',
                                completionDate: momentFactory_1.MomentFactory.parse('2019-05-01')
                            }
                        }
                    ]
                } }));
            let claimState = full_defence_transitions_1.fullDefenceTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('fd-made-agreement-with-mediation');
        });
    });
    describe('given the claim with full defence made agreement without mediation ', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { response: {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    freeMediation: freeMediation_1.FreeMediationOption.NO
                }, settlement: {
                    partyStatements: [
                        {
                            madeBy: 'CLAIMANT',
                            type: 'ACCEPTATION'
                        },
                        {
                            type: 'OFFER',
                            madeBy: 'DEFENDANT',
                            offer: {
                                content: 'test',
                                completionDate: momentFactory_1.MomentFactory.parse('2019-05-01')
                            }
                        }
                    ]
                } }));
            let claimState = full_defence_transitions_1.fullDefenceTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('fd-made-agreement-without-mediation');
        });
    });
    describe('given the claim with full defence settled with agreement ', () => {
        it('should extract the correct state for the claim issued', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimIssueObj), { response: {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    freeMediation: freeMediation_1.FreeMediationOption.NO
                }, settlement: {
                    partyStatements: [
                        {
                            madeBy: 'DEFENDANT',
                            type: 'COUNTERSIGNATURE'
                        },
                        {
                            madeBy: 'CLAIMANT',
                            type: 'ACCEPTATION'
                        },
                        {
                            type: 'OFFER',
                            madeBy: 'DEFENDANT',
                            offer: {
                                content: 'test',
                                completionDate: momentFactory_1.MomentFactory.parse('2019-05-01')
                            }
                        }
                    ]
                }, settlementReachedAt: momentFactory_1.MomentFactory.parse('2019-03-01') }));
            let claimState = full_defence_transitions_1.fullDefenceTransitions(claim);
            claimState.findState(claimState);
            chai_1.expect(claimState.state).to.equal('fd-settled-with-agreement');
        });
    });
});
