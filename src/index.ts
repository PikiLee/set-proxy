#!/usr/bin/env node

import minimist from 'minimist'
import process from 'node:process'
import pc from 'picocolors'
import {execa, execaCommand} from 'execa'

// json database
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

type Data = {
  proxy: string
}

// File path
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')

// Configure lowdb to write to JSONFile
const adapter = new JSONFile<Data>(file)
const db = new Low(adapter)
await db.read()
db.data ||= { proxy: 'http://127.0.0.1:7890' }

const rawArgvs = process.argv.slice(2)
const agrv = minimist(rawArgvs)

if (agrv._[0] === 'proxy') {
	if (agrv._[1]) { // set proxy setting if a proxy is provided
		db.data.proxy = agrv._[1]
		await db.write()
	} else { // show proxy setting
		console.log(`Your proxy is ${db.data.proxy}`)
	}
}  else {
	if (rawArgvs.length > 0) {
		console.log(pc.yellow('----------------- set-proxy -----------------'))
		let command = ''

		if (rawArgvs.length > 1) { // If the command not enclosed by qutation marks like sp curl google.com
			command = rawArgvs.join(' ')
		} else {	// If the command enclosed by qutation marks like sp "curl google.com"
			command = agrv._[0]
		}

		console.log(`Running command: ${pc.blue(command)} with http_proxy and https_proxy=${pc.blue(db.data.proxy)}`)
		console.log(pc.yellow('---------------------------------------------'))

		let runningProcess
		if (rawArgvs.length > 1) {
			runningProcess = execa(rawArgvs[0], rawArgvs.slice(1), {
				env: {
					...process.env,
					'http_proxy': db.data.proxy,
					'https_proxy': db.data.proxy,
				}
			})
		} else {
			runningProcess = execaCommand(rawArgvs[0], {
				env: {
					...process.env,
					'http_proxy': db.data.proxy,
					'https_proxy': db.data.proxy,
				}
			})
		}
		
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
	} else {
		console.error('A command must be provided.')
		console.log(`SYNOPSIS:
		sp [command]     // run command ith http_proxy and https_proxy set
		sp proxy [proxy] // set proxy
		sp proxy         // show proxy

		EXAMPLE:
		// set proxy, set-proxy would memorize this value
		sp proxy http://127.0.0.1:7890

		// show proxy
		sp proxy

		// run command
		sp curl https://www.google.com
		// or
		sp "curl https://www.google.com" // use backslash for escaping if there are spaces in arguments
`)
	}
}
