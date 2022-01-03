import { renderHook, act } from "@testing-library/react-hooks";
import { useTodo } from "./state";

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
