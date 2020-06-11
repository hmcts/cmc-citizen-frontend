"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const _ = require("lodash");
class Converter {
    /**
     * Converts HTML form field in `foo[bar]` format to property in `foo.bar` format.
     */
    static asProperty(fieldName) {
        return fieldName.replace(/\[/g, '.').replace(/]/g, '');
    }
    /**
     * Converts property in `foo.bar` format to HTML form field name in `foo[bar]` format.
     */
    static asFieldName(property) {
        const parts = property.split('.');
        return parts[0] + parts.slice(1).map((part) => `[${part}]`).join('');
    }
}
exports.Converter = Converter;
class FormValidationError extends class_validator_1.ValidationError {
    constructor(error, parentProperty) {
        super();
        Object.assign(this, error);
        this.property = parentProperty ? `${parentProperty}.${this.property}` : this.property;
        this.fieldName = Converter.asFieldName(this.property);
        const firstConstraintName = Object.keys(error.constraints).reverse()[0];
        this.message = error.constraints[firstConstraintName];
    }
}
exports.FormValidationError = FormValidationError;
class Form {
    /**
     * @param model - a object used to fill the form
     * @param errors - an array of error objects
     * @param rawData - a raw data used to create model instance
     */
    constructor(model, errors = [], rawData = undefined) {
        this.model = model;
        this.rawData = rawData;
        this.errors = this.flatMapDeep(errors);
    }
    static empty() {
        return new Form(undefined, []);
    }
    hasErrors() {
        return this.errors.length > 0;
    }
    /**
     * Get error message associated with first constraint violated for given field name.
     *
     * @param fieldName - field name / model property
     */
    errorFor(fieldName) {
        return this.errors
            .filter((error) => error.fieldName === fieldName)
            .map((error) => error.message)[0];
    }
    /**
     * Get raw data for given field name.
     * @param {string} fieldName
     * @returns {object}
     */
    rawDataFor(fieldName) {
        if (this.rawData) {
            return this.getValueFrom(this.rawData, fieldName);
        }
        else {
            return undefined;
        }
    }
    /**
     * Get model value for given field name.
     *
     * @param fieldName - field name / model property
     */
    valueFor(fieldName) {
        if (this.model) {
            return this.getValueFrom(this.model, fieldName);
        }
        else {
            return undefined;
        }
    }
    /**
     * Iterate though elements of input and find value for field
     * @param {any} input of type model/rawData
     * @param {string} fieldName
     * @returns {object}
     */
    getValueFrom(input, fieldName) {
        let value = input;
        Converter.asProperty(fieldName).split('.').forEach(property => {
            value = value ? value[property] : value;
        });
        return value;
    }
    /**
     * Maps array of ValidationError returned by validation framework to FormValidationErrors containing extra form related properties.
     *
     * It also flattens nested structure of ValidationError (see: children property) into flat, one dimension array.
     *
     * @param errors - list of errors
     * @param parentProperty - parent property name
     */
    flatMapDeep(errors, parentProperty) {
        return _.flattenDeep(errors.map((error) => {
            if (error.children && error.children.length > 0) {
                return this.flatMapDeep(error.children, parentProperty ? `${parentProperty}.${error.property}` : error.property);
            }
            else {
                return new FormValidationError(error, parentProperty);
            }
        }));
    }
}
__decorate([
    class_validator_1.ValidateNested()
], Form.prototype, "model", void 0);
exports.Form = Form;
