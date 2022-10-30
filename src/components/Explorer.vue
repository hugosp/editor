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
import axios from 'axios';

import { useEditorStore } from '../store';
import { mapWritableState, mapState } from 'pinia';


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
		...mapWritableState(useEditorStore, ['actions', 'currentTab']),
	},
	mounted() {
		axios.get(this.actions.files)
			.then((res) => {
				this.files = res.data.data;
				// console.log(this.files);
			}).catch((err) => {
				console.log(err);
			});
	},
}

</script>


<style lang="scss" scoped>
.explorer {
	overflow-y: auto;
	background-color: var(--bg-dark);
	color: var(--fg-tab);
	padding: var(--padd);
	height: 100%;


	section {
		margin-bottom: 10px;

		.title {
			background: var(--bg-explorer-section);
			border: 1px solid var(--fg-tab);
			padding: 2px 5px;
			font-size: 75%;
		}
	}
}
</style>
