<template>
	<div class="editor-wrapper">
		<Toolbar></Toolbar>
		<Splitpanes @resized="paneResized">
			<Pane :size="panes[0]">
				<Explorer @openFile="loadFile" v-if="this.actions.files"></Explorer>
			</Pane>
			<Pane :size="panes[1]">
				<Editor ref="editor" :settings="settings" v-if="editorIsLoaded"></Editor>
				<button @click="debug" style="position:fixed;top:0;right:0;">Debug</button>
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
import { mapWritableState } from 'pinia';

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
		...mapWritableState(useEditorStore, ['settings', 'rightClickFiles', 'actions', 'panes']),
	},
	watch: {
		load(val) {
			console.log('load changed to ' + val);
			this.$refs.editor.openFile(val);
		},
	},
	methods: {
		paneResized(panes) {
			this.panes = panes.map(pane => pane.size);
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
@import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

#editor {
	background: var(--bg-editor);
	height: 90%;
	width: 90%;
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
