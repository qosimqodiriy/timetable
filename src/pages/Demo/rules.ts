import { ref } from "vue"
import { useI18n } from "vue-i18n";
import type { FormRules } from 'element-plus'


export const useRules = () => {
  const { t } = useI18n();

  const rules = ref<FormRules>({
    role: [{ required: true, message: t("fieldIsRequired"), trigger: "blur" }],
    email: [{ required: true, message: t("fieldIsRequired"), trigger: "blur" }],
  });

  return rules;
};