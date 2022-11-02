<template>
	<div class="toolbar">
		<div class="item" v-for="button in buttons">
			<button class="toolbar-btn" :disabled="button.disabled()" @click="button.action" :title="button.tooltip" v-if="button.action">
				<Icon style="font-size:22px;margin:auto;" :icon="button.icon" :title="button.tooltip" />
			</button>
			<div v-else class="spacer"></div>
		</div>
	</div>
</template>

<script>

import { Icon } from '@iconify/vue';
import { useEditorStore } from '../store';
import { mapStores } from 'pinia';

export default {
	name: "Toolbar",
	components: {
		Icon,
	},
	data() {
		return {
			buttons: {
				new: {
					name: "new",
					icon: "codicon:new-file",
					tooltip: "Ny fil...",
					disabled: () => false,
					action: () => {
						this.editorStore.newFile();
					},
				},
				newFolder: {
					name: "new folder",
					icon: "mdi:folder-plus",
					tooltip: "Ny fil...",
					disabled: () => false,
					action: () => {
						this.editorStore.newFolder();
					},
				},
				save: {
					name: "save",
					icon: "mdi:content-save",
					tooltip: "Spara",
					disabled: () => this.editorStore.currentTab == null,
					action: () => {
						this.editorStore.saveFile();
					},
				},
				delete: {
					name: "delete",
					icon: "mdi:delete",
					tooltip: "Radera",
					disabled: () => this.editorStore.currentTab == null,
					action: () => {
						this.editorStore.deleteFile();
					},
				},
				blank0: {

				},
				sidebar: {
					name: "sidebar",
					icon: "mdi:table-column",
					tooltip: "Dölj/Visa sidomeny",
					disabled: () => false,
					action: () => {
						if (this.editorStore.paneSize == 100) {
							this.$parent.paneResized([{}, { size: 80 }])
						} else {
							this.$parent.paneResized([{}, { size: 100 }])
						}

					},
				},
				theme: {
					name: "theme",
					icon: "mdi:theme-light-dark",
					tooltip: "Mörkt/Ljust tema",
					disabled: () => false,
					action: () => {
						this.settings.theme = this.settings.theme === "vs-dark" ? "vs" : "vs-dark";
					},
				},
				indentDec: {
					name: "indent",
					icon: "mdi:format-indent-decrease",
					tooltip: "Minska Indentering",
					disabled: () => false,
					action: () => {
						this.settings.tabSize -= 2;
					},
				},
				indentInc: {
					name: "indent",
					icon: "mdi:format-indent-increase",
					tooltip: "Öka Indentering",
					disabled: () => false,
					action: () => {
						this.settings.tabSize += 2;
					},
				},
				wordWrap: {
					name: "wordwrap",
					icon: "mdi:file-word-box",
					tooltip: "Radbrytning",
					disabled: () => false,
					action: () => {
						this.settings.wordWrap = !this.settings.wordWrap;
					},
				},
				fullscreen: {
					name: "fullscreen",
					icon: "mdi:fullscreen",
					tooltip: "Fullskärmsläge",
					disabled: () => false,
					action: () => {
						this.$root.$el.parentElement.classList.toggle("fullscreen");
					},
				},
			},
		};
	},
	created() {
		// Kolla keypresses
		window.addEventListener('keydown', event => {
			if (event.ctrlKey || event.metaKey) {
				if (event.key.toLowerCase() == 's') {
					event.preventDefault();
					this.buttons.save.action();
				}
			}

			if (event.key == 'Escape' && this.fullscreen) {
				event.preventDefault();
				this.buttons.fullscreen.action();
			}
		});
	},
	computed: {
		...mapStores(useEditorStore),
		settings() {
			return this.editorStore.settings;
		},
		fullscreen() {
			return this.$root.$el.parentElement.classList.contains("fullscreen");
		},
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
