import { type CompanyModel } from './model'
import { axiosInstance,type BaseError } from '@/services/network'


export async function getCompany_API(): Promise<[BaseError, null] | [null, CompanyModel]> {
    try {
        const response = <CompanyModel> await axiosInstance.get('/v1/company')
        
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}


export async function updateCompany_API(payload: CompanyModel): Promise<[null, CompanyModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.put('/v1/company', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}