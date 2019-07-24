const puppeteer = require('.')

;(async () => {
	const app = await puppeteer.launch({args: ['--autoplay-policy=no-user-gesture-required']})
	const pages = await app.pages()
	const [page] = pages
	await page.goto('https://files.catbox.moe/5955ob.m4a')

	setTimeout(async () => await app.close(), 15000)
})()