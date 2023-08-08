const TelegramApi = require('node-telegram-bot-api')
const request = require('request')
const {gameOptions, againOptions} = require('./options.js')
const {images, responses, token, commands_descriptions} = require('./data.js')
const bot = new TelegramApi(token, {polling: true})

const numberData = {}
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, responses.try_guess)
    const randomNumber = getRandomInt(1, 3)
    numberData[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай пожалуйста!', gameOptions)
}

function getNsfwPicture (chatId) {
    request('https://api.waifu.pics/nsfw/waifu', async (error, response, body) => {
        try {
            const responseBody = JSON.parse(body)
            const imageUrl = responseBody.url
            await bot.sendPhoto(chatId, imageUrl)
        }
        catch {
            console.error('Error parsing JSON or extracting image URL:', error)
        }
    })
}

const startApp = () => {
    
    bot.setMyCommands(commands_descriptions)
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        switch (text) {
            case '/start': {
                await bot.sendPhoto(chatId, images.juggernaut)
                return bot.sendMessage(chatId, responses.start)
            }
            case '/info': return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
            case '/commands': return bot.sendMessage(chatId, responses.commands)
            case '/game': return startGame(chatId)
            case '/hent': return getNsfwPicture(chatId)
            case '/windranger': return bot.sendPhoto(chatId, images.WR)
            case '/drow_ranger' || 'drow': return bot.sendPhoto(chatId, images.DR)      
            case '/lina': return bot.sendPhoto(chatId, images.lina)
            case '/templar_assasin': return bot.sendPhoto(chatId, images.TA)
            case '/vengeful_spirit': return bot.sendPhoto(chatId, images.VS)       
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю')
    })  
    
    bot.on('callback_query', async msg => {        
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === '/again') {
            return startGame(chatId)
        }
        if (Number(data) === numberData[chatId]) {
            await bot.sendMessage(chatId, responses.guess_right, againOptions)
        } else {
            await bot.sendMessage(chatId, `К сожалению ты не угадал! Загаданная цифра: ${numberData[chatId]}`, againOptions)
        }
    })
}

startApp()

