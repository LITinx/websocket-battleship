import { IJsonWebsocketCommand, IPlayerData } from '../types/types'

export const deepParsing = (wsCommand: IJsonWebsocketCommand) => {
	return { ...wsCommand, data: JSON.parse(wsCommand.data) as IPlayerData }
}
