const fetch = require('node-fetch');

exports.getLatest = async (req, res) => {

    let year = req.query.year;
    let race = req.query.race;

    let latestPath = `https://www.motogp.com/en/Results+Statistics/${year}/${race}/MotoGP/RAC/World+Standing`;

    fetch(latestPath)
        .catch(err => res.send({status: 500, data: `Request to url ${latestPath} failed`}))
        .then(res => res.text())
        .then(body => res.send({status: 200, data: body}))
}

exports.getRaces = async (req, res) => {

    let year = req.query.year;

    let latestPath = `https://www.motogp.com/en/ajax/results/selector/${year}`;

    fetch(latestPath)
        .catch(err => res.send({status: 500, data: `Request to url ${latestPath} failed`}))
        .then(res => res.text())
        .then(body => res.send({status: 200, data: body}))
}