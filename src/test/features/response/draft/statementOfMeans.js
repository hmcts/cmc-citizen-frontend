"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const statementOfMeans_1 = require("response/draft/statementOfMeans");
const residence_1 = require("response/form/models/statement-of-means/residence");
const employment_1 = require("response/form/models/statement-of-means/employment");
const employers_1 = require("response/form/models/statement-of-means/employers");
const selfEmployment_1 = require("response/form/models/statement-of-means/selfEmployment");
const residenceType_1 = require("response/form/models/statement-of-means/residenceType");
describe('StatementOfMeans', () => {
    describe('deserialize', () => {
        it('should return empty StatementOfMeans for undefined given as input', () => {
            const actual = new statementOfMeans_1.StatementOfMeans().deserialize(undefined);
            chai_1.expect(actual).to.be.instanceof(statementOfMeans_1.StatementOfMeans);
            chai_1.expect(actual.residence).to.be.eq(undefined);
            chai_1.expect(actual.employment).to.be.eq(undefined);
            chai_1.expect(actual.employers).to.be.eq(undefined);
            chai_1.expect(actual.selfEmployment).to.be.eq(undefined);
        });
        it('should return populated StatementOfMeans for valid input', () => {
            const actual = new statementOfMeans_1.StatementOfMeans().deserialize({
                residence: {
                    type: {
                        value: residenceType_1.ResidenceType.OTHER.value,
                        displayValue: residenceType_1.ResidenceType.OTHER.displayValue
                    },
                    housingDetails: 'Squat'
                },
                employment: {
                    isCurrentlyEmployed: true,
                    employed: true,
                    selfEmployted: true
                },
                employers: {
                    rows: [
                        {
                            employerName: 'Company',
                            jobTitle: 'role'
                        }
                    ]
                },
                selfEmployed: {
                    jobTitle: 'role',
                    annualTurnover: 1111,
                    areYouBehindOnTax: true,
                    amountYouOwe: 222,
                    reason: 'I did not pay'
                }
            });
            chai_1.expect(actual).to.be.instanceof(statementOfMeans_1.StatementOfMeans);
            chai_1.expect(actual.residence).to.be.instanceOf(residence_1.Residence);
            chai_1.expect(actual.residence.type.value).to.equal(residenceType_1.ResidenceType.OTHER.value);
            chai_1.expect(actual.employment).to.be.instanceof(employment_1.Employment);
            chai_1.expect(actual.employers).to.be.instanceof(employers_1.Employers);
            chai_1.expect(actual.selfEmployment).to.be.instanceof(selfEmployment_1.SelfEmployment);
        });
    });
});
