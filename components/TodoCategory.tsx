import { DerivedCategory } from "../src/state";
import { TodoItem } from "../components/TodoItem";
import { useCategoryForm } from "../src/hooks/useCategoryForm";
import { useMemo } from "react";

const Title: React.FC<{ category: DerivedCategory }> = ({ category }) => {
  const { setOpen, setForm } = useCategoryForm();
  const completed = useMemo(
    () => category.items.filter((category) => category.done).length,
    [category]
  );
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
        completed === 0 ? (
          <span>(complete {category.closeAfterFinished})</span>
        ) : (
          <span>
            ({completed}/{category.closeAfterFinished})
          </span>
        )
      ) : undefined}
    </button>
  );
};

export const TodoCategory: React.FC<{
  category: DerivedCategory;
  showCompleted: boolean;
}> = ({ category, showCompleted }) => {
  return (
    <li key={category.id} className="px-4 py-4 sm:px-6">
      <Title category={category} />
      <ul role="list" className="-my-5 divide-y divide-gray-200">
        {category.items
          .filter((item) => showCompleted || !item.done)
          .map((item) => (
            <TodoItem key={item.id} item={item} />
          ))}
      </ul>
    </li>
  );
};
