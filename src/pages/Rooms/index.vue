<script lang="ts" setup>
import { ref } from 'vue';
import TheModal from './Modal.vue';
import { getIconUrl_UTIL, SCHOOL_WORKING_DAYS } from '@/utils';
import { useRoute, useRouter } from 'vue-router';
import { getRooms_API, ROOM_TYPE, type RoomModel } from '@/services/room';
import { OPEN_DELETE_MODAL } from '@/components/DeleteModal/store';
import { getBaseList_DEFAULT, getBaseParams_DEFAULT, type BaseListModel, type BaseParamsModel } from '@/services/network';

const _modalRef = ref()
const route = useRoute();
const router = useRouter();
const _loading = ref(false);
const _params = ref<BaseParamsModel>(getBaseParams_DEFAULT());
const _items = ref<BaseListModel<RoomModel>>(getBaseList_DEFAULT());

const periods = [1, 2, 3, 4, 5, 6];
const expandedRowKeys = ref<number[]>([]); 

function openModal(item: RoomModel | null) {
  _modalRef.value?.open(item)
}

function copyItem(item: RoomModel) {
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
    if (!availabilities) return false;
    const dayData = availabilities.find(d => d.dayOfWeek === dayKey);
    return dayData?.lessons?.includes(period);
};

const calculateTotalPeriods = (availabilities: any[]) => {
    if (!availabilities) return 0;
    return availabilities.reduce((total, day) => total + (day.lessons ? day.lessons.length : 0), 0);
};

async function loadItems() {
    _loading.value = true;
    const { page = 1, search = '' } = route.query;

    _params.value.size = 12;
    _params.value.page = Number(page);
    _params.value.search = String(search);

    const [error, response] = await getRooms_API(_params.value);
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

function deleteItem(item: RoomModel) {
    OPEN_DELETE_MODAL({
        title: `${item.name} - xonasi`,
        callback: loadItems,
        url: `rooms/v1/${item.id}`,
    })
}

loadItems();
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4">
            <div class="w-full max-w-sm relative custom-search">
                <el-input v-model="_params.search" placeholder="Qidirish..." @input="onSearch" clearable style="width: 200px;">
                    <template #prefix>
                        <i class="ri-search-line text-gray-400"></i>
                    </template>
                </el-input>
            </div>

            <el-button @click="openModal(null)" type="primary" plain>
                <i class="ri-add-line text-lg"></i> 
                <p class="hidden md:block ml-1">Xona qo'shish</p>
            </el-button>
        </div>

        <div v-loading="_loading" class="border rounded-2xl overflow-hidden bg-white shadow-sm transition-all">

            <el-table table-layout="auto" :data="_items.content" style="width: 100%" row-key="id" :expand-row-keys="expandedRowKeys" :header-cell-style="{ background: '#f9fafb', color: '#111827', fontWeight: '600', height: '56px' }">
                <el-table-column type="expand" width="1" class-name="hide-expand-icon">
                    <template #default="{ row }">
                        <div class="expanded-row-wrapper">
                            <div class="p-4 py-2 bg-gray-50/50 border-gray-100">
                                <div class="bg-white border rounded-xl p-4 pb-2 shadow-sm">
                                    <div class="flex items-center justify-between mb-4">
                                        <h4 class="text-sm font-bold text-green-700 flex items-center gap-2">
                                            <i class="ri-calendar-check-line"></i> Xona bandligi jadvali
                                        </h4>
                                        <div class="flex items-center gap-2 cursor-pointer">
                                            <i class="ri-share-line !text-base text-blue-500"></i>
                                            <p class="text-blue-500 text-[14px]">Boshqalarga qo'llash</p>
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
                                                    <span v-if="checkAvailability(row.availabilities, day.key, p)">✓</span>
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

                <el-table-column label="Name" min-width="200">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3">
                            <i class="ri-building-line text-2xl text-gray-400"></i>
                            <span class="text-gray-900 text-[15px]">{{ row.name }}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Short Name" min-width="150">
                    <template #default="{ row }">
                        <span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm border border-gray-200">
                            {{ row.shortName }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="Xona turi" min-width="180">
                    <template #default="{ row }">
                    <span  v-if="row.type" class="px-3 py-1 rounded-lg text-sm font-medium border" :class="row.type === 'SPECIAL' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-purple-100 text-purple-700 border-purple-200'">{{ ROOM_TYPE.get(row.type) }}</span>
                        <span v-else class="text-gray-400 italic">Tayinlanmagan</span>
                    </template>
                </el-table-column>

                <el-table-column label="Mavjudlik" min-width="150">
                    <template #default="{ row }">
                        <div @click="toggleRow(row)" class="flex items-center gap-2 text-green-600 font-medium cursor-pointer hover:text-green-700 transition-colors select-none group">
                            <i class="ri-calendar-check-line text-lg"></i>
                            <span>{{ calculateTotalPeriods(row.availabilities) }} periods</span>
                            <i class="ri-arrow-down-s-line text-gray-400 group-hover:text-green-600 transition-transform duration-300" :class="{'rotate-180': expandedRowKeys.includes(row.id)}"></i>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Harakatlar" width="120">
                    <template #default="{ row }">
                        <div class="flex justify-end gap-3 px-2">
                            <i @click.stop="openModal(row)" class="ri-pencil-fill cursor-pointer text-blue-500 text-lg transition-colors"></i>
                            <img @click.stop="copyItem(row)" class="h-5 cursor-pointer" :src="getIconUrl_UTIL('copy.png')" alt="">
                            <img @click.stop="deleteItem(row)" class="h-5 cursor-pointer" :src="getIconUrl_UTIL('delete.png')" alt="">
                        </div>
                    </template>
                </el-table-column>

                <template #empty>
                    <div class="py-16 flex flex-col items-center gap-2">
                        <i class="ri-home-office-line text-4xl text-gray-200"></i>
                        <p class="text-gray-400 font-medium italic">Xonalar topilmadi</p>
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