import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import dotenv from "dotenv"
import { stringSimilarity } from "string-similarity-js"

import database from './database/tool.js'

dotenv.config()
const bot = new Telegraf(process.env.BOT_TOKEN)

const createAd = (user) => {
    return {
        userId: user.id,
        name: user.first_name,
        messageId: null,
        role: null,
        origin: null,
        destination: null,
        deadline: null,
        description: null
    }
}

const renderOne = (ad, name) => {
    let result = (name) ? `<a href="tg://user?id=${ad.userId}"><b>${name}</b></a>\n` : ''
    result += `<b>Ищу:</b> ${ad.role === 'sender' ? 'доставщика' : (ad.role === null ? '' : 'отправителя')}\n`
    result += `<b>Откуда:</b> ${ad.origin ? ad.origin : ''}\n`
    result += `<b>Куда:</b> ${ad.destination ? ad.destination : ''}\n`
    result += `<b>До:</b> ${ad.deadline ? ad.deadline : ''}\n`
    result += `<b>Описание:</b> ${ad.description ? ad.description : ''}\n`
    result += (name) ? '' : `<b>Опубликовано:</b> ${ad.messageId ? 'да' : 'нет'}\n\n`
    return result
}

const renderAll = (ads, name, id) => {
    let result = `Ваши объявления <a href="tg://user?id=${id}"><b>${name}</b></a>.\n\n`
    ads.forEach((ad, i) => result += `<b>${i+1})</b> ${renderOne(ad)}`)
    if (ads.length === 0) result += 'У вас пока нету объявлений.'
    else result += '<b>Выберите номер объявлении что бы изменить.</b>'
    return result
}

const renderSearch = (ads) => {
    let result = `Результаты вашего поиска.\n\n`
    ads.forEach((ad, i) => result += `<b>${i+1})</b> ${renderOne(ad, ad.name)}`)
    if (ads.length === 0) result += '<b>В данное время мы не нашли никого кто подходит под ваш запрос</b>\nПожалуйста проверьте запрос и попытайтесь найти снова'
    return result
}

const buttons = {
    roles: {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Доставщика", callback_data: "sender" },
                    { text: "Отправителя", callback_data: "carrier" }
                ]
            ]
        }
    },
    tools: (id) => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [ { text: "Удалить", callback_data: `delete-${id}` }, { text: "Исправить", callback_data: `modify-${id}` } ],
                    [ { text: "Найти", callback_data: `find-${id}` }, { text: "Опубликовать", callback_data: `publish-${id}` } ],
                    [ { text: "Назад", callback_data: "back" } ]
                ]
            }
        }
    },
    back: {
        reply_markup: {
            inline_keyboard: [
                [ { text: "Назад", callback_data: "back" } ]
            ]
        }
    },
    numbers: (ads) => {
        const result = []
        for (let i=1; i<=ads.length; i++) {
            result.push({ text: `${i}`, callback_data: ads[i-1].id })
        }
        return {
            reply_markup: {
                inline_keyboard: [
                    result,
                    [ { text: "Добавить обьявление", callback_data: "add" } ]
                ]
            }
        }
    },
    options: (id) => {
        return {
            reply_markup: {
                inline_keyboard: [
                    [ { text: 'Ищу', callback_data: `change-role-${id}` }, { text: 'Откуда', callback_data: `change-origin-${id}` } ],
                    [ { text: 'Куда', callback_data: `change-destination-${id}` }, { text: 'До', callback_data: `change-deadline-${id}` } ],
                    [ { text: 'Описание', callback_data: `change-description-${id}` }, { text: 'Назад', callback_data: "back" } ]
                ]
            }
        }
    }
}
      
const isFilled = (item) => {
    return item.role && item.origin && item.destination && item.deadline && item.description
}

const findUnfilled = (ads) => {
    let i=0
    while (i < ads.length && isFilled(ads[i])) i++
    if (i < ads.length) return ads[i]
    return null
}

const deleteMessages = async (ctx) => {
    let i=0
    let work = true
    while (work) {
        try {
            await ctx.telegram.deleteMessage(ctx.chat.id,
                (ctx.message ? ctx.message.message_id-i : ctx.update.callback_query.message.message_id-i))
            i++
        } catch(e) { work = false }
    }
}

