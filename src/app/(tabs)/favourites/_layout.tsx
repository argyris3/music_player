import { StackScreenWithSearchBar } from '@/constants/layout'
import { defaultStyles } from '@/styles'
import { Stack } from 'expo-router'
import { createElement } from 'react'
import { View } from 'react-native'

const FavoritesScreenLayout = () => {
	return createElement(
		View,
		{ style: defaultStyles.container },
		createElement(
			Stack,
			null,
			createElement(Stack.Screen, {
				name: 'index',
				options: {
					...StackScreenWithSearchBar,
					headerBlurEffect: 'systemMaterial',
					headerTitle: 'Favorites',
				},
			}),
		),
	)
}

export default FavoritesScreenLayout
