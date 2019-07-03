const electron = require('electron')

const options = JSON.parse(process.argv.pop())
Array.from(options.args || []).filter(line => !line.includes('remote-debugging-port')).forEach(line =>
	electron.app.commandLine.appendSwitch.apply(null, line.replace(/^--/, '').split('='))
)

electron.app.once('ready', () => {
	const window = new electron.BrowserWindow({show: false})
	window.loadURL(`file://${__dirname}/index.html`)
	window.once('ready-to-show', () => {
		if(!options.headless) window.show()
		process.stdout.write('ready')
	})
})