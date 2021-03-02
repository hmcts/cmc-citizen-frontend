#!/bin/bash
#echo "${SECURITYCONTEXT}" > /zap/security.context
export LC_ALL=C.UTF-8
export LANG=C.UTF-8
zap-x.sh -d -host 0.0.0.0 -port 1001 -config api.disablekey=true -config scanner.attackOnStart=true -config view.mode=attack -config connection.dnsTtlSuccessfulQueries=-1 -config api.addrs.addr.name=.* -config api.addrs.addr.regex=true -config globalexcludeurl.url_list.url.regex='(http.?:\/\/idam.*state=.*)' /dev/null 2>&1 &
i=0
while !(curl -s http://0.0.0.0:1001) > /dev/null
  do
    i=$(( (i+1) %4 ))
    sleep .1
  done
  echo "ZAP has successfully started"
  zap-cli --zap-url http://0.0.0.0 -p 1001 status -t 120
  zap-cli --zap-url http://0.0.0.0 -p 1001 open-url "${TEST_URL}"
  zap-cli --zap-url http://0.0.0.0 -p 1001 exclude "*gov.uk"
  zap-cli --zap-url http://0.0.0.0 -p 1001 exclude "*.google-analytics.com"
  zap-cli --zap-url http://0.0.0.0 -p 1001 spider ${TEST_URL}
  zap-cli --zap-url http://0.0.0.0 -p 1001 active-scan --scanners all --recursive "${TEST_URL}"
  zap-cli --zap-url http://0.0.0.0 -p 1001 report -o activescan.html -f html
  zap-cli --zap-url http://0.0.0.0 -p 1001 report -o activescanReport.xml -f xml
  echo 'Changing owner from $(id -u):$(id -g) to $(id -u):$(id -u)'
  chown -R $(id -u):$(id -u) activescan.html
  chown -R $(id -u):$(id -u) activescanReport.xml
  curl --fail http://0.0.0.0:1001/OTHER/core/other/jsonreport/?formMethod=GET --output report.json
  cp *.* functional-output/
  zap-cli --zap-url http://0.0.0.0 -p 1001 alerts -l Medium --exit-code False
