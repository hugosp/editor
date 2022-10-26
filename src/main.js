import { createApp, defineComponent } from 'vue'
import { createPinia } from 'pinia';
import './variables.css';
import HCEditor from './HCEditor.vue';

const app = createApp({});
const pinia = createPinia();


app.use(pinia);
app.component('hc-editor', HCEditor);
app.mount('#editor');
