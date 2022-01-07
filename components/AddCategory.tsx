import { useCategoryForm } from "../src/form/category";

export function AddCategory() {
  const { setOpen, resetForm } = useCategoryForm();

  return (
    <button
      className="inline-flex ml-2 items-center px-2.5 py-1.5 border border-transparent text-xs font-medium shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={() => {
        resetForm();
        setOpen(true);
      }}
    >
      Add category
    </button>
  );
}
