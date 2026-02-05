<script lang="ts" setup>
import { ref } from 'vue';
import { useRules } from "./rules";
import { SCHOOL_WORKING_DAYS } from '@/utils/constants'; // utils yo'lini tekshiring
import { createTeacher_API, getTeacher_DEFAULT, updateTeacher_API, type TeacherModel } from '@/services/teacher';
import { getSubjectsAll_API } from '@/services/subject'; // Fanlarni yuklash uchun API

const _formRef = ref();
const rules = useRules();
const _visible = ref(false);
const _loading = ref(false);
const _showAvailability = ref(false);
const emit = defineEmits(['update']);

const periods = [1, 2, 3, 4, 5, 6, 7];
const _allSubjects = ref<any[]>([]); // Barcha fanlar ro'yxati
const _formData = ref<TeacherModel>(getTeacher_DEFAULT());

// --- MANTIQIY FUNKSIYALAR ---
const isAvailable = (dayKey: string, period: number) => {
  const dayData = _formData.value.availabilities.find(a => a.dayOfWeek.includes(dayKey as any));
  return dayData ? dayData.lessons.includes(period) : false;
};

const toggleAvailability = (dayKey: string, period: number) => {
  let dayData = _formData.value.availabilities.find(a => a.dayOfWeek.includes(dayKey as any));
  if (!dayData) {
    dayData = { dayOfWeek: [dayKey as any], lessons: [] };
    _formData.value.availabilities.push(dayData);
  }
  const idx = dayData.lessons.indexOf(period);
  idx > -1 ? dayData.lessons.splice(idx, 1) : dayData.lessons.push(period);
  if (dayData.lessons.length === 0) _formData.value.availabilities = _formData.value.availabilities.filter(a => !a.dayOfWeek.includes(dayKey as any));
};

const toggleRow = (dayKey: string) => {
  const dayData = _formData.value.availabilities.find(a => a.dayOfWeek.includes(dayKey as any));
  _formData.value.availabilities = _formData.value.availabilities.filter(a => !a.dayOfWeek.includes(dayKey as any));
  if (!(dayData && dayData.lessons.length === periods.length)) _formData.value.availabilities.push({ dayOfWeek: [dayKey as any], lessons: [...periods] });
};

const toggleColumn = (period: number) => {
  const allDaysHaveIt = SCHOOL_WORKING_DAYS.every(day => isAvailable(day.key, period));
  if (allDaysHaveIt) {
    _formData.value.availabilities.forEach(d => d.lessons = d.lessons.filter(p => p !== period));
    _formData.value.availabilities = _formData.value.availabilities.filter(a => a.lessons.length > 0);
  } else {
    SCHOOL_WORKING_DAYS.forEach(day => {
      let dayData = _formData.value.availabilities.find(a => a.dayOfWeek.includes(day.key as any));
      if (!dayData) {
        dayData = { dayOfWeek: [day.key as any], lessons: [] };
        _formData.value.availabilities.push(dayData);
      }
      if (!dayData.lessons.includes(period)) dayData.lessons.push(period);
    });
  }
};

const clearAll = () => { _formData.value.availabilities = []; };
const selectAll = () => { _formData.value.availabilities = SCHOOL_WORKING_DAYS.map(day => ({ dayOfWeek: [day.key as any], lessons: [...periods] })); };
const removeSubject = (id: number) => { _formData.value.subjects = _formData.value.subjects.filter(sId => sId !== id); };

// --- OPEN FUNKSIYASI ---
async function open(item: TeacherModel | null) {
  _visible.value = true;
  
  // Agar fanlar ro'yxati bo'sh bo'lsa, API dan yuklaymiz
  if (_allSubjects.value.length === 0) {
      const [error, response] = await getSubjectsAll_API();
      if (!error && response) {
          _allSubjects.value = (response as any).content || response;
      }
  }

  if (item) {
    _formData.value = JSON.parse(JSON.stringify(item));
  } else {
    _formData.value = getTeacher_DEFAULT(); // Yangi ochilganda tozalash
  }
}

