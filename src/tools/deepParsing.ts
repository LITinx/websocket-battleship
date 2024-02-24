import { IPlayerData, IRawWebsocketCommand } from '../types/types'

export const deepParsing = (wsCommand: string) => {
	const parsedData = JSON.parse(wsCommand) as IRawWebsocketCommand
	const deepParsedData = JSON.parse(parsedData.data) as IPlayerData
	return { ...parsedData, data: deepParsedData }
}
