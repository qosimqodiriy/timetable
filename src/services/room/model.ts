import type { AvailabilityModel } from "../teacher";

export enum ROOM_TYPE_ENUM {
    SHARED = "SHARED",
    SPECIAL = "SPECIAL",
}

export interface RoomModel {
    id: number | null;
    name: string;
    shortName: string;
    type: string | null;
    building: any | null;
    buildingId?: number | null;
    availabilities: AvailabilityModel[];
}