const CONSTANTS = require('./constants/index')

const pluginMethods = require('./pluginMethods')
const certificateAdjuster = require('./certificateAdjuster')
const plugin = new pluginMethods()

async function init() {
	return new Promise((resolve, reject) => {
		window.cadesplugin.then(async () => {
			if (await plugin.oStore()) {
				resolve()
			} else {
				reject(new Error('Плагин не доступен.'))
			}
		}).catch((e) => {
			reject(e)
		})
	})
}

async function about() {
	return plugin.oAbout()
}

async function version() {
	const about = await plugin.oAbout()

	const result = {
		version: await about.PluginVersion,
		full: await about.CSPVersion('', 80),
		major: await about.MajorVersion,
		minor: await about.MinorVersion,
		build: await about.BuildVersion,
		isInstalled: true
	}

	console.log('Version result: ', result)
	return result
}

async function getCertificateList() {
	const oStore = await plugin.oStore()

	await oStore.Open(CONSTANTS.CAPICOM.CAPICOM_CURRENT_USER_STORE, CONSTANTS.CAPICOM.CAPICOM_MY_STORE, CONSTANTS.CAPICOM.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED)

	const certificates = await oStore.Certificates
	if (!certificates) {
		console.log('КриптоПро: Нет доступных сертификатов')
		return []
	}

	const activeCertificates = await certificates.Find(CONSTANTS.CAPICOM.CAPICOM_CERTIFICATE_FIND_TIME_VALID)
	const activeCertificatesWithPrivateKey = await activeCertificates.Find(CONSTANTS.CAPICOM.CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY, CONSTANTS.CAPICOM.CAPICOM_PROPID_KEY_PROV_INFO)
	const certificatesCount = await activeCertificatesWithPrivateKey.Count

	if (!certificatesCount) {
		console.log('КриптоПро: Нет доступных сертификатов с приватным ключём')
		return []
	}

	const countArray = Array(certificatesCount).fill(null)
	const certificateList = await Promise.all(
		countArray.map(async (d, i) => {
			try {
				const cert = await activeCertificatesWithPrivateKey.Item(i + 1)

				const certificate = {
					cert,
					issuerInfo: await cert.IssuerName,
					privateKey: await cert.PrivateKey,
					serialNumber: await cert.SerialNumber,
					subjectInfo: await cert.SubjectName,
					thumbprint: await cert.Thumbprint,
					validPeriod: {
						from: await cert.ValidFromDate,
						to: await cert.ValidToDate
					}
				}

				const adjustedCertificate = new certificateAdjuster(certificate)
				return adjustedCertificate
			} catch (error) {
				throw new Error(`При переборе сертификатов произошла ошибка: ${error}`)
			}
		})
	)

	oStore.Close()
	return certificateList
}

async function verify (data, sign, toBase64 = false) {
	const oSignedData = await plugin.oSignedData()

	oSignedData.propset_ContentEncoding(CONSTANTS.CADESCOM.CADESCOM_BASE64_TO_BINARY)
	oSignedData.propset_Content(toBase64 ? btoa(data) : data)

	await oSignedData.VerifyCades(sign, CONSTANTS.CADESCOM.CADESCOM_CADES_BES, true)
	return await getSignInfo(oSignedData)
}

async function getSignInfo (oSignedData) {
	const signers = await oSignedData.Signers
	const count = await signers.Count

	const signs = []

	for (let i = 1; i <= count; i += 1) {
		const signer = await signers.Item(i)
		const certificate = await signer.Certificate

		const sign = {
			ts: await signer.SigningTime,
			cert: await parseCertificate(certificate)
		};

		signs.push(sign)
	}

	return signs
}

