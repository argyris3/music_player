import { Asset } from 'expo-asset'
const unknownArtistImage = require('../../assets/unknown_artist.png')
const unknownTrackImage = require('../../assets/unknown_track.png')

export const unknownTrackImageUri = Asset.fromModule(unknownTrackImage).uri
export const unknownArtistImageUri = Asset.fromModule(unknownArtistImage).uri
