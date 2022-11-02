import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import axios from 'axios'

export const useEditorStore = defineStore('editor', {
	state: () => ({
		settings: useStorage('editor-settings', {
			wordWrap: false,
			theme: 'vs-dark',
			tabSize: 2,
			fontSize: 14,
			// default
			// automaticLayout: true,
			lineNumbersMinChars: 3,
			stickyTabStops: true,
			mouseWheelZoom: true,
			fixedOverflowWidgets: true
		}),
		rightClickFiles: false,
		actions: {},
		currentTab: null,
		tabs: [],
		dirtyTabs: {},
		paneSize: useStorage('editor-panes', 80),
	}),
	actions: {
		async getFiles() {
			const res = await axios.get(this.actions.files);
			return res.data.data;
		},
		async openFile(path) {
			const res = await axios.get(this.actions.open, { params: { filename: path } })
			return res.data.data;
		},
		async newFile() {
			console.log('newFile');
		},
		async newFolder() {
			console.log('newFolder');
		},
		async saveFile() {
			console.log('saveFile');
		},
		async deleteFile() {
			console.log('deleteFile');
		},
	},
	getters: {

	}


})
