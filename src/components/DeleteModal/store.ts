import { ref } from 'vue'

const _deleteModal = ref({
    visible: false,
    title: '',
    url: '',
    callback: () => {}
})

function OPEN_DELETE_MODAL(params: { title: string, url: string, callback?: () => void }) {
    _deleteModal.value.visible = true
    _deleteModal.value.title = params.title
    _deleteModal.value.url = params.url
    
    if (params.callback) {
        _deleteModal.value.callback = params.callback
    }
}

function CLOSE_DELETE_MODAL() {
    _deleteModal.value.visible = false
    _deleteModal.value.url = ''
    _deleteModal.value.title = ''
    _deleteModal.value.callback()
}

export {
    _deleteModal,
    OPEN_DELETE_MODAL,
    CLOSE_DELETE_MODAL,
}