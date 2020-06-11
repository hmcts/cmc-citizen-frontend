"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResidenceType {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
    }
    static valueOf(value) {
        return ResidenceType.all().filter(type => type.value === value).pop();
    }
    static all() {
        return [
            ResidenceType.OWN_HOME,
            ResidenceType.JOINT_OWN_HOME,
            ResidenceType.PRIVATE_RENTAL,
            ResidenceType.COUNCIL_OR_HOUSING_ASSN_HOME,
            ResidenceType.OTHER
        ];
    }
    static except(residenceType) {
        if (residenceType === undefined) {
            throw new Error('Residence type is required');
        }
        return ResidenceType.all().filter(item => item !== residenceType);
    }
}
exports.ResidenceType = ResidenceType;
ResidenceType.OWN_HOME = new ResidenceType('OWN_HOME', 'Home you own yourself (or pay a mortgage on)');
ResidenceType.JOINT_OWN_HOME = new ResidenceType('JOINT_OWN_HOME', 'Jointly-owned home (or jointly mortgaged home)');
ResidenceType.PRIVATE_RENTAL = new ResidenceType('PRIVATE_RENTAL', 'Private rental');
ResidenceType.COUNCIL_OR_HOUSING_ASSN_HOME = new ResidenceType('COUNCIL_OR_HOUSING_ASSN_HOME', 'Council or housing association home');
ResidenceType.OTHER = new ResidenceType('OTHER', 'Other');
