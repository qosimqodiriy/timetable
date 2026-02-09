import type { TeacherModel } from './model'
import { axiosInstance,type BaseError, type BaseListModel, type BaseParamsModel } from '@/services/network'


export async function getTeachers_API(params: BaseParamsModel): Promise<[BaseError, null] | [null, BaseListModel<TeacherModel>]> {
    try {
        const response = <BaseListModel<TeacherModel>> await axiosInstance.get('/teachers/v1', {
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



export async function getTeachersAll_API(): Promise<[BaseError, null] | [null, TeacherModel[]]> {
    try {
        const response = <TeacherModel[]> await axiosInstance.get('/teachers/v1/all')
        
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}


export async function createTeacher_API(payload: TeacherModel): Promise<[null, TeacherModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.post('/teachers/v1', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}

export async function updateTeacher_API(payload: TeacherModel): Promise<[null, TeacherModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.put(`/teachers/v1/${payload.id}`, {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}