/*
 * Список методов и свойств обьекта cadesplugin
 * https://cpdn.cryptopro.ru/content/cades/plugin-methods.html
 */

module.exports = {
	/* Данные будут перекодированы в UCS - 2 little endian */
	CADESCOM_STRING_TO_UCS2LE: 0x00,

	/* Данные будут перекодированы из Base64 в бинарный массив */
	CADESCOM_BASE64_TO_BINARY: 0x01,

	/* Локальное хранилище компьютера */
	CADESCOM_LOCAL_MACHINE_STORE: 1,

	/* Хранилище текущего пользователя */
	CADESCOM_CURRENT_USER_STORE: 2,

	/*
	* Хранилище сертификатов в контейнерах закрытых ключей.
	* В данный Store попадут все сертификаты из контейнеров закрытых ключей которые
	* доступны в системе в момент открытия.
	*/
	CADESCOM_CONTAINER_STORE: 100,

	/* Тип подписи по умолчанию(CAdES - X Long Type 1) */
	CADESCOM_CADES_DEFAULT: 0,

	/* Тип подписи CAdES BES */
	CADESCOM_CADES_BES: 1,

	/* Тип подписи CAdES - T */
	CADESCOM_CADES_T: 0x5,

	/* Тип подписи CAdES - X Long Type 1 */
	CADESCOM_CADES_X_LONG_TYPE_1: 0x5d,

	/* Кодировка BASE64 */
	CADESCOM_ENCODE_BASE64: 0,

	/* Бинарные данные */
	CADESCOM_ENCODE_BINARY: 1,

	/* Название документа */
	CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME: 1,

	/* Описание документа */
	CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_DESCRIPTION: 2,

	/* Прочие атрибуты */
	CADESCOM_ATTRIBUTE_OTHER: -1,

	/* Данные не будут пересылаться в устройство */
	CADESCOM_DISPLAY_DATA_NONE: 0,

	/* Отображаемые данные лежат в теле сообщения */
	CADESCOM_DISPLAY_DATA_CONTENT: 1,

	/* Отображаемые данные лежат в подписанном атрибуте сообщения */
	CADESCOM_DISPLAY_DATA_ATTRIBUTE: 2,

	/* Алгоритм RSA	*/
	CADESCOM_ENCRYPTION_ALGORITHM_RC: {
		RC2: 0,
		RC4: 1
	},

	/* Алгоритм DES */
	CADESCOM_ENCRYPTION_ALGORITHM_DES: 2,

	/* Алгоритм 3 DES */
	CADESCOM_ENCRYPTION_ALGORITHM_3DES: 3,

	/* Алгоритм AES	*/
	CADESCOM_ENCRYPTION_ALGORITHM_AES: 4,

	/* Алгоритм ГОСТ 28147 - 89	*/
	CADESCOM_ENCRYPTION_ALGORITHM_GOST_28147_89: 25,

	/* Алгоритм SHA1 */
	CADESCOM_HASH_ALGORITHM_SHA1: 0,

	/* Алгоритм MD */
	CADESCOM_HASH_ALGORITHM: {
		MD2: 1,
		MD4: 2,
		MD5: 3
	},

	/* Алгоритм SHA1 с длиной ключа 256 бит	*/
	CADESCOM_HASH_ALGORITHM_SHA_256: 4,

	/* Алгоритм SHA1 с длиной ключа 384 бита */
	CADESCOM_HASH_ALGORITHM_SHA_384: 5,

	/* Алгоритм SHA1 с длиной ключа 512 бит	*/
	CADESCOM_HASH_ALGORITHM_SHA_512: 6,

	/* Алгоритм ГОСТ Р 34.11 - 94 */
	CADESCOM_HASH_ALGORITHM_CP_GOST_3411: 100,

	/* Алгоритм ГОСТ Р 34.10 - 2012	*/
	CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256: 101,

	/* Алгоритм ГОСТ Р 34.10 - 2012	*/
	CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512: 102,

	/* Вложенная подпись */
	CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED: 0,

	/* Оборачивающая подпись */
	CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING: 1,

	/* Подпись по шаблону */
	CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE: 2
}