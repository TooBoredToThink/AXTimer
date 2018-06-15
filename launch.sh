#!/bin/sh
sudo systemctl start couchdb.service
cd /home/user/Documents/AXTimerLatest
nodemon server.js
