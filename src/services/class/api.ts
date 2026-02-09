import type { ClassModel } from './model'
import { axiosInstance,type BaseError, type BaseListModel, type BaseParamsModel } from '@/services/network'


export async function getClasses_API(params: BaseParamsModel): Promise<[BaseError, null] | [null, BaseListModel<ClassModel>]> {
    try {
        const response = <BaseListModel<ClassModel>> await axiosInstance.get('/classes/v1', {
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

export async function getClassesAll_API(): Promise<[BaseError, null] | [null, ClassModel[]]> {
    try {
        const response = <ClassModel[]> await axiosInstance.get('/classes/v1/all')
        
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}


export async function createClass_API(payload: ClassModel): Promise<[null, ClassModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.post('/classes/v1', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}

export async function updateClass_API(payload: ClassModel): Promise<[null, ClassModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.put(`/classes/v1/${payload.id}`, {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}