;(function () {
	if (window.cadesplugin) return

	let pluginObject
	let plugin_resolved = 0
	let plugin_reject
	let plugin_resolve
	let failed_extensions = 0

	const canPromise = !!window.Promise
	let cadesplugin = canPromise 
		? new Promise((resolve, reject) => {
			plugin_resolve = resolve
			plugin_reject = reject
		})
		: {}

	const getBrowserSpecs = () => {
		const ua = navigator.userAgent
		let tem
		let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
		if (/trident/i.test(M[1])) {
			tem = /\brv[ :]+(\d+)/g.exec(ua) || []
			return { name: 'IE', version: (tem[1] || '') }
		}
		if (M[1] === 'Chrome') {
			tem = ua.match(/\b(OPR|Edge)\/(\d+)/)
			if (tem != null) return { name: tem[1].replace('OPR', 'Opera'), version: tem[2] }
		}
		M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
		if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1])
		return { name: M[0], version: M[1] }
	}

	let browserSpecs = getBrowserSpecs()

	const cpcsp_console_log = (level, msg) => {
		if (typeof console === 'undefined') return
		if (level <= cadesplugin.current_log_level) {
			const logLevelMap = {
				[cadesplugin.LOG_LEVEL_DEBUG]: 'DEBUG',
				[cadesplugin.LOG_LEVEL_INFO]: 'INFO',
				[cadesplugin.LOG_LEVEL_ERROR]: 'ERROR',
			}
			if (logLevelMap[level]) console[logLevelMap[level].toLowerCase()](`${logLevelMap[level]}: ${msg}`)
		}
	}

	const set_log_level = (level) => {
		const validLevels = [cadesplugin.LOG_LEVEL_DEBUG, cadesplugin.LOG_LEVEL_INFO, cadesplugin.LOG_LEVEL_ERROR]
		if (!validLevels.includes(level)) {
			cpcsp_console_log(cadesplugin.LOG_LEVEL_ERROR, `cadesplugin_api.js: Incorrect log_level: ${level}`)
			return
		}
		cadesplugin.current_log_level = level
		const logLevelMap = {
			[cadesplugin.LOG_LEVEL_DEBUG]: 'DEBUG',
			[cadesplugin.LOG_LEVEL_INFO]: 'INFO',
			[cadesplugin.LOG_LEVEL_ERROR]: 'ERROR',
		}
		cpcsp_console_log(cadesplugin.LOG_LEVEL_INFO, `cadesplugin_api.js: log_level = ${logLevelMap[level]}`)
		if (isNativeMessageSupported()) {
			window.postMessage(`set_log_level=${logLevelMap[level].toLowerCase()}`, "*")
		}
	}

	const set_constantValues = () => {
		cadesplugin.CAPICOM_LOCAL_MACHINE_STORE = 1
		cadesplugin.CAPICOM_CURRENT_USER_STORE = 2
		cadesplugin.CADESCOM_LOCAL_MACHINE_STORE = 1
		cadesplugin.CADESCOM_CURRENT_USER_STORE = 2
		cadesplugin.CADESCOM_CONTAINER_STORE = 100
		cadesplugin.CAPICOM_MY_STORE = "My"
		cadesplugin.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2
		cadesplugin.CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1
		cadesplugin.CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED = 0
		cadesplugin.CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING = 1
		cadesplugin.CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE = 2
		cadesplugin.XmlDsigGost3410UrlObsolete = "http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411"
		cadesplugin.XmlDsigGost3411UrlObsolete = "http://www.w3.org/2001/04/xmldsig-more#gostr3411"
		cadesplugin.XmlDsigGost3410Url = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102001-gostr3411"
		cadesplugin.XmlDsigGost3411Url = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr3411"
		cadesplugin.CADESCOM_CADES_DEFAULT = 0
		cadesplugin.CADESCOM_CADES_BES = 1
		cadesplugin.CADESCOM_CADES_T = 0x5
		cadesplugin.CADESCOM_CADES_X_LONG_TYPE_1 = 0x5d
		cadesplugin.CADESCOM_PKCS7_TYPE = 0xffff
		cadesplugin.CADESCOM_ENCODE_BASE64 = 0
		cadesplugin.CADESCOM_ENCODE_BINARY = 1
		cadesplugin.CADESCOM_ENCODE_ANY = -1
		cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_CHAIN_EXCEPT_ROOT = 0
		cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN = 1
		cadesplugin.CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY = 2
		cadesplugin.CAPICOM_CERT_INFO_SUBJECT_SIMPLE_NAME = 0
		cadesplugin.CAPICOM_CERT_INFO_ISSUER_SIMPLE_NAME = 1
		cadesplugin.CAPICOM_CERTIFICATE_FIND_SHA1_HASH = 0
		cadesplugin.CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1
		cadesplugin.CAPICOM_CERTIFICATE_FIND_ISSUER_NAME = 2
		cadesplugin.CAPICOM_CERTIFICATE_FIND_ROOT_NAME = 3
		cadesplugin.CAPICOM_CERTIFICATE_FIND_TEMPLATE_NAME = 4
		cadesplugin.CAPICOM_CERTIFICATE_FIND_EXTENSION = 5
		cadesplugin.CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY = 6
		cadesplugin.CAPICOM_CERTIFICATE_FIND_APPLICATION_POLICY = 7
		cadesplugin.CAPICOM_CERTIFICATE_FIND_CERTIFICATE_POLICY = 8
		cadesplugin.CAPICOM_CERTIFICATE_FIND_TIME_VALID = 9
		cadesplugin.CAPICOM_CERTIFICATE_FIND_TIME_NOT_YET_VALID = 10
		cadesplugin.CAPICOM_CERTIFICATE_FIND_TIME_EXPIRED = 11
		cadesplugin.CAPICOM_CERTIFICATE_FIND_KEY_USAGE = 12
		cadesplugin.CAPICOM_DIGITAL_SIGNATURE_KEY_USAGE = 128
		cadesplugin.CAPICOM_PROPID_ENHKEY_USAGE = 9
		cadesplugin.CAPICOM_OID_OTHER = 0
		cadesplugin.CAPICOM_OID_KEY_USAGE_EXTENSION = 10
		cadesplugin.CAPICOM_EKU_CLIENT_AUTH = 2
		cadesplugin.CAPICOM_EKU_SMARTCARD_LOGON = 5
		cadesplugin.CAPICOM_EKU_OTHER = 0
		cadesplugin.CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME = 0
		cadesplugin.CAPICOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME = 1
		cadesplugin.CAPICOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_DESCRIPTION = 2
		cadesplugin.CADESCOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME = 0
		cadesplugin.CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME = 1
		cadesplugin.CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_DESCRIPTION = 2
		cadesplugin.CADESCOM_ATTRIBUTE_OTHER = -1
		cadesplugin.CADESCOM_STRING_TO_UCS2LE = 0
		cadesplugin.CADESCOM_BASE64_TO_BINARY = 1
		cadesplugin.CADESCOM_DISPLAY_DATA_NONE = 0
		cadesplugin.CADESCOM_DISPLAY_DATA_CONTENT = 1
		cadesplugin.CADESCOM_DISPLAY_DATA_ATTRIBUTE = 2
		cadesplugin.CADESCOM_ENCRYPTION_ALGORITHM_RC2 = 0
		cadesplugin.CADESCOM_ENCRYPTION_ALGORITHM_RC4 = 1
		cadesplugin.CADESCOM_ENCRYPTION_ALGORITHM_DES = 2
		cadesplugin.CADESCOM_ENCRYPTION_ALGORITHM_3DES = 3
		cadesplugin.CADESCOM_ENCRYPTION_ALGORITHM_AES = 4
		cadesplugin.CADESCOM_ENCRYPTION_ALGORITHM_GOST_28147_89 = 25
		cadesplugin.CADESCOM_HASH_ALGORITHM_SHA1 = 0
		cadesplugin.CADESCOM_HASH_ALGORITHM_MD2 = 1
		cadesplugin.CADESCOM_HASH_ALGORITHM_MD4 = 2
		cadesplugin.CADESCOM_HASH_ALGORITHM_MD5 = 3
		cadesplugin.CADESCOM_HASH_ALGORITHM_SHA_256 = 4
		cadesplugin.CADESCOM_HASH_ALGORITHM_SHA_384 = 5
		cadesplugin.CADESCOM_HASH_ALGORITHM_SHA_512 = 6
		cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411 = 100
		cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256 = 101
		cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512 = 102
		cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_HMAC = 110
		cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256_HMAC = 111
		cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512_HMAC = 112
		cadesplugin.LOG_LEVEL_DEBUG = 4
		cadesplugin.LOG_LEVEL_INFO = 2
		cadesplugin.LOG_LEVEL_ERROR = 1
		cadesplugin.CADESCOM_AllowNone = 0
		cadesplugin.CADESCOM_AllowNoOutstandingRequest = 0x1
		cadesplugin.CADESCOM_AllowUntrustedCertificate = 0x2
		cadesplugin.CADESCOM_AllowUntrustedRoot = 0x4
		cadesplugin.CADESCOM_SkipInstallToStore = 0x10000000
	}

	const async_spawn = generatorFunc => {
		const continuer = (verb, arg) => {
			let result
			try {
				result = generator[verb](arg)
			} catch (err) {
				return Promise.reject(err)
			}
			if (result.done) {
				return result.value
			} else {
				return Promise.resolve(result.value).then(onFulfilled, onRejected)
			}
		}
		const generator = generatorFunc([...arguments].slice(1))
		const onFulfilled = continuer.bind(continuer, "next")
		const onRejected = continuer.bind(continuer, "throw")
		return onFulfilled()
	}

	const isIE = () => browserSpecs.name === 'IE' || browserSpecs.name === 'MSIE'

	const isIOS = () => /ipod|ipad|iphone/i.test(navigator.userAgent)

	const isNativeMessageSupported = () => {
		if (isIE()) return false
		if (browserSpecs.name === 'Edge') {
			isEdge = true
			return true
		}
		if (browserSpecs.name === 'Opera') {
			isOpera = true
			return browserSpecs.version >= 33
		}
		if (browserSpecs.name === 'Firefox') {
			isFireFox = true
			return browserSpecs.version >= 52
		}
		if (browserSpecs.name === 'Chrome') {
			return browserSpecs.version >= 42
		}
		if (browserSpecs.name === 'Safari') {
			isSafari = true
			return browserSpecs.version >= 12
		}
	}

	const CreateObject = name => {
		if (isIOS()) {
			return call_ru_cryptopro_npcades_10_native_bridge("CreateObject", [name])
		}
		if (isIE()) {
			if (name.match(/X509Enrollment/i)) {
				try {
					const objCertEnrollClassFactory = document.getElementById("webClassFactory")
					return objCertEnrollClassFactory.CreateObject(name)
				} catch (e) {
					try {
						const objWebClassFactory = document.getElementById("certEnrollClassFactory")
						return objWebClassFactory.CreateObject(name)
					} catch (err) {
						throw ("Для создания обьектов X509Enrollment следует настроить веб-узел на использование проверки подлинности по протоколу HTTPS")
					}
				}
			}
			try {
				const objWebClassFactory = document.getElementById("webClassFactory")
				return objWebClassFactory.CreateObject(name)
			} catch (e) {
				return new ActiveXObject(name)
			}
		}
		return pluginObject.CreateObject(name)
	}

	const decimalToHexString = number => {
		if (number < 0) {
			number = 0xFFFFFFFF + number + 1
		}
		return number.toString(16).toUpperCase()
	}

	const GetMessageFromException = e => {
		let err = e.message
		if (!err) {
			err = e
		} else if (e.number) {
			err += ` (0x${decimalToHexString(e.number)})`
		}
		return err
	}

	const getLastError = exception => {
		if (isNativeMessageSupported() || isIE() || isIOS()) {
			return GetMessageFromException(exception)
		}
		try {
			return pluginObject.getLastError()
		} catch (e) {
			return GetMessageFromException(exception)
		}
	}

	const ReleasePluginObjects = () => cpcsp_chrome_nmcades.ReleasePluginObjects()

	const CreateObjectAsync = name => pluginObject.CreateObjectAsync(name)

	const ru_cryptopro_npcades_10_native_bridge = {
		callbacksCount: 1,
		callbacks: {},

		resultForCallback(callbackId, resultArray) {
			const callback = this.callbacks[callbackId]
			if (!callback) return
			callback.apply(null, resultArray)
		},

		call(functionName, args, callback) {
			const hasCallback = callback && typeof callback === "function"
			const callbackId = hasCallback ? this.callbacksCount++ : 0

			if (hasCallback)
				this.callbacks[callbackId] = callback

			const iframe = document.createElement("IFRAME")
			const arrObjs = ["_CPNP_handle"]
			try {
				iframe.setAttribute("src", `cpnp-js-call:${functionName}:${callbackId}:${encodeURIComponent(JSON.stringify(args, arrObjs))}`)
			} catch (e) {
				alert(e)
			}
			document.documentElement.appendChild(iframe)
			iframe.parentNode.removeChild(iframe)
		}
	}

	const call_ru_cryptopro_npcades_10_native_bridge = (functionName, array) => {
		let tmpobj
		let ex
		ru_cryptopro_npcades_10_native_bridge.call(functionName, array, (e, response) => {
			ex = e
			const str = `tmpobj=${response}`
			eval(str)
			if (typeof (tmpobj) === "string") {
				tmpobj = tmpobj.replace(/\\\n/gm, "\n")
				tmpobj = tmpobj.replace(/\\\r/gm, "\r")
			}
		})
		if (ex)
			throw ex
		return tmpobj
	}

	const show_firefox_missing_extension_dialog = () => {
		if (!window.cadesplugin_skip_extension_install) {
			const ovr = document.createElement('div')
			ovr.id = "cadesplugin_ovr"
			ovr.style = "visibility: hidden; position: fixed; left: 0px; top: 0px; width:100%; height:100%; background-color: rgba(0,0,0,0.7)"
			ovr.innerHTML = `<div id='cadesplugin_ovr_item' style='position:relative; width:400px; margin:100px auto; background-color:#fff; border:2px solid #000; padding:10px; text-align:center; opacity: 1; z-index: 1500'>
				<button id='cadesplugin_close_install' style='float: right; font-size: 10px; background: transparent; border: 1; margin: -5px'>X</button>
				<p>To use the CryptoPro EDS Browser plugin on this site, you need a browser extension. Make sure it's enabled or install it.</p>
				<p><a href='https://www.cryptopro.ru/sites/default/files/products/cades/extensions/firefox_cryptopro_extension_latest.xpi'>Download extension</a></p>
				</div>`
			document.getElementsByTagName("Body")[0].appendChild(ovr)
			document.getElementById("cadesplugin_close_install").addEventListener('click', () => {
				plugin_loaded_error("Plugin is unavailable")
				document.getElementById("cadesplugin_ovr").style.visibility = 'hidden'
			})

			ovr.addEventListener('click', () => {
				plugin_loaded_error("Plugin is unavailable")
				document.getElementById("cadesplugin_ovr").style.visibility = 'hidden'
			})
			ovr.style.visibility = "visible"
		}
	}

	const install_opera_extension = () => {
		if (!window.cadesplugin_skip_extension_install) {
			document.addEventListener('DOMContentLoaded', () => {
				const ovr = document.createElement('div')
				ovr.id = "cadesplugin_ovr"
				ovr.style = "visibility: hidden; position: fixed; left: 0px; top: 0px; width:100%; height:100%; background-color: rgba(0,0,0,0.7)"
				ovr.innerHTML = `<div id='cadesplugin_ovr_item' style='position:relative; width:400px; margin:100px auto; background-color:#fff; border:2px solid #000; padding:10px; text-align:center; opacity: 1; z-index: 1500'>
					<button id='cadesplugin_close_install' style='float: right; font-size: 10px; background: transparent; border: 1; margin: -5px'>X</button>
					<p>To use the CryptoPro EDS Browser plugin on this site, you need to install an extension from the Opera add-ons catalog.</p>
					<p><button id='cadesplugin_install' style='font:12px Arial'>Install extension</button></p>
					</div>`
				document.getElementsByTagName("Body")[0].appendChild(ovr)
				const btn_install = document.getElementById("cadesplugin_install")
				btn_install.addEventListener('click', (event) => {
					opr.addons.installExtension("epebfcehmdedogndhlcacafjaacknbcm",
						() => {
							document.getElementById("cadesplugin_ovr").style.visibility = 'hidden'
							location.reload()
						},
						() => {})
				})
				document.getElementById("cadesplugin_close_install").addEventListener('click', () => {
					plugin_loaded_error("Plugin is unavailable")
					document.getElementById("cadesplugin_ovr").style.visibility = 'hidden'
				})

				ovr.addEventListener('click', () => {
					plugin_loaded_error("Plugin is unavailable")
					document.getElementById("cadesplugin_ovr").style.visibility = 'hidden'
				})
				ovr.style.visibility = "visible"
				document.getElementById("cadesplugin_ovr_item").addEventListener('click', (e) => {
					e.stopPropagation()
				})
			})
		} else {
			plugin_loaded_error("Plugin is unavailable")
		}
	}

	const firefox_or_edge_nmcades_onload = () => {
		cpcsp_chrome_nmcades.check_chrome_plugin(plugin_loaded, plugin_loaded_error)
	}

	const nmcades_api_onload = () => {
		window.postMessage("cadesplugin_echo_request", "*")
		window.addEventListener("message", (event) => {
			if (typeof(event.data) !== "string" || !event.data.match("cadesplugin_loaded"))
				return
			const url = event.data.substring(event.data.indexOf("url:") + 4)
			const fileref = document.createElement('script')
			fileref.setAttribute("type", "text/javascript")
			fileref.setAttribute("src", url)
			fileref.onerror = plugin_loaded_error
			fileref.onload = firefox_or_edge_nmcades_onload
			document.getElementsByTagName("head")[0].appendChild(fileref)
			failed_extensions++
		}, false)
	}

	const load_extension = () => {
		if (isFireFox || isEdge || isSafari) {
			nmcades_api_onload()
		} else {
			const loadScript = src => {
				const fileref = document.createElement('script')
				fileref.setAttribute("type", "text/javascript")
				fileref.setAttribute("src", src)
				fileref.onerror = plugin_loaded_error
				fileref.onload = nmcades_api_onload
				document.getElementsByTagName("head")[0].appendChild(fileref)
			}
			loadScript("chrome-extension://iifchhfnnmpdbibifmljnfjhpififfog/nmcades_plugin_api.js")
			loadScript("chrome-extension://epebfcehmdedogndhlcacafjaacknbcm/nmcades_plugin_api.js")
		}
	}

	const load_npapi_plugin = () => {
		const createElement = (tagName, attributes) => {
			const elem = document.createElement(tagName)
			for (const [key, value] of Object.entries(attributes)) {
				elem.setAttribute(key, value)
			}
			document.getElementsByTagName("body")[0].appendChild(elem)
			return elem
		}
		createElement('object', {
			id: "cadesplugin_object",
			type: "application/x-cades",
			style: "visibility: hidden"
		})
		pluginObject = document.getElementById("cadesplugin_object")
		if (isIE()) {
			createElement('object', {
				id: "certEnrollClassFactory",
				classid: "clsid:884e2049-217d-11da-b2a4-000e7bbb2b09",
				style: "visibility: hidden"
			})
			createElement('object', {
				id: "webClassFactory",
				classid: "clsid:B04C8637-10BD-484E-B0DA-B8A039F60024",
				style: "visibility: hidden"
			})
		}
	}

	const plugin_loaded = () => {
		plugin_resolved = 1
		if (canPromise) {
			plugin_resolve()
		} else {
			window.postMessage("cadesplugin_loaded", "*")
		}
	}

	const plugin_loaded_error = (msg) => {
		if (isNativeMessageSupported()) {
			failed_extensions++
			if (failed_extensions < 2)
				return
			if (isOpera && (typeof(msg) === 'undefined' || typeof(msg) === 'object')) {
				install_opera_extension()
				return
			}
		}
		if (typeof(msg) === 'undefined' || typeof(msg) === 'object')
			msg = "Plugin is unavailable"
		plugin_resolved = 1
		if (canPromise) {
			plugin_reject(msg)
		} else {
			window.postMessage("cadesplugin_load_error", "*")
		}
	}

	const check_load_timeout = () => {
		if (plugin_resolved === 1)
			return
		if (isFireFox) {
			show_firefox_missing_extension_dialog()
		}
		plugin_resolved = 1
		if (canPromise) {
			plugin_reject("Plugin loading timeout")
		} else {
			window.postMessage("cadesplugin_load_error", "*")
		}
	}

	const createPromise = (arg) => new Promise(arg)

	const check_npapi_plugin = () => {
		try {
			const oAbout = CreateObject("CAdESCOM.About")
			plugin_loaded()
		} catch (err) {
			document.getElementById("cadesplugin_object").style.display = 'none'
			const mimetype = navigator.mimeTypes["application/x-cades"]
			if (mimetype) {
				const plugin = mimetype.enabledPlugin
				if (plugin) {
					plugin_loaded_error("Plugin is loaded, but objects are not created")
				} else {
					plugin_loaded_error("Error loading plugin")
				}
			} else {
				plugin_loaded_error("Plugin is unavailable")
			}
		}
	}

	const check_plugin_working = () => {
		const div = document.createElement("div")
		div.innerHTML = "<!--[if lt IE 9]><i></i><![endif]-->"
		const isIeLessThan9 = (div.getElementsByTagName("i").length === 1)
		if (isIeLessThan9) {
			plugin_loaded_error("Internet Explorer version 8 and below are not supported")
			return
		}

		if (isNativeMessageSupported()) {
			load_extension()
		} else if (!canPromise) {
			window.addEventListener("message", (event) => {
				if (event.data !== "cadesplugin_echo_request")
					return
				load_npapi_plugin()
				check_npapi_plugin()
			}, false)
		} else {
			if (document.readyState === "complete") {
				load_npapi_plugin()
				check_npapi_plugin()
			} else {
				window.addEventListener("load", () => {
					load_npapi_plugin()
					check_npapi_plugin()
				}, false)
			}
		}
	}

	const set_pluginObject = (obj) => {
		pluginObject = obj
	}

	const is_capilite_enabled = () => {
		return (typeof (cadesplugin.EnableInternalCSP) !== 'undefined') && cadesplugin.EnableInternalCSP
	}

	// Export
	cadesplugin.JSModuleVersion = "2.1.2"
	cadesplugin.async_spawn = async_spawn
	cadesplugin.set = set_pluginObject
	cadesplugin.set_log_level = set_log_level
	cadesplugin.getLastError = getLastError
	cadesplugin.is_capilite_enabled = is_capilite_enabled

	if (isNativeMessageSupported()) {
		cadesplugin.CreateObjectAsync = CreateObjectAsync
		cadesplugin.ReleasePluginObjects = ReleasePluginObjects
	}

	if (!isNativeMessageSupported()) {
		cadesplugin.CreateObject = CreateObject
	}

	setTimeout(check_load_timeout, window.cadesplugin_load_timeout || 20000)

	set_constantValues()

	cadesplugin.current_log_level = cadesplugin.LOG_LEVEL_ERROR
	window.cadesplugin = cadesplugin
	check_plugin_working()

}())
