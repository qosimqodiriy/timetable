<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRules } from "./rules";
import { SCHOOL_WORKING_DAYS } from '@/utils';
import { getRoomsAll_API } from '@/services/room';
import { getClassesAll_API } from '@/services/class';
import { getTeachersAll_API } from '@/services/teacher';
import { getSubjectsAll_API } from '@/services/subject';
import { createLesson_API, getLesson_DEFAULT, updateLesson_API, type LessonModel } from '@/services/lessons';
import { ElMessage } from 'element-plus';

// --- INTERFEYSLAR (React kodidan olingan) ---
interface GroupLessonConfig {
    groupId: number;
    groupName: string;
    isSelected: boolean;
    teacherId: number | null;
    teacherName?: string;
    subjectId: number | null;
    subjectName?: string;
    roomIds: number[];
    roomNames?: string[];
}

const _formRef = ref();
const rules = useRules();
const _visible = ref(false);
const _loading = ref(false);
const emit = defineEmits(['update']);

// --- HOLATLAR (STATE) ---
const _formData = ref<any>(getLesson_DEFAULT());
const _isGroupMode = ref(false);
const _groupLessonConfigs = ref<GroupLessonConfig[]>([]);

// Dropdown datalari
const _rooms = ref<any[]>([]);
const _classes = ref<any[]>([]);
const _subjects = ref<any[]>([]);
const _teachers = ref<any[]>([]);

const periods = Array.from({ length: 10 }, (_, i) => i + 1);

// --- MODAL OCHILISHI ---
async function open(item: any | null, defaults: Partial<LessonModel> = {}) {
    _visible.value = true;
    _loading.value = true;
    
    if (_classes.value.length === 0) {
        await loadDropdownData();
    }
    _loading.value = false;

    if (item) {
        // TAHRIRLASH (Edit Mode)
        const raw = item.raw || item;
        
        let initialClasses: number[] = [];
        if (item.classId) initialClasses = [item.classId];
        else if (raw.class?.id) initialClasses = [raw.class.id];

        const teacherId = raw.teacher?.id || item.teacherId || null;
        const subjectId = raw.subject?.id || item.subjectId || null;
        const initialRoomIds = raw.rooms ? raw.rooms.map((r: any) => r.id) : (item.roomIds || []);

        _formData.value = {
            ...JSON.parse(JSON.stringify(raw)),
            classIds: initialClasses, // O'ZGARISH: classId o'rniga massiv
            subjectId: subjectId,
            teacherId: teacherId,
            roomIds: initialRoomIds,
            lessonCount: raw.lessonCount || 1,
            period: raw.period || 1,
            frequency: raw.frequency || 'WEEKLY',
        };

        // Guruh detallari mavjud bo'lsa (Group Mode)
        if (raw.groupDetails && raw.groupDetails.length > 0) {
            _isGroupMode.value = true;
            const configs: GroupLessonConfig[] = [];
            
            initialClasses.forEach(cId => {
                const cls = _classes.value.find(c => c.id === cId);
                if (cls && cls.groups) {
                    cls.groups.forEach((grp: any) => {
                        const detail = raw.groupDetails.find((d: any) => d.group?.id === grp.id);
                        if (detail) {
                            configs.push({
                                groupId: grp.id,
                                groupName: grp.name,
                                isSelected: true,
                                teacherId: detail.teacher?.id || null,
                                subjectId: detail.subject?.id || null,
                                roomIds: detail.rooms ? detail.rooms.map((r: any) => r.id) : [],
                            });
                        }
                    });
                }
            });
            _groupLessonConfigs.value = configs;
        } else {
            _isGroupMode.value = false;
            _groupLessonConfigs.value = [];
        }

    } else {
        // YANGI QO'SHISH (Add Mode)
        // classId kelib qolsa, uni arrayga o'tkazamiz
        const initialClassIds = defaults.classId ? [defaults.classId] : [];
        
        _formData.value = {
            ...getLesson_DEFAULT(),
            ...defaults,
            classIds: initialClassIds,
            roomIds: defaults.roomIds || [],
            lessonCount: 1,
            period: 1,
            frequency: 'WEEKLY'
        };
        _isGroupMode.value = false;
        _groupLessonConfigs.value = [];
    }
}

async function loadDropdownData() {
    const [classRes, subjectRes, teacherRes, roomRes] = await Promise.all([
        getClassesAll_API(),
        getSubjectsAll_API(),
        getTeachersAll_API(),
        getRoomsAll_API()
    ]);

    if (!classRes[0] && classRes[1]) _classes.value = (classRes[1] as any).content || classRes[1];
    if (!subjectRes[0] && subjectRes[1]) _subjects.value = (subjectRes[1] as any).content || subjectRes[1];
    if (!teacherRes[0] && teacherRes[1]) _teachers.value = (teacherRes[1] as any).content || teacherRes[1];
    if (!roomRes[0] && roomRes[1]) _rooms.value = (roomRes[1] as any).content || roomRes[1];
}

