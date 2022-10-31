<template>
	<div class="toolbar">
		<button class="toolbar-btn" v-for="button in buttons" @click="button.action">
			<span :class="button.icon" :title="button.tooltip"></span>
		</button>

	</div>
</template>

<script>

import { useEditorStore } from '../store';
import { mapWritableState } from 'pinia';

export default {
	name: "Toolbar",
	data() {
		return {
			buttons: [
				{
					name: "new",
					icon: "fa fa-file-o",
					tooltip: "Ny fil...",
					action: () => {
						console.log("new");
					},
				},
				{
					name: "save",
					icon: "fa fa-floppy-o",
					tooltip: "Spara",
					action: () => {
						console.log("save");
					},
				},

				{
					name: "theme",
					icon: "fa fa-adjust",
					tooltip: "Mörkt/Ljust tema",
					action: () => {
						this.settings.theme = this.settings.theme === "vs-dark" ? "vs" : "vs-dark";
						console.log("theme");
					},
				},
				{
					name: "fullscreen",
					icon: "fa fa-arrows-alt",
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
	background: var(--bg-editor);
	display: grid;
	grid-template-columns: repeat(auto-fit, 40px);
	color: #333;
	gap: var(--padd);
	padding: var(--padd);
}
</style>
