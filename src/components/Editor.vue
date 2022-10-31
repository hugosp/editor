<template>
	<div class="editor">
		<vue-tabs-chrome ref="tab" :class="editorStore.settings.theme.includes('dark') ? 'theme-dark' : ''" @remove="removeTab" v-model="currentTab" @click="clickTab" :tabs="tabs" insert-to-after v-show="tabs.length" />
		<div ref="monaco" class="code-editor" />
	</div>
</template>

<script>
import axios from 'axios';
import VueTabsChrome from 'vue3-tabs-chrome';
import 'vue3-tabs-chrome/dist/vue3-tabs-chrome.css';
import { useEditorStore } from '../store';
import { mapStores, mapWritableState } from 'pinia';


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
		settings: {
			handler(newVal, oldVal) {
				monaco.editor.setTheme(this.settings.theme);
				editor.updateOptions({ wordWrap: this.settings.wordWrap });
				editor.updateOptions({ tabSize: this.settings.tabSize });
				editor.updateOptions({ fontSize: this.settings.fontSize });

				this.getThemeColors();
			}, deep: true
		}
	},
	computed: {
		...mapWritableState(useEditorStore, ['settings', 'currentTab', 'tabs', 'dirtyTabs',]),
		...mapStores(useEditorStore),
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
			if (!editor) return;
			/*
				{"editor.background" => r}
				{"editor.foreground" => r}
				{"editor.inactiveSelectionBackground" => r}
				{"editorIndentGuide.background" => r}
				{"editorIndentGuide.activeBackground" => r}
				{"editor.selectionHighlightBackground" => r}
			*/
			const theme = editor._themeService._theme;
			const bg = theme.colors.get('editor.background').rgba
			const fg = theme.colors.get('editor.foreground').rgba

			const bgi = theme.colors.get('editor.inactiveSelectionBackground').rgba
			const bgin = theme.colors.get('editorIndentGuide.background').rgba
			const bgina = theme.colors.get('editorIndentGuide.activeBackground').rgba
			const bgsh = theme.colors.get('editor.selectionHighlightBackground').rgba

			const root = document.querySelector(':root');

			root.style.setProperty('--bg-editor', `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${bg.a})`);
			root.style.setProperty('--fg-editor', `rgba(${fg.r}, ${fg.g}, ${fg.b}, ${fg.a})`);
			root.style.setProperty('--bg-editor-inactive', `rgba(${bgi.r}, ${bgi.g}, ${bgi.b}, ${bgi.a})`);
			root.style.setProperty('--bg-editor-indent', `rgba(${bgin.r}, ${bgin.g}, ${bgin.b}, ${bgin.a})`);
			root.style.setProperty('--bg-editor-indent-active', `rgba(${bgina.r}, ${bgina.g}, ${bgina.b}, ${bgina.a})`);
			root.style.setProperty('--bg-editor-selection-highlight', `rgba(${bgsh.r}, ${bgsh.g}, ${bgsh.b}, ${bgsh.a})`);

			console.log('Loaded theme colors', theme);
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
				editor = monaco.editor.create(this.$refs.monaco, this.editorStore.settings);

				editor.onDidChangeModelContent((e) => {
					this.dirtyTabs[this.currentTab] = true;
					console.log(this.tabs, this.dirtyTabs);
				})
				this.getThemeColors();
			}

			if (editorStates[filePath]?.model) {
				editor.setModel(editorStates[filePath].model);
				editor.restoreViewState(editorStates[filePath].viewState);
			} else {
				this.editorStore.openFile(filePath)
					.then(res => {
						const model = monaco.editor.createModel(res, this.getLanguage(filePath), monaco.Uri.file(filePath));
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
	background: var(--bg-editor);
	height: 100%;
}
</style>
