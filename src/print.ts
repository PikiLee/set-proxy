import pc from 'picocolors'

export default function print(text: string) {
	const log = `${pc.yellow('----------------- set-proxy -----------------')}
${text}
${pc.yellow('---------------------------------------------')}`

	console.log(log)
}