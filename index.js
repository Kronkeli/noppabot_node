import { Telegraf } from 'telegraf'
import express from 'express'

const expressApp = express()


const PORT = process.env.PORT || 3000
const URL = process.env.URL || 'https://noppabot.herokuapp.com'
const BOT_TOKEN = process.env.BOT_TOKEN

const bot = new Telegraf(BOT_TOKEN)

bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`)
expressApp.use(bot.webhookCallback(`/bot${BOT_TOKEN}`))

bot.command('gg', (ctx) => {
  // Explicit usage
//   ctx.telegram.leaveChat(ctx.message.chat.id)

  // Using context shortcut
  ctx.leaveChat()
})

function getFileName(value) {
    var fileName = "audios/"
    if (value == 2)
        fileName += "kaksi.m4a"
    else if (value == 3)
        fileName += "kolme.m4a"
    else if (value == 4)
        fileName += "nelja.m4a"
    else if (value == 5)
        fileName += "viisi.m4a"
    else if (value == 6)
        fileName += "kuusi.m4a"
    else if (value == 7)
        fileName += "seitseman.m4a"
    else if (value == 8)
        fileName += "kahdeksan.m4a"
    else if (value == 9)
        fileName += "yhdeksan.m4a"
    else if (value == 10)
        fileName += "kymmenen.m4a"
    else if (value == 11)
        fileName += "yksitoista.m4a"
    else if (value == 12)
        fileName += "kaksitoista.m4a"
    return fileName
}

bot.command('morota', (ctx) => {
    ctx.telegram.sendMessage( ctx.message.chat.id,`Tervetuloa pelaamaan ${ctx.message.from.username}!`),
    (error) => console.log(error)
})

bot.command('aloita_peli', (ctx) => {
    ctx.getChatMembersCount(ctx.chat.id).then((amount) => {
        ctx.telegram.sendMessage(ctx.message.chat.id, `Aloitetaan peli ${amount} pelaajalla.`)
    })
})

bot.command('heita', (ctx) => {
    Promise.all([ctx.telegram.sendDice(ctx.message.chat.id),ctx.telegram.sendDice(ctx.message.chat.id)]).then((values) => {
        var sum = values[0].dice.value + values[1].dice.value
        // Snake is a special case
        if ( sum === 2 ) {
            ctx.telegram.sendMessage(ctx.message.chat.id,` !! SNAKET !! `)
            .then(ctx.telegram.sendAudio(ctx.message.chat.id, {source: `./audios/snake.m4a`}))
        }
        else {
            var fileName = getFileName(sum)
            ctx.telegram.sendMessage(ctx.message.chat.id,`Noppien summa on ${sum}`)
            .then(ctx.telegram.sendAudio(ctx.message.chat.id,  {source: fileName}))
        }

      }).catch(err => {console.log(err)})
})

bot.command('vaihto', (ctx) => {
    ctx.telegram.sendDice(ctx.message.chat.id).then(value =>{
        var dice_value = value.dice.value

        
        // Number one is also possible here
        if (dice_value === 1 ) {
            ctx.telegram.sendMessage(ctx.message.chat.id, `Nopan silmäluku on ${dice_value}`)
            .then(ctx.telegram.sendAudio(ctx.message.chat.id, {source: `./audios/yksi.m4a`}))
        }
        else {
            var fileName = getFileName(dice_value)
            ctx.telegram.sendAudio(ctx.message.chat.id, {source: fileName})
        }
    }).catch(err => {console.log(err)}
    )
})

bot.command("start", (msg) => {
    msg.reply(`Hello ${msg.from.username}!`)
})

// bot.on('text', (ctx) => {
//   // Explicit usage
//   ctx.telegram.reply(`Hello ${ctx.state.role}`)

//   // Using context shortcut
//   ctx.reply(`Hello ${ctx.state.role}`)
// })

// bot.on('callback_query', (ctx) => {
//   // Explicit usage
//   ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

//   // Using context shortcut
//   ctx.answerCbQuery()
// })

// bot.on('inline_query', (ctx) => {
//   const result = []
//   // Explicit usage
//   ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

//   // Using context shortcut
//   ctx.answerInlineQuery(result)
// })

// bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// Start the server on PORT
expressApp.get('/', (req, res) => {
    res.send('Hello from noppabot');
});

expressApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});