async function parseCertificate(certificate) {
	const isValid = await certificate.IsValid()

	return {
		$original: certificate,
		subject: await extractSubjectName(certificate),
		issuer: await extractIssuerName(certificate),
		version: await certificate.Version,
		serialNumber: await certificate.SerialNumber,
		thumbprint: await certificate.Thumbprint,
		validFrom: await certificate.ValidFromDate,
		validTo: await certificate.ValidToDate,
		hasPrivate: await certificate.HasPrivateKey(),
		isValid: await isValid.Result
	}
}

async function extractSubjectName(certificate) {
	var subject = await certificate.SubjectName
	return parseDN(subject)
}

async function extractIssuerName(certificate) {
	var issuer = await certificate.IssuerName
	return parseDN(issuer)
}

async function getHash (data, binary) {
	const oHashedData = await plugin.oHashedData()
    await oHashedData.propset_Algorithm(CONSTANTS.CADESCOM.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256)

    if (binary) {
    	await oHashedData.propset_DataEncoding(CONSTANTS.CADESCOM.CADESCOM_BASE64_TO_BINARY)
    	data = base64Encode(data)
    }

    await oHashedData.Hash(data)
    const hash = await oHashedData.Value

	return hash
}


async function signHash (thumbprint, hash, signOption = 1, isBase64 = false) {
	if (!thumbprint) {
		throw new Error('Не указано thumbprint значение сертификата')
	}

	const certificate = await getCeritficate(thumbprint)

	const oSigner = await plugin.oSigner()
	/*const authAttributes = await oSigner.AuthenticatedAttributes2
	const oDateAttrs = await plugin.oAtts()

    await oDateAttrs.propset_Name(CONSTANTS.CAPICOM.CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME)
    await oDateAttrs.propset_Value(new Date())
    await authAttributes.Add(oDateAttrs)*/

    const oHashedData = await plugin.oHashedData()
    await oHashedData.propset_Algorithm(CONSTANTS.CADESCOM.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256)
    if (isBase64) {
    	await oHashedData.propset_DataEncoding(CONSTANTS.CADESCOM.CADESCOM_BASE64_TO_BINARY)
    	await oHashedData.SetHashValue(base64ToHex(hash))
    } else {
    	await oHashedData.SetHashValue(hash)
    }

    await oSigner.propset_Certificate(certificate)
    await oSigner.propset_CheckCertificate(true)
    await oSigner.propset_Options(signOption)

    const oSignedData = await plugin.oSignedData()
    return await oSignedData.SignHash(oHashedData, oSigner, 1)
}


async function signHashData (thumbprint, hash, base64 = false) {
	if (!thumbprint) {
		throw new Error('Не указано thumbprint значение сертификата')
	}

	const certificate = await getCeritficate(thumbprint)

	const oHashedData = await InitializeHashedData(CONSTANTS.CADESCOM.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256, hash, base64)
	const sSignedMessage = await CreateSignature(certificate, oHashedData)
	const verifyResult = await VerifySignature(oHashedData, sSignedMessage)
	if (verifyResult) {
		return sSignedMessage
	} else {
		throw new Error('Подпись, созданная плагином, не валидна')
	}
}

async function signHashDataNoVerify (thumbprint, hash, base64 = false) {
	if (!thumbprint) {
		throw new Error('Не указано thumbprint значение сертификата')
	}

	const certificate = await getCeritficate(thumbprint)

	const oHashedData = await InitializeHashedData(CONSTANTS.CADESCOM.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256, hash, base64)
	const sSignedMessage = await CreateSignature(certificate, oHashedData)
	return sSignedMessage
}

async function InitializeHashedData(alg, hash, isBase64 = false) {
	const oHashedData = await plugin.oHashedData()
	await oHashedData.propset_Algorithm(CONSTANTS.CADESCOM.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256)

	if (isBase64) {
		await oHashedData.propset_DataEncoding(CONSTANTS.CADESCOM.CADESCOM_BASE64_TO_BINARY)
		await oHashedData.SetHashValue(base64ToHex(hash))
	} else {
		await oHashedData.SetHashValue(hash)
	}

    return oHashedData
}

