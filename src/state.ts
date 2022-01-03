import create from "zustand";
import { persist, combine } from "zustand/middleware";
import produce from "immer";
import { v4 as uuidv4 } from "uuid";
import { useMemo } from "react";
import { default as dayjs } from "dayjs";

interface Category {
  id: string;
  sort: number;
  name: string;
  resetEvery: "day" | "week" | "never";
  closeAfterFinished: number; // 0 === never close
}

export interface Item {
  id: string;
  category: string; // category id
  name: string;
  timerMinutes?: number;
}

interface CategoryWithItems extends Category {
  items: Item[];
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

const initialState: State = {
  categories: [
    {
      id: "todos",
      name: "Todos",
      sort: 0,
      resetEvery: "never",
      closeAfterFinished: 0,
    },
    {
      id: "daily",
      name: "Daily",
      sort: 1,
      resetEvery: "day",
      closeAfterFinished: 2,
    },
    {
      id: "weekly",
      name: "Weekly",
      sort: 2,
      resetEvery: "week",
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
      id: uuidv4(),
      name: "Clean",
      timerMinutes: 15,
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
      partialize: (state) => ({
        categories: state.categories,
        items: state.items,
        // events: state.events,
      }),
    }
  )
);

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

  const categoriesWithEvents = useMemo(() => {
    let sortedEvents = events.slice().sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    let sortedCategories = categories
      .slice()
      .sort((a, b) => a.sort - b.sort)
      .map((category) => {
        return {
          ...category,
          items: items.filter((item) => {
            if (item.category !== category.id) {
              return false;
            }

            if (!showCompleted) {
              let date: dayjs.Dayjs | undefined = undefined;
              if (category.resetEvery === "week") {
                date = dayjs().subtract(1, "week");
              }
              if (category.resetEvery === "day") {
                date = dayjs().subtract(1, "day");
              }

              const latestEvent = sortedEvents.find(
                (event) => event.item === item.id
              );
              if (
                latestEvent &&
                (!date || (date && dayjs(latestEvent.date).isAfter(date)))
              ) {
                return false;
              }
            }
            return true;
          }),
        } as CategoryWithItems;
      });

    return sortedCategories;
  }, [categories, items, events, showCompleted]);

  return { categoriesWithEvents, finishTodo, setShowCompleted, showCompleted };
};
