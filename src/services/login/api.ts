import { type LoginModel, type LoginResponseModel } from './model'
import { axiosInstance,type BaseError } from '@/services/network'


export async function postLogin_API(payload: LoginModel): Promise<[null, LoginResponseModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.post('/auth/v1/login/NO_TOKEN ', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}