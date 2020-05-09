const http = require('http')
const path = require('path')
const { spawn } = require('child_process')

const electron = require('electron')
const puppeteer = require('puppeteer-core')

let child = null
const electronPath = typeof (electron) === 'string' ? electron : electron.app.getPath('exe')

const launch = options => {
	options = options || {}
	const env = Object.assign({}, options.env || process.env)
	if ('ELECTRON_RUN_AS_NODE' in env) delete env.ELECTRON_RUN_AS_NODE
	if (!('headless' in options)) options.headless = true
	const args = [path.join(__dirname, 'main.js'), '--remote-debugging-port=8315', JSON.stringify(options)]
	return new Promise(resolve => {
		const listener = data => data.toString() === 'ready' && resolve(child.stdout.off('data', listener))
		child = spawn(electronPath, args, { env })
		child.stdout.on('data', listener)
	})
}
	
/*
const endpoint = () =>
	Promise.resolve()
	.then(() => new Promise((resolve, reject) => {
		http.request('http://localhost:8315/json/version')
		.on('response', response => resolve(response))
		.on('error', error => reject(error))
		.end()
	}))
	.then(response => new Promise((resolve, reject) => {
		const chunks = []
		response
		.on('data', chunk => chunks.push(chunk))
		.on('end', () => resolve(Buffer.concat(chunks)))
		.on('error', error => reject(error))
	}))
	.then(body => JSON.parse(body))
	.then(data => data.webSocketDebuggerUrl)
*/

const patch = browser =>
	new Proxy(browser, {
		get: (target, key, receiver) =>
			key === 'close'
				? () => target.close().then(() => child && child.kill())
				: Reflect.get(target, key, receiver),
		set: (target, key, value, receiver) =>
			Reflect.set(target, key, value, receiver)
	})

module.exports.launch = options => {
	const { slowMo, defaultViewport } = options || {}
	return Promise.resolve()
	.then(() => launch(options))
	// .then(() => endpoint())
	// .then(browserWSEndpoint => puppeteer.connect({ browserWSEndpoint, slowMo, defaultViewport }))
	.then(() => puppeteer.connect({ browserURL: 'http://localhost:8315', slowMo, defaultViewport }))
	.then(browser => patch(browser))
}