<template>
	<div class="editor">
		<vue-tabs-chrome ref="tab" class="theme-dark" v-model="currentTab" :tabs="tabs" insert-to-after />
		<div ref="monaco" class="code-editor" />
	</div>
</template>

<script>
import axios from 'axios';
import VueTabsChrome from 'vue3-tabs-chrome';
import 'vue3-tabs-chrome/dist/vue3-tabs-chrome.css';

let editor = null;
let editorStates = {};



export default {
	components: {
		VueTabsChrome,
	},
	props: ['settings', 'actions'],
	data() {
		return {
			tabs: [],
			currentTab: null,
			tabHeight: 0,
		}
	},
	watch: {
		currentTab(val) {
			if (val) {
				this.openFile(val);
				// monacoTree.setSelection(val);
			}
		},
	},
	computed: {
		tabsMap() {
			const map = {};
			this.tabs.forEach(item => map[item.key] = item);
			return map;
		},
	},
	mounted() {
		console.log(this.settings)
	},
	methods: {
		getLanguage(filePath) {
			const langMap = {
				js: 'javascript',
				json: 'json',
				twig: 'twig',
				html: 'twig',
				md: 'markdown',
				css: 'css',
				svg: 'html'
			};
			const ext = filePath.split('.').pop();
			return langMap[ext] || 'twig';

		},
		settingsUpdate(key, val) {
			switch (key) {
				case 'theme':
					editor.updateOptions({ theme: val });
					break;

				case 'wordWrap':
					editor.updateOptions({ wordWrap: val });
					break;

				default:
					break;
			}
		},
		openFile(filePath) {

			// Spara undan nuvarande state om de finns
			if (editor && this.currentTab && editorStates[this.currentTab]) {
				editorStates[this.currentTab].viewState = editor.saveViewState();
				editorStates[this.currentTab].model = editor.getModel();
			}

			if (this.tabsMap[filePath]) {
				this.currentTab = filePath;
			} else {
				const label = filePath.split('/').pop();

				this.$refs.tab.addTab({
					label: label,
					key: filePath,
					closable: true,
					// favico: `fa fa-file-code-o`,
					// class: `fa fa-file-code-o`, //`monaco-icon-label ${fileIcon}`,
				});
				this.currentTab = filePath;
			}
			this.initMonacoEditor(filePath);
		},
		initMonacoEditor(filePath) {
			if (!editor) {
				editor = monaco.editor.create(this.$refs.monaco, this.settings);
			}

			if (editorStates[filePath]) {
				editor.restoreViewState(editorStates[filePath].viewState);
				editor.setModel(editorStates[filePath].model);
			} else {
				axios.get(this.actions.open, {
					params: {
						path: filePath,
					},
				}).then(res => {
					const model = monaco.editor.createModel(res.data, this.getLanguage(filePath));
					editor.setModel(model);
					editorStates[filePath] = {
						model: model,
						viewState: null
					}
				}).catch(err => {
					console.log(err);
				});
			}
		},
	}
}
</script>

<style lang="scss">
@font-face {
	font-family: 'codicon';
	src: url('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/base/browser/ui/codicons/codicon/codicon.ttf') format('truetype');
}

@import url('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/editor/editor.main.css');


.editor {
	height: 100%;
	width: 100%;
	display: grid;
	grid-template-rows: 42px 1fr;
}

.code-editor {
	background: var(--bg-dark);
	height: 100%;
}
</style>
