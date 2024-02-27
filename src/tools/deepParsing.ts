export const deepParsing = (wsCommand: any) => {
	if (wsCommand.data === '') return wsCommand
	return { ...wsCommand, data: JSON.parse(wsCommand.data) }
}
