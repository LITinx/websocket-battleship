export interface IWebsocketCommand {
	type: WebsocketCommandType
	data: IPlayerData | Array<IRoomData> | IGameData
	id: 0
}
export interface IPlayerWebsocketCommand
	extends Omit<IWebsocketCommand, 'data'> {
	data: IPlayerData
}
export interface IRoomWebsocketCommand extends Omit<IWebsocketCommand, 'data'> {
	data: Array<IRoomData>
}
export interface IRawWebsocketCommand extends Omit<IWebsocketCommand, 'data'> {
	data: string
}
export interface IGameWebsocketCommand extends Omit<IWebsocketCommand, 'data'> {
	data: IGameData
}
export interface IGameData {
	idGame: string
	idPlayer: string
}
export interface IPlayerData {
	name: string
	index: string
	error?: boolean
	errorText?: string
}

export interface IRoomData {
	roomId: string
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
