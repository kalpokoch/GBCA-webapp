import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { LoadingState } from "./LoadingState";

afterEach(() => vi.useRealTimers());

describe("LoadingState", () => {
  it("progresses through neutral messages over time", () => {
    vi.useFakeTimers();
    render(<LoadingState />);
    expect(screen.getByRole("status")).toHaveTextContent("Analysing scan…");

    act(() => { vi.advanceTimersByTime(4_500); });
    expect(screen.getByRole("status")).toHaveTextContent("this can take up to 20 seconds");

    act(() => { vi.advanceTimersByTime(26_000); });
    expect(screen.getByRole("status")).toHaveTextContent("The server may be waking up");
  });
});
