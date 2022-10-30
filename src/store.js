import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

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
		rightClickFiles: false,
		actions: {},
		currentTab: null,
		tabs: [],
		dirtyTabs: {},
		panes: useStorage('editor-panes', [20, 80]),
	}),
	actions: {

	},
	getters: {

	}


})
