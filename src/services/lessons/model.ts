import type { ClassModel } from "../class";
import type { FREQUENCY_TYPE_ENUM, WORKING_DAYS_ENUM } from "../core";
import type { RoomModel } from "../room";

export interface LessonModel {
    id: number | null;
    classId: number[];
    class: ClassModel;
    teacherId: number;
    rooms: RoomModel[];
    roomIds: number[];
    subjectId: number;
    lessonCount: number;
    dayOfWeek: WORKING_DAYS_ENUM | string;
    hour: number;
    frequency: FREQUENCY_TYPE_ENUM | string;
    period: number;
}