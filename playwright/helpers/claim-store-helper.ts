import { config } from './env-config';

/**
 * Claim Store API helper.
 * Follows the exact same flow as src/integration-test/helpers/clients/claimStoreClient.ts
 * and src/integration-test/helpers/claimStoreHelper.ts but uses native fetch.
 */
export class ClaimStoreHelper {
  private static get baseUrl(): string {
    return config.claimStoreUrl;
  }

  /**
   * POST /claims/{submitterId}
   * Same as ClaimStoreClient.create() in claimStoreClient.ts:61
   */
  static async createClaim(
    claimData: object,
    token: string,
    submitterId: string,
    features: string[] = ['admissions', 'directionsQuestionnaire']
  ): Promise<any> {
    const response = await fetch(`${this.baseUrl}/claims/${submitterId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Features: features.join(','),
      },
      body: JSON.stringify(claimData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create claim: ${response.status} ${await response.text()}`);
    }

    return response.json();
  }

  /**
   * GET /claims/{referenceNumber}
   * Same as ClaimStoreClient.retrieveByReferenceNumber() in claimStoreClient.ts:14
   */
  static async retrieveByReferenceNumber(referenceNumber: string, token: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/claims/${referenceNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to get claim ${referenceNumber}: ${response.status}`);
    }

    return response.json();
  }

  /**
   * GET /claims/claimant/{userId}
   * Retrieves all claims for a claimant by their userId.
   */
  static async getClaimsByClaimant(userId: string, token: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/claims/claimant/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to get claims for claimant ${userId}: ${response.status}`);
    }

    return response.json() as Promise<any[]>;
  }

  /**
   * PUT /testing-support/claims/{referenceNumber}/defendant
   * Same as claimStoreHelper.ts:33 linkDefendant()
   * Links the defendant user to the claim using testing-support endpoint.
   */
  static async linkDefendant(
    referenceNumber: string,
    defendantEmail: string,
    password: string
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/testing-support/claims/${referenceNumber}/defendant`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: defendantEmail, password }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to link defendant: ${response.status} ${await response.text()}`);
    }
  }

  /**
   * POST /responses/claim/{externalId}/defendant/{defendantId}
   * Same as ClaimStoreClient.respond() in claimStoreClient.ts:101
   */
  static async respondToClaim(
    externalId: string,
    responseData: object,
    token: string,
    defendantId: string
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/responses/claim/${externalId}/defendant/${defendantId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(responseData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to respond to claim: ${response.status} ${await response.text()}`);
    }

    return response.json();
  }

  /**
   * POST /user/roles
   * Same as ClaimStoreClient.addRoleToUser() in claimStoreClient.ts:126
   */
  static async addRoleToUser(token: string, role: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/user/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok && response.status !== 409) {
      throw new Error(`Failed to add role: ${response.status}`);
    }
  }

  /**
   * GET /claims/{referenceNumber}/metadata
   * Same as ClaimStoreClient.isOpen() in claimStoreClient.ts:33
   * Polls until claim state is OPEN (max 120 attempts, 500ms each = 60 seconds).
   * Note: metadata endpoint has no auth in the claim-store. Works in CI
   * where Jenkins agent is inside the cluster network.
   */
  static async waitForOpenClaim(referenceNumber: string): Promise<void> {
    const maxAttempts = 120;
    const intervalMs = 500;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(
          `${this.baseUrl}/claims/${referenceNumber}/metadata`
        );
        if (response.ok) {
          const data = (await response.json()) as { state: string };
          if (data.state === 'OPEN') {
            return;
          }
        }
      } catch {
        // retry on network errors
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    throw new Error(
      `Claim ${referenceNumber} did not become OPEN within ${maxAttempts * intervalMs / 1000}s`
    );
  }
}
