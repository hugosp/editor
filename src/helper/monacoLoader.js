const initMonaco = () => new Promise((resolve) => {
	const scriptTag = document.createElement("script");
	scriptTag.src =
		"https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/loader.min.js";
	document.head.appendChild(scriptTag);

	scriptTag.onload = () => {
		require.config({
			paths: {
				vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs",
			},
			"vs/css": { disabled: true },
		});

		window.MonacoEnvironment = {
			getWorkerUrl: function (workerId, label) {
				return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
              self.MonacoEnvironment = {
                baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/'
              };
              importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/base/worker/workerMain.js');`)}`;
			},
		};

		require(["vs/editor/editor.main"], () => {
			resolve(monaco);
		});


	};
});

export default initMonaco;
