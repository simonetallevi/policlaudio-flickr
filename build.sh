#!/bin/bash

set -e
cd $(dirname $0)
basedir=`pwd`
webappdir="src/main/webapp/"

cd $webappdir
ls | grep "config\|WEB-INF" --invert-match | xargs rm -R
cd $basedir

echo "CLEARED"

cd "static"
ng build --prod --build-optimizer
cd $basedir

echo "BUILT"

cp -R static/dist/* $webappdir

echo "COPIED"

echo "DONE"
