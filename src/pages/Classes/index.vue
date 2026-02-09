<script lang="ts" setup>
import { ref } from 'vue';
import TheModal from './Modal.vue';
import { useRoute, useRouter } from 'vue-router';
import { formatDate_UTIL, SCHOOL_WORKING_DAYS } from '@/utils';
import { OPEN_DELETE_MODAL } from '@/components/DeleteModal/store';
import { getClasses_API, type ClassModel } from '@/services/class';
import { getBaseList_DEFAULT, getBaseParams_DEFAULT, type BaseListModel, type BaseParamsModel } from '@/services/network';

const _modalRef = ref()
const route = useRoute();
const router = useRouter();
const _loading = ref(false);
const _params = ref<BaseParamsModel>(getBaseParams_DEFAULT());
const _items = ref<BaseListModel<ClassModel>>(getBaseList_DEFAULT());

const periods = [1, 2, 3, 4, 5, 6];
const expandedRowKeys = ref<number[]>([]); 


function openModal(item: ClassModel | null) {
  _modalRef.value?.open(item)
}

function copyItem(item: ClassModel) {
    const newItem = JSON.parse(JSON.stringify(item));
    newItem.id = null; 
    newItem.name = `${newItem.name} (copy)`;
    newItem.shortName = `${newItem.shortName} (copy)`;
    openModal(newItem);
}

const toggleRow = (row: any) => {
    if (expandedRowKeys.value.includes(row.id)) {
        expandedRowKeys.value = [];
    } else expandedRowKeys.value = [row.id];
};

const checkAvailability = (availabilities: any[], dayKey: string, period: number) => {
    const dayData = availabilities?.find(d => d.dayOfWeek === dayKey);
    return dayData?.lessons?.includes(period);
};

