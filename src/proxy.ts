import { execaCommand } from 'execa'
import Database from './database'
import pc from 'picocolors'

export async function setProxy(proxy: string){
	await Database.set('proxy', proxy)
	console.log(`Your proxy has been set to ${pc.green(proxy)}`)
}

export async function showProxy() {
	const proxy = await Database.get('proxy')
	console.log(`Your proxy is ${pc.green(proxy)}`)
}

export async function run(command: string) {
	const proxy = await Database.get('proxy')

	console.log(`${pc.yellow('----------------- set-proxy -----------------')}
Running command: ${pc.blue(command)} with the following environment variables set:
http_proxy -> ${pc.green(proxy)}
https_proxy -> ${pc.green(proxy)}
${pc.yellow('---------------------------------------------')}`)

	const runningProcess = execaCommand(command, {
		env: {
			...process.env,
			'http_proxy': proxy,
			'https_proxy': proxy,
		}
	})
		
	runningProcess.stdout?.pipe(process.stdout)
	runningProcess.stderr?.pipe(process.stderr)
	runningProcess.on('error', (error) => {
		console.error(`Set-proxy Error: ${error}`)
	})
	runningProcess.on('close', (code) => {
		if (code !== 0) {
			console.log(`Command ${pc.blue(command)} exited with code ${code}`)
		}
	})
}

