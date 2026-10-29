import { playbackService } from '@/constants/playbackService'
import { colors } from '@/constants/tokens'
// @ts-ignore TS config does not set `jsx` for this TSX hook module.
import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState'
// @ts-ignore TS config does not set `jsx` for this TSX hook module.
import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer'
// @ts-ignore TS config does not set `jsx` for this TSX store module.
import { useLibraryStore } from '@/store/library'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { createElement, useCallback, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import TrackPlayer from 'react-native-track-player'

SplashScreen.preventAutoHideAsync()

TrackPlayer.registerPlaybackService(() => playbackService)

const App = () => {
	const loadTracks = useLibraryStore((state) => state.loadTracks)

	useEffect(() => {
		void loadTracks().catch((error: unknown) => {
			console.error('Failed to load mobile_demo data', error)
		})
	}, [loadTracks])

	const handleTrackPlayerLoaded = useCallback(() => {
		SplashScreen.hideAsync()
	}, [])

	useSetupTrackPlayer({
		onLoad: handleTrackPlayerLoaded,
	})

	useLogTrackPlayerState()

	return createElement(
		SafeAreaProvider,
		null,
		createElement(
			GestureHandlerRootView,
			{ style: { flex: 1 } },
			createElement(RootNavigation),
			createElement(StatusBar, { style: 'auto' }),
		),
	)
}

const RootNavigation = () => {
	return createElement(
		Stack,
		null,
		createElement(Stack.Screen, {
			name: '(tabs)',
			options: { headerShown: false },
		}),
		createElement(Stack.Screen, {
			name: 'player',
			options: {
				presentation: 'card',
				gestureEnabled: true,
				gestureDirection: 'vertical',
				animationDuration: 400,
				headerShown: false,
			},
		}),
		createElement(Stack.Screen, {
			name: '(modals)/addToPlaylist',
			options: {
				presentation: 'modal',
				headerStyle: {
					backgroundColor: colors.background,
				},
				headerTitle: 'Add to playlist',
				headerTitleStyle: {
					color: colors.text,
				},
			},
		}),
	)
}

export default App
