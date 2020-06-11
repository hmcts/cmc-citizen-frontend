"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai = require("chai");
const spies = require("sinon-chai");
const path = require("path");
const backend_1 = require("modules/i18n/backend");
const expect = chai.expect;
chai.use(spies);
describe('A gettext backend for i18next', () => {
    let backend;
    beforeEach(() => {
        backend = new backend_1.Backend(undefined, undefined);
    });
    it('should read all translations from PO file', function (done) {
        this.timeout(6000);
        backend.init(null, {
            loadPath: path.join(__dirname, 'fixtures/translation.po')
        });
        backend.read('cy', 'translation', (err, translation) => {
            expect(err).to.be.null;
            expect(translation).to.contain.all.keys({ 'Good morning': 'Bore da' });
            done();
        });
    });
    it('should fail with an error when file does not exist', function (done) {
        this.timeout(6000);
        backend.init(null, {
            loadPath: '/tmp/non-existing-file'
        });
        backend.read('cy', 'translation', (err, translation) => {
            expect(err).to.be.an('error');
            expect(translation).to.be.null;
            done();
        });
    });
});
