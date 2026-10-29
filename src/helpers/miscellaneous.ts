export const formatSecondsToMinutes = (seconds: number) => {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = Math.floor(seconds % 60)

	const formattedMinutes = String(minutes).padStart(2, '0')
	const formattedSeconds = String(remainingSeconds).padStart(2, '0')

	return `${formattedMinutes}:${formattedSeconds}`
}

export const generateTracksListId = (trackListName: string, search?: string) => {
	return `${trackListName}${`-${search}` || ''}`
}

export const encodeRouteSegment = (value: string) =>
	`u-${Array.from({ length: value.length }, (_, index) =>
		value.charCodeAt(index).toString(16).padStart(4, '0'),
	).join('')}`

export const decodeRouteSegment = (value: string) => {
	if (!value.startsWith('u-')) return value

	const encodedValue = value.slice(2)
	if (encodedValue.length === 0) return ''
	if (!/^(?:[0-9a-f]{4})+$/i.test(encodedValue)) return value

	let decodedValue = ''
	for (let index = 0; index < encodedValue.length; index += 4) {
		decodedValue += String.fromCharCode(parseInt(encodedValue.slice(index, index + 4), 16))
	}

	return decodedValue
}
