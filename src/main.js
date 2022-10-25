import { createApp, defineComponent } from 'vue'
import './variables.css';
// import App from './App.vue'
import HCEditor from './HCEditor.vue';

const app = createApp({});
app.component('hc-editor', HCEditor);
app.mount('#editor');