function close() {
  _visible.value = false;
  _formRef.value?.resetFields();
  _formData.value = getTeacher_DEFAULT(); // Yopilganda tozalash
  _showAvailability.value = false;
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
  <el-dialog v-model="_visible" width="680px" class="teacher-dialog" :show-close="false" @close="close">
    
    <template #header>
      <div class="flex items-center justify-between p-1">
        <h3 class="text-lg font-bold text-gray-800">{{ _formData.id ? 'Tahrirlash' : 'Yangi o\'qituvchi' }}</h3>
        <button @click="close" class="w-8 h-8 hover:bg-gray-100 rounded-full transition-all flex items-center justify-center">
            <i class="ri-close-line text-xl text-gray-400"></i>
        </button>
      </div>
    </template>

    <el-form ref="_formRef" :model="_formData" :rules="rules" label-position="top">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <el-form-item label="F.I.Sh" prop="fullName" class="!mb-2">
          <el-input v-model="_formData.fullName" placeholder="Ism familiya..." class="compact-input" />
        </el-form-item>

        <el-form-item label="Fanlar" prop="subjects" class="!mb-4">
          <el-select v-model="_formData.subjects" multiple collapse-tags placeholder="Fanlarni tanlang" class="compact-input w-full" size="default">
            <el-option v-for="s in _allSubjects" :key="s.id" :label="s.name" :value="s.id">
              <div class="flex items-center gap-2">
                  <span>{{ s.emoji || '📖' }}</span>
                  <span>{{ s.name }}</span>
                  <span class="ml-auto text-xs text-gray-400">{{ s.shortName }}</span>
              </div>
            </el-option>
          </el-select>

          <div v-if="_formData.subjects.length" class="flex flex-wrap gap-2 mt-2">
            <template v-for="id in _formData.subjects" :key="id">
              <div v-if="_allSubjects.find(s => s.id === id)" class="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs border bg-gray-50 border-gray-200" 
                   :style="{ color: _allSubjects.find(s => s.id === id)?.color, borderColor: _allSubjects.find(s => s.id === id)?.color + '40', backgroundColor: _allSubjects.find(s => s.id === id)?.color + '10' }">
                <span>{{ _allSubjects.find(s => s.id === id)?.emoji }}</span>
                <span>{{ _allSubjects.find(s => s.id === id)?.name }}</span>
                <i @click="removeSubject(id)" class="ri-close-line cursor-pointer hover:text-red-500"></i>
              </div>
            </template>
          </div>
        </el-form-item>

        <el-form-item label="Qisqa ism" prop="shortName" class="!mb-2">
          <div class="flex gap-2 w-full">
            <el-input v-model="_formData.shortName" placeholder="A. Navoiy" class="compact-input flex-auto" />
            <button type="button" @click="_showAvailability = !_showAvailability" :class="[_showAvailability ? 'bg-green-500 border-green-500 text-white' : 'bg-white text-gray-400 border-gray-200']" class="w-10 h-9 border rounded-lg flex items-center justify-center transition-all hover:shadow-sm">
                <i class="ri-calendar-todo-line text-lg"></i>
            </button>
          </div>
        </el-form-item>
      </div>
      
      <el-collapse-transition>
        <div v-if="_showAvailability" class="availability-section border border-green-300 rounded-2xl p-4 mb-5">
          <div class="flex items-center justify-between mb-4 px-1">
            <h4 class="text-sm font-bold text-gray-700">O'qituvchi mavjudligi</h4>
            <div class="flex gap-2">
              <button type="button" @click="selectAll" class="px-3 py-1 text-[11px] font-bold text-green-600 border border-green-200 rounded-md bg-white hover:bg-green-50 transition-colors">Hammasini tanlash</button>
              <button type="button" @click="clearAll" class="px-3 py-1 text-[11px] font-bold text-red-500 border border-red-100 rounded-md bg-white hover:bg-red-50 transition-colors">Hammasini tozalash</button>
            </div>
          </div>
          <div class="grid grid-cols-[60px_repeat(7,1fr)] gap-1.5">
            <div class="h-8"></div>
            <div v-for="p in periods" :key="p" @click="toggleColumn(p)" class="h-8 flex items-center justify-center bg-white border border-gray-200 rounded-md font-bold text-gray-600 text-[11px] shadow-sm cursor-pointer hover:bg-blue-50 transition-all select-none">P{{ p }}</div>
            <template v-for="day in SCHOOL_WORKING_DAYS" :key="day.key">
              <div @click="toggleRow(day.key)" class="h-8 flex items-center px-2 bg-white border border-gray-200 rounded-md font-bold text-gray-600 text-[11px] shadow-sm cursor-pointer hover:bg-blue-50 transition-all select-none">{{ day.label.substring(0, 3) }}</div>
              <div v-for="p in periods" :key="p" @click="toggleAvailability(day.key, p)" :class="[isAvailable(day.key, p) ? 'bg-[#52c41a] border-[#52c41a] text-white' : 'bg-gray-50 border-gray-100 text-gray-300']" class="h-8 flex items-center justify-center border rounded-md cursor-pointer transition-all active:scale-95 shadow-sm text-xs">
                <i v-if="isAvailable(day.key, p)" class="ri-check-line font-bold"></i><span v-else class="opacity-50">—</span>
              </div>
            </template>
          </div>
        </div>
      </el-collapse-transition>

      <div class="flex justify-end gap-2 pt-2 border-t border-gray-50">
        <el-button size="default" class="!rounded-lg !h-9 !px-6" @click="close">Bekor qilish</el-button>
        <el-button type="primary" class="!rounded-lg !h-9 !px-6 !bg-green-600 !border-green-600" :loading="_loading" @click="submit">
            {{ _formData.id ? 'O\'qituvchini yangilash' : 'O\'qituvchini saqlash' }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>