import { useStorage } from "@vueuse/core";
import { getCompany_DEFAULT, type CompanyModel } from "@/services/company";

export const _language = useStorage('_language', 'uz')
export const _menubar = useStorage('_menubar', () => false);
export const _openMenubar = useStorage('_openMenubar', () => true);
export const _companyStore = useStorage('_companyStore', () => getCompany_DEFAULT());
