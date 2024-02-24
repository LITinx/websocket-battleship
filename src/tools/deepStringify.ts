import { IWebsocketCommand } from '../types/types'

export const deepStringify = (wsCommand: IWebsocketCommand) => {
	return JSON.stringify({ ...wsCommand, data: JSON.stringify(wsCommand.data) })
}
