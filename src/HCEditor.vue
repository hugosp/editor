<template>
	<div class="editor-wrapper">
		<Toolbar></Toolbar>
		<Splitpanes>
			<Pane size="20">
				<FileExplorer :actions="actions" @openFile="loadFile"></FileExplorer>
			</Pane>
			<Pane size="80">
				<Editor ref="editor" :settings="settings" :actions="actions" v-if="editorIsLoaded"></Editor>
				<button @click="debug" style="position:fixed;top:0;right:0;">Debug</button>
			</Pane>
		</Splitpanes>
	</div>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css';

import Editor from './components/Editor.vue'
import FileExplorer from './components/FileExplorer.vue'
import Toolbar from './components/Toolbar.vue';
import initMonaco from './helper/monacoLoader';

import { useEditorStore } from './store';
import { mapWritableState } from 'pinia';

export default {
	name: 'UpCodeEditor',
	components: {
		Splitpanes,
		Pane,
		Editor,
		Toolbar,
		FileExplorer
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
		files: {
			type: String,
			default: "",
		},
		load: {
			type: String,
			default: "",
		},
		open: {
			type: String,
			default: "",
		},
		save: {
			type: String,
			default: "",
		},
		move: {
			type: String,
			default: "",
		},
		delete: {
			type: String,
			default: "",
		}
	},
	async created() {
		if (!window.monaco) {
			window.monaco = await initMonaco();
		}
		this.editorIsLoaded = true;
		this.rightClickFiles = this.contextmenu;
		this.actions = {
			files: this.files,
			load: this.load,
			open: this.open,
			save: this.save,
			move: this.move,
			delete: this.delete,
		}

		this.$nextTick(() => {
			if (this.load) {
				this.$refs.editor.openFile(this.load);
			}
		});

	},
	computed: {
		...mapWritableState(useEditorStore, ['settings', 'rightClickFiles', 'actions']),
	},
	watch: {
		load(val) {
			console.log('load changed to ' + val);
			this.$refs.editor.openFile(val);
		},
	},
	methods: {
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
@import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

#editor {
	height: 90%;
	width: 90%;
	border: 2px solid var(--bg-dark);
	font-family: var(--font);

	margin: 0;
	padding: 0;
	box-sizing: border-box;

	.editor-wrapper {
		height: 100%;
		width: 100%;
		display: grid;
		grid-template-rows: 40px 1fr;
	}
}
</style>
