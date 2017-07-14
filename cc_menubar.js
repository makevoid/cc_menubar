`use strict`
const c = console
const menubar   = require('menubar')
const fs        = require('fs')
const text2png  = require('text2png')
const fetch     = require('electron-fetch')
const async     = require('asyncawait/async')
const await     = require('asyncawait/await')

// const currencies = ["BTC", "LTC", "ETH"]
// const currencies = ["BTC"]
const currencies = ["BTC", "ETH"]

const API = "https://api.coinmarketcap.com/v1/ticker/?limit=10"

const mb = menubar()

const main = () => {
  fetchAndRender(mb)()
  setInterval(fetchAndRender(mb), 10000)
}

const fetchAndRender = (mb) => {
  return async(() => {
    let data = await(fetchData())
    let currencies = filterCurrencies(data)
    let texts = []

    currencies.forEach((currency) => {
      let curText = `${currency.symbol}: $${currency.price_usd} (${currency.percent_change_24h}%)`
      texts.push(curText)
    })

    let text = texts.join("  ")
    renderMenuText(mb, text)
  })
}

const renderMenuText = (mb, text) => {
  let png = text2png(text, {textColor: 'darkGrey', font: "13px sans-serif"})
  let iconPath = './img/icon.png'
  fs.writeFileSync(iconPath, png)
  mb.tray.setImage(iconPath)
}


const filterCurrencies = (results) => (
  results.filter((result) => (
    currencies.includes(result.symbol)
  ))
)

const fetchData = () => (
  fetch(API).then(res => res.json())
)



// setIcon (type) {
//   if (type == 'active'){
//     this.tray.setImage(settings.get('icons.tray.active'))
//   } else if (type == 'default'){
//     this.tray.setImage(settings.get('icons.tray.default'))
//   }
// }
//
// var trayAnimation = setInterval(() => {
//   setTimeout(() => {
//     this.parent.setIcon('active')
//   }, 300)
//   setTimeout(() => {
//     this.parent.setIcon('default')
//   }, 600)
// }, 600)
//
// clearInterval(trayAnimation)

mb.on('ready', main)
