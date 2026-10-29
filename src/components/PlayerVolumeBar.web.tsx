import { colors } from '@/constants/tokens'
import { useTrackPlayerVolume } from '@/hooks/useTrackPlayerVolume'
import { Ionicons } from '@expo/vector-icons'
import { createElement } from 'react'
import { View, ViewProps } from 'react-native'

export const PlayerVolumeBar = ({ style }: ViewProps) => {
	const { volume, updateVolume } = useTrackPlayerVolume()

	return (
		<View style={style}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Ionicons name="volume-low" size={20} color={colors.icon} style={{ opacity: 0.8 }} />

				<View style={{ flex: 1, paddingHorizontal: 10 }}>
					{createElement('input', {
						type: 'range',
						min: 0,
						max: 1,
						step: 0.01,
						value: volume ?? 0,
						'aria-label': 'Playback volume',
						onChange: (event) => {
							void updateVolume(event.currentTarget.valueAsNumber).catch((error) => {
								console.error('Failed to update playback volume', error)
							})
						},
						style: {
							width: '100%',
							margin: 0,
							accentColor: colors.primary,
							cursor: 'pointer',
						},
					})}
				</View>

				<Ionicons name="volume-high" size={20} color={colors.icon} style={{ opacity: 0.8 }} />
			</View>
		</View>
	)
}
