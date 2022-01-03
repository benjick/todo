import type { NextPage } from "next";
import Head from "next/head";
import { useTodo } from "../src/state";
import { AddCategory } from "../components/AddCategory";
import { ShowCompleted } from "../components/ShowCompleted";
import { AddItem } from "../components/AddItem";
import { TodoItem } from "../components/TodoItem";

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
                <TodoItem key={item.id} item={item} />
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;
