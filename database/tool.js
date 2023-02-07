import data from './database.js'
import dataFormat from './dataFormat.js'

const checkFormat = (item) => {
    for (const key in dataFormat) {
        if (item[key] === undefined) return false
        if (!(typeof item[key] === dataFormat[key] || item[key] === null)) return false
    }
    return true
}

const add = (item) => {
    if (!checkFormat(item)) return false
    
    let i=0
    while (i < data.data.length) {
        if (data.data[i].id == item.id) break
        else i++
    }
    if (i < data.length) return false

    item.id = data.all
    data.all += 1
    data.data.push(item)
    return true
}

const find = (id) => {
    let i=0
    while (i < data.data.length) {
        if (data.data[i].id === id) break
        else i++
    }
    if (i < data.data.length) return JSON.parse(JSON.stringify(data.data[i]))
    return null
}

const update = (item) => {
    if (!checkFormat(item)) return false
    let i=0
    while (i < data.data.length) {
        if (data.data[i].id == item.id) break
        else i++
    }
    if (i < data.data.length) {
        data.data[i] = JSON.parse(JSON.stringify(item))
        return true
    }
    return false
}

const remove = (item) => {
    let i=0
    while (i < data.data.length) {
        if (data.data[i].id == item.id) break
        else i++
    }
    if (i < data.data.length) {
        data.data.splice(i, 1)
        return true
    }
    return null
}

const findAll = (item) => {
    let result = []
    data.data.forEach(element => {
        let check = true
        for (const key in item) check = check && item[key] === element[key]
        if (check) result.push(element)
    })
    return result
}

export default { add, find, update, remove, findAll }