<script lang="ts" setup>
import { ref } from 'vue';
import TheModal from './Modal.vue';
import { useRoute, useRouter } from 'vue-router';
import { OPEN_DELETE_MODAL } from '@/components/DeleteModal/store';
import { getTimetables_API, type TimetableModel } from '@/services/timetable';
import { getBaseList_DEFAULT, getBaseParams_DEFAULT, type BaseListModel, type BaseParamsModel } from '@/services/network';

const _modalRef = ref()
const route = useRoute();
const router = useRouter();
const _loading = ref(false);
const _params = ref<BaseParamsModel>(getBaseParams_DEFAULT());
const _items = ref<BaseListModel<TimetableModel>>(getBaseList_DEFAULT());

function openModal(item: TimetableModel | null) {
  _modalRef.value?.open(item)
}

async function loadItems() {
    _loading.value = true;
    const { page = 1, search = '' } = route.query;

    _params.value.page = Number(page);
    _params.value.search = String(search);

    const [error, response] = await getTimetables_API(_params.value);
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

function deleteItem(item: TimetableModel) {
    OPEN_DELETE_MODAL({
        callback: loadItems,
        title: `${item.name}`,
        url: `timetable/v1/timetable/${item.id}`,
    })
}

// Yordamchi funksiyalar
const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Foizni hisoblash
const calculatePercentage = (scheduled: number | null, unscheduled: number | null) => {
    const s = scheduled || 0;
    const u = unscheduled || 0;
    const total = s + u;
    if (total === 0) return 0;
    return Math.round((s / total) * 100);
};

loadItems();
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4">
            <div class="w-full max-w-sm relative custom-search">
                <el-input v-model="_params.search" placeholder="Qidirish" @input="onSearch" clearable style="width: 200px;">
                    <template #prefix>
                        <i class="ri-search-line text-gray-400"></i>
                    </template>
                </el-input>
            </div>

            <el-button @click="openModal(null)" type="primary" plain>
                <i class="ri-add-line text-lg"></i> 
                <p class="hidden md:block ml-1">Jadval yaratish</p>
            </el-button>
        </div>

        <div v-loading="_loading" class="border rounded-2xl overflow-hidden bg-white shadow-sm transition-all">

            <el-table table-layout="auto" :data="_items.content" style="width: 100%" :header-cell-style="{ background: '#f9fafb', color: '#111827', fontWeight: '600', height: '56px' }">
                
                <el-table-column label="Jadval nomi" min-width="220">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3 px-1">
                            <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100">
                                <i class="ri-calendar-todo-line"></i>
                            </div>
                            <div class="flex flex-col">
                                <span class="font-semibold text-gray-800">{{ row.name }}</span>
                                <span class="text-[11px] text-gray-400">Task ID: {{ row.taskId || '-' }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Holati" min-width="200">
                    <template #default="{ row }">
                        <div class="flex flex-col w-full pr-4">
                            <div class="flex justify-between text-xs mb-1">
                                <span class="text-gray-600 font-medium">Joylandi: {{ row.scheduled || 0 }}</span>
                                <span class="text-gray-400">Qoldi: {{ row.unscheduled || 0 }}</span>
                            </div>
                            <el-progress 
                                :percentage="calculatePercentage(row.scheduled, row.unscheduled)" 
                                :status="row.unscheduled === 0 ? 'success' : ''" 
                                :stroke-width="8" 
                                :show-text="false"
                            />
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Sifat" min-width="120">
                    <template #default="{ row }">
                        <div class="flex items-center gap-1.5">
                            <i class="ri-bar-chart-box-line text-green-500"></i>
                            <span class="font-bold text-gray-700">{{ row.score || 0 }}</span>
                            <span class="text-xs text-gray-400">ball</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Muammolar" min-width="180">
                    <template #default="{ row }">
                        <div class="flex flex-col gap-1">
                            <div v-if="row.teacherGaps > 0" class="inline-flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 w-fit">
                                <i class="ri-user-unfollow-line"></i>
                                <span>{{ row.teacherGaps }} ta o'qituvchi bo'sh</span>
                            </div>
                            <div v-if="row.classGaps > 0" class="inline-flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 w-fit">
                                <i class="ri-community-line"></i>
                                <span>{{ row.classGaps }} ta sinf bo'sh</span>
                            </div>
                            <div v-if="!row.teacherGaps && !row.classGaps" class="text-xs text-green-600 flex items-center gap-1">
                                <i class="ri-check-double-line"></i> Hammasi joyida
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Yaratilgan vaqti" min-width="150">
                    <template #default="{ row }">
                        <div class="flex flex-col">
                            <span class="text-sm text-gray-600">{{ formatDate(row.createdDate) }}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Harakatlar" width="120">
                    <template #default="{ row }">
                        <div class="flex justify-end gap-2 px-2">
                            <el-button @click="openModal(row)" size="small" link class="!p-2 hover:bg-indigo-50 rounded-lg group">
                                <i class="ri-pencil-fill text-gray-400 group-hover:text-indigo-500 text-lg transition-colors"></i>
                            </el-button>
                            <el-button @click="deleteItem(row)" size="small" link class="!p-2 hover:bg-red-50 rounded-lg group">
                                <i class="ri-delete-bin-6-line text-gray-400 group-hover:text-red-500 text-lg transition-colors"></i>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>

                <template #empty>
                    <div class="py-16 flex flex-col items-center gap-2">
                        <i class="ri-calendar-event-line text-4xl text-gray-200"></i>
                        <p class="text-gray-400 font-medium italic">Jadvallar topilmadi</p>
                    </div>
                </template>
            </el-table>

            <div v-if="_items.totalElements > 0" class="p-4 border-t flex justify-end bg-gray-50/50">
                <el-pagination :current-page="_items.number" :page-size="_params.size" :total="_items.totalElements" layout="prev, pager, next" background @current-change="handlePageChange" />
            </div>
        </div>

        <the-modal ref="_modalRef" @update="loadItems" />
    </div>
</template>