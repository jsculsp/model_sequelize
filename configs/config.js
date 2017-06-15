const defaultConfig = './config_default'
const testConfig = './config_test'
const overrideConfig = './config_override'
const fs = require('fs')
const log = console.log.bind(console)

let config = null

if (process.env.NODE_ENV === 'test') {
    config = require(testConfig)
} else {
    config = require(defaultConfig)
    try {
        if (fs.statSync(`${__dirname}/config_override.js`).isFile()) {
            config = Object.assign(config, require(overrideConfig))
        }
    } catch (err) {
        log(`Cannot load ${overrideConfig}`)
    }
}

module.exports = config