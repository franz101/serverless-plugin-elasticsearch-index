#!/bin/sh

# Exit the script on any command with non 0 return code
set -ex

# Go to project root
cd "$(dirname "$0")"
cd ..

# Deploy demos

## AGRI demo

cd ./demo/dashboard/server
echo 'Start demo dashboard server deploy ...'
yarn deploy --username agri

cd ../client
echo 'Start demo dashboard client deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build client

echo 'serverless-finch needs a /client folder'
mkdir client

echo 'Deploying dashboard client...'
yarn run release
yarn run sls client deploy --username agri

## BUDG demo

cd ../server
echo 'Start demo dashboard server deploy ...'
yarn deploy --username budg

cd ../client
echo 'Start demo dashboard client deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build client

echo 'serverless-finch needs a /client folder'
mkdir client

echo 'Deploying dashboard client...'
yarn run release
yarn run sls client deploy --username budg

## INFOREGIO demo

cd ../server
echo 'Start demo dashboard server deploy ...'
yarn deploy --username inforegio

cd ../client
echo 'Start demo dashboard client deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build client

echo 'serverless-finch needs a /client folder'
mkdir client

echo 'Deploying dashboard client...'
yarn run release
yarn run sls client deploy --username inforegio

# Website demo

cd ../../website
echo 'Start demo website deploy ...'

echo 'Cleaning previous builds ...'
rm -rf build client

echo 'serverless-finch needs a /client folder'
mkdir client

echo 'Deploying website...'
yarn run release
