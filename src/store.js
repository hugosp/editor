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
			automaticLayout: true,
			lineNumbersMinChars: 3,
			stickyTabStops: true,
			mouseWheelZoom: true,
			fixedOverflowWidgets: true
		}),
		debug: false,
		rightClickFiles: false,
		endpoint: null,
		currentTab: null,
		tabs: [],
		files: [],
		dirtyTabs: {},
		paneSize: 80,
		toast: {}
	}),
	actions: {
		flashMessage(title, text, type) {
			this.toast = {
				title,
				text,
				type
			}
			setTimeout(() => {
				this.toast = {};
			}, 1500)
		},
		async getFiles() {
			const res = await axios.get(this.endpoint, { params: { action: 'files' } });
			this.files = res.data.data;
		},
		async openFile(path) {
			const res = await axios.get(this.endpoint, { params: { action: 'open', filename: path } })
			return res.data.data;
		},
		async newFile(path) {
			const res = await axios.post(this.endpoint, { body: { action: 'new_file', filename: path } })
			return res.data.data;
		},
		async newFolder(path) {
			const res = await axios.post(this.endpoint, { body: { action: 'new_folder', filename: path } })
			return res.data.data;
		},
		async moveFile(from, to) {
			const res = await axios.post(this.endpoint, { body: { action: 'move', from, to } })
			return res.data.data;
		},
		async saveFile(path, content) {
			const res = await axios.post(this.endpoint, { body: { action: 'save', filename: path, content: content } })
			if (res.data.success) {
				this.flashMessage('Save', 'File saved successfully', 'success');
				return res.data.data;
			} else {
				this.flashMessage('Save', 'Error saving file', 'error');
			}

		},
		async deleteFile(path) {
			const res = await axios.post(this.endpoint, { body: { action: 'delete', filename: path } })
			if (res.data.success) {
				this.flashMessage('Delete', 'File deleted successfully', 'success');
				return res.data.data;
			} else {
				this.flashMessage('Delete', 'Error deleting file', 'error');
			}
		},
	},
	getters: {

	}


})
