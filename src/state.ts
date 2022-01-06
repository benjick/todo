import create from "zustand";
import { persist, combine } from "zustand/middleware";
import produce from "immer";
import { v4 as uuidv4 } from "uuid";
import { useMemo } from "react";
import { default as dayjs } from "dayjs";
import { storageStub } from "./storage.stub";

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
  done: boolean;
}

export interface DerivedCategory extends Category {
  done: boolean;
  items: DerivedItem[];
}

interface Event {
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

function isItemDone(events: Event[], item: Item, resetAfterDays?: number) {
  const compareDate = getCompareData(resetAfterDays);
  const latestEvent = events.find((event) => event.item === item.id);

  if (!latestEvent) {
    return false;
  }

  if (compareDate && dayjs(latestEvent.date).isAfter(compareDate)) {
    return true;
  }

  if (!compareDate) {
    return true;
  }

  return false;
}

const initialState: State = {
  categories: [
    {
      id: "todos",
      name: "Todos",
      sort: 0,
      closeAfterFinished: 0,
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
    })),
    {
      name: "todo",
      getStorage: () =>
        process.env.NODE_ENV === "test" ? storageStub : localStorage,
      partialize: (state) => ({
        // categories: state.categories,
        // items: state.items,
        // events: state.events,
      }),
    }
  )
);

function getCompareData(resetAfterDays?: number) {
  if (!resetAfterDays || resetAfterDays < 1) {
    return undefined;
  }
  return dayjs().subtract(resetAfterDays, "days");
}

export const useTodo = () => {
  const {
    categories,
    items,
    events,
    finishTodo,
    showCompleted,
    setShowCompleted,
  } = useStore((state) => ({
    categories: state.categories,
    items: state.items,
    events: state.events,
    finishTodo: state.finishTodo,
    showCompleted: state.showCompleted,
    setShowCompleted: state.setShowCompleted,
  }));

  const categoriesWithItems = useMemo(() => {
    let sortedEvents = events.slice().sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    let sortedCategories = categories
      .slice()
      .sort((a, b) => a.sort - b.sort)
      .map((category): DerivedCategory => {
        const __items: DerivedItem[] = items
          .filter((item) => item.category === category.id)
          .map((item) => {
            return {
              ...item,
              done: isItemDone(sortedEvents, item, category.resetAfterDays),
            };
          });
        const doneItems = __items.filter((item) => item.done).length;
        const doneCategory = category.closeAfterFinished
          ? doneItems >= category.closeAfterFinished
          : doneItems === __items.length;
        return {
          ...category,
          items: __items,
          done: doneCategory,
        } as DerivedCategory;
      });

    return sortedCategories;
  }, [categories, events, items]);

  return { categoriesWithItems, finishTodo, setShowCompleted, showCompleted };
};
