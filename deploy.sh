#!/usr/bin/env bash

git pull
npm install

cd frontend
npm install
npm run build

forever restartall