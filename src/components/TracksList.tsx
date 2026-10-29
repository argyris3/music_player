import { TracksListItem } from './TrackListItem'
import { unknownTrackImageUri } from '../constants/image'
import { useQueue } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { Image } from 'expo-image'
import { useRef } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import TrackPlayer, { Track } from 'react-native-track-player'
import { QueueControls } from './QueueControls'

export type TracksListProps = Partial<FlatListProps<Track>> & {
	id: string
	tracks: Track[]
	hideQueueControls?: boolean
}

const ItemDivider = () => (
	<View style={{ ...utilsStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
)

export const TracksList = ({
	id,
	tracks,
	hideQueueControls = false,
	...flatlistProps
}: TracksListProps) => {
	const queueOffset = useRef(0)
	const isSelectingTrack = useRef(false)
	const { activeQueueId, setActiveQueueId } = useQueue()

	const handleTrackSelect = async (selectedTrack: Track) => {
		if (isSelectingTrack.current) return

		const trackIndex = tracks.indexOf(selectedTrack)

		if (trackIndex === -1) return

		isSelectingTrack.current = true

		try {
			const isChangingQueue = id !== activeQueueId

			if (isChangingQueue) {
				const beforeTracks = tracks.slice(0, trackIndex)
				const afterTracks = tracks.slice(trackIndex + 1)

				await TrackPlayer.pause()
				await TrackPlayer.reset()

				await TrackPlayer.add(selectedTrack)
				await TrackPlayer.add(afterTracks)
				await TrackPlayer.add(beforeTracks)

				await TrackPlayer.play()

				queueOffset.current = trackIndex
				setActiveQueueId(id)
			} else {
				const nextTrackIndex =
					trackIndex - queueOffset.current < 0
						? tracks.length + trackIndex - queueOffset.current
						: trackIndex - queueOffset.current

				await TrackPlayer.skip(nextTrackIndex)
				await TrackPlayer.play()
			}
		} catch (error) {
			console.error('Failed to select track', error)
		} finally {
			isSelectingTrack.current = false
		}
	}

	return (
		<FlatList
			data={tracks}
			contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
			ListHeaderComponent={
				!hideQueueControls ? (
					<QueueControls tracks={tracks} style={{ paddingBottom: 20 }} />
				) : undefined
			}
			ListFooterComponent={ItemDivider}
			ItemSeparatorComponent={ItemDivider}
			ListEmptyComponent={
				<View>
					<Text style={utilsStyles.emptyContentText}>No songs found</Text>

					<Image
						source={unknownTrackImageUri}
						cachePolicy="memory-disk"
						style={utilsStyles.emptyContentImage}
					/>
				</View>
			}
			renderItem={({ item: track }) => (
				<TracksListItem track={track} onTrackSelect={handleTrackSelect} />
			)}
			{...flatlistProps}
		/>
	)
}