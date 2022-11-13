import { defineCustomElement, createApp, h, getCurrentInstance } from 'vue';

export const defineCustomElementWrapped = (component, { plugins = [] } = {}) =>
	defineCustomElement({
		styles: component.styles, // <- this
		props: component.props,
		setup(props) {
			const app = createApp()

			// install plugins
			plugins.forEach(app.use)

			const inst = getCurrentInstance()
			Object.assign(inst.appContext, app._context)
			Object.assign(inst.provides, app._context.provides)

			return () => h(component, props)
		},
	})
