"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Country {
    constructor(value, name) {
        this.value = value;
        this.name = name;
    }
    static all() {
        return [
            Country.WALES,
            Country.ENGLAND,
            Country.SCOTLAND,
            Country.NORTHERN_IRELAND
        ];
    }
    static defendantCountries() {
        return [
            Country.WALES,
            Country.ENGLAND
        ];
    }
    static valueOf(value) {
        return Country.all()
            .filter(country => country.value === value)
            .pop();
    }
}
exports.Country = Country;
Country.WALES = new Country('wales', 'Wales');
Country.ENGLAND = new Country('england', 'England');
Country.SCOTLAND = new Country('scotland', 'Scotland');
Country.NORTHERN_IRELAND = new Country('northernIreland', 'Northern Ireland');
