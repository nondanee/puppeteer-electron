# Puppeteer-Electron

<img src="https://user-images.githubusercontent.com/26399680/60521458-e4360700-9d19-11e9-8185-065c395b0b65.png" height="200" align="right">

> A version of Puppeteer that use Electron instead of Chromium 

⚠️ BEWARE: Experimental. Just for test. Can not work with all Puppeteer APIs.

## Motivation

In comparison with the full-featured Chromium browser (~108MB Mac, ~113MB Linux, ~141MB Win for ZIP package), A portable alternative ------ Electron is able to handle most daily tasks but has half of Chromium's size (~55MB Mac, ~63MB Linux, ~58MB Win for ZIP package)

## Usage

```javascript
const puppeteer = require('puppeteer-electron')

;(async () => {
	const app = await puppeteer.launch({ headless: false }) // default is true
	const pages = await app.pages()
	const [page] = pages
	await page.goto('https://bing.com')

	setTimeout(async () => await app.close(), 5000)
})()
```

## Reference

- https://discuss.atom.io/t/solved-control-automate-an-electron-application-with-puppeteer/64126
- https://stackoverflow.com/questions/51847667/how-to-automate-electronjs-app
- https://github.com/peterdanis/electron-puppeteer-demo
- https://github.com/electron/electron/issues/3331
- https://github.com/electron/electron/issues/11515

## License

The MIT License