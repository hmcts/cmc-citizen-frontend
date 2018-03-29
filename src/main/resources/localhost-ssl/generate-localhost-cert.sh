#!/bin/bash
set -e

openssl req -new -key localhost.key -out localhost.csr \
    -subj /CN=localhost

openssl x509 -req -in localhost.csr -CA localhost-ca.crt -CAkey localhost.key -CAcreateserial -out localhost.crt -days 3650 -sha256  \
    -extensions SAN \
    -extfile <(cat /System/Library/OpenSSL/openssl.cnf \
        <(printf '[SAN]\nsubjectAltName=DNS:localhost, DNS:www-citizen.moneyclaim.reform.hmcts.net'))

rm localhost.csr
echo Successfully generated localhost crt
