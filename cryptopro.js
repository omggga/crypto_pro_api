import './cadesplugin_api'
import pluginApi from './plugin/pluginApi'

const pluginLoad = async () => {
	try {
		await window.cadesplugin
		window.plugin = pluginApi
		return { pluginApi }
	} catch (err) {
		console.error(`Error initializing the plugin: ${err.message}`)
		throw err
	}
}

export default pluginLoad
