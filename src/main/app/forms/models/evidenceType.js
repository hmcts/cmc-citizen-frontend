"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EvidenceType {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
    }
    static valueOf(value) {
        return EvidenceType.all().filter(type => type.value === value).pop();
    }
    static all() {
        return [
            EvidenceType.CONTRACTS_AND_AGREEMENTS,
            EvidenceType.EXPERT_WITNESS,
            EvidenceType.CORRESPONDENCE,
            EvidenceType.PHOTO,
            EvidenceType.RECEIPTS,
            EvidenceType.STATEMENT_OF_ACCOUNT,
            EvidenceType.OTHER
        ];
    }
}
exports.EvidenceType = EvidenceType;
EvidenceType.CONTRACTS_AND_AGREEMENTS = new EvidenceType('CONTRACTS_AND_AGREEMENTS', 'Contracts and agreements');
EvidenceType.EXPERT_WITNESS = new EvidenceType('EXPERT_WITNESS', 'Expert witness');
EvidenceType.CORRESPONDENCE = new EvidenceType('CORRESPONDENCE', 'Letters, emails and other correspondence');
EvidenceType.PHOTO = new EvidenceType('PHOTO', 'Photo evidence');
EvidenceType.RECEIPTS = new EvidenceType('RECEIPTS', 'Receipts');
EvidenceType.STATEMENT_OF_ACCOUNT = new EvidenceType('STATEMENT_OF_ACCOUNT', 'Statements of account');
EvidenceType.OTHER = new EvidenceType('OTHER', 'Other');
