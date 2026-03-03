<script lang="ts" setup>
import { SCHOOL_WORKING_DAYS } from '@/utils';
import { computed, ref, onMounted } from 'vue';

interface SettingsModel {
    schoolName: string;
    academicYear: string;
    schoolStartTime: string;
    schoolEndTime: string;
    defaultPeriodDuration: number;
    breakDuration: number;
    workingDays: Record<string, boolean>;
    maxLessonsPerDay: number;
}

const getSettings_DEFAULT = (): SettingsModel => ({
    schoolName: 'Springfield High School',
    academicYear: '2024-2025',
    schoolStartTime: '09:00',
    schoolEndTime: '16:00',
    defaultPeriodDuration: 45,
    breakDuration: 15,
    workingDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
    },
    maxLessonsPerDay: 7
});


const _loading = ref(false);
const _isEditing = ref(false);
const _item = ref<SettingsModel>(getSettings_DEFAULT());
const _originalItem = ref<SettingsModel>(getSettings_DEFAULT());

const _isChanged = computed(() => {
    return JSON.stringify(_item.value) !== JSON.stringify(_originalItem.value);
});

async function loadItems() {
    _loading.value = true;
    setTimeout(() => {
        const response = getSettings_DEFAULT();
        _item.value = JSON.parse(JSON.stringify(response));
        _originalItem.value = JSON.parse(JSON.stringify(response));
        _loading.value = false;
    }, 500);
}

const handleStartEdit = () => {
    _isEditing.value = true;
    _item.value = JSON.parse(JSON.stringify(_originalItem.value));
};

const handleCancel = () => {
    _isEditing.value = false;
    _item.value = JSON.parse(JSON.stringify(_originalItem.value));
};

const handleUpdate = async () => {
    if (!_isChanged.value) { 
        _isEditing.value = false; 
        return; 
    }

    _loading.value = true;
    
    setTimeout(() => {
        _loading.value = false;
        _isEditing.value = false;
        _originalItem.value = JSON.parse(JSON.stringify(_item.value));
    }, 1000);
};

onMounted(() => {
    loadItems();
});
</script>

<template>
    <div v-loading="_loading" class="flex flex-col gap-6 w-full max-w-[800px] pb-5">
        
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex flex-col gap-1">
                <h2 class="flex items-center gap-3 text-2xl font-extrabold text-gray-800">
                    Sozlamalar
                </h2>
                <p class="text-gray-500 text-sm font-medium">Ilova sozlamalarini boshqaring</p>
            </div>

            <div class="flex items-center gap-2">
                <el-button v-if="_isEditing" @click="handleCancel" plain type="primary" size="large" class="!rounded-xl">
                    <i class="ri-close-line mr-1"></i>
                    <p>Bekor qilish</p>
                </el-button>
                
                <el-button v-if="_isEditing" @click="handleUpdate" plain type="success" size="large" :disabled="!_isChanged" class="!rounded-xl">
                    <i class="ri-save-3-line mr-1"></i>
                    <p>O‘zgarishlarni saqlash</p>
                </el-button>

                <el-button v-if="!_isEditing" @click="handleStartEdit" plain type="primary" size="large" class="!rounded-xl">
                    <i class="ri-edit-line mr-1"></i>
                    <p>Ma'lumotlarni tahrirlash</p>
                </el-button>
            </div>
        </div>

        <div :class="_isEditing ? '' : 'pointer-events-none'">
            
            <div class="flex flex-col gap-5 p-5 border border-gray-200 rounded-[20px] bg-white shadow-sm mb-6">
                <div class="flex flex-col gap-1 mb-1">
                    <h3 class="text-lg font-bold text-gray-900">School Information</h3>
                    <p class="text-gray-500 text-sm font-medium">Configure your school's basic information</p>
                </div>

                <el-form :model="_item" label-position="top" class="custom-form grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <el-form-item label="School Name">
                        <el-input v-model="_item.schoolName" :readonly="!_isEditing" class="custom-input"></el-input>
                    </el-form-item>

                    <el-form-item label="Academic Year">
                        <el-input v-model="_item.academicYear" :readonly="!_isEditing" class="custom-input"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <div class="flex flex-col gap-5 p-5 border border-gray-200 rounded-[20px] bg-white shadow-sm mb-6">
                <div class="flex flex-col gap-1 mb-1">
                    <h3 class="text-lg font-bold text-gray-900">Timetable Settings</h3>
                    <p class="text-gray-500 text-sm font-medium">Configure default timetable settings</p>
                </div>

                <el-form :model="_item" label-position="top" class="custom-form grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <el-form-item label="School Start Time">
                        <el-time-picker v-model="_item.schoolStartTime" format="HH:mm" value-format="HH:mm" :readonly="!_isEditing" :clearable="false" class="custom-time-picker w-full" />
                    </el-form-item>

                    <el-form-item label="School End Time">
                        <el-time-picker v-model="_item.schoolEndTime" format="HH:mm" value-format="HH:mm" :readonly="!_isEditing" :clearable="false" class="custom-time-picker w-full" />
                    </el-form-item>

                    <el-form-item label="Default Period Duration (minutes)">
                        <el-input-number v-model="_item.defaultPeriodDuration" :min="1" :max="120" :disabled="!_isEditing" controls-position="right" class="custom-number-input !w-full" />
                    </el-form-item>

                    <el-form-item label="Break Duration (minutes)">
                        <el-input-number v-model="_item.breakDuration" :min="1" :max="60" :disabled="!_isEditing" controls-position="right" class="custom-number-input !w-full" />
                    </el-form-item>
                </el-form>
            </div>

            <div class="flex flex-col gap-5 p-5 border border-gray-200 rounded-[20px] bg-white shadow-sm mb-6">
                <div class="flex flex-col gap-1 mb-2">
                    <h3 class="text-lg font-bold text-gray-900">Working Days</h3>
                    <p class="text-gray-500 text-sm font-medium">Configure which days are working days</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="day in SCHOOL_WORKING_DAYS" :key="day.key" 
                         class="flex items-center justify-between p-3.5 px-4 rounded-[12px] border transition-all"
                         :class="[
                            _item.workingDays[day.key] ? 'border-gray-300 bg-gray-50/80' : 'border-gray-200 bg-white',
                            _isEditing ? 'hover:border-gray-400 cursor-pointer' : 'opacity-80'
                         ]"
                         @click="_isEditing && (_item.workingDays[day.key] = !_item.workingDays[day.key])"
                    >
                        <span class="text-[14.5px] font-semibold" :class="_item.workingDays[day.key] ? 'text-gray-900' : 'text-gray-400'">
                            {{ day.label }}
                        </span>
                        <el-switch v-model="_item.workingDays[day.key]" :disabled="!_isEditing" class="custom-switch" @click.stop />
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-5 p-5 border border-gray-200 rounded-[20px] bg-white shadow-sm">
                <div class="flex flex-col gap-1 mb-1">
                    <h3 class="text-lg font-bold text-gray-900">Lesson Configuration</h3>
                    <p class="text-gray-500 text-sm font-medium">Configure lesson settings</p>
                </div>

                <el-form :model="_item" label-position="top" class="custom-form grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <el-form-item label="Maximum Lessons per Day">
                        <el-input-number v-model="_item.maxLessonsPerDay" :min="1" :max="20" :disabled="!_isEditing" controls-position="right" class="custom-number-input !w-full" />
                    </el-form-item>
                </el-form>
            </div>

        </div>


        <el-collapse-transition>
            <div v-if="_isEditing && _isChanged" class="fixed bottom-10 right-10 z-50">
                <div class="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
                    <i class="ri-error-warning-fill text-amber-500 text-xl animate-pulse"></i>
                    <span class="text-amber-800 font-medium">Sizda saqlanmagan o'zgarishlar mavjud</span>
                </div>
            </div>
        </el-collapse-transition>
    </div>
