const fs = require('fs')
const db = require('./db')
const log = console.log.bind(console)

let files = fs.readdirSync(`${__dirname}/models`)
let js_files = files.filter(f => f.endsWith('.js'))

module.exports = {}

for (let f of js_files) {
    log(`import model from file ${f}`)
    let name = f.substring(0, f.length - 3)
    module.exports[name] = require(`${__dirname}/models/${f}`)
}

module.exports.sync = () => db.sync()