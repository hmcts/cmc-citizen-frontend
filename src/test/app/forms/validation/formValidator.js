"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai = require("chai");
const sinon = require("sinon");
const spies = require("sinon-chai");
const sinon_express_mock_1 = require("sinon-express-mock");
const class_validator_1 = require("@hmcts/class-validator");
const formValidator_1 = require("forms/validation/formValidator");
chai.use(spies);
class Party {
    constructor(name) {
        this.name = name;
    }
    static fromObject(value) {
        if (value == null) {
            return value;
        }
        return new Party(value.name);
    }
}
__decorate([
    class_validator_1.IsDefined({ message: 'Name is required' })
], Party.prototype, "name", void 0);
describe('FormValidator', () => {
    const next = (e) => {
        return void 0;
    };
    it('should deserialize request body to class instance using default mapper', async () => {
        sinon_express_mock_1.mockReq.body = { name: 'John Smith' };
        await formValidator_1.FormValidator.requestHandler(Party)(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, next);
        chai.expect(sinon_express_mock_1.mockReq.body.model).to.be.instanceof(Party);
        chai.expect(sinon_express_mock_1.mockReq.body.model.name).to.be.equal('John Smith');
    });
    it('should deserialize request body to class instance using custom mapper', async () => {
        sinon_express_mock_1.mockReq.body = { name: 'John Smith' };
        await formValidator_1.FormValidator.requestHandler(Party, Party.fromObject)(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, next);
        chai.expect(sinon_express_mock_1.mockReq.body.model).to.be.instanceof(Party);
        chai.expect(sinon_express_mock_1.mockReq.body.model.name).to.be.equal('John Smith');
    });
    it('should strip control characters from all string values', async () => {
        sinon_express_mock_1.mockReq.body = {
            someString: 'abc\f\ndef',
            someArray: [
                'as\vdf',
                'ghjk\b'
            ],
            someObject: {
                someProperty: 'z\x1Bxc\x1Av',
                someOtherProperty: 'tyu\ri'
            }
        };
        await formValidator_1.FormValidator.requestHandler(Object)(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, next);
        chai.expect(sinon_express_mock_1.mockReq.body.model).to.deep.equal({
            someString: 'abc\ndef',
            someArray: [
                'asdf',
                'ghjk'
            ],
            someObject: {
                someProperty: 'zxcv',
                someOtherProperty: 'tyu\ri'
            }
        });
    });
    it('should validate deserialized object', async () => {
        sinon_express_mock_1.mockReq.body = {};
        await formValidator_1.FormValidator.requestHandler(Party)(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, next);
        chai.expect(sinon_express_mock_1.mockReq.body.errors.length).to.be.equal(1);
        chai.expect(sinon_express_mock_1.mockReq.body.errors[0].property).to.be.equal('name');
        chai.expect(sinon_express_mock_1.mockReq.body.errors[0].message).to.be.equal('Name is required');
    });
    it('should not validate deserialized object when action is whitelisted', () => {
        sinon_express_mock_1.mockReq.body = { action: { reload: 'Reload page' } };
        formValidator_1.FormValidator.requestHandler(Party, null, undefined, ['reload'])(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, next);
        chai.expect(sinon_express_mock_1.mockReq.body.errors.length).to.be.equal(0);
    });
    it('should pass control to the next middleware', async () => {
        const spy = sinon.spy(next);
        await formValidator_1.FormValidator.requestHandler(Party)(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, spy);
        chai.expect(spy).to.have.been.called;
    });
});
