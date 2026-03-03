<script lang="ts" setup>
import { getIconUrl_UTIL } from '@/utils';
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { OPEN_DELETE_MODAL } from '@/components/DeleteModal/store';
import { getLessonAll_DEFAULT, getLessonsAll_API, type LessonAllModel } from '@/services/lessons';

import LessonModal from './Modal.vue';
import RoomModal from '@/pages/Rooms/Modal.vue';
import ClassModal from '@/pages/Classes/Modal.vue';
import TeacherModal from '@/pages/Teachers/Modal.vue';
import SubjectModal from '@/pages/Subjects/Modal.vue';

const _roomModalRef = ref();
const _classModalRef = ref();
const _lessonModalRef = ref();
const _teacherModalRef = ref();
const _subjectModalRef = ref();

const _loading = ref(false);
const expandedRows = ref<number[]>([]);
const tabRefs = ref<Record<string, HTMLElement>>({});
const rawData = ref<LessonAllModel>(getLessonAll_DEFAULT());
const gliderStyle = ref({ left: '4px', width: '0px', height: '0px' });
const activeTab = ref<'classes' | 'teachers' | 'subjects' | 'rooms'>('classes');

const roomMap = computed(() => new Map(rawData.value.rooms.map(i => [i.id, i])));
const classMap = computed(() => new Map(rawData.value.classes.map(i => [i.id, i])));
const teacherMap = computed(() => new Map(rawData.value.teachers.map(i => [i.id, i])));
const subjectMap = computed(() => new Map(rawData.value.subjects.map(i => [i.id, i])));

async function loadItems() {
    _loading.value = true;
    const [error, response] = await getLessonsAll_API();
    _loading.value = false;
    
    if (!error && response) {
        rawData.value = response;
        nextTick(updateGlider);
    }
}

const updateGlider = () => {
    const activeEl = tabRefs.value[activeTab.value];
    if (activeEl) {
        gliderStyle.value = {
            left: `${activeEl.offsetLeft}px`,
            width: `${activeEl.offsetWidth}px`,
            height: `${activeEl.offsetHeight + 1}px`
        };
    }
};

watch(activeTab, () => {
    expandedRows.value = [];
    nextTick(updateGlider);
});

window.addEventListener('resize', updateGlider);

// --- Yordamchi Funksiya: Maksimal soatlarni hisoblash ---
const calculateMaxPeriods = (availabilities: any[] | null) => {
    if (!availabilities || availabilities.length === 0) return 0;
    return availabilities.reduce((total, day) => total + (day.lessons?.length || 0), 0);
};

