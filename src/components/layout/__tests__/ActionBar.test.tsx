import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useOfficeStore } from "@/store/office-store";
import { ActionBar } from "../ActionBar";

beforeEach(() => {
  useOfficeStore.setState({
    selectedAgentId: null,
    agents: new Map(),
  });
});

describe("ActionBar", () => {
  it("is hidden when no agent selected and no meeting agents", () => {
    const { container } = render(<ActionBar />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.style.transform).toBe("translateY(100%)");
  });

  it("is visible when an agent is selected", () => {
    useOfficeStore.setState({ selectedAgentId: "a1" });
    const { container } = render(<ActionBar />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.style.transform).toBe("translateY(0)");
  });

  it("shows tooltip when button is clicked", () => {
    useOfficeStore.setState({ selectedAgentId: "a1" });
    render(<ActionBar />);
    const pauseBtn = screen.getByText("暂停").closest("button")!;
    fireEvent.click(pauseBtn);
    expect(screen.getByText("此功能将在后续版本中启用")).toBeDefined();
  });

  it("renders all three action buttons", () => {
    useOfficeStore.setState({ selectedAgentId: "a1" });
    render(<ActionBar />);
    expect(screen.getByText("暂停")).toBeDefined();
    expect(screen.getByText("派生子Agent")).toBeDefined();
    expect(screen.getByText("对话")).toBeDefined();
  });
});
