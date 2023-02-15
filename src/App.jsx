import React, { useState, useEffect } from "react";
import { fetchProducts, fetchStores, fetchToppings } from "./api";
import ProductCard from "./components/ProductCard";
import lodash from "lodash";

function App() {
  const [stores, setStores] = useState();
  const [products, setProducts] = useState();
  const [toppings, setToppings] = useState();

  const [filter, setFilter] = useState(false);
  const [filterList, setFilterList] = useState([]);
  const [sortBy, setSortBy] = useState("na");
  const [showing, setShowing] = useState();

  const [selected, setSelected] = useState();
  const [loading, setLoading] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const getDate = async () => {
      const storesData = fetchStores();
      const toppingsData = fetchToppings();
      setStores(storesData);
      setToppings(toppingsData);
      setSelected(storesData[0]);
      setLoading(false);
    };
    getDate();
  }, []);

  useEffect(() => {
    if (selected) {
      const data = fetchProducts(selected.id);
      setProducts(productSort(data, sortBy));
    }
  }, [selected]);

  useEffect(() => {
    setShowing(products);
  }, [products]);

  useEffect(() => {
    setShowing(productSort(products, sortBy));
  }, [sortBy]);

  useEffect(() => {
    if (filterList && products) {
      const tempProducts = products.filter((product) => {
        let flag = true;
        filterList.map((item) => {
          if (!product.toppings?.includes(item)) {
            flag = false;
          }
        });
        return flag;
      });
      setShowing(productSort(tempProducts, sortBy));
    }
  }, [filterList, products]);

  return loading ? (
    <div>Loading</div>
  ) : (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Left sidebar */}
      <aside className="hidden md:flex md:w-[200px] flex-col bg-primary">
        <span className="h-16 flex items-center justify-center text-white font-bold text-2xl">
          Milk Tea Store
        </span>
        <nav className="py-4">
          <ul className="flex flex-col gap-1">
            {stores.map((store) => (
              <li
                className={`py-3 inline-flex cursor-pointer justify-center font-semibold ${
                  selected.id === store.id
                    ? "bg-[#304476] text-white"
                    : "text-[#70788f]"
                }`}
                onClick={() => {
                  setSelected(store);
                }}
                key={store.id}
              >
                {store.name}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <section className="flex bg-primary py-4 px-6 text-white md:hidden">
        <div
          className="inline-flex justify-evenly items-center cursor-pointer"
          onClick={() => setIsNavOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-menu-2"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M4 6l16 0"></path>
            <path d="M4 12l16 0"></path>
            <path d="M4 18l16 0"></path>
          </svg>
        </div>
        <span className="text-white font-bold text-2xl mx-auto">
          Milk Tea Store
        </span>

        <div
          className={
            isNavOpen
              ? "absolute w-full h-screen top-0 left-0 bg-white z-10 flex flex-col items-center"
              : "hidden"
          }
        >
          <div
            className="absolute top-0 right-0 px-8 py-8"
            onClick={() => setIsNavOpen(false)}
          >
            <svg
              className="h-8 w-8 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <ul className="flex h-full flex-col items-center justify-center min-h-[250px]">
            {stores.map((store) => (
              <li
                className={`px-4 rounded py-3 inline-flex cursor-pointer justify-center font-semibold ${
                  selected.id === store.id
                    ? "bg-[#304476] text-white"
                    : "text-[#70788f]"
                }`}
                onClick={() => {
                  setSelected(store);
                  setIsNavOpen(false);
                }}
                key={store.id}
              >
                {store.name}
              </li>
            ))}
          </ul>
        </div>
      </section>
      {/* Content */}
      <main className="bg-[#f0f0f0] flex-1 px-2 md:px-16 pt-12 overflow-auto pb-6">
        <div className="flex flex-col text-primary gap-6 ">
          {/* Header */}
          <header className="text-4xl font-bold text-center pb-6">
            {selected.name} Menu
          </header>
          {/* Filter and sort by */}
          <span className="inline-flex items-center justify-between ">
            <button
              onClick={() => setFilter(!filter)}
              className="rounded w-32 py-2 bg-primary text-white"
            >
              Filter
            </button>
            <span className="inline-flex gap-2 items-center">
              <label htmlFor="sort" className="font-bold">
                Sort By
              </label>
              <select
                name="sort"
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2 w-32 rounded outline outline-1  bg-[#e4e4e4] px-4 border-r-8 border-transparent"
              >
                <option value="na">Name ⬆</option>
                <option value="nd">Name ⬇</option>
                <option value="pa">Price ⬆</option>
                <option value="pd">Price ⬇</option>
              </select>
            </span>
          </span>
          {/* Toppings */}
          <div
            className={`rounded-sm bg-white p-4 flex flex-col ${
              filter ? "block" : "hidden"
            }`}
          >
            <label className="font-bold mb-4">Toppings:</label>
            <div className="flex flex-row flex-wrap">
              {toppings &&
                toppings.map((topping) => (
                  <span
                    key={topping.id}
                    className="w-1/3 flex items-center gap-2"
                    onClick={() => {
                      document
                        .getElementById(`topping-${topping.name}`)
                        .click();
                      if (filterList.includes(topping.id)) {
                        setFilterList(
                          filterList.filter((item) => item !== topping.id)
                        );
                      } else {
                        setFilterList([...filterList, topping.id]);
                      }
                    }}
                  >
                    <div className="h-6 w-6 border border-primary p-[3px]">
                      <input
                        type="checkbox"
                        name="toppings"
                        id={`topping-${topping.name}`}
                        className="peer hidden"
                      />
                      <div className="w-full h-full bg-transparent peer-checked:bg-primary"></div>
                    </div>

                    <label htmlFor={`topping-${topping.name}`}>
                      {topping.name}
                    </label>
                  </span>
                ))}
            </div>
          </div>
          {/* Products  */}'
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
            {showing &&
              showing.map((product, index) => (
                <ProductCard
                  {...product}
                  key={index}
                  toppingsList={toppings}
                  isTrending={index === 0}
                />
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function productSort(products, sortBy) {
  if (products) {
    switch (sortBy) {
      case "na":
        return lodash.sortBy(products, ["name"]);
      case "nd":
        return lodash.sortBy(products, ["name"]).reverse();
      case "pa":
        return lodash.sortBy(products, ["price"]);
      case "pd":
        return lodash.sortBy(products, ["price"]).reverse();
      default:
        return products;
    }
  }
}

export default App;
