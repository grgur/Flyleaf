#!/bin/sh
clear
casperjs test --includes=build/libs.js,build/fly.js tests/casper/
