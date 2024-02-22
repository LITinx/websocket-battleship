import { WebSocketServer } from 'ws'

export class BattleShipServer extends WebSocketServer {
	constructor({ port }: { port: number }) {
		super({ port })
	}
}
