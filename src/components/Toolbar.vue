<template>
	<div class="toolbar">
		<button class="toolbar-btn" v-for="button in buttons" @click="button.action">
			<Icon style="font-size:18px;" :icon="button.icon" :title="button.tooltip" />
		</button>
	</div>
</template>

<script>

import { Icon } from '@iconify/vue';
import { useEditorStore } from '../store';
import { mapWritableState } from 'pinia';

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
						console.log("new");
					},
				},
				{
					name: "new folder",
					icon: "codicon:new-folder",
					tooltip: "Ny fil...",
					action: () => {
						console.log("new folder...");
					},
				},
				{
					name: "save",
					icon: "codicon:save",
					tooltip: "Spara",
					action: () => {
						console.log("save");
					},
				},
				{
					name: "delete",
					icon: "codicon:trash",
					tooltip: "Radera",
					action: () => {
						console.log("delete");
					},
				},
				{
					name: "theme",
					icon: "fluent:dark-theme-24-regular",
					tooltip: "Mörkt/Ljust tema",
					action: () => {
						this.settings.theme = this.settings.theme === "vs-dark" ? "vs" : "vs-dark";
						console.log("theme");
					},
				},
				{
					name: "fullscreen",
					icon: "gridicons:fullscreen",
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
	},

};
</script>

<style lang="scss">
.toolbar {
	background: var(--bg-editor-inactive);
	display: grid;
	grid-template-columns: repeat(auto-fit, 40px);
	color: #333;
	gap: var(--padd);
	padding: var(--padd);
}
</style>
