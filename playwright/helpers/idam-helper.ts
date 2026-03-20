import { config } from './env-config';

/**
 * IDAM helper for user management and authentication.
 * Follows the same pattern as:
 *   civil-citizen-ui/src/test/functionalTests/specClaimHelpers/api/idamHelper.js
 * Uses /loginUser endpoint (simpler than OAuth2 authorize flow, works from local).
 */
export class IdamHelper {
  private static get idamUrl(): string {
    return config.idamUrl;
  }

  /**
   * Create user account via IDAM testing-support.
   * Same as cmc idamClient.ts:32 createUser()
   */
  static async createUser(
    email: string,
    role: string = 'citizen',
    password?: string
  ): Promise<void> {
    const pwd = password || config.defaultPassword;

    const response = await fetch(`${this.idamUrl}/testing-support/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        forename: 'John',
        surname: 'Smith',
        levelOfAccess: 0,
        roles: [{ code: role }],
        activationDate: '',
        lastAccess: '',
        password: pwd,
      }),
    });

    if (!response.ok && response.status !== 409) {
      throw new Error(`Failed to create user ${email}: ${response.status} ${await response.text()}`);
    }
  }

  /**
   * Get access token using /loginUser endpoint.
   * Same as civil-citizen-ui idamHelper.js:13 getAccessTokenFromIdam()
   * Simpler than OAuth2 authorize+token flow. Works from local and CI.
   */
  static async authenticateUser(
    email: string,
    password?: string
  ): Promise<string> {
    const pwd = password || config.defaultPassword;

    const response = await fetch(
      `${this.idamUrl}/loginUser?username=${encodeURIComponent(email)}&password=${encodeURIComponent(pwd)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to authenticate user ${email}: ${response.status} ${await response.text()}`
      );
    }

    const data = (await response.json()) as { access_token: string };
    return data.access_token;
  }

  /**
   * Get user ID using /o/userinfo endpoint.
   * Same as civil-citizen-ui idamHelper.js:77 userId()
   */
  static async getUserId(token: string): Promise<string> {
    const response = await fetch(`${this.idamUrl}/o/userinfo`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.status}`);
    }

    const data = (await response.json()) as { uid: string; email: string };
    return data.uid;
  }

  /**
   * Get full user details from /details endpoint.
   * Same as cmc idamClient.ts:209 retrieveUser()
   */
  static async getUserDetails(token: string): Promise<{ id: string; email: string; roles: string[] }> {
    const response = await fetch(`${this.idamUrl}/details`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user details: ${response.status}`);
    }

    return response.json() as Promise<{ id: string; email: string; roles: string[] }>;
  }

  static async deleteUser(email: string): Promise<void> {
    try {
      await fetch(`${this.idamUrl}/testing-support/accounts/${email}`, {
        method: 'DELETE',
      });
    } catch {
      console.log(`Warning: failed to delete user ${email}`);
    }
  }
}
