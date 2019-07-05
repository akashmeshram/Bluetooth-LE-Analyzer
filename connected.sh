#!/usr/bin/expect -f

set prompt "#";
set timeout -1;
set mac [lindex $argv 0];

spawn sudo bluetoothctl

expect -re $prompt
send "info $mac\r"

expect -re $prompt
    send "quit\r"

expect eof