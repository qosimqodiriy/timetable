import { type ProfileModel } from "./model";
import { axiosInstance } from "../network/axios";
import type { BaseError } from "../network/model";


export async function getProfile_API(): Promise<[BaseError, null] | [null, ProfileModel]> {
    try {
        const response = <ProfileModel> await axiosInstance.get('users/v1/users/me')
        
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}