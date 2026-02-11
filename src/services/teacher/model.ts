import type { WORKING_DAYS_ENUM } from "../core";

export interface TeacherModel {
    id: number | null;
    fullName: string;
    shortName: string;
    subjects: number[];
    availabilities: AvailabilityModel[];
    createdDate: string,
    updatedDate: string;
    lastModifiedDate: string,
}

export interface AvailabilityModel {
    dayOfWeek: WORKING_DAYS_ENUM[];
    lessons: number[];
}

export interface TeacherSubjectModel {
    id: number | null;
    shortName: string;
    name: string;
    availabilities: AvailabilityModel[];
    emoji: string;
    color: string;
    weight: number;
}