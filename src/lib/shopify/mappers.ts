import { Collection, Product, Image, Money, ProductVariant, Cart, CartLine } from './types';

export const removeEdgesAndNodes = <T>(array: { edges: { node: T }[] } | { nodes: T[] } | undefined): T[] => {
  if (!array) return [];
  if ('edges' in array) {
    return array.edges.map((edge) => edge.node);
  }
  return array.nodes;
};

export const mapImage = (image: any): Image => ({
  url: image?.url || '',
  altText: image?.altText || '',
  width: image?.width || 0,
  height: image?.height || 0,
});

export const mapMoney = (money: any): Money => ({
  amount: money?.amount || '0.0',
  currencyCode: money?.currencyCode || 'USD',
});

export const mapVariant = (variant: any): ProductVariant => ({
  id: variant.id,
  title: variant.title,
  availableForSale: variant.availableForSale,
  selectedOptions: variant.selectedOptions || [],
  price: mapMoney(variant.price),
});

export const mapProduct = (product: any): Product => ({
  id: product.id,
  handle: product.handle,
  title: product.title,
  description: product.description,
  descriptionHtml: product.descriptionHtml,
  images: removeEdgesAndNodes(product.images).map(mapImage),
  variants: removeEdgesAndNodes(product.variants).map(mapVariant),
  tags: product.tags || [],
  productType: product.productType,
  availableForSale: product.availableForSale,
  priceRange: {
    minVariantPrice: mapMoney(product.priceRange?.minVariantPrice),
    maxVariantPrice: mapMoney(product.priceRange?.maxVariantPrice),
  },
});

export const mapCollection = (collection: any): Collection => ({
  id: collection.id,
  handle: collection.handle,
  title: collection.title,
  description: collection.description,
  image: collection.image ? mapImage(collection.image) : undefined,
  products: removeEdgesAndNodes(collection.products).map(mapProduct),
});

export const mapCartLine = (line: any): CartLine => ({
  id: line.id,
  quantity: line.quantity,
  cost: {
    totalAmount: mapMoney(line.cost?.totalAmount),
  },
  merchandise: {
    id: line.merchandise.id,
    title: line.merchandise.title,
    product: {
      id: line.merchandise.product.id,
      handle: line.merchandise.product.handle,
      title: line.merchandise.product.title,
      featuredImage: mapImage(line.merchandise.product.featuredImage),
    },
    image: mapImage(line.merchandise.image),
    selectedOptions: line.merchandise.selectedOptions || [],
    price: mapMoney(line.merchandise.price),
  },
});

export const mapCart = (cart: any): Cart => ({
  id: cart.id,
  checkoutUrl: cart.checkoutUrl,
  totalQuantity: cart.totalQuantity,
  lines: removeEdgesAndNodes(cart.lines).map(mapCartLine),
  cost: {
    subtotalAmount: mapMoney(cart.cost?.subtotalAmount),
    totalAmount: mapMoney(cart.cost?.totalAmount),
    totalTaxAmount: mapMoney(cart.cost?.totalTaxAmount),
    totalDutyAmount: mapMoney(cart.cost?.totalDutyAmount),
  },
});