const groupedData = computed(() => {
    const { lessons, classes, teachers, subjects, rooms } = rawData.value;
    
    if (activeTab.value === 'classes') {
        return classes.map(cls => {
            const classLessons = lessons.filter(l => l.classId === cls.id);
            const totalAssignedLessons = classLessons.reduce((sum, l) => sum + (l.lessonCount || 0), 0);
            const uniqueTeachers = new Set(classLessons.map(l => l.teacherId).filter(id => id)).size;
            const uniqueSubjects = new Set(classLessons.map(l => l.subjectId).filter(id => id)).size;
            
            // XATOLIK TUG'IRLANDI: Sinflar uchun ham warning tekshiramiz
            const maxAllowedLessons = calculateMaxPeriods(cls.availabilities);
            const overbooked = totalAssignedLessons > maxAllowedLessons ? totalAssignedLessons - maxAllowedLessons : 0;
            const isError = maxAllowedLessons === 0 || overbooked > 0;
            
            let warningText = '';
            if (maxAllowedLessons === 0 && totalAssignedLessons > 0) warningText = '(Vaqt kiritilmagan)';
            else if (overbooked > 0) warningText = `(+${overbooked})`;

            let warningMsg = null;
            if (maxAllowedLessons === 0 && totalAssignedLessons > 0) {
                 warningMsg = `Sinf dars jadvali vaqti kiritilmagan! Jami ${totalAssignedLessons} soat biriktirilgan.`;
            } else if (overbooked > 0) {
                 warningMsg = `Yuklama ortib ketdi! (${overbooked} soat ortiqcha)`;
            }

            return {
                id: cls.id, title: cls.name,
                stats: [
                    { icon: 'ri-book-read-line', text: `${classLessons.length} dars`, isWarning: false },
                    // isWarning hardcode false qilingan edi, isError ga almashtirildi
                    { icon: 'ri-time-line', text: `${totalAssignedLessons} jami dars`, isWarning: isError, warningText: warningText },
                    { icon: 'ri-graduation-cap-line', text: `${uniqueTeachers} o'qituvchi`, isWarning: false },
                    { icon: 'ri-file-text-line', text: `${uniqueSubjects} fan`, isWarning: false }
                ],
                items: classLessons,
                addText: "Sinf uchun dars qo'shish",
                editText: "Sinfni tahrirlash",
                isError: isError,
                warningMsg: warningMsg 
            } as any;
        });
    }
    
    if (activeTab.value === 'teachers') {
        return teachers.map(t => {
            const teacherLessons = lessons.filter(l => l.teacherId === t.id);
            const totalAssignedLessons = teacherLessons.reduce((sum, l) => sum + (l.lessonCount || 0), 0);
            const uniqueClasses = new Set(teacherLessons.map(l => l.classId).filter(id => id)).size;
            
            // Maksimal va ortiqcha darslarni hisoblash
            const maxAllowedLessons = calculateMaxPeriods(t.availabilities);
            const overbooked = totalAssignedLessons > maxAllowedLessons ? totalAssignedLessons - maxAllowedLessons : 0;
            const isError = maxAllowedLessons === 0 || overbooked > 0;
            
            let warningText = '';
            if (maxAllowedLessons === 0 && totalAssignedLessons > 0) warningText = '(Vaqt kiritilmagan)';
            else if (overbooked > 0) warningText = `(+${overbooked})`;

            let warningMsg = null;
            if (maxAllowedLessons === 0 && totalAssignedLessons > 0) {
                 warningMsg = `Ish vaqti kiritilmagan! Jami ${totalAssignedLessons} soat biriktirilgan.`;
            } else if (overbooked > 0) {
                 warningMsg = `Yuklama ortib ketdi! (${overbooked} soat ortiqcha)`;
            }

            return {
                id: t.id, title: t.fullName,
                stats: [
                    { icon: 'ri-group-line', text: `${uniqueClasses} sinf`, isWarning: false },
                    { icon: 'ri-book-read-line', text: `${teacherLessons.length} dars`, isWarning: false },
                    { icon: 'ri-time-line', text: `${totalAssignedLessons} jami dars`, isWarning: isError, warningText: warningText }
                ],
                items: teacherLessons,
                addText: "O‘qituvchi uchun dars qo‘shish",
                editText: "O‘qituvchini tahrirlash",
                isError: isError,
                warningMsg: warningMsg
            } as any;
        });
    }
    
    if (activeTab.value === 'subjects') {
        return subjects.map(s => {
            const subjectLessons = lessons.filter(l => l.subjectId === s.id);
            const uniqueTeachers = new Set(subjectLessons.map(l => l.teacherId).filter(id => id)).size;
            const uniqueClasses = new Set(subjectLessons.map(l => l.classId).filter(id => id)).size;
            
            return {
                id: s.id, title: s.name,
                stats: [
                    { icon: 'ri-graduation-cap-line', text: `${uniqueTeachers} o'qituvchi`, isWarning: false },
                    { icon: 'ri-group-line', text: `${uniqueClasses} sinf`, isWarning: false },
                    { icon: 'ri-book-read-line', text: `${subjectLessons.length} dars`, isWarning: false }
                ],
                items: subjectLessons,
                addText: "Fan uchun dars qo‘shish",
                editText: "Fanni tahrirlash",
                isError: false,
                warningMsg: null
            } as any;
        });
    }
    
    if (activeTab.value === 'rooms') {
        return rooms.map(r => {
            const roomLessons = lessons.filter(l => l.roomIds?.includes(r.id));
            const uniqueTeachers = new Set(roomLessons.map(l => l.teacherId).filter(id => id)).size;
            const uniqueClasses = new Set(roomLessons.map(l => l.classId).filter(id => id)).size;
            const totalAssignedLessons = roomLessons.reduce((sum, l) => sum + (l.lessonCount || 0), 0);
            
            // Maksimal va ortiqcha darslarni hisoblash
            const maxAllowedLessons = calculateMaxPeriods(r.availabilities);
            const overbooked = totalAssignedLessons > maxAllowedLessons ? totalAssignedLessons - maxAllowedLessons : 0;
            const isError = maxAllowedLessons === 0 || overbooked > 0;
            
            let warningText = '';
            if (maxAllowedLessons === 0 && totalAssignedLessons > 0) warningText = '(Vaqt kiritilmagan)';
            else if (overbooked > 0) warningText = `(+${overbooked})`;

            let warningMsg = null;
            if (maxAllowedLessons === 0 && totalAssignedLessons > 0) {
                 warningMsg = `Xona vaqti kiritilmagan! Jami ${totalAssignedLessons} soat biriktirilgan.`;
            } else if (overbooked > 0) {
                 warningMsg = `Sig'im ortib ketdi! (${overbooked} soat ortiqcha)`;
            }

            return {
                id: r.id, title: r.name,
                stats: [
                    { icon: 'ri-graduation-cap-line', text: `${uniqueTeachers} o'qituvchi`, isWarning: false },
                    { icon: 'ri-group-line', text: `${uniqueClasses} sinf`, isWarning: false },
                    { icon: 'ri-time-line', text: `${totalAssignedLessons} jami dars`, isWarning: isError, warningText: warningText }
                ],
                items: roomLessons,
                addText: "Xona uchun dars qo'shish",
                editText: "Xonani tahrirlash",
                isError: isError,
                warningMsg: warningMsg
            } as any;
        });
    }
    return [];
});

