export const generateUniqueNumber = (): number => {
	const generatedNumbers: Set<number> = new Set<number>()
	let randomNumber: number

	do {
		randomNumber = Math.floor(Math.random() * 101)
	} while (generatedNumbers.has(randomNumber))

	return randomNumber
}
