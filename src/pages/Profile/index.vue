<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

// Namuna uchun interfeys
interface ProfileModel {
    avatarUrl?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const getProfile_DEFAULT = (): ProfileModel => ({
    avatarUrl: '', // Boshlang'ich rasm URL si bo'lsa shu yerga keladi
    fullName: 'saydaliyevelmurod01',
    email: 'saydaliyevelmurod01@gmail.com',
    phoneNumber: '',
    role: 'Administrator',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const _loading = ref(false);
const _isEditing = ref(false);
const _item = ref<ProfileModel>(getProfile_DEFAULT());
const _originalItem = ref<ProfileModel>(getProfile_DEFAULT());

// --- Rasm yuklash holatlari ---
const _avatarFile = ref<File | null>(null);
const _avatarPreview = ref<string>('');

// O'zgarishlarni tekshirish (Rasm ham o'zgarganini hisobga olamiz)
const _isChanged = computed(() => {
    const isProfileChanged = JSON.stringify({
        fullName: _item.value.fullName,
        email: _item.value.email,
        phoneNumber: _item.value.phoneNumber
    }) !== JSON.stringify({
        fullName: _originalItem.value.fullName,
        email: _originalItem.value.email,
        phoneNumber: _originalItem.value.phoneNumber
    });

    return isProfileChanged || _avatarFile.value !== null;
});

const _isPasswordChanged = computed(() => {
    return _item.value.currentPassword || _item.value.newPassword || _item.value.confirmPassword;
});

async function loadItems() {
    _loading.value = true;
    // API CHAQIRUV (Simulyatsiya)
    setTimeout(() => {
        const response = getProfile_DEFAULT();
        _item.value = JSON.parse(JSON.stringify(response));
        _originalItem.value = JSON.parse(JSON.stringify(response));
        _avatarPreview.value = response.avatarUrl || '';
        _loading.value = false;
    }, 500);
}

// --- RASM YUKLASH FUNKSIYASI ---
const handleAvatarChange = (uploadFile: any) => {
    const rawFile = uploadFile.raw;
    
    // Fayl hajmini tekshirish (Masalan: 2MB)
    if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error("Rasm hajmi 2MB dan oshmasligi kerak!");
        return false;
    }

    _avatarFile.value = rawFile;
    _avatarPreview.value = URL.createObjectURL(rawFile); // UI da darhol ko'rsatish uchun
};

const handleStartEdit = () => {
    _isEditing.value = true;
    _item.value = JSON.parse(JSON.stringify(_originalItem.value));
};

const handleCancel = () => {
    _isEditing.value = false;
    _item.value = JSON.parse(JSON.stringify(_originalItem.value));
    
    // Parol va rasm holatlarini tozalash
    _item.value.currentPassword = '';
    _item.value.newPassword = '';
    _item.value.confirmPassword = '';
    _avatarFile.value = null;
    _avatarPreview.value = _originalItem.value.avatarUrl || '';
};

// --- PROFILNI SAQLASH (SUBMIT) ---
const handleUpdate = async () => {
    if (!_isChanged.value) { 
        _isEditing.value = false; 
        return; 
    }

    _loading.value = true;
    
    try {
        // HAQIQIY API GA YUBORISH UCHUN TAYYORGARLIK:
        /*
        const formData = new FormData();
        formData.append('fullName', _item.value.fullName);
        formData.append('email', _item.value.email);
        formData.append('phoneNumber', _item.value.phoneNumber);
        
        if (_avatarFile.value) {
            formData.append('avatar', _avatarFile.value); // Rasmni fayl sifatida qoshamiz
        }

        const [error, response] = await updateProfile_API(formData);
        if (error) throw new Error(error.message);
        */

        // API Simulyatsiyasi
        setTimeout(() => {
            _loading.value = false;
            _isEditing.value = false;
            _originalItem.value = JSON.parse(JSON.stringify(_item.value));
            _avatarFile.value = null; // Saqlangandan keyin yangi faylni tozalaymiz
            ElMessage.success("Profil muvaffaqiyatli yangilandi!");
        }, 1000);

    } catch (error) {
        _loading.value = false;
        ElMessage.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    }
};

// --- PAROLNI SAQLASH (SUBMIT) ---
const handleUpdatePassword = async () => {
    if (!_item.value.currentPassword || !_item.value.newPassword || !_item.value.confirmPassword) {
        ElMessage.warning("Iltimos, barcha maydonlarni to'ldiring.");
        return;
    }
    
    if (_item.value.newPassword !== _item.value.confirmPassword) {
        ElMessage.error("Yangi parollar bir xil emas!");
        return;
    }

    _loading.value = true;
    
    try {
        // HAQIQIY API GA YUBORISH:
        /*
        const payload = {
            currentPassword: _item.value.currentPassword,
            newPassword: _item.value.newPassword
        };
        const [error, response] = await updatePassword_API(payload);
        if (error) throw new Error(error.message);
        */

        // API Simulyatsiyasi
        setTimeout(() => {
            _loading.value = false;
            _item.value.currentPassword = '';
            _item.value.newPassword = '';
            _item.value.confirmPassword = '';
            ElMessage.success("Parol muvaffaqiyatli yangilandi!");
        }, 1000);

    } catch (error) {
        _loading.value = false;
        ElMessage.error("Parolni yangilashda xatolik yuz berdi.");
    }
};

onMounted(() => {
    loadItems();
});
</script>

<template>
    <div v-loading="_loading" class="flex flex-col gap-6 w-full max-w-[800px] pb-5">
        
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex flex-col gap-1">
                <h2 class="flex items-center gap-3 text-2xl font-extrabold text-gray-800">Profil</h2>
                <p class="text-gray-500 text-sm font-medium">Shaxsiy ma'lumotlaringizni boshqaring</p>
            </div>

            <div class="flex items-center gap-2">
                <el-button v-if="_isEditing" @click="handleCancel" plain type="primary" size="large" class="!rounded-xl">
                    <i class="ri-close-line mr-1"></i>
                    <p>Bekor qilish</p>
                </el-button>
                
                <el-button v-if="_isEditing" @click="handleUpdate" plain type="success" size="large" :disabled="!_isChanged" class="!rounded-xl">
                    <i class="ri-save-3-line mr-1"></i>
                    <p>O‘zgarishlarni saqlash</p>
                </el-button>

                <el-button v-if="!_isEditing" @click="handleStartEdit" plain type="primary" size="large" class="!rounded-xl">
                    <i class="ri-edit-line mr-1"></i>
                    <p>Ma'lumotlarni tahrirlash</p>
                </el-button>
            </div>
        </div>

        <el-collapse-transition>
            <div v-if="_isEditing && _isChanged" class="fixed bottom-10 right-10 z-50">
                <div class="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
                    <i class="ri-error-warning-fill text-amber-500 text-xl animate-pulse"></i>
                    <span class="text-amber-800 font-medium">Sizda saqlanmagan o'zgarishlar mavjud</span>
                </div>
            </div>
        </el-collapse-transition>

        <div class="flex flex-col gap-6 p-5 pb-2 border border-gray-200 rounded-[20px] bg-white shadow-sm" :class="_isEditing ? '' : 'pointer-events-none'">
            <div class="flex flex-col gap-1 mb-1">
                <h3 class="text-lg font-bold text-gray-900">Profile Information</h3>
                <p class="text-gray-500 text-sm font-medium">Shaxsiy profil ma'lumotlarini yangilash</p>
            </div>

            <div class="flex items-center gap-6 pb-4 border-b border-gray-100">
                
                <div class="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-800 shrink-0 overflow-hidden">
                    <img v-if="_avatarPreview" :src="_avatarPreview" class="w-full h-full object-cover" alt="Avatar" />
                    <span v-else>{{ _item.fullName.substring(0, 2).toUpperCase() }}</span>
                </div>
                
                <div class="flex flex-col items-start gap-2">
                    <el-upload action="#" :show-file-list="false" :auto-upload="false" accept="image/jpeg,image/png,image/gif" :on-change="handleAvatarChange" :disabled="!_isEditing">
                        <!-- <p :class="_isEditing ? 'cursor-pointer' : 'pointer-events-none'">Rasmni o'zgartirish</p> -->
                        <el-button size="default" class="!rounded-lg font-medium !h-8" :disabled="!_isEditing">Rasmni o'zgartirish</el-button>
                    </el-upload>
                    <span class="text-xs text-gray-500 font-medium">JPG, PNG yoki GIF. Maksimal hajm: 2MB.</span>
                </div>
            </div>

            <el-form :model="_item" label-width="auto" label-position="top" class="custom-form grid grid-cols-1 md:grid-cols-2 gap-x-5">
                <el-form-item label="Full Name">
                    <el-input v-model="_item.fullName" placeholder="Ism sharif" :readonly="!_isEditing" class="custom-input"></el-input>
                </el-form-item>

                <el-form-item label="Role">
                    <el-input v-model="_item.role" disabled class="custom-input is-disabled"></el-input>
                </el-form-item>

                <el-form-item label="Email">
                    <el-input v-model="_item.email" placeholder="Elektron manzil" :readonly="!_isEditing" class="custom-input"></el-input>
                </el-form-item>

                <el-form-item label="Phone Number">
                    <el-input v-model="_item.phoneNumber" placeholder="Telefon raqam" :readonly="!_isEditing" class="custom-input"></el-input>
                </el-form-item>
            </el-form>
        </div>

        <div class="flex flex-col gap-6 p-5 border border-gray-200 rounded-[20px] bg-white shadow-sm">
            <div class="flex items-center justify-between">
                <div class="flex flex-col gap-1">
                    <h3 class="text-lg font-bold text-gray-900">Change Password</h3>
                    <p class="text-gray-500 text-sm font-medium">Hisobingiz xavfsizligini ta'minlash uchun parolni yangilang</p>
                </div>
            </div>

            <el-form :model="_item" label-width="auto" label-position="top" class="custom-form">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <el-form-item label="Current Password" class="md:col-span-2 md:w-[48.5%]">
                        <el-input v-model="_item.currentPassword" type="password" show-password placeholder="Joriy parolni kiriting" class="custom-input"></el-input>
                    </el-form-item>

                    <el-form-item label="New Password">
                        <el-input v-model="_item.newPassword" type="password" show-password placeholder="Yangi parol" class="custom-input"></el-input>
                    </el-form-item>

                    <el-form-item label="Confirm New Password">
                        <el-input v-model="_item.confirmPassword" type="password" show-password placeholder="Yangi parolni tasdiqlang" class="custom-input"></el-input>
                    </el-form-item>
                </div>

                <div class="mt-4">
                    <el-button type="primary" class="!rounded-xl !px-6 !h-10 !bg-gray-900 !border-gray-900 transition-all active:scale-95" @click="handleUpdatePassword" :disabled="!_isPasswordChanged">
                        Update Password
                    </el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>