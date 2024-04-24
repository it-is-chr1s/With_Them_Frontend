import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  afterAll,
} from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import PlayerControls from "./PlayerControls";

describe("PlayerControls", () => {
  let onMove = vi.fn();

  beforeEach(() => {
    onMove = vi.fn();
    render(<PlayerControls onMove={onMove} />);
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should handle keydown events for 'w'", async () => {
    fireEvent.keyDown(window, { key: "w" });
    await waitFor(() => expect(onMove).toHaveBeenCalledWith("NORTH"));
  });

  it("should handle keyup events for 'w'", async () => {
    fireEvent.keyDown(window, { key: "w" });
    fireEvent.keyUp(window, { key: "w" });
    await waitFor(() => expect(onMove).toHaveBeenCalledWith("NONE"));
  });
});
