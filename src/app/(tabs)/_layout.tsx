import { FloatingPlayer } from '@/components/FloatingPlayer'
import { colors, fontSize } from '@/constants/tokens'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { StyleSheet, Text } from 'react-native'

const TabsNavigation = () => {
	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: colors.primary,
					tabBarLabelStyle: {
						fontSize: fontSize.xs,
						fontWeight: '500',
					},
					headerShown: false,
					tabBarStyle: {
						position: 'absolute',
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						borderTopWidth: 0,
						paddingTop: 8,
					},
					tabBarBackground: () => (
						<BlurView
							intensity={95}
							style={{
								...StyleSheet.absoluteFill,
								overflow: 'hidden',
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
							}}
						/>
					),
				}}
			>
				<Tabs.Screen
					name="favorites"
					options={{
						title: 'Favorites',
						tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>♥</Text>,
					}}
				/>
				<Tabs.Screen
					name="playlists"
					options={{
						title: 'Playlists',
						tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 28 }}>☷</Text>,
					}}
				/>
				<Tabs.Screen
					name="(songs)"
					options={{
						title: 'Songs',
						tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>♫</Text>,
					}}
				/>
				<Tabs.Screen
					name="artists"
					options={{
						title: 'Artists',
						tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>♙</Text>,
					}}
				/>
			</Tabs>

			<FloatingPlayer
				style={{
					position: 'absolute',
					left: 8,
					right: 8,
					bottom: 78,
				}}
			/>
		</>
	)
}

export default TabsNavigation