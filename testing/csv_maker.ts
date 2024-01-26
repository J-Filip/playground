/**
 * CSV writer - class solution
 */

import { appendFileSync, existsSync } from "fs";

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

  save(file: string): void {
    appendFileSync(file, this.csv);
  }

  logCSV(): void {
    console.log("🎇🎇");
    console.log(this.csv);
    console.log("🎇🎇");
  }

  addRows(values: IPayment[]): void {
    let rows = values.map((value) => this.formatRow(value));
    this.csv += rows.join("\n") + "\n";
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

writer.save("../payments/test_payment.csv");
