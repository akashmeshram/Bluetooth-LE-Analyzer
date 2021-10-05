const util = require('util')
const express = require('express')
const app = express()
const exec = require('child_process').execSync;

app.use(express.static('public'));

app.listen(2345, function() {
    console.log('App listening on port 8080!')
})

app.get('/info', function(req, res) {
    try {
        const data = 'Connected to Main Hub 🎊';
        res.status(200).json(data);
    } catch (err) {
        throw new Error(err);
    }
});

const now = () => {
    return parseInt(new Date().getTime() / 1000)
}

var blDev = [];

app.get('/sensors', function(req, res) {

    blDev.map((_, id) => blDev[id]['status'] = 'Discoverable');

    console.log("initSensors triggered 🔥");
    let _ = {}
    let __ = [
        ["BL", 'sudo ./bluetooth.sh'],
        ["BLdevices", 'sudo ./devices.sh']
    ]

    const regex = /[0-9a-fA-F]{2}[:][0-9a-fA-F]{2}[:][0-9a-fA-F]{2}[:][0-9a-fA-F]{2}[:][0-9a-fA-F]{2}[:][0-9a-fA-F]{2}/g;
    let connectedDev;
    try {
        connectedDev = exec(util.format("sudo hcitool con")).toString().trim();
        connectedDev = connectedDev.match(regex);
        console.log(connectedDev)
    } catch (e) {
        connectedDev = []
    }

    __.map(cmd => {
        try {
            _ = {..._, [cmd[0]] : exec(__[i][1]).toString().trim() || ''};
        } catch (err) {
            throw new Error(err);
        }
    })

    const totalDev = _["BL"].split('\r\n');
    totalDev.map(dev => {
        const mac = dev.substr(0, dev.indexOf(' '));
        const late = dev.substr(l.indexOf(' ') + 1);
        if (blDev[mac] == null) {
            blDev[mac] = { name: late, rssi: '', status: 'Discoverable'}
        } else if (l.split(" ")[1] == 'RSSI:') {
            blDev[mac]['rssi'] = dev.split(" ")[2];
        } else if (mac == blDev[mac]) {
            blDev[mac]['name'] = late;
        }
    })

    if (connectedDev && connectedDev.length > 0) {
        connectedDev.map(Dev => {
            if (blDev[Dev]) {
                const newDev = `\r\n${Dev} ${Dev}`;
                blDev[Dev] = { name: Dev, rssi: '', status: 'Connected' }
                _["BLdevices"] = _["BLdevices"] + newDev;
            } else {
                const data = _.BLdevices.split("\r\n");
                let exist = false;
                data.map(line => {
                    line = line.split(" ");
                    if (line[0] == Dev) exist = true;
                })
                if (!exist) {
                    const newDev = `\r\n${Dev} ${blDev[Dev]['name']}`; 
                    _["BLdevices"] += newDev;
                }
            }
            blDev[Dev]['status'] = 'Connected'
        })
    }

    _["BL"] = blDev;
    _.ts = now();
    res.json({ success: true, _: _ })
});