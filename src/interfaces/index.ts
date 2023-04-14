export interface ISignInResponse {
    data: {
        id: string,
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
    id: string,
    initials: string,
    login: string,
    username: string
}
