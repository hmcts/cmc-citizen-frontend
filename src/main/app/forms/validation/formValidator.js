"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const form_1 = require("forms/form");
const _ = require("lodash");
class FormValidator {
    static requestHandler(modelType, modelTypeMapper, validationGroup, actionsWithoutValidation) {
        const validator = new class_validator_1.Validator();
        if (!modelTypeMapper) {
            modelTypeMapper = (value) => {
                return Object.assign(new modelType(), value);
            };
        }
        const isValidationEnabledFor = (req) => {
            if (actionsWithoutValidation && req.body.action) {
                const actionName = Object.keys(req.body.action)[0];
                return actionsWithoutValidation.indexOf(actionName) < 0;
            }
            return true;
        };
        return async (req, res, next) => {
            const model = modelTypeMapper(removeIllegalCharacters(req.body));
            const errors = isValidationEnabledFor(req) ? await validator.validate(model, { groups: validationGroup !== undefined ? [validationGroup] : [] }) : [];
            const action = req.body.action;
            req.body = new form_1.Form(model, errors, req.body);
            if (action) {
                req.body.action = action; // Workaround to expose action to request handlers
            }
            next();
        };
    }
}
exports.FormValidator = FormValidator;
function removeIllegalCharacters(value) {
    if (typeof value === 'string') {
        // Used the same criteria for excluding characters as in pdf service:
        // https://github.com/hmcts/cmc-pdf-service/commit/0d329cdf316c4170505cea0b1d55fc9e955ef9ed#diff-33006e1cd375862451ac613046341e82R34
        return value.replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]/g, '');
    }
    if (typeof value === 'object') {
        return (_.isArray(value) ? _.map : _.mapValues)(value, removeIllegalCharacters);
    }
    return value;
}
