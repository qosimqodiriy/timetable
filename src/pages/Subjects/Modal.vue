<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRules } from "./rules";
import { SCHOOL_WORKING_DAYS, EMOJI_RECOMMENDATIONS } from '@/utils';
import {
  createSubject_API,
  getSubject_DEFAULT,
  updateSubject_API,
  type SubjectModel
} from '@/services/subject';

const _formRef = ref();
const _popoverRef = ref();
const rules = useRules();
const _visible = ref(false);
const _loading = ref(false);
const _showAvailability = ref(false);
const emit = defineEmits(['update']);

// Constants
const periods = [1, 2, 3, 4, 5, 6];
const _formData = ref<SubjectModel>(getSubject_DEFAULT());

// Emojilar ro'yxati
const emojiList = Object.values(EMOJI_RECOMMENDATIONS);

// Ranglar
const predefineColors = ref([
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6',
]);

// --- FAN NOMI AUTOCOMPLETE ---
const subjectOptions = computed(() => {
  return Object.entries(EMOJI_RECOMMENDATIONS).map(([name, emoji]) => ({ name, emoji }));
});

const onNameChange = (val: string) => {
  const found = subjectOptions.value.find(s => s.name === val);
  if (found) _formData.value.emoji = found.emoji;
};

// --- EMOJI TANLASH ---
function selectEmoji(emoji: string) {
  _formData.value.emoji = emoji;
  _popoverRef.value?.hide(); // Tanlangandan keyin yopish
}

// --- MAVJUDLIK LOGIKASI ---
const isAvailable = (dayKey: string, period: number) => {
  const dayData = _formData.value.availabilities?.find(a => (a.dayOfWeek as any) === dayKey);
  return dayData ? dayData.lessons.includes(period) : false;
};

const toggleAvailability = (dayKey: string, period: number) => {
  if (!_formData.value.availabilities) _formData.value.availabilities = [];
  let dayData = _formData.value.availabilities.find(a => (a.dayOfWeek as any) === dayKey);

  if (!dayData) {
    dayData = { dayOfWeek: dayKey as any, lessons: [] };
    _formData.value.availabilities.push(dayData);
  }

  const idx = dayData.lessons.indexOf(period);
  if (idx > -1) dayData.lessons.splice(idx, 1);
  else { dayData.lessons.push(period); dayData.lessons.sort((a, b) => a - b); }

  if (dayData.lessons.length === 0) {
    _formData.value.availabilities = _formData.value.availabilities.filter(a => (a.dayOfWeek as any) !== dayKey);
  }
};

const toggleRow = (dayKey: string) => {
  if (!_formData.value.availabilities) _formData.value.availabilities = [];
  const dayData = _formData.value.availabilities.find(a => (a.dayOfWeek as any) === dayKey);

  if (dayData && dayData.lessons.length === periods.length) {
    _formData.value.availabilities = _formData.value.availabilities.filter(a => (a.dayOfWeek as any) !== dayKey);
  } else {
    _formData.value.availabilities = _formData.value.availabilities.filter(a => (a.dayOfWeek as any) !== dayKey);
    _formData.value.availabilities.push({ dayOfWeek: dayKey as any, lessons: [...periods] });
  }
};

const toggleColumn = (period: number) => {
  const allDaysHaveIt = SCHOOL_WORKING_DAYS.every(day => isAvailable(day.key, period));
  if (!_formData.value.availabilities) _formData.value.availabilities = [];

  if (allDaysHaveIt) {
    _formData.value.availabilities.forEach(d => { d.lessons = d.lessons.filter(p => p !== period); });
    _formData.value.availabilities = _formData.value.availabilities.filter(a => a.lessons.length > 0);
  } else {
    SCHOOL_WORKING_DAYS.forEach(day => {
      let dayData = _formData.value.availabilities!.find(a => (a.dayOfWeek as any) === day.key);
      if (!dayData) {
        dayData = { dayOfWeek: day.key as any, lessons: [] };
        _formData.value.availabilities!.push(dayData);
      }
      if (!dayData.lessons.includes(period)) { dayData.lessons.push(period); dayData.lessons.sort((a, b) => a - b); }
    });
  }
};

