<template>
	<div class="explorer">

		<section>
			<div class="title">Files</div>
			<FileExplorerItem
				@openFile="v => $emit('openFile', v)"
				v-for="item in editorStore.files"
				:item="item"
			></FileExplorerItem>
		</section>

		<section class="versions">
			<div class="title">Versions</div>
			Here be file versions...
		</section>

		<section
			class="debug"
			v-if="this.editorStore.debug"
		>
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
	computed: {
		...mapStores(useEditorStore),
	},
	mounted() {

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
		overflow-x: hidden;

		.title {
			background: var(--bg-editor-indent);
			border: 1px solid var(--bg-editor-indent-active);
			padding: 2px 5px;
			font-size: 75%;
			margin-bottom: 5px;
		}
	}
}
</style>
