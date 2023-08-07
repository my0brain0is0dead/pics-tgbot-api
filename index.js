const TelegramApi = require('node-telegram-bot-api')
const token = ''
const bot = new TelegramApi(token, {polling: true})

const {gameOptions, againOptions} = require('./options.js')
const {images, responses} = require('./data.js')
// const axios = require('axios').default


const numberData = {}

/*
function getPicture () {
    let pictureLink = ''
    axios
        .get('https://api.waifu.pics/nsfw/waifu')
        .then((response) => {
            pictureLink = response.data.url
            return pictureLink
        })
        .catch((error) => {
            console.error(error.message)
            return ''
        })
}
*/

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
    
        if (text === '/start') {
            await bot.sendPhoto(chatId, images.juggernaut)
            return bot.sendMessage(chatId, responses.start)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }
        if (text === '/commands') {
            return bot.sendMessage(chatId, responses.commands) 
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        switch (text) {
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

