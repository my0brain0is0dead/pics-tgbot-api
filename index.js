const TelegramApi = require('node-telegram-bot-api')
const axios = require('axios').default

const token = ''
const bot = new TelegramApi(token, {polling: true})

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

const start = () => {

    bot.setMyCommands([
        {command: "/start", description:"Приветствие"},
        {command: "/info", description: "Информация о пользователе"},
        {command: "windranger", description: "Картинка с Лиралей"},
        {command: "drow ranger", description: "Картинка с Траксекс"},
        {command: "lina", description: "Картинка с Линой"},
        {command: "templar assasin", description: "Картинка с Ланаей"},
        {command: "vengeful spirit", description: "Картинка с Шендельзар"},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
    
        if (text === '/start') {
            await bot.sendPhoto(chatId, 'https://e1.pxfuel.com/desktop-wallpaper/667/159/desktop-wallpaper-moa-games-juggernaut-dota-2-juggernaut-dota-2-mobile.jpg')
            return bot.sendMessage(chatId, 'Добро пожаловать. /commands для просмотра доступных команд')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }
        if (text === '/commands') {
            return bot.sendMessage(chatId, 'Доступные команды:\r\n/windranger\r\n/drow_ranger\r\n/lina\r\n/templar_assasin\r\n/vengeful_spirit')
        }
        if (text === '/windranger') {
            return bot.sendPhoto(chatId, 'https://i.pinimg.com/originals/4e/07/86/4e07867de7e7d913d00514e0506168aa.png')
        }
        if (text === '/drow_ranger') {
            return bot.sendPhoto(chatId, 'https://cdna.artstation.com/p/assets/images/images/044/268/756/large/boyang-zhu-drow-promo-updated-color-change.jpg?1639536571')
        }
        if (text === '/lina') {
            return bot.sendPhoto(chatId, 'https://rare-gallery.com/livewalls/imgpreview/91757-arts-games-anime-girls-anime-graphics-lina-dota.webp')
        }
        if (text === '/templar_assasin') {
            return bot.sendPhoto(chatId, 'https://images.hdqwalls.com/wallpapers/dota-2-templar-assassin-cosmetic-set-4k-mg.jpg')
        }
        if (text === '/vengeful_spirit') {
            return bot.sendPhoto(chatId, 'https://steamuserimages-a.akamaihd.net/ugc/545280244440647891/F8FAC729651490ACE504A53384A079C900F7FED5/?imw=1024&imh=576&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true')
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю')
    })  
}

start()