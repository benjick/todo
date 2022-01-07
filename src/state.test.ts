import { renderHook, act } from "@testing-library/react-hooks";
import { DerivedCategory, DerivedItem, useStore, useTodo } from "./state";

afterEach(() => {
  jest.useRealTimers();
});

function openItems(category: DerivedCategory) {
  return category.items.filter((item) => !item.done).length;
}

describe("sanity check", () => {
  it("should mark todo item as done", () => {
    const { result } = renderHook(() => useTodo());

    expect(openItems(result.current.derivedCategories[2])).toBe(1);
    act(() => {
      result.current.finishTodo("a");
    });

    expect(openItems(result.current.derivedCategories[2])).toBe(0);
  });

  it("should reset store between runs", () => {
    const { result } = renderHook(() => useTodo());

    expect(openItems(result.current.derivedCategories[2])).toBe(1);
  });
});

describe("re-showing tasks after a while", () => {
  it("should show a task after time has passed", async () => {
    jest.useFakeTimers();
    const { result, rerender } = renderHook(() => useTodo());

    expect(openItems(result.current.derivedCategories[1])).toBe(3);
    act(() => {
      result.current.finishTodo("c");
    });
    expect(openItems(result.current.derivedCategories[1])).toBe(2);

    jest.advanceTimersByTime(1000 * 60 * 60 * 24 - 100);
    act(() => {
      result.current.finishTodo("bingbong");
    });

    expect(openItems(result.current.derivedCategories[1])).toBe(3);
  });
});

test("hide category on X finished tasks", () => {
  const { result } = renderHook(() => useTodo());
  const { result: store } = renderHook(() => useStore());
  act(() => {
    store.current.addCategory({
      name: "test",
      sort: -1,
      closeAfterFinished: 1,
    });
  });
  const category = result.current.derivedCategories.findIndex(
    (category) => category.name === "test"
  );
  act(() => {
    store.current.addItem({
      category: result.current.derivedCategories[category].id,
      name: "test1",
    });
    store.current.addItem({
      category: result.current.derivedCategories[category].id,
      name: "test1",
    });
  });
  expect(openItems(result.current.derivedCategories[category])).toBe(2);
  expect(result.current.derivedCategories[category].done).toBe(false);
  act(() => {
    store.current.finishTodo(
      result.current.derivedCategories[category].items[0].id
    );
  });
  expect(openItems(result.current.derivedCategories[category])).toBe(1);
  expect(result.current.derivedCategories[category].done).toBe(true);
});
