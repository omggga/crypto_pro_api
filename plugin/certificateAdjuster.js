class CertificateAdjuster {

	constructor(currentCert) {
		const { certApi, issuerInfo, privateKey, serialNumber, thumbprint, subjectInfo, validPeriod } = currentCert

		this.certApi = certApi
		this.issuerInfo = issuerInfo
		this.privateKey = privateKey
		this.serialNumber = serialNumber
		this.thumbprint = thumbprint
		this.subjectInfo = subjectInfo
		this.validPeriod = validPeriod
	}

	friendlyInfo(subjectIssuer) {
		if (!this[subjectIssuer]) {
			throw new Error('Не верно указан аттрибут')
		}

		const subjectIssuerArr = this[subjectIssuer].split(', ')
		const _possibleInfo = this.possibleInfo(subjectIssuer)
		const formedSubjectIssuerInfo = subjectIssuerArr.map(tag => {
			const tagArr = tag.split('=');
			const index = `${tagArr[0]}=`;

			return {
				code: tagArr[0],
				text: tagArr[1],
				value: _possibleInfo[index]
			}
		})

		return formedSubjectIssuerInfo
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

	possibleInfo(subjectIssuer) {
		const attrs = {
			'UnstructuredName=': 'Неструктурированное имя',
			'E=': 'Email',
			'C=': 'Страна',
			'S=': 'Регион',
			'L=': 'Город',
			'STREET=': 'Адрес',
			'O=': 'Компания',
			'T=': 'Должность',
			'ОГРНИП=': 'ОГРНИП',
			'OGRNIP=': 'ОГРНИП',
			'SNILS=': 'СНИЛС',
			'СНИЛС=': 'СНИЛС',
			'INN=': 'ИНН',
			'ИНН=': 'ИНН',
			'ОГРН=': 'ОГРН',
			'OGRN=': 'ОГРН'
		}

		switch (subjectIssuer) {
			case 'subjectInfo':
				attrs['SN='] = 'Фамилия'
				attrs['G='] = 'Имя/Отчество'
				attrs['CN='] = 'Владелец'
				attrs['OU='] = 'Отдел/подразделение'
				return attrs

			case 'issuerInfo':
				attrs['CN='] = 'Удостоверяющий центр'
				attrs['OU='] = 'Тип'
				return attrs

			default:
				throw new Error('Не верно указан кейс получаемых данных')
		}
	}

	friendlyDate(date) {
		const newDate = new Date(date)
		const [day, month, year] = [newDate.getDate(), newDate.getMonth() + 1, newDate.getFullYear()]
		const [hours, minutes, seconds] = [newDate.getHours(), newDate.getMinutes(), newDate.getSeconds()]

		return {
			ddmmyy: `${day}.${month}.${year}`,
			hhmmss: `${hours}:${minutes}:${seconds}`
		}
	}

	async isValid() {
		try {
			const isValid = await this.certApi.IsValid()
			return await isValid.Result
		} catch (error) {
			throw new Error(`Произошла ошибка при проверке валидности сертификата: ${error.message}`)
		}
	}

}

module.exports = CertificateAdjuster