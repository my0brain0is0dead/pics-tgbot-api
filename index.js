const TelegramApi = require('node-telegram-bot-api')
const axios = require('axios').default

const token = ''
const bot = new TelegramApi(token, {polling: true})

let pictureLink = ''

function getPicture () {
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

bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
        await bot.sendMessage(chatId, 'Добро пожаловать')
    }
    if (text === '/info') {
        await bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
    }
    if (text === 'w') {
        await bot.sendPhoto(chatId, pictureLink)
    }
})
