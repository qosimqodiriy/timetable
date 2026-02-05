<script lang="ts" setup>
import { ref } from 'vue';
import TheModal from './Modal.vue';
import { useRoute, useRouter } from 'vue-router';
import { OPEN_DELETE_MODAL } from '@/components/DeleteModal/store';
import { getSubjects_API, type SubjectModel } from '@/services/subject';
import { getBaseList_DEFAULT, getBaseParams_DEFAULT, type BaseListModel, type BaseParamsModel } from '@/services/network';

const _modalRef = ref()
const route = useRoute();
const router = useRouter();
const _loading = ref(false);
const _params = ref<BaseParamsModel>(getBaseParams_DEFAULT());
const _items = ref<BaseListModel<SubjectModel>>(getBaseList_DEFAULT());

function openModal(item: SubjectModel | null) {
    _modalRef.value?.open(item)
}

async function loadItems() {
    _loading.value = true;
    const { page = 1, search = '' } = route.query;

    _params.value.page = Number(page);
    _params.value.search = String(search);

    const [error, response] = await getSubjects_API(_params.value);
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

function deleteItem(item: SubjectModel) {
    OPEN_DELETE_MODAL({
        title: item.name,
        callback: loadItems,
        url: `subjects/v1/${item.id}`,
    })
}

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
                <i class="ri-add-line mr-1 text-lg"></i> Fan qo'shish
            </el-button>
        </div>

        <div v-loading="_loading" class="border rounded-2xl overflow-hidden bg-white shadow-sm transition-all">

            <el-table :data="_items.content" style="width: 100%" :header-cell-style="{ background: '#f9fafb', color: '#111827', fontWeight: '600', height: '56px' }">
                
                <el-table-column label="Fan nomi" min-width="200">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3 px-1">
                            <div class="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg border transition-all"
                                 :style="{ 
                                     backgroundColor: (row.color || '#3b82f6') + '15', 
                                     color: row.color || '#3b82f6',
                                     borderColor: (row.color || '#3b82f6') + '30'
                                 }">
                                {{ row.emoji || row.name?.charAt(0) }}
                            </div>
                            <div class="flex flex-col">
                                <span class="font-semibold text-gray-800">{{ row.name }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Qisqa nom" prop="shortName" min-width="150">
                    <template #default="{ row }">
                        <span class="font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded text-sm border border-gray-200">
                            {{ row.shortName }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="Yuklama" min-width="150">
                    <template #default="{ row }">
                        <div class="flex items-center gap-2">
                            <i class="ri-scales-3-line text-gray-400"></i>
                            <span class="text-sm text-gray-600 font-medium">
                                {{ row.weight ? row.weight + ' ball/soat' : '-' }}
                            </span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Harakatlar" width="120">
                    <template #default="{ row }">
                        <div class="flex justify-center gap-2">
                            <i @click="openModal(row)" class="ri-edit-2-line text-gray-400 group-hover:text-blue-500 transition-colors"></i>
                            <i @click="deleteItem(row)" class="ri-delete-bin-6-line text-gray-400 group-hover:text-red-500 transition-colors"></i>
                        </div>
                    </template>
                </el-table-column>

                <template #empty>
                    <div class="py-16 flex flex-col items-center gap-2">
                        <i class="ri-book-open-line text-4xl text-gray-200"></i>
                        <p class="text-gray-400 font-medium italic">Fanlar topilmadi</p>
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