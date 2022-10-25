<template>
	<div ref="wrapper" :class="`monaco-with-tree${isFullScreen ? ' full-screen' : ''}`">
		<Splitpanes>
			<Pane size="20">
				<div ref="menu" class="monaco-menu-pane" />
			</Pane>
			<Pane size="80">
				<div class="monaco-right-pane">
					<vue-tabs-chrome ref="tab" class="theme-dark" v-model="currentTab" :tabs="tabs" insert-to-after />

					<i @click="toggleFullScreen" :class="['btn-fullscreen', 'luyou-icon',
					isFullScreen ? 'icontuichuquanping' : 'iconquanping1',
					isFullScreen ? 'fullscreen' : '']">Full</i>

					<div ref="monaco" :style="{height: `calc(100% - ${tabHeight}px)`, visibility2: currentTab ? 'visible' : 'hidden'}" />

					<div v-show="!currentTab" class="no-tab-pane" :style="{height: `calc(100% - ${tabHeight}px)`}">
						<div class="center-wrapper">Välj en fil att läsa in...</div>
					</div>
				</div>

			</Pane>
		</Splitpanes>
	</div>
</template>


<script>
import VueTabsChrome from 'vue3-tabs-chrome';
import NiceMonacoTree from 'nice-monaco-tree';
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import 'vue3-tabs-chrome/dist/vue3-tabs-chrome.css'

import initMonaco from '../helper/monacoLoader';

let monacoDiffEditor = null;
let monacoEditor = null;
let monacoTree = null;

export default {
	components: {
		VueTabsChrome,
		Splitpanes, Pane
	},
	props: {
		files: {
			type: Array,
			// default: () => [],
			default: () => ['package.json', 'README.md', 'index.js', 'src/test.js', 'src/index.js', 'public/index.html'],
		},
		defaultOpenFiles: {
			type: Array,
			// default: () => [],
			default: () => 'README.md',
		},
		readonly: {
			type: Boolean,
			default: true,
		},
		getFileContent: {
			type: Function,
			default: filePath => {
				// return `${filePath}-left`
				return [`${filePath}-left`, `${filePath}-right`];
			},
		},
		getFileTitle: {
			type: Function,
			default: filePath => filePath.split('/').pop(),
		},
		monacoConfig: {
			type: Object,
			default: () => ({}),
		}
	},
	data() {
		return {
			tabHeight: 48,
			currentTab: '',
			tabs: [],
			isFullScreen: false,
			monaco: null,
		};
	},
	computed: {
		tabsMap() {
			const map = {};
			this.tabs.forEach(item => map[item.key] = item);
			return map;
		},
	},
	watch: {
		currentTab(val) {
			if (val) {
				this.openFile(val);
				monacoTree.setSelection(val);
			}
		},
	},
	async created() {
		this.monaco = await initMonaco();
	},
	mounted() {
		this.$nextTick(() => {
			this.initMonacoTree();
		});
	},
	destroyed() {
		monacoDiffEditor && monacoDiffEditor.dispose();
		monacoEditor && monacoEditor.dispose();
		monacoDiffEditor = null;
		monacoEditor = null;
	},
	methods: {
		initMonacoTree() {
			console.log(this.files);
			monacoTree = NiceMonacoTree.init(this.$refs.menu, {
				files: this.files,
				onClick: (filePath, file, fileIcon) => {
					this.openFile(filePath, file, fileIcon, true);
				},
				onDoubleClick: (filePath, file, fileIcon) => {
					this.openFile(filePath, file, fileIcon, true);
				},
			});
			monacoTree.expandAll();
			setTimeout(() => {
				if (this.defaultOpenFiles && this.defaultOpenFiles[0]) {
					monacoTree.setSelection(this.defaultOpenFiles[0]);
				}
			});
		},
		getMonacoTree() {
			return monacoTree;
		},
		getMonacoDiffEditor() {
			return monacoDiffEditor;
		},
		// 选中并打开某个文件
		setSelection(filePath) {
			monacoTree && monacoTree.setSelection(filePath);
		},
		initMonacoEditor(filePath) {
			const resp = this.getFileContent(filePath);
			const [left, right] = resp instanceof Array ? resp : [resp];
			const modeMap = {
				js: 'javascript',
				json: 'json',
				html: 'html',
				md: 'markdown',
			};
			const ext = filePath.slice(filePath.lastIndexOf('.') + 1);
			const language = modeMap[ext.toLowerCase()] || 'javascript';
			if (!monacoDiffEditor) {
				// 如果不是diff模式
				if (!right) {
					monacoEditor = this.monaco.editor.create(this.$refs.monaco, {
						theme: 'vs-dark',
						fontSize: '13px',
						readOnly: true,
						// todo 切换文件时需要修改语言
						language,
					});
				} else {
					monacoDiffEditor = this.monaco.editor.createDiffEditor(this.$refs.monaco, {
						// 禁用分割线resize
						enableSplitViewResizing: false,
						theme: 'vs-dark',
						fontSize: '13px',
						readOnly: true,
						automaticLayout: true,
					});
				}
			}
			if (!right) {
				monacoEditor.setValue(left);
			} else {
				const original = this.monaco.editor.createModel(left, language);
				const modified = this.monaco.editor.createModel(right, language);
				monacoDiffEditor.setModel({ original, modified });
			}
		},
		openFile(filePath, file, fileIcon, isDoubleClick = true) {
			// const idx = this.tabs.findIndex(item => item.key === filePath);
			if (this.tabsMap[filePath]) {
				this.currentTab = filePath;
				if (isDoubleClick && this.tabsMap[filePath].tempOpen) {
					this.tabsMap[filePath].tempOpen = false;
				}
			} else {
				if (isDoubleClick) {
					this.$refs.tab.addTab({
						label: this.getFileTitle(filePath),
						key: filePath,
						closable: true,
						// 默认的icon只支持传图片，这里我们直接使用monaco的icon class来实现图标展示
						// 通过设置一个空的favicon来设置一个占位符
						favico: `monaco-icon-label ${fileIcon}`,
						//  h => h('span'),
						// class: `monaco-icon-label ${fileIcon}`,
					});
					this.currentTab = filePath;
				} else {

				}
			}
			this.initMonacoEditor(filePath);
		},
		resize() {

		},
		toggleFullScreen() {
			this.isFullScreen = !this.isFullScreen;
		},
	}
}
</script>

<style lang="scss">
.monaco-with-tree {
	height: 100%;
	width: 100%;
	background: #3a3a3a;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
	-webkit-font-smoothing: antialiased;

	&.full-screen {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh !important;
		z-index: 100000;
	}

	.monaco-menu-pane {
		height: 100%;
	}

	.monaco-right-pane {
		height: 100%;
		position: relative;

		.vue-tabs-chrome {

			*,
			*::before,
			*::after {
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
			}

			font-size: 14px;

			.tabs-item.monaco-icon-label::before {
				box-sizing: content-box;
				position: absolute;
				left: 22px;
				top: 5px;
				z-index: 1;
			}
		}

		.no-tab-pane {
			background-color: #1e1e1e;
			text-align: center;
			position: absolute;
			left: 0;
			top: 48px;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.btn-fullscreen {
		position: absolute;
		top: 10px;
		right: 8px;
		z-index: 2000;
		color: white;
		width: 24px;
		height: 24px;
		text-align: center;
		line-height: 24px;
		cursor: pointer;
		opacity: 0.8;

		&.fullscreen {
			position: fixed;
		}

		&:hover {
			opacity: 1;
		}
	}
}
</style>
