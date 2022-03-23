#!/usr/bin/env bash

branchName=$1

#Checkout specific branch pf  cmc ccd definition 
git clone git@github.com:hmcts/cmc-ccd-domain.git
cd cmc-ccd-domain

echo "Switch to ${branchName} branch on cmc-ccd-domain"
git checkout ${branchName}
cd ..

#Copy cmc ccd definition folder to citizen frontend which contians def files
cp -r ./cmc-ccd-domain/definition/bin .
rm -rf ./cmc-ccd-domain

#upload def files to environment      
./bin/import-bpmn-diagram.sh .