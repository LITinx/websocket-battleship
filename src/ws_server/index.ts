import { IncomingMessage } from 'http'
import { v4 } from 'uuid'
import { RawData, WebSocket, WebSocketServer } from 'ws'
import { deepParsing } from '../tools/deepParsing'
import { deepStringify } from '../tools/deepStringify'
import {
	IPlayerData,
	IPlayerWebsocketCommand,
	IRoomWebsocketCommand,
	IWebsocketCommand,
	WebsocketCommandType,
} from '../types/types'

export class BattleShipServer extends WebSocketServer {
	private _playerData: IPlayerWebsocketCommand[] = [
		{
			data: {
				name: '',
				index: '',
			},
			id: 0,
			type: WebsocketCommandType.REG,
		},
	]
	constructor({ port }: { port: number }) {
		super({ port })
		this.on('connection', this.handleConnection.bind(this))
	}

	handleServerClose() {
		// this.clients.forEach((ws) => ws.close());
		const data = JSON.stringify({ server: 'closed' })
		this.clients.forEach((client) => {
			client.send(data)
			client.close()
			this._playerData = []
		})
	}

	handleConnection(ws: WebSocket, req: IncomingMessage) {
		ws.on('message', (data) => this.responseHandler(data, ws))
	}

	responseHandler(data: RawData, ws: WebSocket) {
		const parsedData = JSON.parse(data.toString())
		switch (parsedData.type) {
			case WebsocketCommandType.REG:
				const playerData = deepParsing(data.toString())
				this.registrationResponse(playerData, ws)
				break
			case WebsocketCommandType.CREATE_ROOM:
				this.clients.forEach((client) => {
					this.updateRoomCommandResponse(client)
				})
				break
		}
	}

	registrationResponse(data: IPlayerWebsocketCommand, ws: WebSocket) {
		const playerUuid = v4()
		const player: IPlayerWebsocketCommand = {
			type: data.type as WebsocketCommandType.REG,
			data: {
				name: data.data.name,
				index: playerUuid,
				error: false,
				errorText: '',
			},
			id: 0,
		}
		this._playerData.push(player)
		ws.send(deepStringify(player))
	}

	updateRoomCommandResponse(client: any) {
		const roomUuid = v4()
		const players: IPlayerData[] = []
		this._playerData.forEach((player) => {
			if (player.data.name === '') return
			players.push({
				name: player.data.name,
				index: player.data.index,
			})
		})
		console.log(players)

		const room: IRoomWebsocketCommand = {
			type: WebsocketCommandType.UPDATE_ROOM,
			data: [
				{
					roomId: roomUuid,
					roomUsers: players,
				},
			],
			id: 0,
		}
		client.send(deepStringify(room))
	}
}
