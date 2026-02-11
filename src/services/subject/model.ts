import type { AvailabilityModel } from "../teacher";

export interface SubjectModel {
    id: number | null;
    name: string;
    shortName: string;
    emoji: string | null;
    color: string | null;
    weight: number | null;
    createdDate: string | Date;
    updatedDate: string | Date;
    availabilities: AvailabilityModel[] | null;
}