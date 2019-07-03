const http = require('http')
const path = require('path')
const spawn = require('child_process').spawn

const electron = require('electron')
const puppeteer = require('puppeteer-core')

let child

const launch = options =>
	new Promise(resolve => {
		let env = Object.assign({}, options.env || process.env)
		if('ELECTRON_RUN_AS_NODE' in env) delete env.ELECTRON_RUN_AS_NODE
		if(!'headless' in options) options.headless = true
		child = spawn(electron, [path.join(__dirname, 'main.js'), '--remote-debugging-port=8315', JSON.stringify(options)], {env})
		child.stdout.on('data', data => {
			if(data.toString() === 'ready') resolve()
		})
	})

const endpoint = () =>
	Promise.resolve()
	.then(() => new Promise((resolve, reject) => {
		http.request('http://localhost:8315/json/version')
		.on('response', response => resolve(response))
		.on('error', error => reject(error))
		.end()
	}))
	.then(response => new Promise((resolve, reject) => {
		let chunks = []
		response
		.on('data', chunk => chunks.push(chunk))
		.on('end', () => resolve(Buffer.concat(chunks).toString()))
		.on('error', error => reject(error))
	}))
	.then(body => JSON.parse(body))
	.then(data => data.webSocketDebuggerUrl)

const patch = browser =>
	new Proxy(browser, {
		get: (target, key, receiver) => key !== 'close' ? Reflect.get(target, key, receiver) : () => target.close().then(() => child.kill()),
		set: (target, key, value, receiver) => Reflect.set(target, key, value, receiver)
	})

module.exports.launch = (options = {}) =>
	Promise.resolve()
	.then(() => launch(options))
	// .then(() => endpoint())
	// .then(url => puppeteer.connect({browserWSEndpoint: url}))
	.then(() => puppeteer.connect({browserURL: 'http://localhost:8315', slowMo: options.slowMo, defaultViewport: options.defaultViewport}))
	.then(browser => patch(browser))