import React from "react";

function ProductCard({ id, name, price, toppings, toppingsList, isTrending }) {
  return (
    <div className="p-4 bg-white text-primary w-full rounded-md shadow-lg">
      <span></span>
      <div className="flex flex-col">
        <p className="text-md font-semibold">MT-{id}</p>
        <p className="text-lg font-bold">{name}</p>
        <span className="h-[3px] w-full bg-primary my-2"></span>
        <p className="font-bold">Toppings:</p>
        <p className="font-medium">{toToppings(toppings, toppingsList)}</p>
        <span className="mt-2 flex flex-row items-center">
          {isTrending && (
            <div className="bg-primary text-white -translate-x-4 px-2 py-1 text-sm font-medium">
              Trending
            </div>
          )}
          <p className="flex-1 text-right text-2xl font-semibold">${price}</p>
        </span>
      </div>
    </div>
  );
}

function toToppings(toppings, toppingsList) {
  const list = toppingsList
    .filter((item) => toppings.includes(item.id))
    .map((item) => item.name);
  return list.join(" ,");
}

export default ProductCard;
