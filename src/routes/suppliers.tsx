import { createFileRoute } from "@tanstack/react-router";
import { Plus, Phone, User } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { suppliers, inr } from "@/lib/mock-data";

export const Route = createFileRoute("/suppliers")({
  head: () => ({ meta: [{ title: "Suppliers — Atelier ERP" }] }),
  component: Suppliers,
});

function Suppliers() {
  const totalPending = suppliers.reduce((a, s) => a + s.pendingPayment, 0);
  return (
    <div>
      <PageHeader
        title="Supplier Management"
        description={`${suppliers.length} active suppliers · ${inr(totalPending)} pending payments`}
        actions={<Button><Plus className="mr-1 h-4 w-4" /> Add Supplier</Button>}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {suppliers.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{s.name}</CardTitle>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><User className="h-3 w-3" /> {s.contact}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {s.phone}</p>
                </div>
                {s.pendingPayment > 0
                  ? <Badge className="shrink-0 bg-warning text-warning-foreground">Due</Badge>
                  : <Badge className="shrink-0 bg-success text-success-foreground">Settled</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-xs text-muted-foreground">Fabrics supplied</p>
              <p className="mb-4 text-sm font-medium">{s.fabricSupplied}</p>
              <div className="grid grid-cols-2 gap-2 border-t pt-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Purchases</p>
                  <p className="font-semibold">{inr(s.totalPurchases)}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Pending</p>
                  <p className={`font-semibold ${s.pendingPayment > 0 ? "text-destructive" : ""}`}>{inr(s.pendingPayment)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Purchase History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Fabric</TableHead>
                <TableHead className="text-right">Total Purchases</TableHead>
                <TableHead className="text-right">Pending</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.contact}</TableCell>
                  <TableCell>{s.fabricSupplied}</TableCell>
                  <TableCell className="text-right">{inr(s.totalPurchases)}</TableCell>
                  <TableCell className="text-right">
                    {s.pendingPayment > 0
                      ? <span className="font-semibold text-destructive">{inr(s.pendingPayment)}</span>
                      : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
