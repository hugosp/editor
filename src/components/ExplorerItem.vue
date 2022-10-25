<template>
	<div class="explorer-item">

		<div v-if="item.nodes">
			<span>D </span>
			<span>{{ item.name }}</span>
			<ExplorerItem @openFile="v => $emit('openFile', v)" v-for="sub in item.nodes" :item="sub"></ExplorerItem>
		</div>

		<div v-else @click.native="openFile(item.path)">
			<span>F </span>
			<span>{{ item.name }}</span>
		</div>

	</div>
</template>

<script>
export default {
	name: 'ExplorerItem',
	props: ['item'],
	computed: {
		isFolder() {
			return Array.isArray(this.item);
		},
	},
	methods: {
		openFile(path) {
			this.$parent.$emit('openFile', path);
		},
	},
}
</script>

<style>
.explorer-item {
	padding-left: 20px;
}
</style>
