class pluginMethods {

	constructor() {

	}

	async createObject(method) {
		const supportedMethod = (await window.cadesplugin.CreateObject) ?  await window.cadesplugin.CreateObject(method) :  await window.cadesplugin.CreateObjectAsync(method)
		return supportedMethod
	}

 	oStore() {
		return this.createObject('CAdESCOM.Store')
	}

	oCapicomStore() {
		return this.createObject('CAPICOM.Store')
	}

	oAtts() {
		return this.createObject('CADESCOM.CPAttribute')
	}

  	oSignedData() {
		return this.createObject('CAdESCOM.CadesSignedData')
	}

	oSigner() {
		return this.createObject('CAdESCOM.CPSigner')
	}


	oSignedXml() {
		return this.createObject('CAdESCOM.SignedXML')
	}


	oAbout() {
		return this.createObject('CAdESCOM.About')
	}


	oRawSignature() {
		return this.createObject('CAdESCOM.RawSignature')
	}


	oHashedData() {
		return this.createObject('CAdESCOM.HashedData')
	}

	oCspInformations () {
		return this.createObject('X509Enrollment.CCspInformations')
	}

	CX509Enrollment () {
		return this.createObject('X509Enrollment.CX509Enrollment')
	}

	CX509CertificateRequestPkcs10 () {
		return this.createObject('X509Enrollment.CX509CertificateRequestPkcs10')
	}

	CX509PrivateKey () {
		return this.createObject('X509Enrollment.CX509PrivateKey')
	}

	CX509Extension () {
		return this.createObject('X509Enrollment.CX509Extension')
	}

	CX509ExtensionKeyUsage () {
		return this.createObject('X509Enrollment.CX509ExtensionKeyUsage')
	}

	CX509ExtensionEnhancedKeyUsage () {
		return this.createObject('X509Enrollment.CX509ExtensionEnhancedKeyUsage')
	}

	CObjectIds () {
		return this.createObject('X509Enrollment.CObjectIds')
	}

	CObjectId () {
		return this.createObject('X509Enrollment.CObjectId')
	}

	CX500DistinguishedName () {
		return this.createObject('X509Enrollment.CX500DistinguishedName')
	}
}

module.exports = pluginMethods