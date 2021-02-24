#!/bin/bash
set -ex

if [[ "$BROWSER_GROUP" == "" ]]
then
    EXIT_STATUS=0
    BROWSER_GROUP=chrome yarn test:crossbrowser-verbose || EXIT_STATUS=$?
    BROWSER_GROUP=firefox yarn test:crossbrowser-verbose || EXIT_STATUS=$?
    BROWSER_GROUP=microsoft yarn test:crossbrowser-verbose || EXIT_STATUS=$?
    echo EXIT_STATUS: $EXIT_STATUS
    exit $EXIT_STATUS
else
    # Compatible with Jenkins parallel crossbrowser pipeline
    yarn test:crossbrowser-verbose
fi
