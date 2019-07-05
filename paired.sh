#!/bin/bash

# search.sh



if [ "$(id -u)" != "0" ]; then
    echo "ERROR: must run as root"
    exit 1
fi

(cat <<'END' | /usr/bin/expect

    set prompt "#"

    spawn sudo bluetoothctl

    send "paired-devices\r"

    expect -re $prompt
    send "quit\r"

    expect eof

END
)| sed --unbuffered --quiet --expression 's/^Device //p' \
 | grep --line-buffered -v ManufacturerData \