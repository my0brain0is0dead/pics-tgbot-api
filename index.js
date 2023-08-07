const TelegramApi = require('node-telegram-bot-api')
const axios = require('axios').default

const token = ''
const bot = new TelegramApi(token, {polling: true})

const numberData = {}

const gameOptions = {
    reply_markup:JSON.stringify({
        inline_keyboard: [
        [{text:'1', callback_data:'1'}],[{text:'2', callback_data:'2'}],[{text:'3', callback_data:'3'}]
        ]
    })
}

const againOptions = {
    reply_markup:JSON.stringify({
        inline_keyboard: [
            [{text:'Начать игру заново', callback_data:'/again'}]
        ]
    })
}

const images = {
    juggernaut:'https://e1.pxfuel.com/desktop-wallpaper/667/159/desktop-wallpaper-moa-games-juggernaut-dota-2-juggernaut-dota-2-mobile.jpg',
    WR:'https://i.pinimg.com/originals/4e/07/86/4e07867de7e7d913d00514e0506168aa.png',
    DR:'https://cdna.artstation.com/p/assets/images/images/044/268/756/large/boyang-zhu-drow-promo-updated-color-change.jpg?1639536571',
    lina:'https://rare-gallery.com/livewalls/imgpreview/91757-arts-games-anime-girls-anime-graphics-lina-dota.webp',
    TA:'https://images.hdqwalls.com/wallpapers/dota-2-templar-assassin-cosmetic-set-4k-mg.jpg',
    VS:'https://steamuserimages-a.akamaihd.net/ugc/545280244440647891/F8FAC729651490ACE504A53384A079C900F7FED5/?imw=1024&imh=576&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
}
const responses = {
    start:'Добро пожаловать. /commands для просмотра доступных команд',
    commands:'Доступные команды:\r\n/windranger\r\n/drow_ranger\r\n/lina\r\n/templar_assasin\r\n/vengeful_spirit\r\n/game',
    guess_right:'Поздравляю, ты отгадал цифру!',
}

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