async function loadItems() {
    _loading.value = true;
    const { page = 1, search = '' } = route.query;
    _params.value.page = Number(page);
    _params.value.search = String(search);

    const [error, response] = await getClasses_API(_params.value);
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

function deleteItem(item: ClassModel) {
    OPEN_DELETE_MODAL({
        title: `${item.name} sinfi`,
        callback: loadItems,
        url: `classes/v1/${item.id}`,
    })
}

const calculateTotalPeriods = (availabilities: any[]) => {
    if (!availabilities) return 0;
    return availabilities.reduce((total, day) => total + (day.lessons ? day.lessons.length : 0), 0);
};



loadItems();
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4">
            <div class="w-full max-w-sm relative custom-search">
                <el-input v-model="_params.search" placeholder="Search..." @input="onSearch" clearable style="width: 200px;">
                    <template #prefix><i class="ri-search-line text-gray-400"></i></template>
                </el-input>
            </div>
            <el-button @click="openModal(null)" type="primary" plain size="large" class="!rounded-xl shadow-sm">
                <i class="ri-add-line mr-1 text-lg"></i> Sinf qo'shish
            </el-button>
        </div>

        <div v-loading="_loading" class="border rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
            <el-table table-layout="auto" :data="_items.content" style="width: 100%" row-key="id" :expand-row-keys="expandedRowKeys" :header-cell-style="{ background: '#fff', color: '#111827', fontWeight: 'bold', height: '56px', borderBottom: '1px solid #f3f4f6' }">
                <el-table-column type="expand" width="1" class-name="hide-expand-icon">
                    <template #default="{ row }">
                        <div class="expanded-row-wrapper">
                            <div class="p-4 py-2 bg-gray-50/50 border-gray-100">
                                <div class="bg-white border rounded-xl p-4 pb-2 shadow-sm">
                                    <div class="flex items-center justify-between mb-4">
                                        <h4 class="text-sm font-bold text-green-700 flex items-center gap-2">
                                            <i class="ri-calendar-check-line"></i> Haftalik bandlik jadvali
                                        </h4>

                                        <div class="flex items-center gap-2 cursor-pointer">
                                            <i class="ri-share-line !text-base text-blue-500"></i>
                                            <p class="text-blue-500 text-[16px]">Boshqalarga qo'llash</p>
                                        </div>
                                    </div>

                                    <div class="overflow-x-auto">
                                        <div class="min-w-[600px]">
                                            <div class="grid grid-cols-[100px_repeat(6,1fr)] gap-2 mb-2">
                                                <div></div>
                                                <div v-for="p in periods" :key="p" class="text-center text-xs font-bold text-gray-400 uppercase">P{{ p }}</div>
                                            </div>

                                            <div v-for="day in SCHOOL_WORKING_DAYS" :key="day.key" class="grid grid-cols-[100px_repeat(6,1fr)] gap-2 mb-2 items-center">
                                                <div class="text-xs font-bold text-gray-600 pl-2">{{ day.label }}</div>
                                                <div v-for="p in periods" :key="p"  class="h-8 rounded flex items-center justify-center text-sm transition-all border" :class="checkAvailability(row.availabilities, day.key, p)  ? 'bg-green-100 border-green-300 text-green-600'  : 'bg-gray-50 border-gray-200 text-gray-300'">
                                                    <i v-if="checkAvailability(row.availabilities, day.key, p)">✓</i>
                                                    <span v-else>—</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Nomi" min-width="120">
                    <template #default="{ row }">
                        <span class="font-bold text-gray-900">{{ row.name }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="Qisqa nom" min-width="120">
                    <template #default="{ row }">
                        <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">{{ row.shortName }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="O'qituvchi" min-width="150">
                    <template #default="{ row }">
                        <div v-if="row.teacher" class="flex items-center gap-2">
                            <span class="font-medium text-gray-700">{{ row.teacher.fullName || row.teacher.name }}</span>
                        </div>
                        <span v-else class="text-gray-400 italic">Tayinlanmagan</span>
                    </template>
                </el-table-column>

                <el-table-column label="Xonalar" min-width="150">
                    <template #default="{ row }">
                        <span v-if="row.rooms && row.rooms.length > 0" class="text-gray-700 font-medium">{{ row.rooms.length }} ta</span>
                        <span v-else class="text-gray-400 italic">Tayinlanmagan</span>
                    </template>
                </el-table-column>

                <el-table-column label="Mavjudlik" min-width="180">
                    <template #default="{ row }">
                        <div @click="toggleRow(row)" class="flex items-center gap-2 text-green-600 font-medium cursor-pointer hover:text-green-700 transition-colors select-none group">
                            <i class="ri-calendar-check-line text-lg"></i>
                            <span>{{ calculateTotalPeriods(row.availabilities) }} periods</span>
                            <i class="ri-arrow-down-s-line text-gray-400 group-hover:text-green-600 transition-transform duration-300" :class="{'rotate-180': expandedRowKeys.includes(row.id)}"></i>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Yangilangan sana" min-width="200">
                    <template #default="{ row }">
                        <span class="text-gray-500 text-sm">{{ formatDate_UTIL(row.updatedDate || row.createdDate) }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="Harakatlar" width="120">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3">
                            <i @click.stop="openModal(row)" class="ri-edit-2-line cursor-pointer text-blue-500 text-lg transition-colors"></i>
                            <i @click.stop="copyItem(row)" class="ri-file-copy-line cursor-pointer text-gray-400 text-lg transition-colors"></i>
                            <i @click.stop="deleteItem(row)" class="ri-delete-bin-6-line cursor-pointer text-red-500 text-lg transition-colors"></i>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <div v-if="_items.totalElements > 0" class="p-4 border-t flex justify-end bg-gray-50/50">
                <el-pagination :current-page="_items.number" :page-size="_params.size" :total="_items.totalElements" layout="prev, pager, next" background @current-change="handlePageChange" />
            </div>
        </div>

        <the-modal ref="_modalRef" @update="loadItems" />
    </div>
</template>

<style scoped>
/* Animatsiya */
.expanded-row-wrapper {
    overflow: hidden;
    transform-origin: top;
    animation: slideDown 0.4s ease-out forwards;
}

@keyframes slideDown {
    0% {
        opacity: 0;
        max-height: 0;
        transform: translateY(-10px) scaleY(0.95);
    }
    100% {
        opacity: 1;
        max-height: 500px;
        transform: translateY(0) scaleY(1);
    }
}
</style>