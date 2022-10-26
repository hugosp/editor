<template>
	<div class="file-explorer">
		<ExplorerItem @openFile="v => $emit('openFile',v)" v-for="item in files" :item="item"></ExplorerItem>
	</div>
</template>

<script>
import ExplorerItem from './ExplorerItem.vue';
import axios from 'axios';

export default {
	name: "FileExplorer",
	components: {
		ExplorerItem,
	},
	props: ['actions'],
	data() {
		return {
			files: [],
		};
	},
	created() {
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


<style lang="scss">
.file-explorer {
	overflow-y: auto;
	background-color: var(--bg-dark);
	color: var(--fg-tab);
	padding: var(--padd);
	height: 100%;
}
</style>
