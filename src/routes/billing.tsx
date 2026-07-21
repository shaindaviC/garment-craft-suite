import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Printer, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products, inr } from "@/lib/mock-data";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Billing — Atelier ERP" }] }),
  component: Billing,
});

type Line = { productId: string; qty: number };

function Billing() {
  const [customer, setCustomer] = useState("Meera Iyer");
  const [address, setAddress] = useState("14 MG Road, Bengaluru 560001");
  const [lines, setLines] = useState<Line[]>([
    { productId: "PRD-501", qty: 5 },
    { productId: "PRD-505", qty: 3 },
  ]);
  const [shipping, setShipping] = useState(250);
  const [discount, setDiscount] = useState(500);

  const rows = lines.map((l) => {
    const p = products.find((x) => x.id === l.productId)!;
    return { ...l, name: p.name, price: p.sellingPrice, total: p.sellingPrice * l.qty };
  });
  const subtotal = rows.reduce((a, r) => a + r.total, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax - discount;
  const invoiceNo = useMemo(() => "INV-" + Math.floor(100000 + Math.random() * 900000), []);
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      <PageHeader
        title="Billing & Invoicing"
        description="Generate a printable customer invoice"
        actions={<Button onClick={() => window.print()}><Printer className="mr-1 h-4 w-4" /> Print Invoice</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-3 print:block">
        <Card className="lg:col-span-1 print:hidden">
          <CardHeader><CardTitle className="text-base">Invoice Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><Label>Customer</Label><Input value={customer} onChange={(e) => setCustomer(e.target.value)} /></div>
            <div><Label>Address</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Shipping</Label><Input type="number" value={shipping} onChange={(e) => setShipping(Number(e.target.value))} /></div>
              <div><Label>Discount</Label><Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} /></div>
            </div>
            <div className="border-t pt-3">
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Line items</p>
              {lines.map((l, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <select
                    className="flex-1 rounded-md border bg-background px-2 py-1 text-sm"
                    value={l.productId}
                    onChange={(e) => setLines((ls) => ls.map((x, j) => j === i ? { ...x, productId: e.target.value } : x))}
                  >
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <Input type="number" className="w-20" value={l.qty}
                    onChange={(e) => setLines((ls) => ls.map((x, j) => j === i ? { ...x, qty: Number(e.target.value) } : x))} />
                  <Button size="icon" variant="ghost" onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setLines((ls) => [...ls, { productId: products[0].id, qty: 1 }])}>
                <Plus className="mr-1 h-3 w-3" /> Add item
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 print:border-0 print:shadow-none">
          <CardContent className="p-8">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary">Atelier & Co.</h2>
                <p className="text-sm text-muted-foreground">Garment Manufacturing House</p>
                <p className="mt-1 text-xs text-muted-foreground">42 Industrial Estate, Peenya, Bengaluru 560058</p>
                <p className="text-xs text-muted-foreground">GST: 29ABCDE1234F1Z5 · +91 80 4123 5678</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Invoice</p>
                <p className="text-lg font-bold">{invoiceNo}</p>
                <p className="mt-1 text-xs text-muted-foreground">Date: {today}</p>
              </div>
            </div>

            <div className="mb-6 rounded-lg border bg-secondary/40 p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">Billed to</p>
              <p className="font-semibold">{customer}</p>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell className="text-right">{r.qty}</TableCell>
                    <TableCell className="text-right">{inr(r.price)}</TableCell>
                    <TableCell className="text-right font-medium">{inr(r.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 ml-auto max-w-xs space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{inr(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{inr(shipping)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GST (5%)</span><span>{inr(tax)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-{inr(discount)}</span></div>
              <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold">
                <span>Total</span><span className="text-primary">{inr(total)}</span>
              </div>
            </div>

            <div className="mt-10 border-t pt-4 text-center text-xs text-muted-foreground">
              Thank you for your business. Payment due within 15 days.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
