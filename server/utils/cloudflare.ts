import { createError, type H3Event } from 'h3'

export function useWAE(event: H3Event, query: string) {
  const { cfAccountId: runtimeAccountId, cfApiToken: runtimeApiToken } = useRuntimeConfig(event)
  const env = event.context.cloudflare?.env
  const cfAccountId = runtimeAccountId || env?.NUXT_CF_ACCOUNT_ID
  const cfApiToken = runtimeApiToken || env?.NUXT_CF_API_TOKEN

  if (!cfAccountId || !cfApiToken) {
    throw createError({
      status: 500,
      statusText: 'Cloudflare Analytics Engine is not configured',
    })
  }
  console.info('useWAE', query)
  return $fetch(`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/analytics_engine/sql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfApiToken}`,
    },
    body: query,
    retry: 1,
    retryDelay: 100, // ms
  })
}
