import type { RoomModel } from "../room";
import type { AvailabilityModel, TeacherModel } from "../teacher";

export interface ClassModel {
    id: number;
    name: string;
    shortName: string;
    availabilities: AvailabilityModel[] | null;
    teacher: TeacherModel | null;
    teacherId?: number | null;
    rooms: RoomModel[] | null;
    groups: any[] | null;
    createdDate: string;
    updatedDate: string;
}