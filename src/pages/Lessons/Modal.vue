<script lang="ts" setup>
import { ref } from 'vue';
import { useRules } from "./rules";
import { SCHOOL_WORKING_DAYS } from '@/utils';
import { getRoomsAll_API } from '@/services/room';
import { getClassesAll_API } from '@/services/class';
import { getTeachersAll_API } from '@/services/teacher';
import { getSubjectsAll_API } from '@/services/subject';
import { createLesson_API, getLesson_DEFAULT, updateLesson_API, type LessonModel } from '@/services/lessons';

const _formRef = ref();
const rules = useRules();
const _visible = ref(false);
const _loading = ref(false);
const emit = defineEmits(['update']);
const _formData = ref<LessonModel>(getLesson_DEFAULT());

const _rooms = ref<any[]>([]);
const _classes = ref<any[]>([]);
const _subjects = ref<any[]>([]);
const _teachers = ref<any[]>([]);

const periods = Array.from({ length: 10 }, (_, i) => i + 1);

// --- MODAL OPEN MANTIQI (YANGILANDI) ---
// defaults: { classId: 1, teacherId: 5 ... } kabi obyekt qabul qiladi
async function open(item: any | null, defaults: Partial<LessonModel> = {}) {
  _visible.value = true;
  
  // Ma'lumotlarni yuklash (agar hali yuklanmagan bo'lsa)
  if (_classes.value.length === 0) {
      _loading.value = true;
      await loadDropdownData();
      _loading.value = false;
  }

  if (item) {
    // Tahrirlash (Edit) holati
    _formData.value = {
        ...JSON.parse(JSON.stringify(item)),
        classId: item.class?.id || item.classId,
        subjectId: item.subject?.id || item.subjectId,
        teacherId: item.teacher?.id || item.teacherId,
        rooms: item.rooms?.map((r: any) => r.id) || item.roomIds || [] 
    };
  } else {
    // Yangi qo'shish (Add) holati, defaults ni qo'llaymiz
    _formData.value = {
        ...getLesson_DEFAULT(),
        ...defaults // <-- Asosiy fokus shu yerda
    };
  }
}

async function loadDropdownData() {
    const [classRes, subjectRes, teacherRes, roomRes] = await Promise.all([
      getClassesAll_API(),
      getSubjectsAll_API(),
      getTeachersAll_API(),
      getRoomsAll_API()
    ]);

    // Odatda api dan { content: [...] } keladi, o'zgaruvchiga moslab yozish kerak
    // Sizdagi yozilish usuliga ko'ra yozdim
    if (!classRes[0] && classRes[1]) _classes.value = (classRes[1] as any).content || classRes[1];
    if (!subjectRes[0] && subjectRes[1]) _subjects.value = (subjectRes[1] as any).content || subjectRes[1];
    if (!teacherRes[0] && teacherRes[1]) _teachers.value = (teacherRes[1] as any).content || teacherRes[1];
    if (!roomRes[0] && roomRes[1]) _rooms.value = (roomRes[1] as any).content || roomRes[1];
}

function close() {
  _visible.value = false;
  _formRef.value?.resetFields();
  _formData.value = getLesson_DEFAULT();
}

async function submit() {
  _formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      _loading.value = true;
      const handler = _formData.value.id ? updateLesson_API : createLesson_API;
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
  <el-dialog v-model="_visible" :title="_formData.id ? 'Darsni tahrirlash' : 'Yangi dars qo\'shish'" width="650px" @close="close">
    <el-form ref="_formRef" :model="_formData" :rules="rules" label-position="top">
      
      <div class="grid grid-cols-2 gap-4 mb-2">
        <el-form-item label="Sinf" prop="classId">
          <el-select v-model="_formData.classId" placeholder="Sinfni tanlang" class="compact-input w-full" filterable>
            <el-option v-for="item in _classes" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="Fan" prop="subjectId">
          <el-select v-model="_formData.subjectId" placeholder="Fanni tanlang" class="compact-input w-full" filterable>
            <el-option v-for="item in _subjects" :key="item.id" :label="item.name" :value="item.id">
                <div class="flex items-center gap-2">
                    <span>{{ item.emoji }}</span>
                    <span>{{ item.name }}</span>
                </div>
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-2">
        <el-form-item label="O'qituvchi" prop="teacherId">
            <el-select v-model="_formData.teacherId" placeholder="O'qituvchini tanlang" class="compact-input w-full" filterable>
            <el-option v-for="item in _teachers" :key="item.id" :label="item.fullName" :value="item.id">
                <div class="flex items-center gap-2">
                    <div class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 border">
                        {{ item.fullName?.charAt(0) }}
                    </div>
                    <span class="truncate">{{ item.fullName }}</span>
                </div>
            </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="Xonalar" prop="roomIds">
            <el-select v-model="_formData.roomIds" multiple collapse-tags placeholder="Xonani tanlang" class="compact-input w-full" filterable>
            <el-option v-for="item in _rooms" :key="item.id" :label="item.name" :value="item.id">
                <div class="flex items-center justify-between w-full">
                    <span>{{ item.name }}</span>
                    <span class="text-xs text-gray-400">{{ item.capacity ? item.capacity + ' o\'rin' : '' }}</span>
                </div>
            </el-option>
            </el-select>
        </el-form-item>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-2">
        <el-form-item label="Hafta kuni" prop="dayOfWeek">
          <el-select v-model="_formData.dayOfWeek" placeholder="Kun" class="compact-input w-full" clearable>
            <el-option v-for="day in SCHOOL_WORKING_DAYS" :key="day.key" :label="day.label" :value="day.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="Dars soati" prop="period">
          <el-select v-model="_formData.period" placeholder="Soat" class="compact-input w-full" clearable>
             <el-option v-for="p in periods" :key="p" :label="p + '-soat'" :value="p" />
          </el-select>
        </el-form-item>

        <el-form-item label="Soni (Haftalik)" prop="lessonCount">
           <el-input-number v-model="_formData.lessonCount" :min="1" :max="10" controls-position="right" class="!w-full compact-input" />
        </el-form-item>
      </div>
      
      <div class="flex justify-end gap-2 pt-4 mt-2 border-t border-gray-50">
        <el-button size="default" class="!rounded-lg !h-9 !px-6" @click="close">Bekor qilish</el-button>
        <el-button type="primary" class="!rounded-lg !h-9 !px-6" :loading="_loading" @click="submit">{{ _formData.id ? 'Saqlash' : 'Qo\'shish' }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>