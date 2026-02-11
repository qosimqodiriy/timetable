import type { ClassModel } from "../class";
import type { RoomModel } from "../room";
import type { SubjectModel } from "../subject";
import type { TeacherModel } from "../teacher";
import type { FREQUENCY_TYPE_ENUM, WORKING_DAYS_ENUM } from "../core";


export interface LessonAllModel {
    classes: ClassModel[];
    lessons: LessonModel[];
    rooms: RoomModel[];
    subjects: SubjectModel[];
    teachers: TeacherModel[];
}


export interface LessonModel {
    id: number;
    classId: number | null;
    class: ClassModel;
    teacherId: number | null;
    subjectId: number | null;
    rooms: RoomModel[];
    roomIds: number[];
    groupId: number | null;
    groupDetails: any[];
    lessonCount: number;
    dayOfWeek: WORKING_DAYS_ENUM | string | null;
    hour: string | null;
    period: number | null;
    frequency: FREQUENCY_TYPE_ENUM | string | null;
    createdDate: string;
    updatedDate: string;
}