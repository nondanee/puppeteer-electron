const electron = require('electron')

electron.app.commandLine.appendSwitch('remote-debugging-port', '8315')
electron.app.once('ready', () => {
	let window = new electron.BrowserWindow({show: false})
	window.loadURL(`file://${__dirname}/index.html`)
	window.once('ready-to-show', () => {
		if(process.argv.pop() !== 'headless') window.show()
		process.stdout.write('ready')
	})
})