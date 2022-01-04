import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useTodo, useStore } from "../src/state";

export function AddCategory() {
  const [open, setOpen] = useState(false);

  const { categoriesWithEvents } = useTodo();
  const { addCategory } = useStore();
  const nameRef = useRef<HTMLInputElement>(null);
  const resetRef = useRef<HTMLInputElement>(null);
  const closeAfterFinishedRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = nameRef.current?.value;
    const resetAfterDays = closeAfterFinishedRef.current
      ? Number(closeAfterFinishedRef.current.value)
      : undefined;
    const closeAfterFinished = closeAfterFinishedRef.current
      ? Number(closeAfterFinishedRef.current.value)
      : undefined;

    if (!name) {
      return;
    }

    addCategory({
      name,
      closeAfterFinished,
      resetAfterDays,
      sort: categoriesWithEvents.length,
    });
    nameRef.current.value = "";
    setOpen(false);
  }

  return (
    <>
      <button
        className="inline-flex ml-2 items-center px-2.5 py-1.5 border border-transparent text-xs font-medium shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setOpen(true)}
      >
        Add category
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden"
          onClose={setOpen}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="absolute inset-0" />

            <div className="fixed inset-y-0 pl-16 max-w-full right-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-md">
                  <form
                    onSubmit={handleSubmit}
                    className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
                  >
                    <div className="flex-1 h-0 overflow-y-auto">
                      <div className="py-6 px-4 bg-indigo-700 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-medium text-white">
                            New category
                          </Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                              type="button"
                              className="bg-indigo-700 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-indigo-300">
                            Create a new category for the todo items.
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="px-4 divide-y divide-gray-200 sm:px-6">
                          <div className="space-y-6 pt-6 pb-5">
                            <div>
                              <label
                                htmlFor="category-name"
                                className="block text-sm font-medium text-gray-900"
                              >
                                Category name
                              </label>
                              <div className="mt-1">
                                <input
                                  ref={nameRef}
                                  required
                                  id="category-name"
                                  type="text"
                                  className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="category-name"
                                className="block text-sm font-medium text-gray-900"
                              >
                                Reset item after X days
                              </label>
                              <div className="mt-1">
                                <input
                                  ref={resetRef}
                                  min="1"
                                  step="1"
                                  id="category-name"
                                  type="number"
                                  className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="close-after-finish"
                                className="block text-sm font-medium text-gray-900"
                              >
                                Close category after X finished items?
                              </label>
                              <div className="mt-1">
                                <input
                                  ref={closeAfterFinishedRef}
                                  id="close-after-finish"
                                  type="number"
                                  min="1"
                                  step="1"
                                  className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
