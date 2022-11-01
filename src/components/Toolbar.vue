<template>
	<div class="toolbar">
		<div class="item" v-for="button in buttons">
			<button class="toolbar-btn" @click="button.action" :title="button.tooltip" v-if="button.action">
				<Icon style="font-size:22px;margin:auto;" :icon="button.icon" :title="button.tooltip" />
			</button>
			<div v-else class="spacer"></div>
		</div>
	</div>
</template>

<script>

import { Icon } from '@iconify/vue';
import { useEditorStore } from '../store';
import { mapStores, mapWritableState } from 'pinia';

export default {
	name: "Toolbar",
	components: {
		Icon,
	},
	data() {
		return {
			buttons: [
				{
					name: "new",
					icon: "codicon:new-file",
					tooltip: "Ny fil...",
					action: () => {
						this.editorStore.newFile();
					},
				},
				{
					name: "new folder",
					icon: "mdi:folder-plus",
					tooltip: "Ny fil...",
					action: () => {
						this.editorStore.newFolder();
					},
				},
				{
					name: "save",
					icon: "mdi:content-save",
					tooltip: "Spara",
					action: () => {
						this.editorStore.saveFile();
					},
				},
				{
					name: "delete",
					icon: "mdi:delete",
					tooltip: "Radera",
					action: () => {
						this.editorStore.deleteFile();
					},
				},
				{

				},
				{
					name: "theme",
					icon: "mdi:theme-light-dark",
					tooltip: "Mörkt/Ljust tema",
					action: () => {
						this.settings.theme = this.settings.theme === "vs-dark" ? "vs" : "vs-dark";
					},
				},
				{
					name: "indent",
					icon: "mdi:format-indent-decrease",
					tooltip: "Minska Indentering",
					action: () => {
						this.settings.tabSize -= 2;
					},
				},
				{
					name: "indent",
					icon: "mdi:format-indent-increase",
					tooltip: "Öka Indentering",
					action: () => {
						this.settings.tabSize += 2;
					},
				},
				{
					name: "wordwrap",
					icon: "mdi:file-word-box",
					tooltip: "Radbrytning",
					action: () => {
						this.settings.wordWrap = !this.settings.wordWrap;
					},
				},
				{

				},
				{
					name: "fullscreen",
					icon: "mdi:fullscreen",
					tooltip: "Fullskärmsläge",
					action: () => {
						this.$root.$el.parentElement.classList.toggle("fullscreen");
					},
				},
			],
		};
	},
	computed: {
		...mapWritableState(useEditorStore, ['settings']),
		...mapStores(['editorStore']),
	},

};
</script>

<style lang="scss">
.toolbar {
	background: var(--bg-editor-inactive);
	display: grid;
	grid-template-columns: repeat(auto-fit, 18px);
	color: #333;
	gap: var(--padd);
	padding: var(--padd);

	.item {
		grid-column: span 2;
	}
}
</style>
