<script lang="ts" setup>
import { ref } from 'vue';
import { useRules } from "./rules";
import { createTeacher_API, getTeacher_DEFAULT, updateTeacher_API, type TeacherModel, type TeacherSubjectModel } from '@/services/teacher';

const _formRef = ref();
const rules = useRules();
const _visible = ref(false);
const _loading = ref(false);
const emit = defineEmits(['update']);
const _formData = ref<TeacherModel>(getTeacher_DEFAULT());


function open(item: TeacherModel | null) {
  _visible.value = true;
  if(item) _formData.value = JSON.parse(JSON.stringify(item));
}

function close() {
  _visible.value = false;
  _formRef.value?.resetFields();
}

async function submit() {
  _formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      _loading.value = true;
      const handler = _formData.value.id ? updateTeacher_API : createTeacher_API;
      const [error] = await handler(_formData.value);
      _loading.value = false;
      if(error) return;
      close(); emit('update');
    }
  });
}

defineExpose({ open });
</script>

<template>
  <el-dialog v-model="_visible" :title="_formData.id ? 'Tahrirlash' : 'Yangi o\'qituvchi'" width="680px" @close="close">
    <el-form ref="_formRef" :model="_formData" :rules="rules" label-position="top">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <el-form-item label="F.I.Sh" prop="fullName" class="!mb-2">
          <el-input v-model="_formData.fullName" placeholder="Ism familiya..." class="compact-input" />
        </el-form-item>

        <el-form-item label="Qisqa ism" prop="shortName" class="!mb-2">
          <el-input v-model="_formData.shortName" placeholder="A. Navoiy" class="compact-input flex-auto" />
        </el-form-item>
      </div>
      
      <div class="flex justify-end gap-2 pt-2">
        <el-button size="default" class="!rounded-lg !h-9 !px-6" @click="close">Bekor qilish</el-button>
        <el-button type="primary" class="!rounded-lg !h-9 !px-6 !bg-green-600 !border-green-600" :loading="_loading" @click="submit">{{ _formData.id ? 'O\'qituvchini yangilash' : 'O\'qituvchini saqlash' }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>