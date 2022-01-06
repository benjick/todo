import type { NextPage } from "next";
import Head from "next/head";
import { useTodo } from "../src/state";
import { AddCategory } from "../components/AddCategory";
import { ShowCompleted } from "../components/ShowCompleted";
import { AddItem } from "../components/AddItem";
import { TodoItem } from "../components/TodoItem";
import { EmptyState } from "../components/EmptyState";

const Home: NextPage = () => {
  const { categoriesWithItems, showCompleted } = useTodo();
  const categories = categoriesWithItems.filter(
    (category) => showCompleted || !category.done
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

        {categories.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={category.id} className="px-4 py-4 sm:px-6">
                  <p className="block text-sm font-medium text-gray-700 mb-4">
                    {category.name}{" "}
                    {category.closeAfterFinished ? (
                      <span>(complete {category.closeAfterFinished})</span>
                    ) : undefined}
                  </p>
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {category.items
                      .filter((item) => showCompleted || !item.done)
                      .map((item) => (
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
