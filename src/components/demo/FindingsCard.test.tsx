import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { FindingsCard } from "./FindingsCard";

const KEYS = [
  "wall_thickening", "mass_replacing_gb", "polypoidal_lesion", "liver_invasion",
  "lymph_node_involvement", "biliary_obstruction", "adjacent_organ_involvement",
];

const make = (present: string[]) =>
  Object.fromEntries(KEYS.map((k) => [k, { probability: 0.4321, present: present.includes(k), threshold: 0.55 }]));

describe("FindingsCard", () => {
  it("lists all 7 findings, detected first, with text status and no numbers", () => {
    const { container } = render(<FindingsCard attributes={make(["liver_invasion", "mass_replacing_gb"])} />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(7);
    expect(items[0]).toHaveTextContent("Mass replacing the gallbladder");
    expect(items[0]).toHaveTextContent("Detected");
    expect(items[1]).toHaveTextContent("Liver invasion");
    expect(items[2]).toHaveTextContent("Not detected");
    expect(screen.getByText(/research and decision support only/i)).toBeInTheDocument();
    // Probabilities and thresholds must never be shown.
    expect(container.textContent).not.toMatch(/\d\s*%|0\.\d/);
  });

  it("shows the none-detected note when every finding is absent", () => {
    render(<FindingsCard attributes={make([])} />);
    expect(screen.getAllByText("Not detected")).toHaveLength(7);
    expect(screen.getByText("No specific findings identified by the attribute model.")).toBeInTheDocument();
  });

  it("shows a non-blocking unavailable notice when attributes are null", () => {
    render(<FindingsCard attributes={null} />);
    expect(screen.getByRole("status")).toHaveTextContent("Detailed findings are unavailable for this scan.");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
