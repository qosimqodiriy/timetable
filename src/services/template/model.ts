import type { AvailabilityModel } from "../teacher";

export interface TemplateModel {
    id: number | null;
    class: string;
    subject: string;
    availability: AvailabilityModel[];
}