// --- GURUHLAR MANTIQI (REACTDAN OLINGAN) ---
// Sinf tanlanganda yoki o'chirilganda guruhlar ro'yxatini yangilash
watch(() => _formData.value.classIds, (newClassIds: number[]) => {
    if (!_classes.value.length || !newClassIds) return;

    const newConfigs: GroupLessonConfig[] = [];

    newClassIds.forEach(classId => {
        const selectedClass = _classes.value.find(c => c.id === classId);
        if (selectedClass && selectedClass.groups) {
            selectedClass.groups.forEach((group: any) => {
                const existing = _groupLessonConfigs.value.find(g => g.groupId === group.id);
                newConfigs.push(existing || {
                    groupId: group.id,
                    groupName: `${selectedClass.name} - ${group.name}`, // Qaysi sinfning guruhi ekanini ko'rsatamiz
                    isSelected: false,
                    teacherId: null,
                    subjectId: null,
                    roomIds: []
                });
            });
        }
    });

    _groupLessonConfigs.value = newConfigs;
}, { deep: true });

function close() {
    _visible.value = false;
    _formRef.value?.resetFields();
    _formData.value = getLesson_DEFAULT();
    _isGroupMode.value = false;
    _groupLessonConfigs.value = [];
}

async function submit() {
    // 1. O'zimizning Validatsiya
    if (_isGroupMode.value) {
        const selectedGroups = _groupLessonConfigs.value.filter(g => g.isSelected);
        if (selectedGroups.length === 0) {
            ElMessage.error("Kamida bitta guruhni tanlang!");
            return;
        }
        const incomplete = selectedGroups.some(g => !g.teacherId || !g.subjectId);
        if (incomplete) {
            ElMessage.error("Tanlangan barcha guruhlar uchun o'qituvchi va fan ko'rsatilishi shart!");
            return;
        }
    } else {
        if (!_formData.value.subjectId || !_formData.value.classIds?.length || !_formData.value.teacherId) {
            ElMessage.error("Barcha majburiy maydonlarni to'ldiring (Sinf, Fan, O'qituvchi)");
            return;
        }
    }

    // 2. Element Plus Form Validation
    _formRef.value?.validate(async (valid: boolean) => {
        if (valid) {
            _loading.value = true;

            const selectedGroups = _groupLessonConfigs.value.filter(g => g.isSelected);
            const groupDetails = selectedGroups.map(g => ({
                groupId: g.groupId,
                teacherId: g.teacherId,
                subjectId: g.subjectId,
                roomIds: g.roomIds
            }));

            // API kutayotgan formatni tayyorlash
            const payload = {
                id: _formData.value.id,
                classId: _formData.value.classIds,
                roomIds: _formData.value.roomIds,
                lessonCount: _formData.value.lessonCount,
                groups: _isGroupMode.value ? groupDetails : undefined,
                
                subjectId: _isGroupMode.value && groupDetails.length > 0 ? groupDetails[0]?.subjectId : _formData.value.subjectId,
                teacherId: _isGroupMode.value && groupDetails.length > 0 ? groupDetails[0]?.teacherId : _formData.value.teacherId,
                
                frequency: _formData.value.frequency?.toUpperCase(),
                period: _formData.value.period,
                dayOfWeek: _formData.value.dayOfWeek || null,
                hour: _formData.value.hour || null
            };

            const handler = _formData.value.id ? updateLesson_API : createLesson_API;
            const [error] = await handler(payload as any);
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
  <el-dialog v-model="_visible" :title="_formData.id ? 'Darsni tahrirlash' : 'Yangi dars qo\'shish'" width="600px" @close="close">
    
    <el-form ref="_formRef" :model="_formData" :rules="rules" label-position="top">
      
      <el-form-item label="Sinf(lar) *" prop="classIds">
        <el-select v-model="_formData.classIds" multiple collapse-tags placeholder="Sinfni tanlang" class="compact-input w-full" filterable>
          <el-option v-for="item in _classes" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span class="text-xs text-gray-400 mt-1">Ushbu dars qaysi sinflarga o'tilishini tanlang.</span>
      </el-form-item>

      <div class="flex items-center gap-3 py-3 mb-3 border-y border-gray-100">
          <el-switch v-model="_isGroupMode" />
          <div class="flex flex-col">
              <span class="font-semibold text-gray-800 text-sm">Sinfni guruhlarga bo'lish</span>
              <span class="text-xs text-gray-500">Ingliz tili kabi fanlar uchun bitta sinfni ikki guruhga ajratish</span>
          </div>
      </div>

      <template v-if="!_isGroupMode">
          <div class="grid md:grid-cols-3 gap-4">
            <el-form-item label="Fan *" prop="subjectId">
              <el-select v-model="_formData.subjectId" placeholder="Fanni tanlang" class="compact-input w-full" filterable>
                <el-option v-for="item in _subjects" :key="item.id" :label="item.name" :value="item.id">
                    <div class="flex items-center gap-2"><span>{{ item.emoji }}</span><span>{{ item.name }}</span></div>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Asosiy o'qituvchi *" prop="teacherId">
                <el-select v-model="_formData.teacherId" placeholder="O'qituvchini tanlang" class="compact-input w-full" filterable>
                <el-option v-for="item in _teachers" :key="item.id" :label="item.fullName" :value="item.id">
                    <div class="flex items-center gap-2">
                        <div class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 border">{{ item.fullName?.charAt(0) }}</div>
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
      </template>

      <div v-if="_isGroupMode" class="bg-blue-50/50 border border-blue-100 rounded-xl p-3 mb-3.5">
          
          <div v-if="_groupLessonConfigs.length === 0" class="text-center text-sm text-blue-600 py-4">
              Iltimos, avval tepadan sinfni tanlang yoki tanlangan sinfda guruhlar yo'q.
          </div>

          <div v-else class="flex flex-col gap-3">
              <div v-for="config in _groupLessonConfigs" :key="config.groupId" class="bg-white border rounded-lg p-3 shadow-sm">
                  
                  <el-checkbox v-model="config.isSelected" class="font-bold text-gray-800 mb-2">
                      {{ config.groupName }}
                  </el-checkbox>

                  <el-collapse-transition>
                      <div v-if="config.isSelected" class="grid grid-cols-2 gap-3 mt-2 pt-2 border-t">
                          <div class="flex flex-col gap-1">
                              <label class="text-[11px] font-semibold text-gray-500">O'qituvchi *</label>
                              <el-select v-model="config.teacherId" placeholder="Tanlang" class="compact-input" filterable>
                                  <el-option v-for="item in _teachers" :key="item.id" :label="item.fullName" :value="item.id" />
                              </el-select>
                          </div>
                          
                          <div class="flex flex-col gap-1">
                              <label class="text-[11px] font-semibold text-gray-500">Fan *</label>
                              <el-select v-model="config.subjectId" placeholder="Tanlang" class="compact-input" filterable>
                                  <el-option v-for="item in _subjects" :key="item.id" :label="item.name" :value="item.id" />
                              </el-select>
                          </div>

                          <div class="col-span-2 flex flex-col gap-1">
                              <label class="text-[11px] font-semibold text-gray-500">Xona</label>
                              <el-select v-model="config.roomIds" multiple collapse-tags placeholder="Xona tanlang" class="compact-input" filterable>
                                  <el-option v-for="item in _rooms" :key="item.id" :label="item.name" :value="item.id" />
                              </el-select>
                          </div>
                      </div>
                  </el-collapse-transition>
              </div>
          </div>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-2">
        <el-form-item label="Soni (Haftalik) *" prop="lessonCount">
           <el-input-number v-model="_formData.lessonCount" :min="1" :max="20" controls-position="right" class="!w-full compact-input" />
        </el-form-item>

        <el-form-item label="Chastota" prop="frequency">
          <el-select v-model="_formData.frequency" class="compact-input w-full">
            <el-option label="Har hafta" value="WEEKLY" />
            <el-option label="Ikki haftada bir" value="BI_WEEKLY" />
          </el-select>
        </el-form-item>

        <el-form-item label="Dars soati" prop="period">
          <el-select v-model="_formData.period" placeholder="Soat" class="compact-input w-full" clearable>
             <el-option v-for="p in periods" :key="p" :label="p + '-soat'" :value="p" />
          </el-select>
        </el-form-item>
      </div>
      
      <div class="flex justify-end gap-2 pt-4 mt-2 border-t border-gray-100">
        <el-button size="default" class="!rounded-lg !h-9 !px-6" @click="close">Bekor qilish</el-button>
        <el-button type="primary" class="!rounded-lg !h-9 !px-6 !bg-gray-900 !border-gray-900" :loading="_loading" @click="submit">
            {{ _formData.id ? 'Saqlash' : 'Qo\'shish' }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.lesson-dialog :deep(.el-dialog) { border-radius: 20px; padding: 20px; }
.lesson-dialog :deep(.el-dialog__title) { font-weight: 700; color: #1f2937; font-size: 18px; }
.lesson-dialog :deep(.el-dialog__body) { padding-top: 10px; }
.compact-input :deep(.el-input__wrapper) { background-color: #f9fafb; border-radius: 8px; box-shadow: none; border: 1px solid #f3f4f6; height: 38px; }
.compact-input :deep(.el-input__wrapper.is-focus) { border-color: #3b82f6; background-color: #fff; }
:deep(.el-form-item__label) { font-weight: 600; color: #374151; padding-bottom: 4px; font-size: 12px; }
</style>