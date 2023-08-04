import './cadesplugin_api'
import pluginApi from './plugin/pluginApi'

const pluginLoad = async () => {
	try {
		await window.cadesplugin
		window.plugin = pluginApi
		return {
			pluginApi
		}
	} catch (err) {
		console.error(`Ошибка при инициализации плагина: ${err}`)
	}
}

export default pluginLoad
