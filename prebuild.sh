#!/bin/sh
mkdir -p assets/dist/jquery/dist
mkdir -p assets/dist/bootstrap/dist/js
mkdir -p assets/dist/bootstrap/dist/css
mkdir -p assets/dist/bootstrap/dist/fonts
mkdir -p assets/dist/bootstrap-social/assets
cp -a node_modules/jquery/dist/jquery.min.js assets/dist/jquery/dist/
cp -a node_modules/bootstrap/dist/css/bootstrap.min.css assets/dist/bootstrap/dist/css/
cp -a node_modules/bootstrap/dist/js/bootstrap.min.js assets/dist/bootstrap/dist/js/
cp -a node_modules/bootstrap/dist/fonts/. assets/dist/bootstrap/dist/fonts/
cp -a node_modules/bootstrap-social/bootstrap-social.css assets/dist/bootstrap-social/
cp -a node_modules/bootstrap-social/assets assets/dist/bootstrap-social/
