<template>
	<div class="explorer-item">
		<div
			v-if="item.nodes"
			@click.native="showNodes = !showNodes"
		>
			<div class="item-row">
				<span :class="iconClass"></span>
				<span>{{ item.name }}</span>
			</div>
			<FileExplorerItem
				@openFile="v => $emit('openFile', v)"
				v-for="sub in item.nodes"
				:item="sub"
				v-if="showFolder"
			></FileExplorerItem>
		</div>

		<div
			v-else
			@click.native="openFile(item.path)"
		>
			<div
				class="item-row"
				:class="['file', currentTab == item.path ? 'active' : '']"
			>
				<span :class="iconClass"></span>
				<span>{{ item.name }}</span>
			</div>
		</div>

	</div>
</template>

<script>
import { useEditorStore } from '../store';
import { mapState } from 'pinia';

export default {
	name: 'FileExplorerItem',
	props: ['item'],
	data() {
		return {
			showNodes: false,
		};
	},
	computed: {
		iconClass() {
			const extension = this.item.name.includes('.') ? this.item.name.split('.').pop() : 'folder';
			const defaultIcon = this.item.type == 'folder' ? 'folder' : 'blank';

			if (extension === 'vue') return 'fiv-viv fiv-icon-js';

			return 'fiv-viv fiv-icon-' + (extension || defaultIcon);
		},
		...mapState(useEditorStore, ['currentTab']),
		isFolder() {
			return Array.isArray(this.item);
		},
		showFolder() {
			return this.showNodes || this.currentTab?.startsWith(this.item.path);
		}
	},
	methods: {
		openFile(path) {
			this.$parent.$emit('openFile', path);
		},
	},
}
</script>

<style lang="scss">

</style>