// starting application
bot.start(async (ctx) => {
    try {
        const ads = database.findAll({ userId: ctx.message.from.id })
        if (ads.length === 0) {
            const newAd = createAd(ctx.message.from)
            if (database.add(newAd)) {
                await ctx.replyWithHTML(`Привет ${ctx.message.from.first_name}!\n\nЯ помогу вам найти доставщика или отправителя посылки.\n<b>Для начало выберите кого вы ищете?</b>`,
                buttons.roles)
            }
        } else await ctx.replyWithHTML(renderAll(ads, ctx.message.from.first_name, ctx.message.from.id), buttons.numbers(ads))
        await deleteMessages(ctx)
    } catch (error) {
        await ctx.reply('Что то пошло не так, попробуйте повторить еще раз :(', buttons.back)
    }
})

bot.on(message('text'), async (ctx) => {
    try {
        const ads = database.findAll({ userId: ctx.message.from.id })
        const ad = findUnfilled(ads)
        if (!/[a-zA-Z]/.test(ctx.message.text)) {
            if (ad) {
                if (!ad.origin) {
                    ad.origin = `${ctx.message.text}`
                    if (!ad.destination) await ctx.replyWithHTML(`Куда?\n<b>(город, район, область, страна)</b>`)
                    else await ctx.replyWithHTML(renderAll(ads, ctx.message.from.first_name, ctx.message.from.id), buttons.numbers(ads))
                } else if (!ad.destination) {
                    ad.destination = `${ctx.message.text}`
                    if (!ad.deadline) await ctx.replyWithHTML('Укажите кайнюю дату.\n<b>(дд-мм-гггг, дд.мм.гггг, дд/мм/гггг)</b>')
                    else await ctx.replyWithHTML(renderAll(ads, ctx.message.from.first_name, ctx.message.from.id), buttons.numbers(ads))
                } else if (!ad.deadline) {
                    if (/^(0?[1-9]|[12][0-9]|3[01])[\/\-/.](0?[1-9]|1[012])[\/\-/.]\d{4}$/.test(ctx.message.text)) {
                        ad.deadline = `${ctx.message.text}`
                        if (!ad.description) await ctx.replyWithHTML(`Добавьте описание.`)
                        else await ctx.replyWithHTML(renderAll(ads, ctx.message.from.first_name, ctx.message.from.id), buttons.numbers(ads))
                    } else await ctx.replyWithHTML(`Пожалуйста, укажите крайнюю дату в правильном формате.\n<b>(дд-мм-гггг, дд.мм.гггг, дд/мм/гггг)</b>`)
                } else if (!ad.description) {
                    ad.description = `${ctx.message.text}`
                    await ctx.replyWithHTML(renderAll(ads, ctx.message.from.first_name, ctx.message.from.id), buttons.numbers(ads))
                } else await ctx.replyWithHTML(renderAll(ads, ctx.message.from.first_name, ctx.message.from.id), buttons.numbers(ads))
                database.update(ad)
            } else await ctx.replyWithHTML(renderAll(ads, ctx.message.from.first_name, ctx.message.from.id), buttons.numbers(ads))
        } else {
            let errorText = `Пожалуйста, укажите на кирилице.\n\n`
            if (ad && !ad.origin) {
                errorText += 'Откуда?\n<b>(город, район, область, страна)</b>'
            } else if (ad && !ad.destination) {
                errorText += 'Куда?\n<b>(город, район, область, страна)</b>'
            } else if (ad && !ad.deadline) {
                errorText += 'Укажите кайнюю дату.\n<b>(дд-мм-гггг, дд.мм.гггг, дд/мм/гггг)</b>'
            } else if (ad && !ad.description) {
                errorText += `Добавьте описание.`
            }
            await ctx.replyWithHTML(errorText)
        }
        await deleteMessages(ctx)
    } catch (error) {
        await ctx.reply('Что то пошло не так, попробуйте повторить еще раз :(', buttons.back)
    }
})

