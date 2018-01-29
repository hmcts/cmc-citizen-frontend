export class User {
  id: string
  email: string
  forename: string
  surname: string
  roles: string[]
  group: string
  bearerToken: string

  constructor (id: string,
               email: string,
               forename: string,
               surname: string,
               roles: string[],
               group: string,
               bearerToken: string) {
    this.id = id
    this.email = email
    this.forename = forename
    this.surname = surname
    this.roles = roles
    this.group = group
    this.bearerToken = bearerToken
  }

  isInRoles (...requiredRoles: string[]): boolean {
    return requiredRoles.every(requiredRole => this.roles.indexOf(requiredRole) > -1)
  }

  getLetterHolderIdList (): string[] {
    return this.roles
      .filter(
        (role: string) =>
          role.startsWith('letter') &&
          role !== 'letter-holder' &&
          !role.endsWith('loa1')
      )
      .map(role => role.replace('letter-', ''))
  }
}
