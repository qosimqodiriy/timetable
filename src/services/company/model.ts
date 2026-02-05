export interface CompanyModel {
    id: number | null;
    name: string;
    description: string;
    daysOfWeek: string[];
    periods: PeriodModel[];
    createdDate: Date | string;
    lastModifiedDate: Date | string;
}


export interface PeriodModel {
    name: string;
    startTime: string;
    endTime: string;
    duration: number | null;
    isBreak: boolean | null;
}