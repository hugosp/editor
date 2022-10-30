<template>
	<div class="editor">
		<vue-tabs-chrome ref="tab" class="theme-dark" @remove="removeTab" v-model="currentTab" @click="clickTab" :tabs="tabs" insert-to-after v-show="tabs.length" />
		<div ref="monaco" class="code-editor" />
	</div>
</template>

<script>
import axios from 'axios';
import VueTabsChrome from 'vue3-tabs-chrome';
import 'vue3-tabs-chrome/dist/vue3-tabs-chrome.css';
import { useEditorStore } from '../store';
import { mapWritableState } from 'pinia';


let editor = null;
let editorStates = {};

export default {
	components: {
		VueTabsChrome,
	},
	watch: {
		currentTab(newFile, oldFile) {
			// Spara undan nuvarande state om de finns
			if (editor && editorStates[oldFile]) {
				editorStates[oldFile].viewState = editor.saveViewState();
				editorStates[oldFile].model = editor.getModel();
			}
		},
		settings(changedKey) {
			console.log('changedKey', changedKey);
			if (changedKey === 'theme') {
				monaco.editor.setTheme(this.settings.theme);
				this.getThemeColors();
			} else {
				editor.updateOptions({ changedKey: this.settings[changedKey] });
			}

		}
	},
	computed: {
		...mapWritableState(useEditorStore, ['actions', 'settings', 'currentTab', 'tabs', 'dirtyTabs']),
		tabsMap() {
			const map = {};
			this.tabs.forEach(item => map[item.key] = item);
			return map;
		},
	},
	mounted() {

	},
	methods: {
		getThemeColors() {
			debugger;
			const theme = editor._themeService._theme;
			console.log('theme', theme)
		},
		clickTab(e, tab) {
			this.openFile(tab.key);
		},
		removeTab(tab) {
			if (this.tabs.length) {
				this.openFile(this.tabs[0].key);
			} else {
				editor.dispose();
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
					favico: () => this.dirtyTabs[filePath] ? '🔴' : '🟢',
				});
				this.currentTab = filePath;
			}

			this.initMonacoEditor(filePath);
		},
		initMonacoEditor(filePath) {
			if (!editor) {
				editor = monaco.editor.create(this.$refs.monaco, this.settings);

				editor.onDidChangeModelContent((e) => {
					this.dirtyTabs[this.currentTab] = true;
					console.log(this.tabs, this.dirtyTabs);
				})
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

.tab {
	&-dirty {
		&::after {
			content: '●';
			color: #ff0000;
			font-size: 0.8em;
			margin-left: 0.5em;
		}
	}
}

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
