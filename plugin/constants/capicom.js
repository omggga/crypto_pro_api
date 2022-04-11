/*
 * Microsoft cryptographic technologies include CryptoAPI, Cryptographic Service Providers (CSP), CryptoAPI Tools, CAPICOM, WinTrust, issuing and managing certificates, and developing customizable public key infrastructures. Certificate and smart card enrollment, certificate management, and custom module development are also described.
 * https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-portal
 */

module.exports = {
	/* Локальное хранилище компьютера */
	CAPICOM_LOCAL_MACHINE_STORE: 1,

	/* Хранилище текущего пользователя */
	CAPICOM_CURRENT_USER_STORE: 2,

	/* Хранилище персональных сертификатов пользователя	*/
	CAPICOM_MY_STORE: 'My',

	/*
	* Открывает хранилище на чтение/запись, если пользователь имеет права на чтение/запись.
	* Если прав на запись нет, то хранилище открывается за чтение.
	*/
	CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED: 2,

	/* Сохраняет все сертификаты цепочки за исключением корневого */
	CAPICOM_CERTIFICATE_INCLUDE_CHAIN_EXCEPT_ROOT: 0,

	/* Сертификат включает только конечное лицо	*/
	CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY: 2,

	/* Сохраняет полную цепочку	*/
	CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN: 1,

	/* Возвращает имя наименования сертификата */
	CAPICOM_CERT_INFO_SUBJECT_SIMPLE_NAME: 0,

	/* Возвращает имя издателя сертификата */
	CAPICOM_CERT_INFO_ISSUER_SIMPLE_NAME: 1,

	/* Возвращает сертификаты соответствующие указанному хэшу SHA1 */
	CAPICOM_CERTIFICATE_FIND_SHA1_HASH: 0,

	/* Возвращает сертификаты, наименование которого точно или частично совпадает с указанным */
	CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME: 1,

	/* Возвращает сертификаты, наименование издателя которого точно или частично совпадает с указанным */
	CAPICOM_CERTIFICATE_FIND_ISSUER_NAME: 2,

	/* Возвращает сертификаты, у которых наименование корневого точно или частично совпадает с указанным */
	CAPICOM_CERTIFICATE_FIND_ROOT_NAME: 3,

	/* Возвращает сертификаты, у которых шаблонное имя точно или частично совпадает с указанным	*/
	CAPICOM_CERTIFICATE_FIND_TEMPLATE_NAME: 4,

	/* Возвращает сертификаты, у которых имеется раширение, совпадающее с указанным	*/
	CAPICOM_CERTIFICATE_FIND_EXTENSION: 5,

	/* Возвращает сертификаты, у которых идентификатор раширенного свойства совпадает с указанным */
	CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY: 6,

	/* Возвращает сертификаты, содержащие указанный OID политики */
	CAPICOM_CERTIFICATE_FIND_CERTIFICATE_POLICY: 8,

	/* Возвращает действующие на текущее время сертификаты */
	CAPICOM_CERTIFICATE_FIND_TIME_VALID: 9,

	/* Возвращает сертификаты, время которых невалидно */
	CAPICOM_CERTIFICATE_FIND_TIME_NOT_YET_VALID: 10,

	/* Возвращает просроченные сертификаты */
	CAPICOM_CERTIFICATE_FIND_TIME_EXPIRED: 11,

	/* Возвращает сертификаты, содержащие ключи, которые могут быть использованны указанным способом */
	CAPICOM_CERTIFICATE_FIND_KEY_USAGE: 12,

	/* Ключ может быть использован для создания цифровой подписи */
	CAPICOM_DIGITAL_SIGNATURE_KEY_USAGE: 128,

	CAPICOM_PROPID_ENHKEY_USAGE: 9,

	/* Информация о ключе */
	CAPICOM_PROPID_KEY_PROV_INFO: 2,

	/* Объект не соответствует ни одному из предуставленных типов */
	CAPICOM_OID_OTHER: 0,

	/* Расширение сертификата, содержащее информацию о назначении открытого ключа */
	CAPICOM_OID_KEY_USAGE_EXTENSION: 10,

	/* Сертификат может быть использован для чего-то, что не предустановлено */
	CAPICOM_EKU_OTHER: 0,

	/* Сертификат может быть использован для аутентификации сервера	*/
	CAPICOM_EKU_SERVER_AUTH: 1,

	/* Сертификат может быть использован для аутентификации клиента */
	CAPICOM_EKU_CLIENT_AUTH: 2,

	/* Сертификат может быть использован для создания цифровой подписи */
	CAPICOM_EKU_CODE_SIGNING: 3,

	/* Сертификат может быть использован для защиты электронной подписи	*/
	CAPICOM_EKU_EMAIL_PROTECTION: 4,

	/* Сертификат может быть использован для входа со смарт карты */
	CAPICOM_EKU_SMARTCARD_LOGON: 5,

	/* Время подписи */
	CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME: 0
}