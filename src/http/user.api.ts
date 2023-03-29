import { $host, $authHost } from "."
import jwt_decode from 'jwt-decode'
import { getInitials } from "../utils"
import { ISignInResponse, IUserData } from "../interfaces"

class UserAPI {
    private _profileData: IUserData
    private _signInResponse: ISignInResponse
    
    async registration(login: string, username: string, password: string) {
        const { data } = await $host.post('api/auth/signup', { login, username, password })
        return { message: data.message, isSignUp: data.isSignUp } 
    }

    async login(login: string, password: string) {
        const { data } = await $host.post('api/auth/signin', { login, password })
        this.saveToken(data.token)
        this._writeResponseData({ data, decoded: jwt_decode(data.token) })
        this._writeProfileData({ data, decoded: jwt_decode(data.token) })
        return this._signInResponse
    }

    // async check() {
    //     const { data } = await $authHost.get('api/auth/auth')
    //     localStorage.setItem('token', data.token)
    //     return { data, decoded: jwt_decode(data.token) } as ISignInResponse
    // }

    private _writeResponseData(response: ISignInResponse) {
        this._signInResponse = response
    }

    private _writeProfileData(response: ISignInResponse) {
        console.log(response.data)
        this._profileData = {
            id: response.data.id,
            initials: getInitials(response.data.username),
            login: response.decoded.login,
            username: response.data.username
        }
    }

    saveToken(token: string) {
        localStorage.setItem('token', token)
    }

    get token() {
        return localStorage.getItem('token')
    }

    purgeToken() {
        localStorage.removeItem('token')
    }

    saveToStorage() {
        localStorage.setItem("userId", this._profileData.id)
        localStorage.setItem("login", this._profileData.login)
        localStorage.setItem("username", this._profileData.username)
        localStorage.setItem("initials", this._profileData.initials)
    }

    get storageUserData() {
        return {
            id: localStorage.getItem("userId"),
            login: localStorage.getItem("login"),
            username: localStorage.getItem("username"),
            initials: localStorage.getItem("initials")
        }
    }

    purgeFromStorage() {
        localStorage.removeItem("userId")        
        localStorage.removeItem("login")
        localStorage.removeItem("username")
        localStorage.removeItem("initials")
    }
}

const userAPI = new UserAPI() 

export { userAPI }
