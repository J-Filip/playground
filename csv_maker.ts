/**
 * CSV writer - class solution
 */

interface IPayment {
  id: number;
  amount?: number;
  to?: string;
  notes?: string;
}

type PaymentColumns = Array<keyof IPayment>;

class CSVWriter {
  constructor(private columns: PaymentColumns) {
    this.csv = this.columns.join(",") + "\n";
  }

  private csv: string;

  // methods
  logCSV(): void {
    console.log("🎇🎇");
    console.log(this.csv);
    console.log("🎇🎇");
  }

  addRows(values: IPayment[]): void {
    let rows = values.map((value) => this.formatRow(value));
    this.csv += rows.join("\n");
    this.logCSV();
  }

  private formatRow(value: IPayment): string {
    return this.columns.map((column) => value[column]).join(",");
  }
}

const writer = new CSVWriter(["id", "amount", "to", "notes"]);

writer.addRows([
  { id: 1, amount: 100, to: "Bob", notes: "for fizza" },
  { id: 2, amount: 300, to: "Kii", notes: "party" },
]);
