<template>
	<div class="editor-wrapper">
		<Toolbar @resize="resize"></Toolbar>
		<Splitpanes
			@resized="paneResized"
			theme="default-theme"
		>
			<Pane :size="100 - editorStore.paneSize">
				<Explorer @openFile="loadFile"></Explorer>
			</Pane>
			<Pane :size="editorStore.paneSize">
				<Editor
					ref="editor"
					v-if="editorIsLoaded"
				></Editor>
				<button
					@click="debug"
					style="position:fixed;top:0;right:0;"
				>Debug</button>
			</Pane>
		</Splitpanes>
	</div>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css';

import Editor from './components/Editor.vue'
import Explorer from './components/Explorer.vue'
import Toolbar from './components/Toolbar.vue';
import initMonaco from './helper/monacoLoader';

import { useEditorStore } from './store';
import { mapStores, mapWritableState } from 'pinia';

export default {
	name: 'UpCodeEditor',
	components: {
		Splitpanes,
		Pane,
		Editor,
		Toolbar,
		Explorer
	},
	data() {
		return {
			editorIsLoaded: false,

		}
	},
	props: {
		contextmenu: {
			type: Boolean,
			default: false,
		},
		endpoint: {
			type: String,
			default: "",
		},
	},
	async created() {
		if (!window.monaco) {
			window.monaco = await initMonaco();
		}
		this.editorIsLoaded = true;
		this.editorStore.rightClickFiles = this.contextmenu;
		this.editorStore.endpoint = this.endpoint;

		this.$nextTick(() => {
			this.editorStore.getFiles();

			if (this.load) {
				this.$refs.editor.openFile(this.load);
			}
		});

	},
	computed: {
		...mapStores(useEditorStore),
	},
	methods: {
		resize() {
			this.$refs.editor.resizeEditor();
		},
		paneResized(panes) {
			this.editorStore.paneSize = panes[1].size;
			this.resize();
		},
		loadFile(file) {
			this.$refs.editor.openFile(file);
		},
		debug() {
			debugger;
		}
	}
}
</script>

<style lang="scss">
#editor {
	background: var(--bg-editor);
	border: 2px solid var(--bg-editor);
	font-family: var(--font);

	margin: 0;
	padding: 0;
	box-sizing: border-box;

	&.fullscreen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100% !important;
		height: 100vh !important;
	}

	.editor-wrapper {
		height: 100%;
		width: 100%;
		display: grid;
		grid-template-rows: 40px 1fr;
	}
}
</style>
