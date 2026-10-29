import { PlaylistTracksList } from '@/components/PlaylistTracksList'
import { screenPadding } from '@/constants/tokens'
import { decodeRouteSegment } from '@/helpers/miscellaneous'
import { usePlaylists } from '@/store/library'
import { defaultStyles } from '@/styles'
import { Redirect, useLocalSearchParams } from 'expo-router'
import { ScrollView, View } from 'react-native'

const PlaylistScreen = () => {
	const { name } = useLocalSearchParams<{ name: string }>()
	const playlistName = decodeRouteSegment(name)

	const { playlists } = usePlaylists()

	const playlist = playlists.find((playlist) => playlist.name === playlistName)

	if (!playlist) {
		console.warn(`Playlist ${playlistName} was not found!`)

		return <Redirect href={'/(tabs)/playlists'} />
	}

	return (
		<View style={defaultStyles.container}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{ paddingHorizontal: screenPadding.horizontal }}
			>
				<PlaylistTracksList playlist={playlist} />
			</ScrollView>
		</View>
	)
}

export default PlaylistScreen