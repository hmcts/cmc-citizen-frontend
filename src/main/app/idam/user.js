"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(id, email, forename, surname, roles, group, bearerToken) {
        this.id = id;
        this.email = email;
        this.forename = forename;
        this.surname = surname;
        this.roles = roles;
        this.group = group;
        this.bearerToken = bearerToken;
    }
    isInRoles(...requiredRoles) {
        return requiredRoles.every(requiredRole => this.roles.indexOf(requiredRole) > -1);
    }
    getLetterHolderIdList() {
        return this.roles
            .filter((role) => role.startsWith('letter') &&
            role !== 'letter-holder' &&
            !role.endsWith('loa1'))
            .map(role => role.replace('letter-', ''));
    }
}
exports.User = User;
