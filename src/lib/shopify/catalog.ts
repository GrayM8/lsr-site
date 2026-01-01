import { shopifyFetch } from './client';
import { COLLECTIONS_QUERY, COLLECTION_BY_HANDLE_QUERY, PRODUCT_BY_HANDLE_QUERY } from './queries';
import { mapCollection, mapProduct, removeEdgesAndNodes } from './mappers';
import { Collection, Product } from './types';

export async function getCollections(): Promise<Collection[]> {
  const { body } = await shopifyFetch<any>({
    query: COLLECTIONS_QUERY,
    revalidate: 900,
  });

  return removeEdgesAndNodes(body.collections).map((node: any) => ({
    ...node,
    products: [], // Basic list doesn't include products usually, or mapped differently
    image: node.image ? { ...node.image } : undefined,
  }));
}

export async function getCollectionByHandle(handle: string): Promise<Collection | null> {
  const { body } = await shopifyFetch<any>({
    query: COLLECTION_BY_HANDLE_QUERY,
    variables: { handle },
    revalidate: 900,
  });

  if (!body.collection) {
    return null;
  }

  return mapCollection(body.collection);
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
