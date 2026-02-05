<script lang="ts" setup>
import { ref } from 'vue';
import { useRules } from "./rules";
import { createSubject_API, getSubject_DEFAULT, updateSubject_API, type SubjectModel } from '@/services/subject';

const _formRef = ref();
const rules = useRules();
const _visible = ref(false);
const _loading = ref(false);
const emit = defineEmits(['update']);
const _formData = ref<SubjectModel>(getSubject_DEFAULT());

const predefineColors = ref([
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6',
]);

function open(item: SubjectModel | null) {
  _visible.value = true;
  if (item) _formData.value = JSON.parse(JSON.stringify(item));
}

function close() {
  _visible.value = false;
  _formRef.value?.resetFields();
  _formData.value = getSubject_DEFAULT();
}

async function submit() {
  _formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      _loading.value = true;
      const handler = _formData.value.id ? updateSubject_API : createSubject_API;
      const [error] = await handler(_formData.value);
      _loading.value = false;

      if (error) return;
      close();
      emit('update');
    }
  });
}

defineExpose({ open });
</script>

<template>
  <el-dialog v-model="_visible" :title="_formData.id ? 'Fanni tahrirlash' : 'Yangi fan'" width="600px" @close="close">
    <el-form ref="_formRef" :model="_formData" :rules="rules" label-position="top">
      <div class="grid grid-cols-3 gap-4 mb-2">
        <el-form-item label="Fan nomi" prop="name" class="col-span-2">
          <el-input v-model="_formData.name" placeholder="Masalan: Matematika" class="compact-input" />
        </el-form-item>

        <el-form-item label="Qisqa nom" prop="shortName" class="col-span-1">
          <el-input v-model="_formData.shortName" placeholder="MATEM" class="compact-input" />
        </el-form-item>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-4">
        <el-form-item label="Emoji" prop="emoji">
          <el-input v-model="_formData.emoji" placeholder="📐" class="compact-input text-center" />
        </el-form-item>

        <el-form-item label="Rang" prop="color">
          <div class="w-full flex items-center">
            <el-color-picker v-model="_formData.color" show-alpha :predefine="predefineColors" size="large" class="!w-full" />
          </div>
        </el-form-item>

        <el-form-item label="Yuklama (Ball)" prop="weight">
          <el-input-number v-model="_formData.weight" :min="1" :max="100" controls-position="right" class="!w-full compact-input" placeholder="0" />
        </el-form-item>
      </div>

      <div class="flex justify-end gap-2 pt-4 mt-2 border-t border-gray-50">
        <el-button size="default" class="!rounded-lg !h-9 !px-6" @click="close">Bekor qilish</el-button>
        <el-button type="primary" class="!rounded-lg !h-9 !px-6" :loading="_loading" @click="submit">{{ _formData.id ? 'Saqlash' : 'Qo\'shish' }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>