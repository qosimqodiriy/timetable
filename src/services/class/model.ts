import type { RoomModel } from "../room";
import type { AvailabilityModel, TeacherModel } from "../teacher";

export interface ClassModel {
    id: number | null;
    availabilities: AvailabilityModel[];
    createdDate: Date | string;
    name: string;
    rooms: RoomModel[];
    shortName: string;
    teacher: TeacherModel;
    teacherId: number | null;
}