const toggleAccordion = (id: number) => {
    if (expandedRows.value.includes(id)) {
        expandedRows.value = expandedRows.value.filter(i => i !== id);
    } else expandedRows.value.push(id);
};

const collapseAll = () => expandedRows.value = [];

// --- HELPER TEXT ---
const getSubjectName = (id: number) => subjectMap.value.get(id)?.name || '-';
const getTeacherName = (id: number) => teacherMap.value.get(id)?.fullName || '-';
const getClassName = (id: number) => classMap.value.get(id)?.name || '-';
const getRoomNames = (ids: number[]) => (!ids || ids.length === 0) ? 'Biriktirilmagan' : ids.map(id => roomMap.value.get(id)?.shortName).join(', ');

// --- MODAL ACTIONS ---
const openAddModal = (parentId: number) => {
    let defaults = {};
    if (activeTab.value === 'classes') defaults = { classId: parentId };
    else if (activeTab.value === 'rooms') defaults = { roomIds: [parentId] };
    else if (activeTab.value === 'teachers') defaults = { teacherId: parentId };
    else if (activeTab.value === 'subjects') defaults = { subjectId: parentId };

    _lessonModalRef.value?.open(null, defaults);
};

const openEditGroup = (parentId: number) => {
    if (activeTab.value === 'classes') {
        const item = rawData.value.classes.find(c => c.id === parentId);
        if (item) _classModalRef.value?.open(item);
    } else if (activeTab.value === 'teachers') {
        const item = rawData.value.teachers.find(t => t.id === parentId);
        if (item) _teacherModalRef.value?.open(item);
    } else if (activeTab.value === 'subjects') {
        const item = rawData.value.subjects.find(s => s.id === parentId);
        if (item) _subjectModalRef.value?.open(item);
    } else if (activeTab.value === 'rooms') {
        const item = rawData.value.rooms.find(r => r.id === parentId);
        if (item) _roomModalRef.value?.open(item);
    }
};

const openEditLesson = (lesson: any) => {
    _lessonModalRef.value?.open(lesson);
};

const deleteLesson = (lesson: any) => {
    OPEN_DELETE_MODAL({
        title: "Darsni",
        callback: loadItems,
        url: `lessons/v1/${lesson.id}`,
    });
};

onMounted(() => {
    loadItems();
    setTimeout(updateGlider, 100);
});
</script>

