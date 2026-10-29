import { unknownTrackImageUri } from '@/constants/image'
import { Artist, Playlist, TrackWithPlaylist } from '@/helpers/types'
import { ta_data } from '@/library/lib'
import { Track } from 'react-native-track-player'
import { create } from 'zustand'

interface LibraryState {
	tracks: TrackWithPlaylist[]
	loadTracks: () => Promise<void>
	toggleTrackFavorite: (track: Track) => void
	addToPlaylist: (track: Track, playlistName: string) => void
}

const normalizeTrackUrl = (url: string) => {
	const trimmedUrl = url.trim()
	const normalizedUrl =
		trimmedUrl.startsWith('{') && trimmedUrl.endsWith('}')
			? trimmedUrl.slice(1, -1).trim()
			: trimmedUrl

	if (!normalizedUrl || /[{}]/.test(normalizedUrl)) {
		throw new Error('Database returned an invalid track URL')
	}

	return normalizedUrl
}

export const useLibraryStore = create<LibraryState>()((set) => ({
	tracks: [],
	loadTracks: async () => {
		const { data, error } = await ta_data.from<TrackWithPlaylist>('mobile_demo').select('*')

		if (error) {
			throw new Error(`Failed to load mobile_demo data: ${error}`)
		}

		if (data === null) {
			throw new Error('Failed to load mobile_demo data: the database returned no data')
		}

		const tracks = Array.isArray(data) ? data : [data]
		set({
			tracks: tracks.map((track) => ({
				...track,
				url: normalizeTrackUrl(track.url),
			})),
		})
	},
	toggleTrackFavorite: (track) =>
		set((state) => ({
			tracks: state.tracks.map((currentTrack) => {
				if (currentTrack.url === track.url) {
					return {
						...currentTrack,
						rating: currentTrack.rating === 1 ? 0 : 1,
					}
				}

				return currentTrack
			}),
		})),
	addToPlaylist: (track, playlistName) =>
		set((state) => ({
			tracks: state.tracks.map((currentTrack) => {
				if (currentTrack.url === track.url) {
					return {
						...currentTrack,
						playlist: [...(currentTrack.playlist ?? []), playlistName],
					}
				}

				return currentTrack
			}),
		})),
}))

export const useTracks = () => useLibraryStore((state) => state.tracks)

export const useFavorites = () => {
	const tracks = useLibraryStore((state) => state.tracks)
	const toggleTrackFavorite = useLibraryStore((state) => state.toggleTrackFavorite)
	const favorites = tracks.filter((track) => track.rating === 1)

	return {
		favorites,
		toggleTrackFavorite,
	}
}

export const useArtists = () => {
	const tracks = useLibraryStore((state) => state.tracks)

	return tracks.reduce((acc, track) => {
		const existingArtist = acc.find((artist) => artist.name === track.artist)

		if (existingArtist) {
			existingArtist.tracks.push(track)
		} else {
			acc.push({
				name: track.artist ?? 'Unknown',
				tracks: [track],
			})
		}

		return acc
	}, [] as Artist[])
}

export const usePlaylists = () => {
	const tracks = useLibraryStore((state) => state.tracks)
	const addToPlaylist = useLibraryStore((state) => state.addToPlaylist)

	const playlists = tracks.reduce((acc, track) => {
		track.playlist?.forEach((playlistName) => {
			const existingPlaylist = acc.find((playlist) => playlist.name === playlistName)

			if (existingPlaylist) {
				existingPlaylist.tracks.push(track)
			} else {
				acc.push({
					name: playlistName,
					tracks: [track],
					artworkPreview: track.artwork ?? unknownTrackImageUri,
				})
			}
		})

		return acc
	}, [] as Playlist[])

	return { playlists, addToPlaylist }
}
