const Sequelize = require('sequelize').Sequelize
const uuid = require('node-uuid')
const config = require('./configs/config')
const log = console.log.bind(console)
const generateId = () => uuid.v4()

const sequelize = new Sequelize('test', 'root', '123456', {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    }
})

const ID_TYPE = Sequelize.STRING(50)

const defineModel = function (name, attributes) {
    let attrs = {}
    for (let key in attributes) {
        let value = attributes[key]
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false
            attrs[key] = value
        } else {
            attrs[key] = {
                type: value,
                allowNull: false,
            }
        }
    }
    attrs.id = {
        type: ID_TYPE,
        primaryKey: true,
    }
    attrs.createdAt = {
        type: Sequelize.BIGINT,
        allowNull: false,
    }
    attrs.updatedAt = {
        type: Sequelize.BIGINT,
        allowNull: false,
    }
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    }
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: obj => {
                let now = Date.now()
                if (obj.isNewRecord) {
                    if (!obj.id) {
                        obj.id = generateId()
                    }
                    obj.createdAt = now
                    obj.updatedAt = now
                    obj.version = 0
                } else {
                    obj.updatedAt = now
                    obj.version += 1
                }
            }
        }
    })
}

let exp = {
    defineModel: defineModel,
    sync: () => {
        if (process.env.NODE_ENV !== 'production') {
            sequelize.sync({force: true})
        } else {
            throw new Error(`Cannot sync() when NODE_ENV is set to 'production'.`)
        }
    }
}
exp.STRING = Sequelize.STRING
exp.INTEGER = Sequelize.INTEGER
exp.BIGINT = Sequelize.BIGINT
exp.TEXT = Sequelize.TEXT
exp.DOUBLE = Sequelize.DOUBLE
exp.DATEONLY = Sequelize.DATEONLY
exp.BOOLEAN = Sequelize.BOOLEAN
exp.ID = ID_TYPE
exp.generateId = generateId

module.exports = exp