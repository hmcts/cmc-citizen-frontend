/* tslint:disable:no-unused-expression */
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'
import { mockReq as req, mockRes as res } from 'sinon-express-mock'
import { IsDefined } from 'class-validator'

import { FormValidator } from 'app/forms/validation/formValidator'

chai.use(spies)

class Person {
  @IsDefined({ message: 'Name is required' })
  name?: string

  constructor (name?: string) {
    this.name = name
  }

  static fromObject (value?: any): Person {
    if (value == null) {
      return value
    }
    return new Person(value.name)
  }

}

describe('FormValidator', () => {
  const next = (e?: any): void => {
    return void 0
  }

  it('should deserialize request body to class instance using default mapper', () => {
    req.body = { name: 'John Smith' }

    FormValidator.requestHandler(Person)(req, res, next)

    chai.expect(req.body.model).to.be.instanceof(Person)
    chai.expect(req.body.model.name).to.be.equal('John Smith')
  })

  it('should deserialize request body to class instance using custom mapper', () => {
    req.body = { name: 'John Smith' }

    FormValidator.requestHandler(Person, Person.fromObject)(req, res, next)

    chai.expect(req.body.model).to.be.instanceof(Person)
    chai.expect(req.body.model.name).to.be.equal('John Smith')
  })

  it('should validate deserialized object', () => {
    req.body = {}

    FormValidator.requestHandler(Person)(req, res, next)

    chai.expect(req.body.errors.length).to.be.equal(1)
    chai.expect(req.body.errors[0].property).to.be.equal('name')
    chai.expect(req.body.errors[0].message).to.be.equal('Name is required')
  })

  it('should not validate deserialized object when action is whitelisted', () => {
    req.body = { action: { reload: 'Reload page' } }

    FormValidator.requestHandler(Person, null, ['reload'])(req, res, next)

    chai.expect(req.body.errors.length).to.be.equal(0)
  })

  it('should pass control to the next middleware', () => {
    const spy = sinon.spy(next)

    FormValidator.requestHandler(Person)(req, res, spy)

    chai.expect(spy).to.have.been.called
  })
})
