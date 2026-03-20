import { randomUUID } from 'crypto';

/**
 * Test data factory for creating claim and response payloads.
 * Based on src/integration-test/data/test-data.ts but without CodeceptJS dependency.
 */

const CLAIM_FEE = 35.0;

export function buildClaimData(defendantEmail: string): object {
  return {
    claimants: [
      {
        type: 'individual',
        name: 'Mr. John Smith',
        title: 'Mr.',
        firstName: 'John',
        lastName: 'Smith',
        address: {
          line1: '10, DALBERG ROAD',
          line2: 'Brixton',
          city: 'LONDON',
          postcode: 'SW2 1AN',
        },
        correspondenceAddress: {
          line1: '234 Acacia Road',
          line2: 'a really cool place',
          city: 'Edinburgh',
          postcode: 'G72 7ZY',
        },
        phone: '07700000001',
        dateOfBirth: '1982-07-26',
      },
    ],
    defendants: [
      {
        type: 'individual',
        name: 'Mrs. Rose Smith',
        title: 'Mrs.',
        firstName: 'Rose',
        lastName: 'Smith',
        address: {
          line1: '11 Dalberg road',
          line2: 'Brixton',
          city: 'London',
          postcode: 'SW2 1AN',
        },
        phone: '07700000002',
        email: defendantEmail,
        dateOfBirth: '1982-07-26',
      },
    ],
    payment: {
      amount: CLAIM_FEE * 100,
      reference: `RC-${Date.now()}-0001`,
      status: 'success',
    },
    feeAmountInPennies: CLAIM_FEE * 100,
    amount: {
      type: 'breakdown',
      rows: [
        { reason: 'Goods purchased', amount: 10.0 },
        { reason: 'Services rendered', amount: 20.5 },
        { reason: 'Miscellaneous costs', amount: 50.0 },
      ],
    },
    interest: {
      type: 'no interest',
    },
    reason:
      'My reasons for the claim are that I am owed this money for a variety of reason, these being...',
    timeline: { rows: [{ date: 'May 2024', description: 'Agreement was made' }] },
    externalId: randomUUID(),
  };
}

export function buildResponseData(): object {
  return {
    responseType: 'FULL_DEFENCE',
    defenceType: 'DISPUTE',
    defendant: {
      type: 'individual',
      name: 'Mrs. Rose Smith',
      title: 'Mrs.',
      firstName: 'Rose',
      lastName: 'Smith',
      address: {
        line1: '11 Dalberg road',
        line2: 'Brixton',
        city: 'London',
        postcode: 'SW2 1AN',
      },
      phone: '07700000002',
      dateOfBirth: '1982-07-26',
    },
    moreTimeNeeded: 'no',
    freeMediation: 'no',
    defence: 'I fully dispute this claim',
  };
}

/**
 * Generate a unique test email to avoid collisions between parallel CI runs.
 */
export function generateTestEmail(prefix: string): string {
  const random = Math.random().toString(36).substring(2, 9);
  return `civilmoneyclaims+${prefix}-${random}@gmail.com`;
}
