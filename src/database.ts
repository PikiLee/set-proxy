import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

type Data = {
  proxy: string
}

export default class Database {
	private static db: Low<Data> | null = null
	private static DEFAULT_DATA = { proxy: 'http://127.0.0.1:7890' }

	private static async initiateDatabase() {
		if (Database.db) return
		// File path
		const __dirname = dirname(fileURLToPath(import.meta.url))
		const file = join(__dirname, 'db.json')
    
		// Configure lowdb to write to JSONFile
		const adapter = new JSONFile<Data>(file)
		Database.db = new Low(adapter)
		await Database.db.read()
		Database.db.data ||= Database.DEFAULT_DATA
	}

	static async get(key: keyof Data): Promise<Data[keyof Data] | undefined> {
		await Database.initiateDatabase()
		return Database.db?.data?.[key]
	}

	static async set(key: keyof Data, value: string) {
		await Database.initiateDatabase()
		if (Database.db?.data) {
			Database.db.data[key] = value
		}
	}
}




