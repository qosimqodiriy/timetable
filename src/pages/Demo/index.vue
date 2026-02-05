<script lang="ts" setup>
import { ref, watch } from 'vue';
import TeacherModal from './Modal.vue';
import { useRoute, useRouter } from 'vue-router';
import { getTeachers_API } from '@/services/teacher';
import type { TeacherModel } from '@/services/teacher';
import { OPEN_DELETE_MODAL } from '@/components/DeleteModal/store';
import { getBaseList_DEFAULT, getBaseParams_DEFAULT, type BaseListModel, type BaseParamsModel } from '@/services/network';


const _modalRef = ref()
const route = useRoute();
const router = useRouter();
const _loading = ref(false);
const _params = ref<BaseParamsModel>(getBaseParams_DEFAULT());
const _items = ref<BaseListModel<TeacherModel>>(getBaseList_DEFAULT());


function openModal(item: TeacherModel | null) {
  _modalRef.value?.open(item)
}


async function loadItems() {
    _loading.value = true;
    const { page = 1, search = '' } = route.query;

    _params.value.page = Number(page);
    _params.value.search = String(search);

    const [error, response] = await getTeachers_API(_params.value);
    _loading.value = false;

    if (error) return;
    _items.value = response;
    _items.value.number = page ? Number(page) : 1;
}

const handlePageChange = (page: number) => {
    router.push({ query: { ...route.query, page } });
};

function deleteItem(item: TeacherModel) {
    OPEN_DELETE_MODAL({
      callback: loadItems,
      title: item.fullName,
      url: `call/v1/client/type/${item.id}`,
    })
}


watch(() => route.query, () => {
    loadItems();
}, { deep: true });

watch(() => _params.value.search, (newSearch) => {
    router.push({ query: { ...route.query, search: newSearch, page: 1 } });
});


loadItems();
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4">
            <div class="w-full max-w-sm relative custom-search">
                <el-input v-model="_params.search" placeholder="Qidirish" clearable style="width: 200px;"></el-input>
            </div>

            <el-button @click="openModal(null)" type="primary" size="large" class="!rounded-xl shadow-sm">
                <i class="ri-add-line mr-1 text-lg"></i> O'qituvchi qo'shish
            </el-button>
        </div>

        <div v-loading="_loading" class="border rounded-2xl overflow-hidden bg-white shadow-sm transition-all">

            <el-table :data="_items.content" style="width: 100%" :header-cell-style="{ background: '#f9fafb', color: '#111827', fontWeight: '600', height: '56px' }">
                <el-table-column label="Nomi" min-width="200">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3 px-1">
                            <div
                                class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100 uppercase">
                                {{ row.fullName?.charAt(0) || '?' }}
                            </div>
                            <span class="font-semibold text-gray-800">{{ row.fullName }}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Qisqa nom" prop="shortName" min-width="150" />

                <el-table-column label="Fanlar" min-width="200">
                    <template #default="{ row }">
                        <div class="flex flex-wrap gap-1">
                            <el-tag v-for="id in row.subjects" :key="id" size="small" effect="light" type="info"
                                class="!rounded-md">
                                ID: {{ id }}
                            </el-tag>
                            <span v-if="!row.subjects?.length" class="text-gray-300 text-xs italic">Mavjud emas</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Mavjudlik" min-width="150">
                    <template #default="{ row }">
                        <div class="flex items-center gap-1.5">
                            <i class="ri-calendar-event-line text-blue-500"></i>
                            <span class="text-sm text-gray-600 font-medium">
                                {{ row.availabilities?.length || 0 }} ta vaqt
                            </span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="Harakatlar" align="right" width="160">
                    <template #default="{ row }">
                        <div class="flex justify-end gap-1 px-2">
                            <el-button @click="openModal(row)" size="small" link class="!p-2 hover:bg-blue-50 rounded-lg group">
                                <i class="ri-edit-2-line text-gray-400 group-hover:text-blue-500 transition-colors"></i>
                            </el-button>
                            <el-button @click="deleteItem(row)" size="small" link class="!p-2 hover:bg-red-50 rounded-lg group">
                                <i class="ri-delete-bin-6-line text-gray-400 group-hover:text-red-500 transition-colors"></i>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>

                <template #empty>
                    <div class="py-16 flex flex-col items-center gap-2">
                        <i class="ri-user-search-line text-4xl text-gray-200"></i>
                        <p class="text-gray-400 font-medium italic">O'qituvchi topilmadi</p>
                    </div>
                </template>
            </el-table>

            <div v-if="_items.totalElements > 0" class="p-4 border-t flex justify-end bg-gray-50/50">
                <el-pagination :current-page="_items.number" :page-size="_params.size" :total="_items.totalElements" layout="prev, pager, next" background @current-change="handlePageChange" />
            </div>
        </div>

        <teacher-modal ref="_modalRef" @update="loadItems" />
    </div>
</template>