</template>

<style scoped>
.custom-form :deep(.el-form-item__label) {
    font-weight: 600;
    color: #374151; 
    padding-bottom: 6px;
    font-size: 13px;
}

.custom-input :deep(.el-input__wrapper),
.custom-time-picker :deep(.el-input__wrapper),
.custom-number-input :deep(.el-input__wrapper) {
    background-color: #f3f4f6; 
    border-radius: 10px; 
    box-shadow: none;
    border: 1px solid transparent;
    height: 42px; 
    transition: all 0.2s ease-in-out;
}

.custom-input:not(.is-disabled) :deep(.el-input__wrapper.is-focus),
.custom-time-picker:not(.is-disabled) :deep(.el-input__wrapper.is-focus),
.custom-number-input:not(.is-disabled) :deep(.el-input__wrapper.is-focus) {
    border-color: #d1d5db;
    background-color: #ffffff;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); 
}

.pointer-events-none .custom-input :deep(.el-input__wrapper),
.pointer-events-none .custom-time-picker :deep(.el-input__wrapper),
.pointer-events-none .custom-number-input :deep(.el-input__wrapper),
.is-disabled :deep(.el-input__wrapper) {
    background-color: #f9fafb !important;
    border-color: #f3f4f6 !important;
}

.pointer-events-none .custom-input :deep(.el-input__inner),
.pointer-events-none .custom-time-picker :deep(.el-input__inner),
.pointer-events-none .custom-number-input :deep(.el-input__inner),
.is-disabled :deep(.el-input__inner) {
    color: #6b7280 !important;
    -webkit-text-fill-color: #6b7280 !important; 
    font-weight: 500;
}

.custom-number-input :deep(.el-input__inner) {
    text-align: left !important;
}

.custom-time-picker :deep(.el-input__prefix) {
    display: none; 
}
.custom-time-picker :deep(.el-input__suffix) {
    display: flex; 
}

.custom-switch {
    --el-switch-on-color: #111827; 
    --el-switch-off-color: #d1d5db; 
}
.custom-switch :deep(.el-switch__core) {
    border-radius: 100px;
}
</style>