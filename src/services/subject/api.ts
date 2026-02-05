import type { SubjectModel } from './model'
import { axiosInstance,type BaseError, type BaseListModel, type BaseParamsModel } from '@/services/network'


export async function getSubjects_API(params: BaseParamsModel): Promise<[BaseError, null] | [null, BaseListModel<SubjectModel>]> {
    try {
        const response = <BaseListModel<SubjectModel>> await axiosInstance.get('/subjects/v1', {
            params: {
                ...params,
                page: params.page ? params.page - 1 : 0,
            }
        })
        
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}

export async function getSubjectsAll_API(): Promise<[BaseError, null] | [null, SubjectModel[]]> {
    try {
        const response = <SubjectModel[]> await axiosInstance.get('/subjects/v1/all')
        
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}


export async function createSubject_API(payload: SubjectModel): Promise<[null, SubjectModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.post('/subjects/v1', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}

export async function updateSubject_API(payload: SubjectModel): Promise<[null, SubjectModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.put('/subjects/v1', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}