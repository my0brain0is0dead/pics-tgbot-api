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
            case '/drow_ranger': return bot.sendPhoto(chatId, images.DR)      
            case '/lina': return bot.sendPhoto(chatId, images.lina)
            case '/templar_assasin': return bot.sendPhoto(chatId, images.TA)
            case '/vengeful_spirit': return bot.sendPhoto(chatId, images.VS)
            
            case '701': return bot.sendPhoto(chatId, images.pic1)
            case '702': return bot.sendPhoto(chatId, images.pic2)
            case '703': return bot.sendPhoto(chatId, images.pic3)
            case '704': return bot.sendPhoto(chatId, images.pic4)
            case '705': return bot.sendPhoto(chatId, images.pic5)
            case '706': return bot.sendPhoto(chatId, images.pic6)
            case '707': return bot.sendPhoto(chatId, images.pic7)
            case '708': return bot.sendPhoto(chatId, images.pic8)
            case '709': return bot.sendVideo(chatId, images.pic9)
            case '710': return bot.sendPhoto(chatId, images.pic10)
            case '711': return bot.sendPhoto(chatId, images.pic11)
            case '712': return bot.sendPhoto(chatId, images.pic12)
            case '713': return bot.sendPhoto(chatId, images.pic13)
            case '714': return bot.sendPhoto(chatId, images.pic14)
            case '715': return bot.sendPhoto(chatId, images.pic15)
            case '716': return bot.sendPhoto(chatId, images.pic16)
            case '717': return bot.sendPhoto(chatId, images.pic17)
            case '718': return bot.sendPhoto(chatId, images.pic18)
            case '719': return bot.sendPhoto(chatId, images.pic19)
            case '720': return bot.sendPhoto(chatId, images.pic20)
            case '721': return bot.sendPhoto(chatId, images.pic21)
            case '722': return bot.sendPhoto(chatId, images.pic22)
            case '723': return bot.sendPhoto(chatId, images.pic23)
            case '724': return bot.sendPhoto(chatId, images.pic24)
            case '725': return bot.sendVideo(chatId, images.pic25)
            case '726': return bot.sendVideo(chatId, images.pic26)
            case '727': return bot.sendVideo(chatId, images.pic27)
            case '728': return bot.sendVideo(chatId, images.pic28)
            case '729': return bot.sendVideo(chatId, images.pic29)
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

