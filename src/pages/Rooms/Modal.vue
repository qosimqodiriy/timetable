<script lang="ts" setup>
import { ref } from 'vue';
import { useRules } from "./rules";
import { SCHOOL_WORKING_DAYS } from '@/utils';
import {  createRoom_API,  getRoom_DEFAULT,  ROOM_TYPE,  ROOM_TYPE_ENUM,  updateRoom_API,  type RoomModel } from '@/services/room';

const _formRef = ref();
const rules = useRules();
const _visible = ref(false);
const _loading = ref(false);
const emit = defineEmits(['update']);

const periods = [1, 2, 3, 4, 5, 6]; 
const _formData = ref<RoomModel>(getRoom_DEFAULT());


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
  if (idx > -1) {
      dayData.lessons.splice(idx, 1);
  } else {
      dayData.lessons.push(period);
      dayData.lessons.sort((a, b) => a - b);
  }
  
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
    _formData.value.availabilities.forEach(d => {
        d.lessons = d.lessons.filter(p => p !== period);
    });
    _formData.value.availabilities = _formData.value.availabilities.filter(a => a.lessons.length > 0);
  } else {
    SCHOOL_WORKING_DAYS.forEach(day => {
      let dayData = _formData.value.availabilities!.find(a => (a.dayOfWeek as any) === day.key);
      if (!dayData) {
        dayData = { dayOfWeek: day.key as any, lessons: [] };
        _formData.value.availabilities!.push(dayData);
      }
      if (!dayData.lessons.includes(period)) {
          dayData.lessons.push(period);
          dayData.lessons.sort((a, b) => a - b);
      }
    });
  }
};

const clearAll = () => { _formData.value.availabilities = []; };
const selectAll = () => { 
    _formData.value.availabilities = SCHOOL_WORKING_DAYS.map(day => ({ 
        dayOfWeek: day.key as any, 
        lessons: [...periods] 
    })); 
};


async function open(item: any | null) {
  _visible.value = true;

  if (item) {
    const parsedItem = JSON.parse(JSON.stringify(item));
    _formData.value = {
        ...parsedItem,
        buildingId: parsedItem.building?.id || parsedItem.buildingId,
        availabilities: parsedItem.availabilities || []
    };
  }
}

function close() {
  _visible.value = false;
  _formRef.value?.resetFields();
  _formData.value = getRoom_DEFAULT();
  _formData.value = getRoom_DEFAULT();
}

async function submit() {
  _formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      _loading.value = true;
      const handler = _formData.value.id ? updateRoom_API : createRoom_API;
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
  <el-dialog v-model="_visible" :title="_formData.id ? 'Xonani tahrirlash' : 'Yangi xona qo‘shish'"  width="680px"  @close="close">
    <el-form ref="_formRef" :model="_formData" :rules="rules" label-position="top">
      <div class="grid md:grid-cols-3 gap-x-4 mb-2">
        <el-form-item label="Xona nomi" prop="name">
          <el-input v-model="_formData.name" placeholder="Masalan: 101-xona" class="compact-input" />
        </el-form-item>

        <el-form-item label="Qisqa nom (Raqami)" prop="shortName">
          <el-input v-model="_formData.shortName" placeholder="101" class="compact-input" />
        </el-form-item>

        <el-form-item label="Xona turi" prop="type">
            <el-select v-model="_formData.type" placeholder="Turini tanlang" class="compact-input w-full">
                <el-option v-for="type in ROOM_TYPE_ENUM" :key="type" :label="ROOM_TYPE.get(type)" :value="type" />
            </el-select>
        </el-form-item>
      </div>

      <div class="availability-section border border-green-200 rounded-2xl p-4 mb-5 bg-green-50/30">
        <div class="flex items-center justify-between mb-4 px-1">
          <div class="flex items-center gap-2 text-gray-600">
            <i class="ri-calendar-check-line text-lg text-green-600"></i>
            <span class="text-sm font-medium">Xona bandligi jadvali</span>
          </div>

          <div class="flex gap-2">
            <button type="button" @click="selectAll" class="px-3 py-1 text-[11px] font-bold text-green-600 border border-green-200 rounded-md bg-white hover:bg-green-50 transition-colors">Hammasini tanlash</button>
            <button type="button" @click="clearAll" class="px-3 py-1 text-[11px] font-bold text-red-500 border border-red-100 rounded-md bg-white hover:bg-red-50 transition-colors">Tozalash</button>
          </div>
        </div>

        <div class="grid grid-cols-[60px_repeat(6,1fr)] gap-1.5">
          <div class="h-8"></div> <div v-for="p in periods" :key="p" @click="toggleColumn(p)" class="h-8 flex items-center justify-center bg-white border border-gray-200 rounded-md font-bold text-gray-600 text-[11px] shadow-sm cursor-pointer hover:bg-blue-50 transition-all select-none"> P{{ p }} </div>

          <template v-for="day in SCHOOL_WORKING_DAYS" :key="day.key">
            <div @click="toggleRow(day.key)" class="h-8 flex items-center px-2 bg-white border border-gray-200 rounded-md font-bold text-gray-600 text-[11px] shadow-sm cursor-pointer hover:bg-blue-50 transition-all select-none">{{ day.label.substring(0, 3) }}</div>
            
            <div v-for="p in periods" :key="p" @click="toggleAvailability(day.key, p)"  :class="[isAvailable(day.key, p) ? 'bg-[#52c41a] border-[#52c41a] text-white' : 'bg-white border-gray-200 text-gray-300']"  class="h-8 flex items-center justify-center border rounded-md cursor-pointer transition-all active:scale-95 shadow-sm text-xs">
              <span v-if="isAvailable(day.key, p)" class="font-medium text-base">✓</span>
              <span v-else class="opacity-30">—</span>
            </div>
          </template>
        </div>
      </div>
      
      <div class="sticky bottom-0 flex justify-end gap-2 pt-2 mt-2 bg-white">
        <el-button size="default" class="!rounded-lg !h-9 !px-6" @click="close">Bekor qilish</el-button>
        <el-button type="primary" class="!rounded-lg !h-9 !px-6 !bg-blue-600 !border-blue-600" :loading="_loading" @click="submit">{{ _formData.id ? 'Saqlash' : 'Qo\'shish' }}</el-button>
      </div>

    </el-form>
  </el-dialog>
</template>