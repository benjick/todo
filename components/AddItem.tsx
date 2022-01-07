import { useItemForm } from "../src/form/item";

export function AddItem() {
  const { setOpen, resetForm } = useItemForm();

  return (
    <button
      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={() => {
        resetForm();
        setOpen(true);
      }}
    >
      Add item
    </button>
  );
}