<template>
    <div class="flex flex-col gap-6 w-full">
        <div class="sticky top-0 bg-white pb-2 z-10 min-w-[750px]">
            <div class="w-full h-1 bg-white absolute -top-0.5 z-0"></div>
            <div class="flex items-center justify-between gap-4 relative">
                <div class="relative bg-gray-100/80 p-1  rounded-full flex items-center border border-gray-200">
                    <div class="absolute bg-white rounded-full shadow-sm border border-gray-200 transition-all duration-500 cubic-bezier" :style="{ left: gliderStyle.left, width: gliderStyle.width, height: gliderStyle.height }"></div>
                    <button v-for="tab in ['classes', 'teachers', 'subjects', 'rooms']" :key="tab" :ref="(el) => tabRefs[tab] = el as HTMLElement" @click="activeTab = tab as any" class="relative z-10 px-8 py-2.5 rounded-lg text-sm font-bold transition-colors duration-300 flex items-center gap-2 capitalize whitespace-nowrap select-none" :class="activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'">
                        <i v-if="tab === 'classes'" class="ri-group-line text-lg"></i>
                        <i v-if="tab === 'teachers'" class="ri-user-star-line text-lg"></i>
                        <i v-if="tab === 'subjects'" class="ri-book-open-line text-lg"></i>
                        <i v-if="tab === 'rooms'" class="ri-home-office-line text-lg"></i>
                        <p>{{ tab === 'classes' ? 'Sinflar' : tab === 'teachers' ? 'O\'qituvchilar' : tab === 'subjects' ? 'Fanlar' : 'Xonalar' }}</p>
                    </button>
                </div>

                <div class="flex items-center gap-3">
                    <transition name="scale">
                        <button v-if="expandedRows.length > 0" @click="collapseAll" class="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-all border border-red-100 shadow-sm active:scale-95">
                            <i class="ri-collapse-vertical-line text-sm"></i>
                            Yopish <span class="w-5 h-5 rounded-full flex items-center justify-center bg-red-200 text-[10px]">{{ expandedRows.length }}</span>
                        </button>
                    </transition>

                    <div class="h-9 w-px bg-gray-200 mx-2 hidden sm:block"></div>

                    <div class="text-xs text-gray-400 font-medium px-2 hidden sm:flex items-center">
                        Jami: <p class="text-gray-900 font-bold text-base min-w-[26px] leading-[100%] text-end">{{ groupedData.length }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-loading="_loading" class="flex flex-col gap-3 min-h-[300px] min-w-[750px] overflow-x-auto">
            <transition name="slide-up" mode="out-in">
                <div :key="activeTab" class="flex flex-col gap-3">
                    
                    <div v-for="(group, index) in groupedData" :key="index" class="bg-white border border-gray-200 rounded-[14px] overflow-hidden transition-all duration-300 shadow-sm" :class="{'border-red-300 bg-red-50/30 shadow-red-50': group.isError}">
                        <div class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors select-none group relative" @click.self="toggleAccordion(group.id)">
                            
                            <div class="flex items-center gap-4 pointer-events-none">
                                <i class="ri-arrow-right-s-line text-lg text-gray-400 transition-transform duration-300" :class="{ 'rotate-90 text-gray-800': expandedRows.includes(group.id) }"></i>
                                <h3 class="text-base font-semibold text-gray-900">{{ group.title }}</h3>
                                
                                <div class="flex items-center gap-5 ml-8">
                                    <span v-for="(stat, idx) in group.stats" :key="idx" class="flex items-center gap-1.5 text-[13px] whitespace-nowrap transition-colors" :class="stat.isWarning ? 'text-[#c62828]' : 'text-gray-500'">
                                        <i :class="stat.icon" class="text-[15px]"></i> {{ stat.text }}
                                        <span v-if="stat.isWarning && stat.warningText">{{ stat.warningText }}</span>
                                    </span>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 overflow-hidden">
                                <button @click.stop="openAddModal(group.id)" class="flex items-center gap-1.5 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium border border-gray-300 transition-all active:scale-95 shadow-sm">
                                    <i class="ri-add-line text-base"></i>
                                    <p class="hidden xl:block line-clamp-1 break-all">{{ group.addText }}</p>
                                </button>
                                <button @click.stop="openEditGroup(group.id)" class="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                                    <i class="ri-pencil-line text-base"></i>
                                    <p class="hidden xl:block line-clamp-1 break-all">{{ group.editText }}</p>
                                </button>
                            </div>
                        </div>

                        <div class="grid-transition-wrapper" :class="{ 'is-open': expandedRows.includes(group.id) }">
                            <div class="overflow-hidden min-h-0 border-t border-gray-100" :class="{'border-red-100 bg-red-50/20': group.isError}">
                                <div class="w-full">
                                    
                                    <div v-if="group.warningMsg" class="bg-red-50 border-b border-red-100 p-3 px-6 flex items-center gap-2 text-sm text-red-700 font-medium">
                                        <i class="ri-error-warning-fill text-lg"></i> {{ group.warningMsg }}
                                    </div>

                                    <table class="w-full text-left border-collapse">
                                        <thead>
                                            <tr class="text-[13px] text-gray-900 border-b border-gray-100 bg-white">
                                                
                                                <th v-if="activeTab !== 'classes'" class="py-3 px-6 font-semibold w-[15%]">Sinf</th>
                                                <th v-if="activeTab !== 'subjects'" class="py-3 px-6 font-semibold w-[25%]">Fan</th>
                                                <th v-if="activeTab !== 'teachers'" class="py-3 px-6 font-semibold w-[25%]">O'qituvchi</th>
                                                
                                                <th class="py-3 px-6 font-semibold w-[10%]">Chastota</th>
                                                <th class="py-3 px-6 font-semibold w-[15%]">Xona</th>
                                                <th class="py-3 px-6 font-semibold text-right pr-6 w-[100px]">Harakatlar</th>
                                            </tr>
                                        </thead>

                                        <tbody class="text-[14px]">
                                            <tr v-for="lesson in group.items" :key="lesson.id" class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors bg-white">
                                                
                                                <td v-if="activeTab !== 'classes'" class="py-3.5 px-6 text-gray-800">
                                                    {{ getClassName(lesson.classId) }}
                                                </td>

                                                <td v-if="activeTab !== 'subjects'" class="py-3.5 px-6 text-gray-800">
                                                    {{ getSubjectName(lesson.subjectId) }}
                                                </td>

                                                <td v-if="activeTab !== 'teachers'" class="py-3.5 px-6 text-gray-800">
                                                    {{ getTeacherName(lesson.teacherId) }}
                                                </td>

                                                <td class="py-3.5 px-6 text-gray-800">
                                                    {{ lesson.lessonCount }}x
                                                </td>

                                                <td class="py-3.5 px-6 text-gray-500">
                                                    {{ getRoomNames(lesson.roomIds) }}
                                                </td>

                                                <td class="py-3.5 px-6 text-right pr-6">
                                                    <div class="flex items-center justify-end gap-3">
                                                        <button @click="openEditLesson(lesson)" class="text-gray-500 hover:text-gray-900 transition-colors text-[17px] outline-none">
                                                            <i class="ri-pencil-fill text-lg"></i>
                                                        </button>
                                                        <button @click="deleteLesson(lesson)" class="text-red-500 hover:text-red-700 transition-colors text-[17px] outline-none">
                                                            <img class="h-5 cursor-pointer" :src="getIconUrl_UTIL('delete.png')" alt="">
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr v-if="group.items.length === 0">
                                                <td colspan="6" class="py-8 text-center text-gray-400 italic text-sm bg-white">Ushbu bo'limda darslar yo'q</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>

            <div v-if="groupedData.length === 0 && !_loading" class="flex flex-col items-center justify-center py-24 text-gray-400 bg-gray-50 rounded-2xl border border-dashed">
                <i class="ri-folder-open-line text-4xl mb-2 opacity-50"></i>
                <p>Ma'lumot topilmadi</p>
            </div>
        </div>

        <lesson-modal ref="_lessonModalRef" @update="loadItems" />
        <class-modal ref="_classModalRef" @update="loadItems" />
        <teacher-modal ref="_teacherModalRef" @update="loadItems" />
        <subject-modal ref="_subjectModalRef" @update="loadItems" />
        <room-modal ref="_roomModalRef" @update="loadItems" />
    </div>
</template>

<style scoped>
.cubic-bezier { transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1); }
.grid-transition-wrapper { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.grid-transition-wrapper.is-open { grid-template-rows: 1fr; }

.slide-up-enter-active, 
.slide-up-leave-active { 
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
}
.slide-up-enter-from { 
    opacity: 0; 
    transform: translateY(20px); 
}
.slide-up-leave-to { 
    opacity: 0; 
    transform: translateY(-20px); 
}

.scale-enter-active, .scale-leave-active { transition: all 0.2s ease-out; }
.scale-enter-from, .scale-leave-to { opacity: 0; transform: scale(0.9); }
</style>