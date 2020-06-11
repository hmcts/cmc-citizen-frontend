"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const claimDocument_1 = require("claims/models/claimDocument");
const claimDocumentSample = {
    id: '3f1813ee-5b60-43fd-9160-fa92605dfd6e',
    documentName: '000MC258-claim-form.pdf',
    documentType: 'SEALED_CLAIM',
    createdDatetime: '2020-02-26T14:56:49.264',
    createdBy: 'OCMC',
    size: 79777
};
const claimDocument = new claimDocument_1.ClaimDocument();
describe('ClaimDocument', () => {
    it('should return document display name', () => {
        const actual = claimDocument.deserialize(claimDocumentSample);
        chai_1.expect(actual.documentDisplayName).to.be.eq('Download claim');
    });
    it('should return text', () => {
        const actual = claimDocument.getDisplayName('CLAIMANT_DIRECTIONS_QUESTIONNAIRE');
        chai_1.expect(actual).to.be.eq('Download the claimant\'s hearing requirements');
    });
    it('should return uri', () => {
        const actual = claimDocument.getDocumentURI('CLAIMANT_DIRECTIONS_QUESTIONNAIRE');
        chai_1.expect(actual).to.be.eq('claimant-directions-questionnaire');
    });
});
