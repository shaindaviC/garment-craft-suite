import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { orders as seed, inr, type PaymentStatus, type ProductionStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Customer Orders — Atelier ERP" }] }),
  component: Orders,
});

const payTone: Record<PaymentStatus, string> = {
  Paid: "bg-success text-success-foreground",
  Partial: "bg-warning text-warning-foreground",
  Unpaid: "bg-destructive text-destructive-foreground",
};

function Orders() {
  const [q, setQ] = useState("");
  const [pay, setPay] = useState<string>("all");
  const [stage, setStage] = useState<string>("all");

  const filtered = seed.filter((o) =>
    (pay === "all" || o.payment === pay) &&
    (stage === "all" || o.production === stage) &&
    [o.id, o.customer, o.product, o.phone].some((v) => v.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div>
      <PageHeader
        title="Customer Orders"
        description={`${seed.length} orders · ${seed.filter((o) => o.production !== "Completed").length} in progress`}
        actions={<Button><Plus className="mr-1 h-4 w-4" /> New Order</Button>}
      />

      <Card>
        <CardContent className="p-4">
          <div className="mb-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_180px_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order, customer, phone, product…" className="pl-9" />
            </div>
            <Select value={pay} onValueChange={setPay}>
              <SelectTrigger><SelectValue placeholder="Payment" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All payments</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger><SelectValue placeholder="Stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stages</SelectItem>
                {(["Cutting","Stitching","Quality","Ironing","Packing","Completed"] as ProductionStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Production</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{o.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{o.phone}</TableCell>
                    <TableCell>{o.product}</TableCell>
                    <TableCell>{o.size}</TableCell>
                    <TableCell>{o.qty}</TableCell>
                    <TableCell className="text-muted-foreground">{o.deliveryDate}</TableCell>
                    <TableCell><Badge className={payTone[o.payment]}>{o.payment}</Badge></TableCell>
                    <TableCell><Badge variant="secondary">{o.production}</Badge></TableCell>
                    <TableCell className="text-right font-medium">{inr(o.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
