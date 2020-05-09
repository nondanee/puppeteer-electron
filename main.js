const { app, BrowserWindow } = require('electron')

let options = {}
try { options = JSON.parse(process.argv.pop()) } catch (error) {}

Array.from(options.args || [])
.filter(line => !line.includes('remote-debugging-port'))
.forEach(line =>
	app.commandLine.appendSwitch.apply(null, line.replace(/^--/, '').split('='))
)

app.once('ready', () => {
	const window = new BrowserWindow({ show: false })
	window.loadURL('data:text/html')
	window.once('ready-to-show', () => {
		if (!options.headless) window.show()
		process.stdout.write('ready')
	})
})