"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PartyType {
    constructor(value, name) {
        this.value = value;
        this.name = name;
    }
    static all() {
        return [
            PartyType.INDIVIDUAL,
            PartyType.SOLE_TRADER_OR_SELF_EMPLOYED,
            PartyType.COMPANY,
            PartyType.ORGANISATION
        ];
    }
    static except(partyType) {
        if (partyType === undefined) {
            throw new Error('Party type is required');
        }
        return PartyType.all().filter(_ => _.value !== partyType.value);
    }
    static valueOf(value) {
        return PartyType.all()
            .filter(type => type.value === value)
            .pop();
    }
}
exports.PartyType = PartyType;
PartyType.INDIVIDUAL = new PartyType('individual', 'Individual');
PartyType.SOLE_TRADER_OR_SELF_EMPLOYED = new PartyType('soleTrader', 'Sole trader');
PartyType.COMPANY = new PartyType('company', 'Company');
PartyType.ORGANISATION = new PartyType('organisation', 'Organisation');
