<template>
	<div class="file-explorer">
		<div @click="$emit('openFile', file)" class="file" v-for="file in files">{{ file }}</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	name: "FileExplorer",
	props: ['actions'],
	data() {
		return {
			files: [],
		};
	},
	created() {
		axios.get(this.actions.files)
			.then((res) => {
				this.files = res.data;
				console.log(this.files);
			}).catch((err) => {
				console.log(err);
			});
	},
}

</script>


<style lang="scss">
.file-explorer {
	background-color: var(--bg-dark);
	color: var(--fg-tab);
	padding: var(--padd);
	height: 100%;
}
</style>
