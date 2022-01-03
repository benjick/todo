import type { NextPage } from "next";
import Head from "next/head";
import { useTodo } from "../src/state";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import { AddCategory } from "../components/AddCategory";
import { ShowCompleted } from "../components/ShowCompleted";
import { AddItem } from "../components/AddItem";

const Home: NextPage = () => {
  const { categoriesWithEvents, finishTodo } = useTodo();
  return (
    <div>
      <Head>
        <title>TODO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <AddItem />

        <AddCategory />

        <ShowCompleted />
        <hr />
        {categoriesWithEvents.map((category) => (
          <div className="flow-root mt-6" key={category.id}>
            <p>{category.name}</p>
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {category.items.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <BadgeCheckIcon style={{ width: 25 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => finishTodo(item.id)}
                        className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Finish
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;
