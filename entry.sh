#!/bin/sh
npm install
# yarn global add serve
yarn build
serve -s build