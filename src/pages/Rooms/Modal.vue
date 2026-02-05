<script lang="ts" setup>
import { ref } from 'vue';
import { useRules } from "./rules";
import { createRoom_API, getRoom_DEFAULT, ROOM_TYPE_ENUM, updateRoom_API, type RoomModel } from '@/services/room';

const _formRef = ref();
const rules = useRules();
const _visible = ref(false);
const _loading = ref(false);
const _buildings = ref<any[]>([]);
const emit = defineEmits(['update']);
const _formData = ref<RoomModel>(getRoom_DEFAULT());


async function open(item: any | null) {
  loadDropdownData();
  _visible.value = true;

  if (item) {
    _formData.value = {
        ...JSON.parse(JSON.stringify(item)),
        buildingId: item.building?.id || item.buildingId,
    };
  }
}

async function loadDropdownData() {
    // const [error, response] = await getBuildingsAll_API();
    // if (!error && response) {
    //     _buildings.value = (response as any) || response;
    // }
}

function close() {
  _visible.value = false;
  _formRef.value?.resetFields();
  _formData.value = getRoom_DEFAULT();
}

async function submit() {
  _formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      _loading.value = true;
      const handler = _formData.value.id ? updateRoom_API : createRoom_API;
      const [error] = await handler(_formData.value);
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
  <el-dialog v-model="_visible" :title="_formData.id ? 'Xonani tahrirlash' : 'Yangi xona qo\'shish'" width="550px" class="room-dialog" @close="close" :show-close="false">
    
    <template #header>
      <div class="flex items-center justify-between p-1">
        <h3 class="text-lg font-bold text-gray-800">{{ _formData.id ? 'Xonani tahrirlash' : 'Yangi xona' }}</h3>
        <button @click="close" class="w-8 h-8 hover:bg-gray-100 rounded-full transition-all flex items-center justify-center">
            <i class="ri-close-line text-xl text-gray-400"></i>
        </button>
      </div>
    </template>

    <el-form ref="_formRef" :model="_formData" :rules="rules" label-position="top">
      
      <div class="grid grid-cols-2 gap-4 mb-2">
        <el-form-item label="Xona nomi" prop="name">
          <el-input v-model="_formData.name" placeholder="Masalan: 101-xona" class="compact-input" />
        </el-form-item>

        <el-form-item label="Qisqa nom (Raqami)" prop="shortName">
          <el-input v-model="_formData.shortName" placeholder="101" class="compact-input" />
        </el-form-item>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-2">
        <el-form-item label="Bino" prop="buildingId">
            <el-select v-model="_formData.buildingId" placeholder="Binoni tanlang" class="compact-input w-full" filterable>
                <el-option v-for="item in _buildings" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>

        <el-form-item label="Xona turi" prop="type">
            <el-select v-model="_formData.type" placeholder="Turini tanlang" class="compact-input w-full">
                <el-option v-for="type in ROOM_TYPE_ENUM" :key="type" :label="type" :value="type" />
            </el-select>
        </el-form-item>
      </div>
      
      <div class="flex justify-end gap-2 pt-4 mt-2 border-t border-gray-50">
        <el-button size="default" class="!rounded-lg !h-9 !px-6" @click="close">Bekor qilish</el-button>
        <el-button type="primary" class="!rounded-lg !h-9 !px-6" :loading="_loading" @click="submit">
            {{ _formData.id ? 'Saqlash' : 'Qo\'shish' }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>