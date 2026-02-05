import type { ProfileModel } from "./model";


export function getProfile_DEFAULT(): ProfileModel {
    const item: ProfileModel = {
        userId: "",
        email: "",
        name: "",
        image: "",
        sessionId: "",
    }

    return item
}