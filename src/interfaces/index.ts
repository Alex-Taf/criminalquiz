export interface ISignInResponse {
    data: {
        message: string,
        username: string,
        token: string
    },
    decoded: {
        exp: number,
        iat: number,
        login: string,
        password: string
    }
}

export interface IUserData {
    initials: string,
    login: string,
    username: string
}
