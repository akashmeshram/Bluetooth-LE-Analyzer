var bodyParser = require('body-parser')
const util = require('util')
const express = require('express')
const app = express()
app.use(express.static('public'))

app.use(bodyParser.json());
var exec = require('child_process').execSync;


app.get('/info', function(req, res) {


});


app.listen(8080, function() {
    console.log('App listening on port 8080!')
})

function now() {
    return parseInt(new Date().getTime() / 1000)
}

var blDev = {};

app.get('/sensors', function(req, res) {

    for (var l in blDev) {
        blDev[l]['status'] = 'Discoverable'
    }

    console.log("initSensors triggered");
    var _ = {}
    var __ = [
        ["BL", 'sudo ./bluetooth.sh'],
        ["BLdevices", 'sudo ./devices.sh']
    ]

    var regex = /[0-9a-fA-F]{2}[:][0-9a-fA-F]{2}[:][0-9a-fA-F]{2}[:][0-9a-fA-F]{2}[:][0-9a-fA-F]{2}[:][0-9a-fA-F]{2}/g;
    var connectedDev;
    try {
        connectedDev = exec(util.format("sudo hcitool con")).toString().trim();
        connectedDev = connectedDev.match(regex);
        console.log(connectedDev)
    } catch (e) {
        connectedDev = []
    }

    for (var i = 0; i < __.length; i++) {

        try { _[__[i][0]] = exec(__[i][1]).toString().trim() } catch (e) {

            _[__[i][0]] = ""
        }
    }

    var totalDev = _["BL"].split('\r\n');
    for (var l of totalDev) {
        var mac = l.substr(0, l.indexOf(' '));
        var late = l.substr(l.indexOf(' ') + 1);
        if (blDev[mac] == null) {
            blDev[mac] = {
                name: late,
                rssi: '',
                status: 'Discoverable'
            }
        } else if (l.split(" ")[1] == 'RSSI:') {
            blDev[mac]['rssi'] = l.split(" ")[2];
        } else if (mac == blDev[mac]) {
            blDev[mac]['name'] = late;
        }
    }
    if (connectedDev != null && connectedDev.length > 0) {
        for (var Dev of connectedDev) {
            if (blDev[Dev] == null) {
                var newDev = "\r\n" + Dev + " " + Dev
                blDev[Dev] = {
                    name: Dev,
                    rssi: '',
                    status: 'Connected'
                }
                _["BLdevices"] = _["BLdevices"] + newDev;
            } else {
                var data = _.BLdevices.split("\r\n");
                var exist = false;
                for (var line of data) {
                    line = line.split(" ");
                    if (line[0] == Dev) {
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    var newDev = "\r\n" + Dev + " " + blDev[Dev]['name']
                    _["BLdevices"] = _["BLdevices"] + newDev;
                }
            }

            blDev[Dev]['status'] = 'Connected'
        }
    }

    _["BL"] = blDev;

    _.ts = now()
    res.json({ success: true, _: _ })
});