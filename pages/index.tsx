import type { NextPage } from "next";
import Head from "next/head";
import { useTodo } from "../src/state";
import { AddCategory } from "../components/AddCategory";
import { ShowCompleted } from "../components/ShowCompleted";
import { AddItem } from "../components/AddItem";
import { TodoItem } from "../components/TodoItem";
import { EmptyState } from "../components/EmptyState";

const Home: NextPage = () => {
  const { categoriesWithEvents } = useTodo();
  const categoriesWithEventsAndItems = categoriesWithEvents.filter(
    (category) => category.items.length > 0 && !category.hide
  );
  return (
    <div>
      <Head>
        <title>TODO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <span className="relative z-0 inline-flex shadow-sm rounded-md m-2">
          <AddItem />
          <AddCategory />
          <ShowCompleted />
        </span>
        <hr />

        {categoriesWithEventsAndItems.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {categoriesWithEventsAndItems.map((category) => (
                <li key={category.id} className="px-4 py-4 sm:px-6">
                  <p className="block text-sm font-medium text-gray-700 mb-4">
                    {category.name}
                  </p>
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {category.items.map((item) => (
                      <TodoItem key={item.id} item={item} />
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

export default Home;
