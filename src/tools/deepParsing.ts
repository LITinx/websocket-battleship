import {
	IPlayerData,
	IRawWebsocketCommand,
	IWebsocketCommand,
} from '../types/types'

export const deepParsing = (wsCommand: string): IWebsocketCommand => {
	const parsedData = JSON.parse(wsCommand) as IRawWebsocketCommand
	const deepParsedData = JSON.parse(parsedData.data) as IPlayerData
	return { ...parsedData, data: deepParsedData }
}
