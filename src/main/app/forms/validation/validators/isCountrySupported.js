"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const errorLogger_1 = require("logging/errorLogger");
const clientFactory_1 = require("postcode-lookup/clientFactory");
const postcodeClient = clientFactory_1.ClientFactory.createOSPlacesClient();
const countryClient = clientFactory_1.ClientFactory.createPostcodeToCountryClient();
var BlockedPostcodes;
(function (BlockedPostcodes) {
    BlockedPostcodes["ISLE_OF_MAN"] = "IM";
})(BlockedPostcodes || (BlockedPostcodes = {}));
let CheckCountryConstraint = class CheckCountryConstraint {
    async validate(value, args) {
        if (value === undefined || value === null || value === '') {
            return true;
        }
        if (value.trim().toUpperCase().startsWith(BlockedPostcodes.ISLE_OF_MAN)) {
            return false;
        }
        try {
            const addressInfoResponse = await postcodeClient.lookupByPostcode(value);
            if (!addressInfoResponse.isValid) {
                return true;
            }
            const country = await countryClient.lookupCountry(addressInfoResponse.addresses[0].postcode);
            const countries = args.constraints[0];
            return countries.some(result => result.name.toLowerCase() === country.toLowerCase());
        }
        catch (err) {
            const errorLogger = new errorLogger_1.ErrorLogger();
            errorLogger.log(err);
            return true;
        }
    }
    defaultMessage(args) {
        return 'Country is not supported';
    }
};
CheckCountryConstraint = __decorate([
    class_validator_1.ValidatorConstraint({ async: true })
], CheckCountryConstraint);
exports.CheckCountryConstraint = CheckCountryConstraint;
/**
 * Verify postcode is within accepted list of countries.
 */
function IsCountrySupported(countries, validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [countries],
            validator: CheckCountryConstraint
        });
    };
}
exports.IsCountrySupported = IsCountrySupported;
