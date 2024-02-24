import { IncomingMessage } from 'http'
import { RawData, WebSocket, WebSocketServer } from 'ws'
import { deepParsing } from '../tools/deepParsing'
import { IWebsocketCommand, WebsocketCommandType } from '../types/types'

export class BattleShipServer extends WebSocketServer {
	constructor({ port }: { port: number }) {
		super({ port })
		this.on('connection', this.handleConnection.bind(this))
	}
	handleConnection(ws: WebSocket, req: IncomingMessage) {
		ws.on('message', (data: RawData) => {
			const parsedData = deepParsing(data.toString())
			switch (parsedData.type) {
				case WebsocketCommandType.REG:
					this.registrationResponse(parsedData)
			}
		})
	}
	registrationResponse(data: IWebsocketCommand) {
		console.log(data)
	}
}
//
// const player: IWebsocketCommand = {
// 	type: WebsocketCommandType.REG,
// 	data: {
// 		name: 'sdfdsf',
// 		index: 2,
// 		error: false,
// 		errorText: '',
// 	},
// 	id: 0,
// }

// wss.on('connection', (ws) => {
// 	ws.on('message', (data) => {
// 		console.log(JSON.parse(data.toString()))
// 		ws.send(deepStringify(player))
// 	})
// })
