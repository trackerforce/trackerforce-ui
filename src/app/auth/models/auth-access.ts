export class AuthAccess {
    access: Access;
    token: string;
    refreshToken: string;

    constructor(
        access: Access,
        token: string,
        refreshToken: string
    ) {
        this.access = access;
        this.token = token;
        this.refreshToken = refreshToken;
    }
}

export class Access {
    id: string;
    email: string;
    organization: Organzation;

    constructor(
        id: string,
        email: string,
        organization: Organzation
    ) {
        this.id = id;
        this.email = email;
        this.organization = organization;
    }
}

export class Organzation {
    name: string | undefined;
    alias: string | undefined;

    constructor(
        name: string,
        alias: string
    ) {
        this.name = name;
        this.alias = alias;
    }
}