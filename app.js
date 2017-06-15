const model = require('./model')
const Pet = model.Pet
const User = model.User
const log = console.log.bind(console)

const __main = async function () {
    let john = await User.create({
        name: 'John',
        gender: false,
        email: `john-${Date.now()}@garfield.pet`,
        passwd: 'hahaha',
    })
    log(`created: ${JSON.stringify(john)}`)
    let cat = await Pet.create({
        ownerId: john.id,
        name: 'Garfield',
        gender: false,
        birth: '2007-07-07',
    })
    log(`created: ${JSON.stringify(cat)}`)
    let dog = await Pet.create({
        ownerId: john.id,
        name: 'Odie',
        gender: false,
        birth: '2008-08-08',
    })
    log('created: ' + JSON.stringify(dog))
}

__main().catch(err => log(err))