import { execaCommand } from 'execa'
import Database from './database'
import pc from 'picocolors'
import print from './print'

export async function setProxy(proxy: string){
	await Database.set('proxy', proxy)
	print(`Your proxy has been set to ${pc.green(proxy)}`)
}

export async function showProxy() {
	const proxy = await Database.get('proxy')
	print(`Your proxy is ${pc.green(proxy)}`)
}

export async function run(command: string) {
	const proxy = await Database.get('proxy')

	print(`Running command: ${pc.blue(command)} with the following environment variables set:
http_proxy -> ${pc.green(proxy)}
https_proxy -> ${pc.green(proxy)}`)

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
			print(`Command ${pc.blue(command)} exited with code ${code}`)
		}
	})
	if (runningProcess.stdin) process.stdin.pipe(runningProcess.stdin)
}

