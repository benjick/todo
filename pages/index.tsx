import type { NextPage } from "next";
import { useTodo } from "../src/state";
import { AddCategory } from "../components/AddCategory";
import { ShowCompleted } from "../components/ShowCompleted";
import { AddItem } from "../components/AddItem";
import { EmptyState } from "../components/EmptyState";
import { CategoryPopup } from "../components/CategoryPopup";
import { ItemPopup } from "../components/ItemPopup";
import { TodoCategory } from "../components/TodoCategory";

const Home: NextPage = () => {
  const { derivedCategories, showCompleted } = useTodo();
  const categories = derivedCategories.filter(
    (category) => showCompleted || !category.done
  );
  return (
    <div>
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
                <TodoCategory
                  key={category.id}
                  category={category}
                  showCompleted={showCompleted}
                />
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
