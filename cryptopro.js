require('./cadesplugin_api')

const pluginApi = require('./plugin/pluginApi')

const pluginLoad = (async function pluginLoad() {
	try {
		await window.cadesplugin

		window.plugin = pluginApi
		return {
			pluginApi
		}
	} catch (err) {
		console.log(`Ошибка при инициализации плагина: ${err}`)
	}
})

module.exports = pluginLoad