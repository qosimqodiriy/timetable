<script lang="ts" setup>
import { ref } from 'vue';
import TheModal from './Modal.vue';
import { useRoute, useRouter } from 'vue-router';
import { OPEN_DELETE_MODAL } from '@/components/DeleteModal/store';
import { getLessons_API, type LessonModel } from '@/services/lessons';
import { getBaseList_DEFAULT, getBaseParams_DEFAULT, type BaseListModel, type BaseParamsModel } from '@/services/network';

const _modalRef = ref()
const route = useRoute();
const router = useRouter();
const _loading = ref(false);
const _params = ref<BaseParamsModel>(getBaseParams_DEFAULT());
const _items = ref<BaseListModel<LessonModel>>(getBaseList_DEFAULT());

function openModal(item: LessonModel | null) {
    _modalRef.value?.open(item)
}

async function loadItems() {
    _loading.value = true;
    const { page = 1, search = '' } = route.query;

    _params.value.page = Number(page);
    _params.value.search = String(search);

    const [error, response] = await getLessons_API(_params.value);
    _loading.value = false;

    if (error) return;
    _items.value = response;
    _items.value.number = page ? Number(page) : 1;
}

async function onSearch() {
    await router.replace({ query: { ...route.query, search: _params.value.search, page: 1 } });
    loadItems();
}

async function handlePageChange(page: number) {
    await router.replace({ query: { page } });
    loadItems();
}

function deleteItem(item: LessonModel) {
    OPEN_DELETE_MODAL({
        callback: loadItems,
        title: `${item.class?.name}`,
        url: `lessons/v1/${item.id}`,
    })
}

loadItems();
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4">
            <div class="w-full max-w-sm relative custom-search">
                <el-input v-model="_params.search" placeholder="Qidirish" @input="onSearch" clearable
                    style="width: 200px;"></el-input>
            </div>

            <el-button @click="openModal(null)" type="primary" size="large" class="!rounded-xl shadow-sm">
                <i class="ri-add-line mr-1 text-lg"></i> Dars qo'shish
            </el-button>
        </div>

        <div v-loading="_loading" class="border rounded-2xl overflow-hidden bg-white shadow-sm transition-all">

            <el-table :data="_items.content" style="width: 100%" :header-cell-style="{ background: '#f9fafb', color: '#111827', fontWeight: '600', height: '56px' }">

                <el-table-column label="Sinf" min-width="100">
                    <template #default="{ row }">
                        <div class="flex items-center gap-2">
                            <span
                                class="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 font-bold rounded-lg text-sm">
                                {{ row.class?.name || '?' }}
                            </span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Fan" min-width="200">
                    <template #default="{ row }">
                        <div v-if="row.subject"
                            class="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-sm font-medium"
                            :style="{
                                backgroundColor: (row.subject.color || '#3b82f6') + '15',
                                borderColor: (row.subject.color || '#3b82f6') + '30',
                                color: row.subject.color || '#3b82f6'
                            }">
                            <span>{{ row.subject.emoji || '📖' }}</span>
                            <span>{{ row.subject.name }}</span>
                        </div>
                        <span v-else class="text-gray-400 text-xs italic">Fan belgilanmagan</span>
                    </template>
                </el-table-column>

                <el-table-column label="O'qituvchi" min-width="200">
                    <template #default="{ row }">
                        <div v-if="row.teacher" class="flex items-center gap-3">
                            <div
                                class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs border">
                                {{ row.teacher.fullName?.charAt(0) }}
                            </div>
                            <span class="text-gray-700 font-medium text-sm">{{ row.teacher.fullName }}</span>
                        </div>
                        <span v-else class="text-gray-400 text-xs italic">Biriktirilmagan</span>
                    </template>
                </el-table-column>

                <el-table-column label="Vaqt" min-width="150">
                    <template #default="{ row }">
                        <div class="flex flex-col">
                            <div class="flex items-center gap-1.5">
                                <i class="ri-calendar-line text-gray-400"></i>
                                <span class="text-sm font-semibold text-gray-800 uppercase">{{ row.dayOfWeek || '' }}</span>
                            </div>
                            <div v-if="row.period" class="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                                <i class="ri-time-line"></i>
                                <span>{{ row.period }}-soat ({{ row.lessonCount }}x)</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Harakatlar" width="120" align="right">
                    <template #default="{ row }">
                        <div class="flex justify-end gap-2 px-2">
                            <i @click="openModal(row)"
                                class="ri-edit-2-line text-gray-400 hover:text-blue-500 cursor-pointer transition-colors"></i>
                            <i @click="deleteItem(row)"
                                class="ri-delete-bin-6-line text-gray-400 hover:text-red-500 cursor-pointer transition-colors"></i>
                        </div>
                    </template>
                </el-table-column>

                <template #empty>
                    <div class="py-16 flex flex-col items-center gap-2">
                        <i class="ri-calendar-todo-line text-4xl text-gray-200"></i>
                        <p class="text-gray-400 font-medium italic">Darslar jadvali bo'sh</p>
                    </div>
                </template>
            </el-table>

            <div v-if="_items.totalElements > 0" class="p-4 border-t flex justify-end bg-gray-50/50">
                <el-pagination :current-page="_items.number" :page-size="_params.size" :total="_items.totalElements"
                    layout="prev, pager, next" background @current-change="handlePageChange" />
            </div>
        </div>

        <the-modal ref="_modalRef" @update="loadItems" />
    </div>
</template>