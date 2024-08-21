#!/bin/bash
set -e

export E2E_TEST_WORKSPACE_PATH="${PWD}/workspace-sample"

yarn start &
while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' http://localhost:9999/)" != "200" ]]; do sleep 1; done
