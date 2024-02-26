export interface IWebsocketCommand {
	type: WebsocketCommandType
	data: IPlayerData | Array<IRoomData> | IGameData | IShipsData
	id: 0
}
export interface IPlayerWebsocketCommand
	extends Omit<IWebsocketCommand, 'data'> {
	data: IPlayerData
}
export interface IRoomWebsocketCommand extends Omit<IWebsocketCommand, 'data'> {
	data: Array<IRoomData>
}
export interface IJsonWebsocketCommand extends Omit<IWebsocketCommand, 'data'> {
	data: string
}
export interface IGameWebsocketCommand extends Omit<IWebsocketCommand, 'data'> {
	data: IGameData
}

export interface IShipsWebsocketCommand
	extends Omit<IWebsocketCommand, 'data'> {
	data: IShipsData
}
export interface IShipsData {
	gameId?: number
	currentPlayerIndex?: number
	ships: [
		{
			position: {
				x: number
				y: number
			}
			direction: boolean
			length: number
			type: 'small' | 'medium' | 'large' | 'huge'
		},
	]
	indexPlayer?: number
}

export interface IGameData {
	idGame: number
	idPlayer: number
}
export interface IPlayerData {
	name: string
	index: number
	error?: boolean
	errorText?: string
}

export interface IRoomData {
	roomId: number
	roomUsers: Array<IPlayerData>
}

export enum WebsocketCommandType {
	REG = 'reg',
	UPDATE_WINNERS = 'update_winners',
	CREATE_ROOM = 'create_room',
	ADD_USER_TO_ROOM = 'add_user_to_room',
	CREATE_GAME = 'create_game',
	UPDATE_ROOM = 'update_room',
	ADD_SHIPS = 'add_ships',
	START_GAME = 'start_game',
	ATTACK = 'attack',
	RANDOM_ATTACK = 'randomAttack',
	TURN = 'turn',
	FINISH = 'finish',
}