async function CreateSignature(oCertificate, oHashedData) {

	const oSigner = await plugin.oSigner()
	await oSigner.propset_Certificate(oCertificate)

	const oSignedData = await plugin.oSignedData()
	let sSignedMessage
	try {
		sSignedMessage = await oSignedData.SignHash(oHashedData, oSigner, 1)
	} catch (err) {
		alert("Failed to create signature. Error: " + cadesplugin.getLastError(err))
		return
	}

	return sSignedMessage
}

async function VerifySignature(oHashedData, sSignedMessage) {
	const oSignedData = await plugin.oSignedData()

	try {
	    await oSignedData.VerifyHash(oHashedData, sSignedMessage, 1)
	} catch (err) {
	    alert("Failed to verify signature. Error: " + cadesplugin.getLastError(err))
	    return false
	}

	return true
}

async function verify (base64data, sign) {
	const oSignedData = await plugin.oSignedData()
	oSignedData.propset_ContentEncoding(CONSTANTS.CADESCOM.CADESCOM_BASE64_TO_BINARY)
	oSignedData.propset_Content(base64data)

	try {
		await oSignedData.VerifyCades(sign, CONSTANTS.CADESCOM.CADESCOM_CADES_BES, true)
	} catch (err) {
		return false
	}
	return true
}

async function verifyHash (hash, signedHash, toBase64 = 1) {
	const oSignedData = await plugin.oSignedData()

	const oHashedData = await plugin.oHashedData()
	await oHashedData.propset_Algorithm(CONSTANTS.CADESCOM.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256)



	oSignedData.propset_ContentEncoding(CONSTANTS.CADESCOM.CADESCOM_BASE64_TO_BINARY)
	oSignedData.propset_Content(toBase64 ? btoa(signedHash) : signedHash)

	try {
		await oSignedData.VerifyHash(hash, signedHash, 1)
	} catch (err) {
		return false
	}
	return true
}

function base64ToHex(str) {
	const raw = atob(str)
	let result = ''
	for (let i = 0; i < raw.length; i++) {
		const hex = raw.charCodeAt(i).toString(16)
		result += (hex.length === 2 ? hex : '0' + hex)
	}
	return result.toUpperCase()
}

async function signBase64 (thumbprint, base64, type = true) {
	if (!thumbprint) {
		throw new Error('Не указано thumbprint значение сертификата')
	}

	if (typeof thumbprint !== 'string') {
		throw new Error('Не валидное значение thumbprint сертификата')
	}

	//const oAttrs = await plugin.oAtts()
	const oSignedData = await plugin.oSignedData()
	const oSigner = await plugin.oSigner()

	const certificate = await getCeritficate(thumbprint)
	//const authAttributes = await oSigner.AuthenticatedAttributes2

	//await oAttrs.propset_Name(CONSTANTS.CAPICOM.CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME)
	//await oAttrs.propset_Value(new Date())
	//await authAttributes.Add(oAttrs)
	await oSignedData.propset_ContentEncoding(CONSTANTS.CADESCOM.CADESCOM_BASE64_TO_BINARY)
	await oSignedData.propset_Content(base64)
	await oSigner.propset_Certificate(certificate)
	//await oSigner.propset_Options(CONSTANTS.CAPICOM.CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN)

	return await oSignedData.SignCades(oSigner, CONSTANTS.CADESCOM.CADESCOM_CADES_BES, type)
}

async function signString (thumbprint, base64) {
	const oSignedData = await plugin.oSignedData()
	const oSigner = await plugin.oSigner()

	const certificate = await getCeritficate(thumbprint)

	await oSignedData.propset_ContentEncoding(CONSTANTS.CADESCOM.CADESCOM_BASE64_TO_BINARY)
	await oSignedData.propset_Content(base64)

	await oSigner.propset_Certificate(certificate)
	await oSigner.propset_Options(CONSTANTS.CAPICOM.CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY)

	return await oSignedData.SignCades(oSigner, CONSTANTS.CADESCOM.CADESCOM_CADES_BES, true)
}

