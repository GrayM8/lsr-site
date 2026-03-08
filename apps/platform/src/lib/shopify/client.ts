const domain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-10';

type ShopifyFetchParams = {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  revalidate?: number | false;
};

export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  revalidate,
}: ShopifyFetchParams): Promise<{ body: T }> {
  if (!domain || !accessToken) {
    throw new Error('Missing Shopify environment variables');
  }

  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': accessToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache,
  };

  if (revalidate !== undefined && revalidate !== false) {
    fetchOptions.next = { revalidate };
  } else if (revalidate === false) {
      // no-store handled by cache: 'no-store' usually, but for Next.js revalidate: 0 or cache: 'no-store'
      // If revalidate is explicitly false, we assume the caller might want no cache at all.
      // But standard fetch cache='no-store' is safer.
      // We will respect the passed 'cache' param primarily.
  }

  try {
    const result = await fetch(endpoint, fetchOptions);
    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      body: body.data,
    };
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    throw {
      message: 'Unknown Shopify Error',
      originalError: e,
    };
  }
}
