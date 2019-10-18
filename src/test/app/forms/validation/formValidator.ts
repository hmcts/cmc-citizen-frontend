  /* tslint:disable:no-unused-expression */
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'
import { mockReq as req, mockRes as res } from 'sinon-express-mock'
import { IsDefined } from '@hmcts/class-validator'

import { FormValidator } from 'forms/validation/formValidator'

chai.use(spies)

class Party {
  @IsDefined({ message: 'Name is required' })
  name?: string

  constructor (name?: string) {
    this.name = name
  }

  static fromObject (value?: any): Party {
    if (value == null) {
      return value
    }
    return new Party(value.name)
  }

}

describe('FormValidator', () => {
  const next = (e?: any): void => {
    return void 0
  }

  it('should deserialize request body to class instance using default mapper', async () => {
    req.body = { name: 'John Smith' }

    await FormValidator.requestHandler(Party)(req, res, next)

    chai.expect(req.body.model).to.be.instanceof(Party)
    chai.expect(req.body.model.name).to.be.equal('John Smith')
  })

  it('should deserialize request body to class instance using custom mapper', async () => {
    req.body = { name: 'John Smith' }

    await FormValidator.requestHandler(Party, Party.fromObject)(req, res, next)

    chai.expect(req.body.model).to.be.instanceof(Party)
    chai.expect(req.body.model.name).to.be.equal('John Smith')
  })

  it('should strip control characters from all string values', async () => {
    req.body = {
      someString: 'abc\f\ndef',
      someArray: [
        'as\vdf',
        'ghjk\b'
      ],
      someObject: {
        someProperty: 'z\x1Bxc\x1Av',
        someOtherProperty: 'tyu\ri'
      }
    }

    await FormValidator.requestHandler(Object)(req, res, next)

    chai.expect(req.body.model).to.deep.equal({
      someString: 'abc\ndef',
      someArray: [
        'asdf',
        'ghjk'
      ],
      someObject: {
        someProperty: 'zxcv',
        someOtherProperty: 'tyu\ri'
      }
    })
  })

  it('should validate deserialized object', async () => {
    req.body = {}

    await FormValidator.requestHandler(Party)(req, res, next)

    chai.expect(req.body.errors.length).to.be.equal(1)
    chai.expect(req.body.errors[0].property).to.be.equal('name')
    chai.expect(req.body.errors[0].message).to.be.equal('Name is required')
  })

  it('should not validate deserialized object when action is whitelisted', () => {
    req.body = { action: { reload: 'Reload page' } }

    FormValidator.requestHandler(Party, null, undefined, ['reload'])(req, res, next)

    chai.expect(req.body.errors.length).to.be.equal(0)
  })

  it('should pass control to the next middleware', async () => {
    const spy = sinon.spy(next)

    await FormValidator.requestHandler(Party)(req, res, spy)

    chai.expect(spy).to.have.been.called
  })
})
