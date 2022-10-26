<template>
	<div class="editor">
		<vue-tabs-chrome ref="tab" class="theme-dark" @remove="removeTab" v-model="currentTab" @click="clickTab" :tabs="tabs" insert-to-after />
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
		currentTab(newFile, oldFile) {
			// Spara undan nuvarande state om de finns
			if (editor && editorStates[oldFile]) {
				editorStates[oldFile].viewState = editor.saveViewState();
				editorStates[oldFile].model = editor.getModel();
			}

			// monacoTree.setSelection(val);

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

	},
	methods: {
		clickTab(e, tab) {
			this.openFile(tab.key);
		},
		removeTab(tab) {
			console.log('remove tab', tab);
			if (this.tabs.length) {
				this.openFile(this.tabs[0].key);
			}
			editorStates[tab.key] = null;
		},
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

			if (this.tabsMap[filePath]) {
				this.currentTab = filePath;
			} else {
				this.$refs.tab.addTab({
					label: filePath.split('/').pop(),
					key: filePath,
					closable: true,
					isDirty: false,
					// favico: `fa fa-file-code-o`,
				});
				this.currentTab = filePath;
			}

			this.initMonacoEditor(filePath);
		},
		initMonacoEditor(filePath) {
			if (!editor) {
				editor = monaco.editor.create(this.$refs.monaco, this.settings);
			}

			if (editorStates[filePath]?.model) {
				editor.setModel(editorStates[filePath].model);
				editor.restoreViewState(editorStates[filePath].viewState);
			} else {
				axios.get(this.actions.open, { params: { filename: filePath } })
					.then(res => {
						const model = monaco.editor.createModel(res.data.data, this.getLanguage(filePath), monaco.Uri.file(filePath));
						editor.setModel(model);

						editorStates[filePath] = {
							model: editor.getModel(),
							viewState: editor.saveViewState()
						}
					}).catch(err => {
						console.error(err);
					});
			}
		}
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
