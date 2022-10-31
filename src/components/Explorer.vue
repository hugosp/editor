<template>
	<div class="explorer">

		<section>
			<div class="title">Files</div>
			<FileExplorerItem @openFile="v => $emit('openFile', v)" v-for="item in files" :item="item"></FileExplorerItem>
		</section>

		<section class="versions">
			<div class="title">Versions</div>
			Here be file versions...
		</section>

		<section class="debug">
			<div class="title">Debug</div>

		</section>
	</div>
</template>

<script>
import FileExplorerItem from './FileExplorerItem.vue';
import { useEditorStore } from '../store';
import { mapStores } from 'pinia';


export default {
	name: "Explorer",
	components: {
		FileExplorerItem,
	},
	data() {
		return {
			files: [],
		};
	},
	computed: {
		...mapStores(useEditorStore),
	},
	mounted() {
		this.editorStore.getFiles().then(res => {
			this.files = res;
		});
	},
}

</script>


<style lang="scss" scoped>
.explorer {
	overflow-y: auto;
	background-color: var(--bg-editor-inactive);
	color: var(--fg-editor);
	padding: var(--padd);
	height: 100%;


	section {
		margin-bottom: 10px;

		.title {
			background: var(--bg-editor-indent);
			border: 1px solid var(--bg-editor-indent-active);
			padding: 2px 5px;
			font-size: 75%;
		}
	}
}
</style>
