import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', {
	state: () => ({
		settings: {
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
		},
		actions: {},
		currentTab: null,
		tabs: [],
	}),
	actions: {

	}


})