async function getCeritficate (thumbprint) {
	const oStore = await plugin.oStore()

	await oStore.Open(CONSTANTS.CAPICOM.CAPICOM_CURRENT_USER_STORE, CONSTANTS.CAPICOM.CAPICOM_MY_STORE, CONSTANTS.CAPICOM.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED)

	const certificates = await oStore.Certificates
	if (!certificates) {
		console.log('Нет доступных сертификатов')
		return null
	}

	const count = await certificates.Count
	const findCertificate = await certificates.Find(CONSTANTS.CAPICOM.CAPICOM_CERTIFICATE_FIND_SHA1_HASH, thumbprint)
	const certificateItem = await findCertificate.Item(1)
	oStore.Close()

	return certificateItem
}


function parseDN(dn) {
	const tags = {
		'CN': 'name',
		'S': 'region',
		'STREET': 'address',
		'O': 'company',
		'OU': 'postType',
		'T': 'post',
		'ОГРН': 'ogrn',
		'СНИЛС': 'snils',
		'ИНН': 'inn',
		'E': 'email',
		'L': 'city'
	};

	let buf = dn
	const fields = [...buf.matchAll(/(\w+)=/g)].reduceRight((acc, cur) => {
		let v = buf.substring(cur.index)
		v = v.replace(cur[0], '')
		v = v.replace(/\s*"?(.*?)"?,?\s?$/, '$1')
		v = v.replace(/""/g, '"')

		const tag = cur[1]

		if (tags[tag]) {
			acc[tags[tag]] = v
		}

		buf = buf.substring(0, cur.index)

		return acc
	}, {})

	return fields
}


/**
 * https://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array/28227607#28227607
 * @param {string} str
 * @returns {Array}
 */
function stringToUtf8ByteArray(str) {
	// TODO(user): Use native implementations if/when available
	var out = [], p = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if (c < 128) {
			out[p++] = c;
		}
		else if (c < 2048) {
			out[p++] = (c >> 6) | 192;
			out[p++] = (c & 63) | 128;
		}
		else if (
				((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
				((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
			// Surrogate Pair
			c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
			out[p++] = (c >> 18) | 240;
			out[p++] = ((c >> 12) & 63) | 128;
			out[p++] = ((c >> 6) & 63) | 128;
			out[p++] = (c & 63) | 128;
		}
		else {
			out[p++] = (c >> 12) | 224;
			out[p++] = ((c >> 6) & 63) | 128;
			out[p++] = (c & 63) | 128;
		}
	}
	return out;
}

/*
 * Перевод строки в base64

 */
function base64Encode (str) {
	str = JSON.stringify(str)
	str = unescape(encodeURIComponent(str))

	const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	let out = ""
	let i = 0
	let len = str.length
	let c1, c2, c3

	while (i < len) {
		c1 = str.charCodeAt(i++) & 0xff
		if (i == len) {
			out += CHARS.charAt(c1 >> 2)
			out += CHARS.charAt((c1 & 0x3) << 4)
			out += "=="
			break
		}
		c2 = str.charCodeAt(i++)
		if (i == len) {
			out += CHARS.charAt(c1 >> 2);
			out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
			out += CHARS.charAt((c2 & 0xF) << 2)
			out += "="
			break
		}
		c3 = str.charCodeAt(i++)
		out += CHARS.charAt(c1 >> 2)
		out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
		out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6))
		out += CHARS.charAt(c3 & 0x3F)
	}
	return out
}


module.exports = {
	about,
	version,
	getCertificateList,
	signHash,
	signBase64,
	signString,
	verify,
	verifyHash,
	getHash,
	signHashData,
	signHashDataNoVerify
}
