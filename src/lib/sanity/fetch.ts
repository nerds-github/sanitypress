import client from '@/lib/sanity/client'
import dev from '@/lib/env'
import { draftMode } from 'next/headers'
import type { QueryParams, QueryOptions } from 'next-sanity'

export { groq } from 'next-sanity'

export async function fetchSanity<T = any>(
	query: string,
	{
		params = {},
		...next
	}: {
		params?: QueryParams
	} & QueryOptions['next'] = {},
) {
	const isDraft = (await draftMode()).isEnabled
	const preview = dev || isDraft

	return client.fetch<T>(
		query,
		params,
		preview
			? {
					stega: true,
					perspective: 'previewDrafts',
					useCdn: false,
					token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
					next: {
						revalidate: 0,
						...next,
					},
				}
			: {
					perspective: 'published',
					useCdn: true,
					next: {
						revalidate: 3600, // every hour
						...next,
					},
				},
	)
}
