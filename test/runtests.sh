#!/usr/bin/env bash

VENV_DIR=venv
TEST_OUTPUT_DIR=out
PWD=`pwd`
activate () {
    . $PWD/$VENV_DIR/bin/activate
}

bootstrap()
{
    python3 ./get_pip.py
    python3 -m pip install -U virtualenv
    python3 -m virtualenv $VENV_DIR
    echo $PWD
    activate
    python3 -m pip install requests robotframework robotframework-requests
}

[ ! -d $VENV_DIR ] && bootstrap

activate

[ ! -d $TEST_OUTPUT_DIR ] && mkdir $TEST_OUTPUT_DIR
robot --outputdir ./$TEST_OUTPUT_DIR apitest.robot
