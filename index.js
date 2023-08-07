const TelegramApi = require('node-telegram-bot-api')
const token = '6654435491:AAHw8WWSFwWt9W0TrtLMeMpt7id09lTWeM8'
const bot = new TelegramApi(token, {polling: true})
const request = require('request')

const {gameOptions, againOptions} = require('./options.js')
const {images, responses} = require('./data.js')

const numberData = {}


const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадал цифру от 1 до 3, попробуй отгадать')
    const randomNumber = getRandomInt(1, 3)
    numberData[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай пожалуйста!', gameOptions)
}

function getPicture (chatId) {
    request('https://api.waifu.pics/nsfw/waifu', (error, response, body) => {
        try {
            const responseBody = JSON.parse(body)
            const imageUrl = responseBody.url
            bot.sendPhoto(chatId, imageUrl)
        } catch {
            console.error('Error parsing JSON or extracting image URL:', error)
        }
    })
}

const startApp = () => {
    
    bot.setMyCommands([
        {command: "/start", description:"Приветствие"},
        {command: "/info", description: "Информация о пользователе"},
        {command: "/game", description:'Игра "Угадай цифру"'},
        {command: "/windranger", description: "Картинка с Лиралей"},
        {command: "/drow ranger", description: "Картинка с Траксекс"},
        {command: "/lina", description: "Картинка с Линой"},
        {command: "/templar assasin", description: "Картинка с Ланаей"},
        {command: "/vengeful spirit", description: "Картинка с Шендельзар"},
    ])
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
            case '/pic': return getPicture(chatId)
            case '/windranger': return bot.sendPhoto(chatId, images.WR)
            case '/drow_ranger': return bot.sendPhoto(chatId, images.DR)      
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

