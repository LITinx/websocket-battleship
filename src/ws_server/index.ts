import { IncomingMessage } from 'http'
import { RawData, WebSocket, WebSocketServer } from 'ws'
import { deepParsing } from '../tools/deepParsing'
import { deepStringify } from '../tools/deepStringify'
import { generateUniqueNumber } from '../tools/generateUniqueNumber'
import {
	IGameWebsocketCommand,
	IPlayerData,
	IPlayerWebsocketCommand,
	IRoomWebsocketCommand,
	IShipsWebsocketCommand,
	WebsocketCommandType,
} from '../types/types'
export class BattleShipServer extends WebSocketServer {
	private _playerData: IPlayerWebsocketCommand[]
	private _roomId: number = generateUniqueNumber()
	constructor({ port }: { port: number }) {
		super({ port })
		this._playerData = []
		this.on('connection', this.handleConnection.bind(this))
		this.on('close', this.handleServerClose.bind(this))
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
		const userId = generateUniqueNumber()
		console.log(`Received a new connection.`)
		console.log(`${userId} connected.`)
		ws.on('message', (data) => this.responseHandler(data, ws))
	}

	responseHandler(data: RawData, ws: WebSocket) {
		const parsedData = JSON.parse(data.toString())

		console.log(deepParsing(parsedData))
		switch (parsedData.type) {
			case WebsocketCommandType.REG:
				const playerData = deepParsing(parsedData)
				this.registrationResponse(playerData, ws)
				break
			case WebsocketCommandType.CREATE_ROOM:
				this.clients.forEach((client) => {
					this.updateRoomCommandResponse(client)
				})
				break
			case WebsocketCommandType.ADD_USER_TO_ROOM:
				this.clients.forEach((client) => {
					this.createGameCommandResponse(client)
				})
				break
			case WebsocketCommandType.ADD_SHIPS:
				this.clients.forEach((client) => {
					this.addShipsResponse(parsedData, client)
				})
			default:
				break
		}
	}

	registrationResponse(data: IPlayerWebsocketCommand, ws: WebSocket) {
		const playerId = generateUniqueNumber()
		const player: IPlayerWebsocketCommand = {
			type: data.type as WebsocketCommandType.REG,
			data: {
				name: data.data.name,
				index: playerId,
				error: false,
				errorText: '',
			},
			id: 0,
		}
		this._playerData.push(player)
		ws.send(deepStringify(player))
	}

	addShipsResponse(data: IShipsWebsocketCommand, client: WebSocket) {
		const receivedData: IShipsWebsocketCommand = deepParsing(data)

		const gameShips: IShipsWebsocketCommand = {
			type: WebsocketCommandType.START_GAME,
			data: {
				ships: receivedData.data.ships,
				currentPlayerIndex: receivedData.data.indexPlayer,
			},
			id: 0,
		}
		client.send(deepStringify(gameShips))
	}

	createGameCommandResponse(client: WebSocket) {
		const game: IGameWebsocketCommand = {
			type: WebsocketCommandType.CREATE_GAME,
			data: {
				idGame: this._roomId,
				idPlayer: this._playerData[0].data.index,
			},
			id: 0,
		}
		client.send(deepStringify(game))
	}

	updateRoomCommandResponse(client: WebSocket) {
		const roomUuid = this._roomId
		const players: IPlayerData[] = []
		this._playerData.forEach((player) => {
			if (player.data.name === '') return
			players.push({
				name: player.data.name,
				index: player.data.index,
			})
		})

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
