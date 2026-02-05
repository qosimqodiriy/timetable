import type { RoomModel } from './model'
import { axiosInstance,type BaseError, type BaseListModel, type BaseParamsModel } from '@/services/network'


export async function getRooms_API(params: BaseParamsModel): Promise<[BaseError, null] | [null, BaseListModel<RoomModel>]> {
    try {
        const response = <BaseListModel<RoomModel>> await axiosInstance.get('/rooms/v1', {
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

export async function getRoomsAll_API(): Promise<[BaseError, null] | [null, RoomModel[]]> {
    try {
        const response = <RoomModel[]> await axiosInstance.get('/rooms/v1/all')
        
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}


export async function createRoom_API(payload: RoomModel): Promise<[null, RoomModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.post('/rooms/v1', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}

export async function updateRoom_API(payload: RoomModel): Promise<[null, RoomModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.put('/rooms/v1', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}