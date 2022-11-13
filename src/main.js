import { defineCustomElementWrapped } from './CustomElementWrapped';
import { createPinia } from 'pinia';

import HCEditor from './HCEditor.ce.vue';

const store = createPinia();
window.customElements.define('up-code-editor', defineCustomElementWrapped(HCEditor, { plugins: [store], }));
