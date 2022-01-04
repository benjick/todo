import { renderHook, act } from "@testing-library/react-hooks";
import { useTodo } from "./state";

afterEach(() => {
  jest.useRealTimers();
});

function forceTick(result: any) {
  // Hack to force update after time passing 🤷
  act(() => {
    result.current.setShowCompleted(true);
  });
  act(() => {
    result.current.setShowCompleted(false);
  });
}

describe("sanity check", () => {
  it("should mark todo item as done", () => {
    const { result } = renderHook(() => useTodo());

    expect(result.current.categoriesWithEvents[2].items.length).toBe(1);
    act(() => {
      result.current.finishTodo("a");
    });
    expect(result.current.categoriesWithEvents[2].items.length).toBe(0);
  });

  it("should reset store between runs", () => {
    const { result } = renderHook(() => useTodo());

    expect(result.current.categoriesWithEvents[2].items.length).toBe(1);
  });
});

describe("re-showing tasks after a while", () => {
  it("should show a task after time has passed", async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useTodo());

    expect(result.current.categoriesWithEvents[1].items.length).toBe(1);
    act(() => {
      result.current.finishTodo("c");
    });
    expect(result.current.categoriesWithEvents[1].items.length).toBe(0);

    jest.advanceTimersByTime(1000 * 60 * 60 * 24);
    forceTick(result);

    expect(result.current.categoriesWithEvents[1].items.length).toBe(1);
  });
});
