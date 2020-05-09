const puppeteer = require('.')

;(async () => {
	const app = await puppeteer.launch({ args: ['--autoplay-policy=no-user-gesture-required'] })
	const pages = await app.pages()
	const [page] = pages

	const close = async () => await app.close()
	await page.exposeFunction('close', close)
	const audioHandle = await page.evaluateHandle(src => (new Audio(src)), 'https://files.catbox.moe/5955ob.m4a')
	await page.evaluate(audio => audio.onended = close, audioHandle)
	await page.evaluate(audio => audio.play(), audioHandle)
})()