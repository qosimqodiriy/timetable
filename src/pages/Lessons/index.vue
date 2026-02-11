<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { getLessonAll_DEFAULT, getLessonsAll_API, type LessonAllModel } from '@/services/lessons';

const _loading = ref(false);
const expandedRows = ref<number[]>([]);
const tabRefs = ref<Record<string, HTMLElement>>({});
const rawData = ref<LessonAllModel>(getLessonAll_DEFAULT());
const gliderStyle = ref({ left: '4px', width: '0px', height: '0px' });
const activeTab = ref<'classes' | 'teachers' | 'subjects' | 'rooms'>('classes');


const classMap = computed(() => new Map(rawData.value.classes.map(i => [i.id, i])));
const teacherMap = computed(() => new Map(rawData.value.teachers.map(i => [i.id, i])));
const subjectMap = computed(() => new Map(rawData.value.subjects.map(i => [i.id, i])));
const roomMap = computed(() => new Map(rawData.value.rooms.map(i => [i.id, i])));


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
            height: `${activeEl.offsetHeight}px`
        };
    }
};

watch(activeTab, () => {
    expandedRows.value = [];
    nextTick(updateGlider);
});

window.addEventListener('resize', updateGlider);

const groupedData = computed(() => {
    const { lessons, classes, teachers, subjects, rooms } = rawData.value;
    if (activeTab.value === 'classes') {
        return classes.map(cls => ({
            id: cls.id, title: cls.name, subTitle: `${cls.availabilities?.length || 0} kun mavjud`, icon: 'ri-group-line',
            items: lessons.filter(l => l.classId === cls.id)
        }));
    }
    if (activeTab.value === 'teachers') {
        return teachers.map(t => ({
            id: t.id, title: t.fullName, subTitle: t.shortName, icon: 'ri-user-star-line',
            items: lessons.filter(l => l.teacherId === t.id)
        }));
    }
    if (activeTab.value === 'subjects') {
        return subjects.map(s => ({
            id: s.id, title: s.name, subTitle: `Yuklama: ${s.weight || 0}`, icon: 'ri-book-open-line',
            items: lessons.filter(l => l.subjectId === s.id)
        }));
    }
    if (activeTab.value === 'rooms') {
        return rooms.map(r => ({
            id: r.id, title: r.name, subTitle: r.type || 'Umumiy', icon: 'ri-home-office-line',
            items: lessons.filter(l => l.roomIds && l.roomIds.includes(r.id))
        }));
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
const getRoomNames = (ids: number[]) => (!ids || ids.length === 0) ? 'Xona yo\'q' : ids.map(id => roomMap.value.get(id)?.shortName).join(', ');

// Placeholders
const openAddModal = (id: number) => console.log(id);
const openEditLesson = (l: any) => console.log(l);
const deleteLesson = (l: any) => console.log(l);


onMounted(() => {
    loadItems();
    setTimeout(updateGlider, 100);
});
</script>


<template>
    <div class="flex flex-col gap-6">
        <div class="sticky top-0 bg-white pb-2 z-10">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="relative bg-gray-100/80 p-1  rounded-full flex items-center border border-gray-200">
                    <div class="absolute bg-white rounded-full shadow-sm border border-gray-200 transition-all duration-500 cubic-bezier" :style="{ left: gliderStyle.left, width: gliderStyle.width, height: gliderStyle.height }"></div>
                    <button v-for="tab in ['classes', 'teachers', 'subjects', 'rooms']" :key="tab" :ref="(el) => tabRefs[tab] = el as HTMLElement" @click="activeTab = tab as any" class="relative z-10 px-8 py-2.5 rounded-lg text-sm font-bold transition-colors duration-300 flex items-center gap-2 capitalize whitespace-nowrap select-none" :class="activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'">
                        <i v-if="tab === 'classes'" class="ri-group-line text-lg"></i>
                        <i v-if="tab === 'teachers'" class="ri-user-star-line text-lg"></i>
                        <i v-if="tab === 'subjects'" class="ri-book-open-line text-lg"></i>
                        <i v-if="tab === 'rooms'" class="ri-home-office-line text-lg"></i>
                        {{ tab === 'classes' ? 'Sinflar' : tab === 'teachers' ? 'O\'qituvchilar' : tab === 'subjects' ? 'Fanlar' : 'Xonalar' }}
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

        <div v-loading="_loading" class="flex flex-col gap-3 min-h-[200px]">
            <transition name="fade" mode="out-in">
                <div :key="activeTab" class="flex flex-col gap-3">
                    <div v-for="group in groupedData" :key="group.id" class="bg-white border rounded-2xl overflow-hidden transition-shadow duration-300">
                        <div @click="toggleAccordion(group.id)" class="flex items-center justify-between p-4 px-1 cursor-pointer hover:bg-gray-50 transition-colors select-none group relative overflow-hidden" :class="{ 'border-b border-gray-100 bg-gray-50/30': expandedRows.includes(group.id) }">
                            <div class="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500 transition-transform duration-300" :class="expandedRows.includes(group.id) ? 'scale-y-100' : 'scale-y-0'"></div>

                            <div class="flex items-center gap-5 pl-3">
                                <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all duration-300" :class="expandedRows.includes(group.id) ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm'">
                                    <i :class="group.icon"></i>
                                </div>
                                <div class="flex flex-col">
                                    <h3 class="text-[15px] font-bold text-gray-800">{{ group.title }}</h3>
                                    <span class="text-xs text-gray-500 font-medium">{{ group.subTitle }}</span>
                                </div>
                            </div>

                            <div class="flex items-center gap-4 pr-2">
                                <span class="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">{{ group.items.length }} dars</span>
                                <i class="ri-arrow-down-s-line text-xl text-gray-400 transition-transform duration-300" :class="{ 'rotate-180 text-blue-600': expandedRows.includes(group.id) }"></i>
                            </div>
                        </div>

                        <div class="grid-transition-wrapper" :class="{ 'is-open': expandedRows.includes(group.id) }">
                            <div class="overflow-hidden min-h-0">
                                <div class="p-3 bg-gray-50/50">
                                    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">

                                        <div class="flex justify-between items-center p-3 px-4 border-b border-gray-100 bg-white">
                                            <span class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Darslar jadvali</span>
                                            <button @click.stop="openAddModal(group.id)" class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-all active:scale-95">
                                                <i class="ri-add-line"></i> Qo'shish
                                            </button>
                                        </div>

                                        <div class="overflow-x-auto">
                                            <table class="w-full text-left border-collapse">
                                                <thead>
                                                    <tr
                                                        class="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/30">
                                                        <th v-if="activeTab !== 'subjects'"
                                                            class="px-4 py-3 font-semibold pl-5">Fan</th>
                                                        <th v-if="activeTab !== 'teachers'"
                                                            class="px-4 py-3 font-semibold">O'qituvchi</th>
                                                        <th v-if="activeTab !== 'classes'"
                                                            class="px-4 py-3 font-semibold">Sinf</th>
                                                        <th class="px-4 py-3 font-semibold text-center">Chastota</th>
                                                        <th class="px-4 py-3 font-semibold">Xona</th>
                                                        <th class="px-4 py-3 font-semibold text-right pr-5">Amallar</th>
                                                    </tr>
                                                </thead>

                                                <tbody class="text-sm">
                                                    <tr v-for="lesson in group.items" :key="lesson.id" class="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors group/row">

                                                        <td v-if="activeTab !== 'subjects'" class="px-4 py-3 font-bold text-gray-800 pl-5">
                                                            {{ getSubjectName(lesson.subjectId) }}
                                                        </td>

                                                        <td v-if="activeTab !== 'teachers'" class="px-4 py-3 text-gray-600">
                                                            {{ getTeacherName(lesson.teacherId) }}
                                                        </td>

                                                        <td v-if="activeTab !== 'classes'" class="px-4 py-3">
                                                            <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold border">{{ getClassName(lesson.classId) }}</span>
                                                        </td>

                                                        <td class="px-4 py-3 text-center">
                                                            <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{{ lesson.lessonCount }}x</span>
                                                        </td>

                                                        <td class="px-4 py-3 text-gray-500 text-xs">
                                                            <div class="flex items-center gap-1.5">
                                                                <i class="ri-map-pin-line"></i> {{ getRoomNames(lesson.roomIds) }}
                                                            </div>
                                                        </td>

                                                        <td class="px-4 py-3 text-right pr-5">
                                                            <div class="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                                <button @click="openEditLesson(lesson)" class="w-7 h-7 flex items-center justify-center rounded bg-gray-100 hover:bg-blue-500 hover:text-white transition-colors">
                                                                    <i class="ri-pencil-line"></i>
                                                                </button>
                                                                <button @click="deleteLesson(lesson)" class="w-7 h-7 flex items-center justify-center rounded bg-gray-100 hover:bg-red-500 hover:text-white transition-colors">
                                                                    <i class="ri-delete-bin-line"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr v-if="group.items.length === 0">
                                                        <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic text-sm"> Ma'lumot yo'q</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>

            <div v-if="groupedData.length === 0 && !_loading" class="flex flex-col items-center justify-center py-24 text-gray-400 bg-white rounded-3xl border border-dashed">
                <i class="ri-folder-open-line text-4xl mb-2 opacity-50"></i>
                <p>Ma'lumot topilmadi</p>
            </div>

        </div>
    </div>
</template>

<style scoped>
.cubic-bezier {
    transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
}

.grid-transition-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.grid-transition-wrapper.is-open {
    grid-template-rows: 1fr;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.scale-enter-active,
.scale-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0.8);
}
</style>