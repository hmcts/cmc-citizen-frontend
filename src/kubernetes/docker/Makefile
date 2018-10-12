.DEFAULT=build

build:
	docker build -t hmctssandbox.azurecr.io/hmcts/ccd-postgres:10.5-alpine .

push:
	az acr login --name hmctssandbox
	docker push hmctssandbox.azurecr.io/hmcts/ccd-postgres:10.5-alpine
