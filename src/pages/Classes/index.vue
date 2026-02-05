<script lang="ts" setup>
import { ref } from 'vue';
import TheModal from './Modal.vue';
import { useRoute, useRouter } from 'vue-router';
import { OPEN_DELETE_MODAL } from '@/components/DeleteModal/store';
import { getClasses_API, type ClassModel } from '@/services/class';
import { getBaseList_DEFAULT, getBaseParams_DEFAULT, type BaseListModel, type BaseParamsModel } from '@/services/network';

const _modalRef = ref()
const route = useRoute();
const router = useRouter();
const _loading = ref(false);
const _params = ref<BaseParamsModel>(getBaseParams_DEFAULT());
const _items = ref<BaseListModel<ClassModel>>(getBaseList_DEFAULT());

function openModal(item: ClassModel | null) {
  _modalRef.value?.open(item)
}

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

// Kun nomlarini qisqartirish uchun yordamchi funksiya
const getDayShortName = (day: string) => {
    const days: Record<string, string> = {
        MONDAY: 'Dush', TUESDAY: 'Sesh', WEDNESDAY: 'Chor', 
        THURSDAY: 'Pay', FRIDAY: 'Juma', SATURDAY: 'Shan', SUNDAY: 'Yak'
    };
    return days[day] || day;
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

            <el-button @click="openModal(null)" type="primary" size="large" class="!rounded-xl shadow-sm">
                <i class="ri-add-line mr-1 text-lg"></i> Sinf qo'shish
            </el-button>
        </div>

        <div v-loading="_loading" class="border rounded-2xl overflow-hidden bg-white shadow-sm transition-all">

            <el-table :data="_items.content" style="width: 100%" :header-cell-style="{ background: '#f9fafb', color: '#111827', fontWeight: '600', height: '56px' }">
                
                <el-table-column label="Sinf" min-width="120">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3 px-1">
                            <div class="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-lg border border-orange-100">
                                {{ row.name }}
                            </div>
                            <div class="flex flex-col">
                                <span class="text-xs text-gray-400">ID: {{ row.id }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Haftalik yuklama" min-width="400">
                    <template #default="{ row }">
                        <div class="flex flex-wrap gap-2">
                            <div v-for="av in row.availabilities" :key="av.dayOfWeek" 
                                 class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 border border-gray-100"
                                 :class="{'!bg-blue-50 !border-blue-100': av.lessons?.length > 0}"
                            >
                                <span class="text-[10px] font-bold text-gray-500 uppercase">{{ getDayShortName(av.dayOfWeek) }}</span>
                                <span class="text-xs font-semibold" :class="av.lessons?.length ? 'text-blue-600' : 'text-gray-300'">
                                    {{ av.lessons?.length || 0 }} soat
                                </span>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Harakatlar" width="120" align="right">
                    <template #default="{ row }">
                        <div class="flex justify-end gap-2 px-2">
                            <el-button @click="openModal(row)" size="small" link class="!p-2 hover:bg-blue-50 rounded-lg group">
                                <i class="ri-edit-2-line text-gray-400 group-hover:text-blue-500 text-lg transition-colors"></i>
                            </el-button>
                            <el-button @click="deleteItem(row)" size="small" link class="!p-2 hover:bg-red-50 rounded-lg group">
                                <i class="ri-delete-bin-6-line text-gray-400 group-hover:text-red-500 text-lg transition-colors"></i>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>

                <template #empty>
                    <div class="py-16 flex flex-col items-center gap-2">
                        <i class="ri-community-line text-4xl text-gray-200"></i>
                        <p class="text-gray-400 font-medium italic">Sinflar topilmadi</p>
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