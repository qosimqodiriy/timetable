import type { AvailabilityModel } from "../teacher";

export enum ROOM_TYPE_ENUM {
    SHARED = "SHARED",
    SPECIAL = "SPECIAL",
}

export const ROOM_TYPE = new Map<ROOM_TYPE_ENUM, string>()
ROOM_TYPE.set(ROOM_TYPE_ENUM.SHARED, 'Umumiy')
ROOM_TYPE.set(ROOM_TYPE_ENUM.SPECIAL, 'Maxsus')


export interface RoomModel {
    id: number;
    name: string;
    shortName: string;
    type: ROOM_TYPE_ENUM | string | null;
    building: any | null;
    buildingId?: number | null;
    availabilities: AvailabilityModel[] | null;
    createdDate?: string;
    updatedDate?: string;
}