const clearAll = () => { _formData.value.availabilities = []; };
const selectAll = () => {
  _formData.value.availabilities = SCHOOL_WORKING_DAYS.map(day => ({ dayOfWeek: day.key as any, lessons: [...periods] }));
};

// --- DATA YUKLASH ---
function open(item: SubjectModel | null) {
  _visible.value = true;
  if (item) {
    const parsedItem = JSON.parse(JSON.stringify(item));
    _formData.value = { ...parsedItem, availabilities: parsedItem.availabilities || [] };
  } else {
    _formData.value = getSubject_DEFAULT();
    if (!_formData.value.availabilities) _formData.value.availabilities = [];
  }
}

function close() {
  _visible.value = false;
  // Modal yopilganda popoverni ham majburan yopamiz
  _popoverRef.value?.hide();

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
      close(); emit('update');
    }
  });
}

defineExpose({ open });
</script>

<template>
  <el-dialog v-model="_visible" :title="_formData.id ? 'Fanni tahrirlash' : 'Yangi fan'" width="600px" @close="close">
    <el-form ref="_formRef" :model="_formData" :rules="rules" label-position="top">

      <div class="grid grid-cols-5 gap-x-4">
        <el-form-item label="Fan nomi" prop="name" class="col-span-3">
          <el-select v-model="_formData.name" placeholder="Masalan: Matematika" class="compact-input w-full" filterable
            allow-create default-first-option @change="onNameChange">
            <el-option v-for="item in subjectOptions" :key="item.name" :label="item.name" :value="item.name">
              <div class="flex items-center justify-between">
                <span>{{ item.name }}</span>
                <span class="text-lg">{{ item.emoji }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Qisqa nom" prop="shortName" class="col-span-2">
          <el-input v-model="_formData.shortName" placeholder="MATEM" class="compact-input" />
        </el-form-item>
      </div>

      <div class="grid grid-cols-5 gap-4 mb-4">
        <div class="grid grid-cols-2 col-span-3 gap-4">
          <el-form-item label="Emoji" prop="emoji">
            <el-popover ref="_popoverRef" placement="bottom" :width="320" trigger="click">
              <template #reference>
                <el-input v-model="_formData.emoji" placeholder="😀" class="compact-input text-center font-emoji" />
              </template>

              <div class="grid grid-cols-8 gap-2 max-h-[200px] overflow-y-auto p-1 custom-scroll">
                <div v-for="emoji in emojiList" :key="emoji" @click="selectEmoji(emoji)"
                  class="w-8 h-8 flex items-center justify-center text-xl cursor-pointer hover:bg-blue-50 rounded transition-colors select-none">
                  {{ emoji }}
                </div>
              </div>
            </el-popover>
          </el-form-item>

          <el-form-item label="Rang" prop="color">
            <el-color-picker v-model="_formData.color" show-alpha :predefine="predefineColors" size="large"
              class="!w-full" />
          </el-form-item>
        </div>

        <div class="col-span-2 flex items-center gap-4">
          <el-form-item label="Qiyinlik (1-10)" prop="weight" class="flex-auto">
            <el-input-number v-model="_formData.weight" :min="1" :max="10" controls-position="right"
              class="!w-full compact-input" placeholder="1" />
          </el-form-item>

          <button type="button" @click="_showAvailability = !_showAvailability"
            class="flex-shrink-0 w-10 h-10 flex items-center justify-center border rounded-lg transition-all duration-200 mt-4"
            :class="_showAvailability
              ? 'bg-green-100 border-green-500 text-green-700'
              : 'bg-white border-gray-300 text-gray-600 hover:bg-green-50/50'" title="Mavjudlikni ko'rsatish/yashirish">
            <i class="ri-calendar-event-line text-lg"></i>
          </button>
        </div>
      </div>

      <el-collapse-transition>
        <div v-if="_showAvailability"
          class="availability-section border border-green-200 rounded-2xl p-4 mb-5 bg-green-50/30">
          <div class="flex items-center justify-between mb-4 px-1">
            <div class="flex items-center gap-2 text-gray-600">
              <i class="ri-calendar-check-line text-lg text-green-600"></i>
              <span class="text-sm font-medium">Fan o'tiladigan vaqtlar</span>
            </div>
            <div class="flex gap-2">
              <button type="button" @click="selectAll"
                class="px-3 py-1 text-[11px] font-bold text-green-600 border border-green-200 rounded-md bg-white hover:bg-green-50 transition-colors">Hammasini
                tanlash</button>
              <button type="button" @click="clearAll"
                class="px-3 py-1 text-[11px] font-bold text-red-500 border border-red-100 rounded-md bg-white hover:bg-red-50 transition-colors">Tozalash</button>
            </div>
          </div>

          <div class="grid grid-cols-[60px_repeat(6,1fr)] gap-1.5">
            <div class="h-8"></div>

            <div v-for="p in periods" :key="p" @click="toggleColumn(p)"
              class="h-8 flex items-center justify-center bg-white border border-gray-200 rounded-md font-bold text-gray-600 text-[11px] shadow-sm cursor-pointer hover:bg-blue-50 transition-all select-none">
              P{{ p }} </div>

            <template v-for="day in SCHOOL_WORKING_DAYS" :key="day.key">
              <div @click="toggleRow(day.key)"
                class="h-8 flex items-center px-2 bg-white border border-gray-200 rounded-md font-bold text-gray-600 text-[11px] shadow-sm cursor-pointer hover:bg-blue-50 transition-all select-none">
                {{ day.label.substring(0, 3) }}
              </div>

              <div v-for="p in periods" :key="p" @click="toggleAvailability(day.key, p)"
                :class="[isAvailable(day.key, p) ? 'bg-[#52c41a] border-[#52c41a] text-white' : 'bg-white border-gray-200 text-gray-300']"
                class="h-8 flex items-center justify-center border rounded-md cursor-pointer transition-all active:scale-95 shadow-sm text-xs">
                <span v-if="isAvailable(day.key, p)" class="font-medium text-base">✓</span>
                <span v-else class="opacity-30">—</span>
              </div>
            </template>
          </div>
        </div>
      </el-collapse-transition>

      <div class="sticky bottom-0 flex justify-end gap-2 pt-2 mt-2 bg-white">
        <el-button size="default" class="!rounded-lg !h-9 !px-6" @click="close">Bekor qilish</el-button>
        <el-button type="primary" class="!rounded-lg !h-9 !px-6 !bg-blue-600 !border-blue-600" :loading="_loading"
          @click="submit">
          {{ _formData.id ? 'Saqlash' : 'Qo\'shish' }}
        </el-button>
      </div>

    </el-form>
  </el-dialog>
</template>

<style scoped>
.subject-dialog :deep(.el-dialog) {
  border-radius: 20px;
  padding: 20px;
}

.subject-dialog :deep(.el-dialog__title) {
  font-weight: 700;
  color: #1f2937;
  font-size: 18px;
}

.subject-dialog :deep(.el-dialog__body) {
  padding-top: 10px;
}

.compact-input :deep(.el-input__wrapper) {
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid #f3f4f6;
  height: 38px;
}

.compact-input :deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  background-color: #fff;
}

/* Emoji input (readonly emas) */
.font-emoji :deep(.el-input__inner) {
  font-size: 20px;
  text-align: center;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
  padding-bottom: 4px;
  font-size: 12px;
}

.custom-scroll::-webkit-scrollbar,
.availability-section ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scroll::-webkit-scrollbar-track,
.availability-section ::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb,
.availability-section ::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
</style>