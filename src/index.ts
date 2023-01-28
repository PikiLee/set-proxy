#!/usr/bin/env node

import minimist from 'minimist'
import process from 'node:process'
import childProcess from 'node:child_process'
import pc from 'picocolors'

// Remember to set type: module in package.json or use .mjs extension
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

const agrv = minimist(process.argv.slice(2))

function execCallback(error: childProcess.ExecException | null, stdout: string | Buffer, stderr: string | Buffer) {
	if (error) {
		console.error(`exec error: ${error}`)
		return
	}
	if (stdout) {
		console.log(stdout)
	}
	if (stderr) {
		console.error(stderr)
	}
}

if (agrv._[0] === 'proxy') {
	if (agrv._[1]) { // set proxy setting if a proxy is provided
		db.data.proxy = agrv._[1]
		await db.write()
	} else { // show proxy setting
		console.log(`Your proxy is ${db.data.proxy}`)
	}
}  else {
	if (agrv._[0]) {
		console.log(pc.yellow('----------------- set-proxy -----------------'))
		console.log(`Running command: ${pc.blue(agrv._[0])} with http_proxy and https_proxy=${pc.blue(db.data.proxy)}`)
		console.log(pc.yellow('---------------------------------------------'))
		await childProcess.exec(`${agrv._[0]}`, {
			env: {
				...process.env,
				'http_proxy': db.data.proxy,
				'https_proxy': db.data.proxy
			}
		}, execCallback)
	} else {
		console.error('A command must be provided.')
		console.log(`SYNOPSIS:
		sp [command]     // run command ith http_proxy and https_proxy set
		sp proxy [proxy] // set proxy
		sp proxy         // show proxy
	`)
	}
}
