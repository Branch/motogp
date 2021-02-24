const fetch = require('node-fetch');

exports.getYears = async (req, res) => {
    fetch('https://results.motorsportstats.com/series/motogp/')
        .then(res => res.text())
        .then(data => {
            res.send(data)
        });
}