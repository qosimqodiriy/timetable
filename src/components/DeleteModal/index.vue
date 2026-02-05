<script setup lang="ts">
import { ref } from 'vue'
import i18n from '@/i18n';
import { ElNotification } from 'element-plus'
import { deleteItem } from '@/services/network'
import { _deleteModal, CLOSE_DELETE_MODAL } from './store'

const { t } = i18n.global
const _loading = ref(false)

async function submit() {
  _loading.value = true
  const [error] = await deleteItem(_deleteModal.value.url)
  _loading.value = false

  if (error) {

  } else {
    ElNotification({
      type: 'success',
      title: t('successful'),
      message: t('elementDeleted'),
    })

    CLOSE_DELETE_MODAL()
  }
}

document.addEventListener('keydown', (evt: any) => {
  if (_deleteModal.value.visible && evt.key === 'Enter') {
    submit()
  }
})
</script>

<template>
  <el-dialog v-model="_deleteModal.visible" width="400">
    <div class="flex flex-col space-y-3">
      <div class="bg-red-color p-3 rounded-xl flex items-center justify-center self-start">
        <i class="ri-delete-bin-line text-white"></i>
      </div>

      <div class="flex flex-col space-y-1">
        <p class="text-lg leading-5 font-medium text-main-dark-color">{{ $t(`deleteText`) }}</p>
        <p class="text-base text-main-dark-color line-clamp-5 break-all">{{ _deleteModal.title }}</p>
      </div>

      <div class="flex gap-3">
        <button @click="_deleteModal.visible = false" class="rounded-xl p-4 w-full bg-light-background-color text-main-dark-color font-medium">{{ $t('cancel') }}</button>
        <button @click="submit" :loading="_loading" class="rounded-xl p-4 w-full bg-red-color text-white font-medium">{{ $t('delete') }}</button>
      </div>
    </div>
  </el-dialog>
</template>