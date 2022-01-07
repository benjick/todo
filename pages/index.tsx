import type { NextPage } from "next";
import Head from "next/head";
import { DerivedCategory, useTodo } from "../src/state";
import { AddCategory } from "../components/AddCategory";
import { ShowCompleted } from "../components/ShowCompleted";
import { AddItem } from "../components/AddItem";
import { TodoItem } from "../components/TodoItem";
import { EmptyState } from "../components/EmptyState";
import { CategoryPopup } from "../components/CategoryPopup";
import { useCategoryForm } from "../src/form/category";
import { ItemPopup } from "../components/ItemPopup";

const CategoryTitle: React.FC<{ category: DerivedCategory }> = ({
  category,
}) => {
  const { setOpen, setForm } = useCategoryForm();
  return (
    <button
      onClick={() => {
        setForm(category.id, {
          name: category.name,
          closeAfterFinished: category.closeAfterFinished,
          resetAfterDays: category.resetAfterDays,
        });
        setOpen(true);
      }}
      className="block text-sm font-medium text-gray-700 mb-4"
    >
      {category.name}{" "}
      {category.closeAfterFinished ? (
        <span>(complete {category.closeAfterFinished})</span>
      ) : undefined}
    </button>
  );
};

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

      {/* Popups */}
      <CategoryPopup />
      <ItemPopup />

      <main>
        <div className="relative z-0 inline-flex shadow-sm rounded-md m-2">
          <AddItem />
          <AddCategory />
          <ShowCompleted />
        </div>

        {categories.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={category.id} className="px-4 py-4 sm:px-6">
                  <CategoryTitle category={category} />
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
