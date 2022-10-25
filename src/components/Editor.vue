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
		currentTab(val, o) {
			console.log(val, o)
			if (val !== null && val !== this.currentTab) {
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
			if (editor && editorStates[filePath]) {
				editorStates[filePath].viewState = editor.saveViewState();
				editorStates[filePath].model = editor.getModel();
			}

			if (this.tabsMap[filePath]) {
				this.currentTab = filePath;
			} else {
				const label = filePath.split('/').pop();

				this.$refs.tab.addTab({
					label: label,
					key: filePath,
					closable: true,
					isDirty: false,
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

			console.log('set state to ', filePath, editorStates)

			if (editorStates[filePath]?.model) {
				console.log('byt editorstate');
				editor.setModel(editorStates[filePath].model);
				editor.restoreViewState(editorStates[filePath].viewState);
			} else {
				axios.get(this.actions.open, {
					params: {
						filename: filePath,
					},
				}).then(res => {
					const model = monaco.editor.createModel(res.data.data, this.getLanguage(filePath));
					editor.setModel(model);

					editorStates[filePath] = {
						model: editor.getModel(),
						viewState: editor.saveViewState()
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
