import { axiosInstance } from "./axios"

export async function deleteItem(url: string): Promise<[any, any]> {
    try {
        const response = await axiosInstance.delete(url)
        return [null, response]
    } catch (error) {
        return [error, null]
    }
}