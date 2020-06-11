"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
const claimDocumentType_1 = require("common/claimDocumentType");
class ClaimDocument {
    deserialize(input) {
        if (input) {
            this.id = input.id;
            this.documentManagementUrl = input.documentManagementUrl;
            this.documentManagementBinaryUrl = input.documentManagementBinaryUrl;
            this.documentName = input.documentName.replace('.pdf', '');
            this.documentType = input.documentType;
            this.uri = this.getDocumentURI(input.documentType);
            this.documentDisplayName = this.getDisplayName(input.documentType);
            this.createdDatetime = momentFactory_1.MomentFactory.parse(input.createdDatetime);
            this.createdBy = input.createdBy;
            this.size = input.size;
        }
        return this;
    }
    getDisplayName(documentType) {
        return claimDocumentType_1.ClaimDocumentType[documentType].text;
    }
    getDocumentURI(documentType) {
        return claimDocumentType_1.ClaimDocumentType[documentType].uri;
    }
}
exports.ClaimDocument = ClaimDocument;
