import App from './App.vue'
import i18n from "./i18n";
import router from './router'
import { createApp } from 'vue'
import './assets/style/main.css'
import 'element-plus/dist/index.css'
import 'remixicon/fonts/remixicon.css'

import ElementPlus from 'element-plus'
import NotFound from "@/components/NotFound/index.vue";
import BackTitle from "@/components/BackTitle/index.vue";
import DeleteModal from "@/components/DeleteModal/index.vue";

const app = createApp(App)

app.use(i18n);
app.use(router)
app.use(ElementPlus)

app.component("NotFound", NotFound);
app.component("BackTitle", BackTitle);
app.component("DeleteModal", DeleteModal);

app.mount('#app')
