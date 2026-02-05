export interface TimetableModel {
    id: number | null;
    taskId: number | null;
    name: string;
    scheduled: number | null;
    unscheduled: number | null;
    score: number | null;
    teacherGaps: number | null;
    classGaps: number | null;
    deleted: boolean;
    createdDate: Date | string | null;
}