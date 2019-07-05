#!/bin/bash

# blutooth.sh
# Displays bluetooth devices, connected and searched
# Need 'expect' to be installed
# Need 'bluez-tools' for bluetoothctl

# Uses expect to automate interaction with bluetoothctl.
# Uses sed to remove bluetoothctl colorization escape characters.
# Uses grep to filter out beacon manufacturer data logging.



if [ "$(id -u)" != "0" ]; then
    echo "ERROR: must run as root"
    exit 1
fi

(cat <<'END' | /usr/bin/expect

    set prompt "#"
    set timeout 10

    spawn sudo bluetoothctl

    expect -re $prompt
    send "scan off\r"

    expect -re $prompt
    send "scan on\r"

    trap {
        expect -re $prompt
        send "scan off\r"

        expect -re $prompt
        send "quit\r"
    } SIGINT

    expect eof

END
) | sed --unbuffered --quiet --expression 's/^.*Device //p' \
  | grep --line-buffered -v ManufacturerData \
