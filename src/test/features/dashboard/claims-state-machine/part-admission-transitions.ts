import { expect } from 'chai'
import { Claim } from 'claims/models/claim'
import { sampleClaimIssueObj } from 'test/http-mocks/claim-store'

import { claimState } from 'dashboard/claims-state-machine/claim-state'
import { ResponseType } from 'claims/models/response/responseType'
import { MomentFactory } from 'shared/momentFactory'
import { PaymentOption } from 'claims/models/paymentOption'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'

describe('State Machine for the dashboard status', () => {

  describe('given the claim with part admission - pay immediately response with mediation disabled', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'no',
          paymentIntention: {
            paymentOption : PaymentOption.IMMEDIATELY,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-immediately-without-mediation')
    })
  })

  describe('given the claim with part admission - pay immediately response with mediation enabled', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.IMMEDIATELY,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-immediately-with-mediation')
    })
  })

  describe('given the claim with part admission - pay immediately response accepted with mediation disabled', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'no',
          paymentIntention: {
            paymentOption : PaymentOption.IMMEDIATELY,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantResponse : {
          type : ClaimantResponseType.ACCEPTATION,
          FormaliseOption: FormaliseOption.SETTLEMENT
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-immediately-accepted-without-mediation')
    })
  })

  describe('given the claim with part admission - pay immediately response accepted with mediation enabled', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.IMMEDIATELY,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantResponse : {
          type : ClaimantResponseType.ACCEPTATION,
          FormaliseOption: FormaliseOption.SETTLEMENT
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-immediately-accepted-with-mediation')
    })
  })

  describe('given the claim with part admission - pay by set date response with mediation enabled', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-by-set-date-with-mediation')
    })
  })

  describe('given the claim with part admission - pay by set date response with mediation enabled', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'no',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-by-set-date-without-mediation')
    })
  })

  describe('given the claim with part admission - pay by installments response with mediation enabled', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.INSTALMENTS,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-in-instalments-with-mediation')
    })
  })

  describe('given the claim with full admission - pay by installments response with mediation disabled', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'no',
          paymentIntention: {
            paymentOption : PaymentOption.INSTALMENTS,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-in-instalments-without-mediation')
    })
  })

  describe('given the claim with part admission - ccj requested by admission when accept repayment plan', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        countyCourtJudgmentRequestedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.CCJ
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-ccj-pay-by-set-date-by-admission')
    })
  })

  describe('given the claim with part admission - ccj requested by determination when accept repayment plan', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        countyCourtJudgmentRequestedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtDetermination: {
            courtDecision : {
              paymentDate : '2019-05-01',
              paymentOption : PaymentOption.BY_SPECIFIED_DATE
            }
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.CCJ
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-ccj-pay-by-set-date-by-determination')
    })
  })

  describe('given the claim with part admission - with claimant accepted settlement by admission', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-by-set-date-claimant-offer-accepted-by-admission')
    })
  })

  describe('given the claim with part admission - with claimant accepted settlement by determination', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtDetermination: {
            courtDecision : {
              paymentDate : '2019-05-01',
              paymentOption : PaymentOption.BY_SPECIFIED_DATE
            }
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-by-set-date-claimant-offer-accepted-by-determination')
    })
  })

  describe('given the claim with part admission - with counter signature past deadline by admission', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantRespondedAt : MomentFactory.currentDate().subtract(8,'days'),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-by-set-date-past-counter-signature-deadline-by-admission')
    })
  })

  describe('given the claim with part admission - with counter signature past deadline by determination', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantRespondedAt : MomentFactory.currentDate().subtract(8,'days'),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtDetermination: {
            courtDecision : {
              paymentDate : '2019-05-01',
              paymentOption : PaymentOption.BY_SPECIFIED_DATE
            }
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-by-set-date-past-counter-signature-deadline-by-determination')
    })
  })

  describe('given the claim with part admission - ccj requested when counter signature past deadline by admission', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantRespondedAt : MomentFactory.currentDate().subtract(8,'days'),
        countyCourtJudgmentRequestedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-ccj-pay-by-set-date-past-counter-signature-deadline-by-admission')
    })
  })

  describe('given the claim with part admission - ccj requested with counter signature past deadline by determination', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        countyCourtJudgmentRequestedAt : MomentFactory.currentDate(),
        claimantRespondedAt : MomentFactory.currentDate().subtract(8,'days'),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtDetermination: {
            courtDecision : {
              paymentDate : '2019-05-01',
              paymentOption : PaymentOption.BY_SPECIFIED_DATE
            }
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-ccj-pay-by-set-date-past-counter-signature-deadline-by-determination')
    })
  })

  describe('given the claim with part admission - with defendant rejected settlement by admission', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantRespondedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            },
            {
              madeBy : 'DEFENDANT',
              type : 'REJECTION'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-by-set-date-defendant-rejected-claimant-offer-by-admission')
    })
  })

  describe('given the claim with part admission - with defendant rejected settlement by determination', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantRespondedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtDetermination: {
            courtDecision : {
              paymentDate : '2019-05-01',
              paymentOption : PaymentOption.BY_SPECIFIED_DATE
            }
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            },
            {
              madeBy : 'DEFENDANT',
              type : 'REJECTION'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-by-set-date-defendant-rejected-claimant-offer-by-determination')
    })
  })

  describe('given the claim with part admission - ccj requested when defendant rejected settlement by admission', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        countyCourtJudgmentRequestedAt : MomentFactory.currentDate(),
        claimantRespondedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            },
            {
              madeBy : 'DEFENDANT',
              type : 'REJECTION'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-ccj-pay-by-set-date-defendant-rejected-claimant-offer-by-admission')
    })
  })

  describe('given the claim with part admission - ccj requested when defendant rejected settlement by determination', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        countyCourtJudgmentRequestedAt : MomentFactory.currentDate(),
        claimantRespondedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtDetermination: {
            courtDecision : {
              paymentDate : '2019-05-01',
              paymentOption : PaymentOption.BY_SPECIFIED_DATE
            }
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            },
            {
              madeBy : 'DEFENDANT',
              type : 'REJECTION'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-ccj-pay-by-set-date-defendant-rejected-claimant-offer-by-determination')
    })
  })

  describe('given the claim with part admission - settled through admission', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantRespondedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-by-set-date-claimant-offer-accepted-by-admission')
    })
  })

  describe('given the claim with part admission - settled through determination', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantRespondedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtDetermination: {
            courtDecision : {
              paymentDate : '2019-05-01',
              paymentOption : PaymentOption.BY_SPECIFIED_DATE
            }
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            },
            {
              madeBy : 'DEFENDANT',
              type : 'COUNTERSIGNATURE'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-by-set-date-past-payment-deadline-settled-through-determination')
    })
  })

  describe('given the claim with part admission - settlement by set date past payment deadline through admission', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantRespondedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                completionDate : MomentFactory.currentDate().subtract(2,'days'),
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                }
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            },
            {
              madeBy : 'DEFENDANT',
              type : 'COUNTERSIGNATURE'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-by-set-date-past-payment-deadline-settled-through-admission')
    })
  })

  describe('given the claim with part admission - settlement by installments past payment deadline through admission', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.INSTALMENTS,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantRespondedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.INSTALMENTS
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  paymentOption : PaymentOption.INSTALMENTS,
                  repaymentPlan : {
                    firstPaymentDate : MomentFactory.currentDate().subtract(2, 'days')
                  }
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            },
            {
              madeBy : 'DEFENDANT',
              type : 'COUNTERSIGNATURE'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-in-instalments-past-payment-deadline-settled-through-admission')
    })
  })

  describe('given the claim with part admission - settlement by set date past payment deadline through determination', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantRespondedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          courtDetermination: {
            courtDecision : {
              paymentDate : '2019-05-01',
              paymentOption : PaymentOption.BY_SPECIFIED_DATE
            }
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                completionDate : MomentFactory.currentDate().subtract(2,'days'),
                paymentIntention : {
                  paymentDate : MomentFactory.currentDate().subtract(2, 'days'),
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                }
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            },
            {
              madeBy : 'DEFENDANT',
              type : 'COUNTERSIGNATURE'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-by-set-date-past-payment-deadline-settled-through-determination')
    })
  })

  describe('given the claim with part admission - settlement by installments past payment deadline through determination', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.INSTALMENTS,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        claimantRespondedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.INSTALMENTS
          },
          courtDetermination: {
            courtDecision : {
              paymentDate : '2019-05-01',
              paymentOption : PaymentOption.INSTALMENTS
            }
          },
          courtPaymentIntention : {
            paymentOption : PaymentOption.INSTALMENTS
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                paymentIntention : {
                  repaymentPlan : {
                    firstPaymentDate : MomentFactory.currentDate().subtract(2, 'days')
                  },
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                },
                completionDate : '2019-05-01'
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            },
            {
              madeBy : 'DEFENDANT',
              type : 'COUNTERSIGNATURE'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-pay-in-instalments-past-payment-deadline-settled-through-determination')
    })
  })

  describe('given the claim with part admission - ccj requested when past payment deadline during settlement through admission', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        countyCourtJudgmentRequestedAt : MomentFactory.currentDate(),
        claimantRespondedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.IMMEDIATELY
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                completionDate : MomentFactory.currentDate().subtract(2,'days'),
                paymentIntention : {
                  paymentDate : '2019-05-01',
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                }
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            },
            {
              madeBy : 'DEFENDANT',
              type : 'COUNTERSIGNATURE'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-ccj-pay-by-set-date-past-payment-deadline-settled-through-admission')
    })
  })

  describe('given the claim with part admission - ccj requested when past payment deadline during settlement through determination', () => {
    it('should extract the correct state for the claim issued', () => {
      const claim: Claim = new Claim().deserialize({
        ...sampleClaimIssueObj,
        response: {
          responseType: ResponseType.PART_ADMISSION,
          freeMediation: 'yes',
          paymentIntention: {
            paymentOption : PaymentOption.BY_SPECIFIED_DATE,
            paymentDate : MomentFactory.currentDate().add(7, 'days')
          }
        },
        countyCourtJudgmentRequestedAt : MomentFactory.currentDate(),
        claimantRespondedAt : MomentFactory.currentDate(),
        claimantResponse : {
          claimantPaymentIntention : {
            paymentDate : '2019-04-08',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          courtDetermination: {
            courtDecision : {
              paymentDate : '2019-05-01',
              paymentOption : PaymentOption.BY_SPECIFIED_DATE
            }
          },
          courtPaymentIntention : {
            paymentDate : '2019-06-28',
            paymentOption : PaymentOption.BY_SPECIFIED_DATE
          },
          type : ClaimantResponseType.ACCEPTATION,
          formaliseOption : FormaliseOption.SETTLEMENT
        },
        settlement : {
          partyStatements : [
            {
              madeBy : 'DEFENDANT',
              offer : {
                completionDate : MomentFactory.currentDate().subtract(2,'days'),
                paymentIntention : {
                  paymentDate : MomentFactory.currentDate().subtract(2, 'days'),
                  paymentOption : PaymentOption.BY_SPECIFIED_DATE
                }
              },
              type : 'OFFER'
            },
            {
              madeBy : 'CLAIMANT',
              type : 'ACCEPTATION'
            },
            {
              madeBy : 'DEFENDANT',
              type : 'COUNTERSIGNATURE'
            }
          ]
        }
      })
      claimState([claim],'claimant')
      expect(claim.template.state).to.equal('pa-ccj-pay-by-set-date-past-payment-deadline-settled-through-determination')
    })
  })
})
