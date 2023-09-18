/*
 * Microsoft cryptographic technologies include CryptoAPI, Cryptographic Service Providers (CSP), CryptoAPI Tools, CAPICOM, WinTrust, issuing and managing certificates, and developing customizable public key infrastructures. Certificate and smart card enrollment, certificate management, and custom module development are also described.
 * https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-portal
 */

module.exports = {
	/* Local machine store */
	CAPICOM_LOCAL_MACHINE_STORE: 1,

	/* Current user's store */
	CAPICOM_CURRENT_USER_STORE: 2,

	/* User's personal certificate store */
	CAPICOM_MY_STORE: 'My',

	/*
	* Opens the store for reading/writing if the user has read/write permissions.
	* If there are no write permissions, the store is opened for reading.
	*/
	CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED: 2,

	/* Saves all certificates in the chain except the root */
	CAPICOM_CERTIFICATE_INCLUDE_CHAIN_EXCEPT_ROOT: 0,

	/* Certificate includes only the end entity */
	CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY: 2,

	/* Saves the full chain */
	CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN: 1,

	/* Returns the certificate's subject name */
	CAPICOM_CERT_INFO_SUBJECT_SIMPLE_NAME: 0,

	/* Returns the certificate issuer's name */
	CAPICOM_CERT_INFO_ISSUER_SIMPLE_NAME: 1,

	/* Returns certificates that match the specified SHA1 hash */
	CAPICOM_CERTIFICATE_FIND_SHA1_HASH: 0,

	/* Returns certificates whose name exactly or partially matches the specified one */
	CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME: 1,

	/* Returns certificates whose issuer name exactly or partially matches the specified one */
	CAPICOM_CERTIFICATE_FIND_ISSUER_NAME: 2,

	/* Returns certificates whose root name exactly or partially matches the specified one */
	CAPICOM_CERTIFICATE_FIND_ROOT_NAME: 3,

	/* Returns certificates whose template name exactly or partially matches the specified one */
	CAPICOM_CERTIFICATE_FIND_TEMPLATE_NAME: 4,

	/* Returns certificates that have an extension matching the specified one */
	CAPICOM_CERTIFICATE_FIND_EXTENSION: 5,

	/* Returns certificates that have an extended property ID matching the specified one */
	CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY: 6,

	/* Returns certificates containing the specified policy OID */
	CAPICOM_CERTIFICATE_FIND_CERTIFICATE_POLICY: 8,

	/* Returns certificates that are valid at the current time */
	CAPICOM_CERTIFICATE_FIND_TIME_VALID: 9,

	/* Returns certificates that are not yet valid */
	CAPICOM_CERTIFICATE_FIND_TIME_NOT_YET_VALID: 10,

	/* Returns expired certificates */
	CAPICOM_CERTIFICATE_FIND_TIME_EXPIRED: 11,

	/* Returns certificates containing keys that can be used in the specified manner */
	CAPICOM_CERTIFICATE_FIND_KEY_USAGE: 12,

	/* Key can be used to create a digital signature */
	CAPICOM_DIGITAL_SIGNATURE_KEY_USAGE: 128,

	CAPICOM_PROPID_ENHKEY_USAGE: 9,

	/* Key information */
	CAPICOM_PROPID_KEY_PROV_INFO: 2,

	/* Object does not match any of the provided types */
	CAPICOM_OID_OTHER: 0,

	/* Certificate extension containing information about the purpose of the public key */
	CAPICOM_OID_KEY_USAGE_EXTENSION: 10,

	/* Certificate can be used for something that is not preset */
	CAPICOM_EKU_OTHER: 0,

	/* Certificate can be used for server authentication */
	CAPICOM_EKU_SERVER_AUTH: 1,

	/* Certificate can be used for client authentication */
	CAPICOM_EKU_CLIENT_AUTH: 2,

	/* Certificate can be used to create a digital signature */
	CAPICOM_EKU_CODE_SIGNING: 3,

	/* Certificate can be used for electronic signature protection */
	CAPICOM_EKU_EMAIL_PROTECTION: 4,

	/* Certificate can be used for smart card login */
	CAPICOM_EKU_SMARTCARD_LOGON: 5,

	/* Signing time */
	CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME: 0
}
