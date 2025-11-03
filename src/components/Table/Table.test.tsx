import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Table from "./index";

describe("Table Component", () => {
  it("renders table element correctly", () => {
    render(
      <Table>
        <Table.THead>
          <Table.TR>
            <Table.TH>Header</Table.TH>
          </Table.TR>
        </Table.THead>
      </Table>
    );

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass("table");
  });

  it("renders table header correctly", () => {
    render(
      <Table>
        <Table.THead>
          <Table.TR>
            <Table.TH>Name</Table.TH>
            <Table.TH>Age</Table.TH>
          </Table.TR>
        </Table.THead>
      </Table>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();

    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(2);
    headers.forEach((header) => {
      expect(header).toHaveClass("th");
    });
  });

  it("renders table body with rows and cells correctly", () => {
    render(
      <Table>
        <Table.TBody>
          <Table.TR>
            <Table.TD>John</Table.TD>
            <Table.TD>25</Table.TD>
          </Table.TR>
          <Table.TR>
            <Table.TD>Jane</Table.TD>
            <Table.TD>30</Table.TD>
          </Table.TR>
        </Table.TBody>
      </Table>
    );

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();

    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(4);
    cells.forEach((cell) => {
      expect(cell).toHaveClass("td");
    });
  });

  it("renders complete table structure", () => {
    render(
      <Table>
        <Table.THead>
          <Table.TR>
            <Table.TH>Name</Table.TH>
            <Table.TH>Score</Table.TH>
          </Table.TR>
        </Table.THead>
        <Table.TBody>
          <Table.TR>
            <Table.TD>Player 1</Table.TD>
            <Table.TD>100</Table.TD>
          </Table.TR>
          <Table.TR>
            <Table.TD>Player 2</Table.TD>
            <Table.TD>85</Table.TD>
          </Table.TR>
        </Table.TBody>
      </Table>
    );

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Check thead exists
    const thead = table.querySelector("thead");
    expect(thead).toBeInTheDocument();
    expect(thead).toHaveClass("thead");

    // Check tbody exists
    const tbody = table.querySelector("tbody");
    expect(tbody).toBeInTheDocument();
    expect(tbody).toHaveClass("tbody");

    // Check headers
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Score")).toBeInTheDocument();

    // Check data
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Player 2")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("applies custom className correctly", () => {
    render(
      <Table className="custom-table">
        <Table.THead>
          <Table.TR className="custom-row">
            <Table.TH className="custom-header">Header</Table.TH>
          </Table.TR>
        </Table.THead>
        <Table.TBody className="custom-body">
          <Table.TR>
            <Table.TD className="custom-cell">Data</Table.TD>
          </Table.TR>
        </Table.TBody>
      </Table>
    );

    const table = screen.getByRole("table");
    expect(table).toHaveClass("table");
    expect(table).toHaveClass("custom-table");

    const header = screen.getByText("Header");
    expect(header).toHaveClass("th");
    expect(header).toHaveClass("custom-header");

    const cell = screen.getByText("Data");
    expect(cell).toHaveClass("td");
    expect(cell).toHaveClass("custom-cell");
  });

  it("handles empty table correctly", () => {
    render(<Table />);

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass("table");
  });

  it("passes through HTML props correctly", () => {
    render(
      <Table data-testid="test-table" role="table">
        <Table.THead>
          <Table.TR data-testid="test-row">
            <Table.TH data-testid="test-header">Header</Table.TH>
          </Table.TR>
        </Table.THead>
        <Table.TBody>
          <Table.TR>
            <Table.TD data-testid="test-cell">Data</Table.TD>
          </Table.TR>
        </Table.TBody>
      </Table>
    );

    expect(screen.getByTestId("test-table")).toBeInTheDocument();
    expect(screen.getByTestId("test-row")).toBeInTheDocument();
    expect(screen.getByTestId("test-header")).toBeInTheDocument();
    expect(screen.getByTestId("test-cell")).toBeInTheDocument();
  });

  it("renders multiple rows in tbody correctly", () => {
    const data = [
      { id: 1, name: "Item 1", value: "Value 1" },
      { id: 2, name: "Item 2", value: "Value 2" },
      { id: 3, name: "Item 3", value: "Value 3" },
    ];

    render(
      <Table>
        <Table.THead>
          <Table.TR>
            <Table.TH>Name</Table.TH>
            <Table.TH>Value</Table.TH>
          </Table.TR>
        </Table.THead>
        <Table.TBody>
          {data.map((item) => (
            <Table.TR key={item.id}>
              <Table.TD>{item.name}</Table.TD>
              <Table.TD>{item.value}</Table.TD>
            </Table.TR>
          ))}
        </Table.TBody>
      </Table>
    );

    data.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(4); // 1 header row + 3 data rows
  });
});
