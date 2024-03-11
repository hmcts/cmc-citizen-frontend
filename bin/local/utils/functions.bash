#!/usr/bin/env bash

function logInfo() {
  printf "\e[32m${1}\e[0m\n"
}

function logError() {
  printf >&2 "\e[31m${1}\e[0m\n"
}

function require () {
  local command=${1}
  local installMessage=${2}
  hash ${command} 2>/dev/null || {
    logError "${command} is not installed. ${installMessage}. Aborting."
    exit 1
  }
}

function curlTest200() {
  #--max-time         (how long each retry will wait)
  #--retry            (it will retry 5 times)
  #--retry-delay      (an exponential backoff algorithm)
  #--retry-max-time   (total time before it's considered failed)
  #--retry-connrefuse (retries even when the connection is refused)
  curl -k -s -o /dev/null -w '%{http_code}' --connect-timeout 5 --max-time 20 --retry 3 --retry-delay 0 --retry-max-time 20 --retry-connrefuse "$@" 2>/dev/null | grep -q 200
}

export ENV_MESSAGE="Environment must be one of: (s)aat, demo or (s)prod"
