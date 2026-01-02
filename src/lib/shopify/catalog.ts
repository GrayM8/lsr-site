import { shopifyFetch } from './client';
import { PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY } from './queries';
import { mapProduct, removeEdgesAndNodes } from './mappers';
import { Product } from './types';

export async function getProducts(): Promise<Product[]> {
  const { body } = await shopifyFetch<any>({
    query: PRODUCTS_QUERY,
    revalidate: 900,
  });

  return removeEdgesAndNodes(body.products).map(mapProduct);
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const { body } = await shopifyFetch<any>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    revalidate: 900,
  });

  if (!body.product) {
    return null;
  }

  return mapProduct(body.product);
}