bot.action(/.+/, async (ctx) => {
    try {
        const from = ctx.update.callback_query.from
        const action = ctx.match[0]
        const ads = database.findAll({ userId: from.id })
        const ad = findUnfilled(ads)
        await ctx.answerCbQuery()
        if (['sender', 'carrier'].includes(action)) {
            if (ad) {
                ad.role = action
                database.update(ad)
                if (!ad.origin) await ctx.replyWithHTML('Откуда?\n<b>(город, район, область, страна)</b>')
                else await ctx.replyWithHTML(renderAll(ads, from.first_name, from.id), buttons.numbers(ads))
            } else await ctx.replyWithHTML(renderAll(ads, from.first_name, from.id), buttons.numbers(ads))    
        } else if (action === 'add') {
            if (ad) await ctx.replyWithHTML(`У вас есть неоконченное объявление`, buttons.back)
            else if (ads.length === 5) await ctx.replyWithHTML(`Вы можете создать только до пяти обявлений`, buttons.back)
            else {
                const newAd = createAd(from)
                if (database.add(newAd)) {
                    await ctx.replyWithHTML(`Выберите кого вы ищете?`, buttons.roles)
                } else await ctx.reply('Что то пошло не так, попробуйте повторить еще раз :(', buttons.back)
            }
        } else if (action === 'back') {
            await ctx.replyWithHTML(renderAll(ads, from.first_name, from.id), buttons.numbers(ads))
        } else if (action.includes('delete')) {
            const id = parseInt(action.split('-')[1])
            const item = database.find(id)
            if (item) {
                if (item.messageId) {
                    ctx.telegram.deleteMessage('@deliver_test', item.messageId)
                }
                database.remove(item)
                await ctx.reply('Объявление успешно удалено!', buttons.back)
            } else await ctx.reply('Что то пошло не так, попробуйте повторить еще раз :(', buttons.back)
        } else if (action.includes('modify')) {
            const id = parseInt(action.split('-')[1])
            const item = database.find(id)
            if (item) {
                if (item.messageId) {
                    ctx.telegram.deleteMessage('@deliver_test', item.messageId)
                    item.messageId = null
                    database.update(item)
                }
                await ctx.replyWithHTML(renderOne(item), buttons.options(id))
            } else await ctx.reply('Что то пошло не так, попробуйте повторить еще раз :(', buttons.back)
        } else if (action.includes('find')) {
            const id = parseInt(action.split('-')[1])
            const item = database.find(id)
            const oponent = (item.role === 'sender') ? 'carrier' : 'sender'
            const all = database.findAll({role: oponent})
            const result = []
            all.forEach(element => {
                const checkOponent = element.id !== item.id
                const originA = element.origin.toUpperCase()
                const originB = item.origin.toUpperCase()
                let checkOrigins = originA.includes(originB)
                    checkOrigins = checkOrigins || originB.includes(originA)
                    checkOrigins = checkOrigins || stringSimilarity(originA, originB) > 0.5
                const destinationA = element.destination.toUpperCase()
                const destinationB = item.destination.toUpperCase()
                let checkDestinations = destinationA.includes(destinationB)
                    checkDestinations = checkDestinations || destinationB.includes(destinationA)
                    checkDestinations = checkDestinations || stringSimilarity(destinationA, destinationB) > 0.5
                if (checkOponent && checkOrigins && checkDestinations) result.push(element)
            })
            await ctx.replyWithHTML(renderSearch(result), buttons.back)
        } else if (action.includes('publish')) {
            const id = parseInt(action.split('-')[1])
            const item = database.find(id)
            if (isFilled(item)) {
                const text = renderOne(item, from.first_name)
                const message = await ctx.telegram.sendMessage('@deliver_test', text, {parse_mode: 'HTML'})
                item.messageId = message.message_id
                database.update(item)
                await ctx.replyWithHTML(renderAll(ads, from.first_name, from.id), buttons.numbers(ads))
            } else await ctx.reply('Заполите объявление что бы опубликовать.', buttons.back)
        } else if (action.includes('change')) {
            const option = action.split('-')[1]
            const id = parseInt(action.split('-')[2])
            const item = database.find(id)
            item[option] = null
            database.update(item)
            if (action.includes('role')) {
                await ctx.replyWithHTML(`Выберите кого вы ищете?`, buttons.roles)
            } else if (action.includes('origin')) {
                await ctx.replyWithHTML('Откуда?\n<b>(город, район, область, страна)</b>')
            } else if (action.includes('destination')) {
                await ctx.replyWithHTML('Куда?\n<b>(город, район, область, страна)</b>')
            } else if (action.includes('deadline')) {
                await ctx.replyWithHTML('Укажите кайнюю дату.\n<b>(дд-мм-гггг, дд.мм.гггг, дд/мм/гггг)</b>')
            } else if (action.includes('description')) {
                await ctx.replyWithHTML(`Добавьте описание.`)
            } else await ctx.reply('Что то пошло не так, попробуйте повторить еще раз :(', buttons.back)
        } else if (parseInt(action) == action) {
            const id = parseInt(action)
            const item = database.find(id)
            await ctx.replyWithHTML(renderOne(item), buttons.tools(id))
        } else await ctx.reply('Что то пошло не так, попробуйте повторить еще раз :(', buttons.back)
        await deleteMessages(ctx)
    } catch (error) {
        await ctx.reply('Что то пошло не так, попробуйте повторить еще раз :(', buttons.back)
    }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))