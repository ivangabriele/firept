#!/bin/bash
set -e

echo "[FirePT Script] Uninstalling FirePT globally..."
npm rm -g firept
echo "[FirePT Script] Building FirePT..."
yarn build
echo "[FirePT Script] Packing FirePT..."
npm pack
echo "[FirePT Script] Installing FirePT globally..."
FILE=$(ls firept-*.tgz)
npm i -g $FILE
echo "[FirePT Script] Cleaning up..."
rm $FILE
echo "[FirePT Script] Done!"
