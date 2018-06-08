#!/bin/bash

rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/build/ braican@69.164.211.156:~/_tmp/taskkeeper

# ssh 
ssh braican@69.164.211.156 "touch ~/TEST.txt"
