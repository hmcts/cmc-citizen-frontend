import { test, expect } from '@playwright/test';
import { config } from '../../helpers/env-config';
import { IdamHelper } from '../../helpers/idam-helper';
import { ClaimStoreHelper } from '../../helpers/claim-store-helper';
import { buildClaimData, buildResponseData, generateTestEmail } from '../../helpers/test-data-helper';

/**
 * Claim Lifecycle API test.
 *
 * References:
 *   civil-citizen-ui/src/test/functionalTests/tests/api_tests/ - API test pattern
 *   civil-citizen-ui/src/test/functionalTests/specClaimHelpers/api/idamHelper.js - IDAM auth via /loginUser
 *   cmc-citizen-frontend/src/integration-test/helpers/claimStoreHelper.ts - claim-store API flow
 *   cmc-citizen-frontend/src/integration-test/helpers/clients/claimStoreClient.ts - endpoints
 *
 * Flow:
 *   1. Create claimant & defendant users via IDAM /testing-support/accounts
 *   2. Auth via /loginUser, get userId via /o/userinfo
 *   3. Create claim via POST /claims/{submitterId}
 *   4. Retrieve claims via GET /claims/claimant/{userId}
 *   5. Link defendant via PUT /testing-support/claims/{ref}/defendant
 *   6. Defendant responds via POST /responses/claim/{externalId}/defendant/{defendantId}
 *   7. Verify claim has response attached
 */
test.describe.serial('Claim Lifecycle - Create, Respond, Verify', () => {

  const claimantEmail = generateTestEmail('pw-claimant');
  const defendantEmail = generateTestEmail('pw-defendant');

  let claimantToken: string;
  let defendantToken: string;
  let claimantId: string;
  let defendantId: string;
  let claimReferenceNumber: string;
  let claimExternalId: string;

  test.beforeAll(async () => {
    // Create test users
    await IdamHelper.createUser(claimantEmail, 'citizen');
    await IdamHelper.createUser(defendantEmail, 'citizen');

    // Auth via /loginUser - same as civil-citizen-ui idamHelper.js:13
    claimantToken = await IdamHelper.authenticateUser(claimantEmail);
    defendantToken = await IdamHelper.authenticateUser(defendantEmail);

    // Get user IDs via /o/userinfo - same as civil-citizen-ui idamHelper.js:77
    claimantId = await IdamHelper.getUserId(claimantToken);
    defendantId = await IdamHelper.getUserId(defendantToken);

    // Add consent role - same as bootstrap.ts:105
    await ClaimStoreHelper.addRoleToUser(claimantToken, 'cmc-new-features-consent-given');
    await ClaimStoreHelper.addRoleToUser(defendantToken, 'cmc-new-features-consent-given');
  });

  test.afterAll(async () => {
    await IdamHelper.deleteUser(claimantEmail);
    await IdamHelper.deleteUser(defendantEmail);
  });

  test('Claimant creates a claim', async () => {
    // POST /claims/{submitterId} - same as claimStoreClient.ts:61
    const claimData = buildClaimData(defendantEmail);
    const claim = await ClaimStoreHelper.createClaim(claimData, claimantToken, claimantId);

    expect(claim).toBeDefined();
    expect(claim.referenceNumber).toBeDefined();
    expect(claim.externalId).toBeDefined();

    claimReferenceNumber = claim.referenceNumber;
    claimExternalId = claim.externalId;
    console.log('Claim created:', claimReferenceNumber);
  });

  test('Claim is retrievable and data is correct', async () => {
    expect(claimReferenceNumber).toBeDefined();

    // Allow CCD async processing
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // GET /claims/claimant/{userId} - retrieves all claims for this user
    const claims = await ClaimStoreHelper.getClaimsByClaimant(claimantId, claimantToken);
    expect(claims.length).toBeGreaterThan(0);

    const claim = claims.find((c: any) => c.referenceNumber === claimReferenceNumber);
    expect(claim).toBeDefined();
    expect(claim.claim).toBeDefined();
    expect(claim.claim.claimants).toHaveLength(1);
    expect(claim.claim.defendants).toHaveLength(1);
    expect(claim.claim.claimants[0].name).toBe('Mr. John Smith');
    expect(claim.claim.defendants[0].name).toBe('Mrs. Rose Smith');

    // Use the externalId from the persisted claim
    claimExternalId = claim.externalId;
  });

  test('Defendant is linked to the claim', async () => {
    expect(claimReferenceNumber).toBeDefined();

    // PUT /testing-support/claims/{ref}/defendant - same as claimStoreHelper.ts:33
    await ClaimStoreHelper.linkDefendant(
      claimReferenceNumber,
      defendantEmail,
      config.defaultPassword
    );
  });

  test('Defendant submits full defence response', async () => {
    expect(claimExternalId).toBeDefined();

    // POST /responses/claim/{externalId}/defendant/{defendantId} - same as claimStoreClient.ts:101
    const responseData = buildResponseData();
    const result = await ClaimStoreHelper.respondToClaim(
      claimExternalId,
      responseData,
      defendantToken,
      defendantId
    );

    expect(result).toBeDefined();
  });

  test('Claim has defendant response attached', async () => {
    expect(claimReferenceNumber).toBeDefined();

    const claims = await ClaimStoreHelper.getClaimsByClaimant(claimantId, claimantToken);
    const claim = claims.find((c: any) => c.referenceNumber === claimReferenceNumber);

    expect(claim).toBeDefined();
    expect(claim.response).toBeDefined();
    expect(claim.response.responseType).toBe('FULL_DEFENCE');
    expect(claim.response.defenceType).toBe('DISPUTE');
    expect(claim.response.defence).toBe('I fully dispute this claim');
    expect(claim.respondedAt).toBeDefined();
    console.log('Defendant responded at:', claim.respondedAt);
  });
});
