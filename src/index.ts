#!/usr/bin/env node

import minimist from 'minimist'
import process from 'node:process'
import { run, setProxy, showProxy } from './proxy'

const rawArgvs = process.argv.slice(2)
const agrv = minimist(rawArgvs)

if (agrv._[0] === 'proxy') {
	if (agrv._[1]) setProxy(agrv._[1]) 
	else showProxy()
}  else {
	if (rawArgvs.length > 0) {
		const command = rawArgvs.join(' ')
		run(command)
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
`)
	}
}
