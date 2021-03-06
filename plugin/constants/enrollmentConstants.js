module.exports = {

	X509KeySpec: {
		XCN_AT_NONE        : 0x0,
		XCN_AT_KEYEXCHANGE : 0x1,
		XCN_AT_SIGNATURE   : 0x2
	},

	X509PrivateKeyExportFlags: {
		XCN_NCRYPT_ALLOW_EXPORT_NONE               : 0,
		XCN_NCRYPT_ALLOW_EXPORT_FLAG               : 0x1,
		XCN_NCRYPT_ALLOW_PLAINTEXT_EXPORT_FLAG     : 0x2,
		XCN_NCRYPT_ALLOW_ARCHIVING_FLAG            : 0x4,
		XCN_NCRYPT_ALLOW_PLAINTEXT_ARCHIVING_FLAG  : 0x8
	},

	X509CertificateEnrollmentContext: {
		ContextUser                      : 0x1,
		ContextMachine                   : 0x2,
		ContextAdministratorForceMachine : 0x3
	},

	X509KeyUsageFlags: {
		XCN_CERT_NO_KEY_USAGE                 : 0,
		XCN_CERT_DIGITAL_SIGNATURE_KEY_USAGE  : 0x80,
		XCN_CERT_NON_REPUDIATION_KEY_USAGE    : 0x40,
		XCN_CERT_KEY_ENCIPHERMENT_KEY_USAGE   : 0x20,
		XCN_CERT_DATA_ENCIPHERMENT_KEY_USAGE  : 0x10,
		XCN_CERT_KEY_AGREEMENT_KEY_USAGE      : 0x8,
		XCN_CERT_KEY_CERT_SIGN_KEY_USAGE      : 0x4,
		XCN_CERT_OFFLINE_CRL_SIGN_KEY_USAGE   : 0x2,
		XCN_CERT_CRL_SIGN_KEY_USAGE           : 0x2,
		XCN_CERT_ENCIPHER_ONLY_KEY_USAGE      : 0x1,
		XCN_CERT_DECIPHER_ONLY_KEY_USAGE      : ( 0x80 << 8 )
	},

	X500NameFlags: {
		XCN_CERT_NAME_STR_NONE                       : 0,
		XCN_CERT_SIMPLE_NAME_STR                     : 1,
		XCN_CERT_OID_NAME_STR                        : 2,
		XCN_CERT_X500_NAME_STR                       : 3,
		XCN_CERT_XML_NAME_STR                        : 4,
		XCN_CERT_NAME_STR_SEMICOLON_FLAG             : 0x40000000,
		XCN_CERT_NAME_STR_NO_PLUS_FLAG               : 0x20000000,
		XCN_CERT_NAME_STR_NO_QUOTING_FLAG            : 0x10000000,
		XCN_CERT_NAME_STR_CRLF_FLAG                  : 0x8000000,
		XCN_CERT_NAME_STR_COMMA_FLAG                 : 0x4000000,
		XCN_CERT_NAME_STR_REVERSE_FLAG               : 0x2000000,
		XCN_CERT_NAME_STR_FORWARD_FLAG               : 0x1000000,
		XCN_CERT_NAME_STR_DISABLE_IE4_UTF8_FLAG      : 0x10000,
		XCN_CERT_NAME_STR_ENABLE_T61_UNICODE_FLAG    : 0x20000,
		XCN_CERT_NAME_STR_ENABLE_UTF8_UNICODE_FLAG   : 0x40000,
		XCN_CERT_NAME_STR_FORCE_UTF8_DIR_STR_FLAG    : 0x80000,
		XCN_CERT_NAME_STR_DISABLE_UTF8_DIR_STR_FLAG  : 0x100000
	},

	EncodingType: {
		XCN_CRYPT_STRING_BASE64HEADER         : 0,
		XCN_CRYPT_STRING_BASE64               : 0x1,
		XCN_CRYPT_STRING_BINARY               : 0x2,
		XCN_CRYPT_STRING_BASE64REQUESTHEADER  : 0x3,
		XCN_CRYPT_STRING_HEX                  : 0x4,
		XCN_CRYPT_STRING_HEXASCII             : 0x5,
		XCN_CRYPT_STRING_BASE64_ANY           : 0x6,
		XCN_CRYPT_STRING_ANY                  : 0x7,
		XCN_CRYPT_STRING_HEX_ANY              : 0x8,
		XCN_CRYPT_STRING_BASE64X509CRLHEADER  : 0x9,
		XCN_CRYPT_STRING_HEXADDR              : 0xa,
		XCN_CRYPT_STRING_HEXASCIIADDR         : 0xb,
		XCN_CRYPT_STRING_HEXRAW               : 0xc,
		XCN_CRYPT_STRING_NOCRLF               : 0x40000000,
		XCN_CRYPT_STRING_NOCR                 : 0x80000000
	},

	InstallResponseRestrictionFlags: {
		AllowNone                  : 0x00000000,
		AllowNoOutstandingRequest  : 0x00000001,
		AllowUntrustedCertificate  : 0x00000002,
		AllowUntrustedRoot         : 0x00000004
	},

	ProviderTypes: {
		GOST_R_34_10_2001: 75, // Crypto-Pro GOST R 34.10-2001 KC1 CSP
		GOST_R_34_10_2012: 80  // Crypto-Pro GOST R 34.10-2012 KC1 CSP
	}

}