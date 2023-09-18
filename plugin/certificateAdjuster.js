class CertificateAdjuster {
	constructor(currentCert = {}) {
		const {
			certApi = null,
			issuerInfo = "",
			privateKey = "",
			serialNumber = "",
			thumbprint = "",
			subjectInfo = "",
			validPeriod = {}
		} = currentCert

		this.certApi = certApi
		this.issuerInfo = issuerInfo
		this.privateKey = privateKey
		this.serialNumber = serialNumber
		this.thumbprint = thumbprint
		this.subjectInfo = subjectInfo
		this.validPeriod = validPeriod
	}

	friendlyInfo(type) {
		const info = this[type]
		if (!info) {
			throw new Error(`Invalid attribute: ${type}`)
		}

		return info.split(', ').map(tag => {
			const [code, text] = tag.split('=')
			return {
				code,
				text,
				value: this.possibleInfo(type)[`${code}=`] || code
			}
		})
	}

	friendlySubjectInfo() {
		return this.friendlyInfo('subjectInfo')
	}

	friendlyIssuerInfo() {
		return this.friendlyInfo('issuerInfo')
	}

	friendlyValidPeriod() {
		const { from, to } = this.validPeriod
		return {
			from: this.friendlyDate(from),
			to: this.friendlyDate(to)
		}
	}

	possibleInfo(type) {
		const baseAttrs = {
			'UnstructuredName=': 'Unstructured Name',
			'E=': 'Email',
			'C=': 'Country',
			'S=': 'Region',
			'L=': 'City',
			'STREET=': 'Address',
			'O=': 'Company',
			'T=': 'Position',
			'ОГРНИП=': 'OGRNIP',
			'SNILS=': 'SNILS',
			'INN=': 'INN',
			'ОГРН=': 'OGRN'
		}

		if (type === 'subjectInfo') {
			return {
				...baseAttrs,
				'SN=': 'Surname',
				'G=': 'Name/Patronymic',
				'CN=': 'Owner',
				'OU=': 'Department'
			}
		} else if (type === 'issuerInfo') {
			return {
				...baseAttrs,
				'CN=': 'Certification Center',
				'OU=': 'Type'
			}
		} else {
			throw new Error(`Invalid data type: ${type}`)
		}
	}

	friendlyDate(date) {
		const newDate = new Date(date)
		return {
			ddmmyy: `${newDate.getDate()}.${newDate.getMonth() + 1}.${newDate.getFullYear()}`,
			hhmmss: `${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`
		}
	}

	async isValid() {
		try {
			const isValid = await this.certApi.IsValid()
			return await isValid.Result
		} catch (error) {
			console.error(`Failed to check certificate validity: `, error)
			throw new Error("Error checking certificate validity.")
		}
	}
}

module.exports = CertificateAdjuster
