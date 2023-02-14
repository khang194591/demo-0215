import { stores } from "../../data/stores.json";
import { products } from "../../data/products.json";
import { toppings } from "../../data/toppings.json";
import { shopProducts } from "../../data/storeProducts.json";

export function fetchStores() {
  return stores;
}

export function fetchStoreById(id) {
  return stores.filter((store) => store.id === id);
}

export function fetchProducts(storeId) {
  const list = [
    ...new Set(
      shopProducts
        .filter((item) => item.shop === storeId)
        .map((item) => item.product)
    ),
  ];
  return products.filter((item) => list.includes(item.id));
}

export function fetchToppings() {
  return toppings;
}
