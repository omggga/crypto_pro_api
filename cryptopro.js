require('./cadesplugin_api')

const pluginApi = require('./plugin/pluginApi')

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

module.exports = pluginLoad