import create from "zustand";
import { persist, combine } from "zustand/middleware";
import produce from "immer";
import { v4 as uuidv4 } from "uuid";
import { useMemo } from "react";
import { storageStub } from "./storage.stub";
import { isItemDone } from "./helpers";

interface Category {
  id: string;
  sort: number;
  name: string;
  resetAfterDays?: number;
  closeAfterFinished?: number;
}

export interface Item {
  id: string;
  category: string; // category id
  name: string;
  timerMinutes?: number;
}

export interface DerivedItem extends Item {
  done: string | false;
}

export interface DerivedCategory extends Category {
  done: boolean;
  items: DerivedItem[];
}

export interface Event {
  id: string;
  item: string;
  date: Date;
}

interface State {
  categories: Category[];
  items: Item[];
  events: Event[];
  showCompleted: boolean;
}

const initialState: State = {
  categories: [
    {
      id: "todos",
      name: "Todos",
      sort: 0,
    },
    {
      id: "daily",
      name: "Daily",
      sort: 1,
      resetAfterDays: 1,
      closeAfterFinished: 2,
    },
    {
      id: "weekly",
      name: "Weekly",
      sort: 2,
      resetAfterDays: 7,
      closeAfterFinished: 4,
    },
  ],
  items: [
    {
      category: "weekly",
      id: "a",
      name: "Work on todo app",
    },
    {
      category: "todos",
      id: "b",
      name: "Test it",
    },
    {
      category: "daily",
      id: "c",
      name: "Workout",
      timerMinutes: 15,
    },
    {
      category: "daily",
      id: "d",
      name: "Clean",
      timerMinutes: 15,
    },
    {
      category: "daily",
      id: "e",
      name: "Read",
      timerMinutes: 10,
    },
  ],
  events: [
    {
      id: "dcc943de-1cd0-451a-ae82-c2a82db1cb67",
      item: "b",
      date: new Date("2021-01-02T02:06:22.151Z"),
    },
  ],
  showCompleted: false,
};

export const useStore = create(
  persist(
    combine(initialState, (set, get) => ({
      setShowCompleted: (showCompleted: boolean) => {
        set({ showCompleted });
      },
      addCategory: async (category: Omit<Category, "id">) => {
        const newCategory: Category = {
          ...category,
          id: uuidv4(),
        };
        set(
          produce((state: State) => {
            state.categories.push(newCategory);
          })
        );
      },
      updateCategory: async (
        id: string,
        category: Partial<Omit<Category, "id">>
      ) => {
        set(
          produce((state: State) => {
            const index = state.categories.findIndex((cat) => cat.id === id);
            if (index) {
              state.categories[index] = {
                ...state.categories[index],
                ...category,
              };
            }
          })
        );
      },
      deleteCategory: (id: string) => {
        set(
          produce((state: State) => {
            state.items = state.items.filter((item) => item.category !== id);
            state.categories = state.categories.filter(
              (category) => category.id !== id
            );
          })
        );
      },
      addItem: async (item: Omit<Item, "id">) => {
        const newItem: Item = {
          ...item,
          id: uuidv4(),
        };
        set(
          produce((state: State) => {
            state.items.push(newItem);
          })
        );
      },
      updateItem: async (id: string, item: Partial<Omit<Item, "id">>) => {
        set(
          produce((state: State) => {
            const index = state.items.findIndex((item) => item.id === id);
            if (index) {
              state.items[index] = {
                ...state.items[index],
                ...item,
              };
            }
          })
        );
      },
      deleteItem: (id: string) => {
        const index = get().items.findIndex((item) => item.id === id);
        if (index > -1) {
          set(
            produce((state: State) => {
              state.items.splice(index, 1);
            })
          );
        }
      },
      finishTodo: async (item: string) => {
        const event: Event = {
          id: uuidv4(),
          item,
          date: new Date(),
        };
        set(
          produce((state: State) => {
            state.events.push(event);
          })
        );
      },
      undoTodo: async (id: string) => {
        const index = get().events.findIndex((event) => event.id === id);
        if (index > -1) {
          set(
            produce((state: State) => {
              state.events.splice(index, 1);
            })
          );
        }
      },
    })),
    {
      name: "todo",
      getStorage: () =>
        process.env.NODE_ENV === "test" ? storageStub : localStorage,
      partialize: (state) => {
        if (process.env.NODE_ENV === "development") {
          return {};
        }
        return {
          categories: state.categories,
          items: state.items,
          events: state.events,
        };
      },
    }
  )
);

export const useTodo = () => {
  const {
    categories,
    items,
    events,
    finishTodo,
    undoTodo,
    showCompleted,
    setShowCompleted,
  } = useStore((state) => ({
    categories: state.categories,
    items: state.items,
    events: state.events,
    finishTodo: state.finishTodo,
    showCompleted: state.showCompleted,
    setShowCompleted: state.setShowCompleted,
    undoTodo: state.undoTodo,
  }));

  const derivedCategories = useMemo(() => {
    let sortedEvents = events.slice().sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return categories
      .slice()
      .sort((a, b) => a.sort - b.sort)
      .map((category): DerivedCategory => {
        const derivedItems: DerivedItem[] = items
          .filter((item) => item.category === category.id)
          .map((item) => {
            return {
              ...item,
              done: isItemDone(sortedEvents, item, category.resetAfterDays),
            };
          });
        const doneItems = derivedItems.filter((item) => item.done).length;
        const doneCategory = category.closeAfterFinished
          ? doneItems === derivedItems.length ||
            doneItems >= category.closeAfterFinished
          : doneItems === derivedItems.length;
        return {
          ...category,
          items: derivedItems,
          done: doneCategory,
        } as DerivedCategory;
      });
  }, [categories, events, items]);

  return {
    derivedCategories,
    finishTodo,
    undoTodo,
    setShowCompleted,
    showCompleted,
  };
};
