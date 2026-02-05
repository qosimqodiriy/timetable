export const SCHOOL_WORKING_DAYS = [
    { key: 'MONDAY', label: 'Dushanba' },
    { key: 'TUESDAY', label: 'Seshanba' },
    { key: 'WEDNESDAY', label: 'Chorshanba' },
    { key: 'THURSDAY', label: 'Payshanba' },
    { key: 'FRIDAY', label: 'Juma' },
    { key: 'SATURDAY', label: 'Shanba' },
    { key: 'SUNDAY', label: 'Yakshanba' },
] as const;

export const ALL_WORKING_DAY_KEYS = SCHOOL_WORKING_DAYS.map(day => day.key);