import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingDown, PackagePlus, Brain, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fabrics, orders, products, inr } from "@/lib/mock-data";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({ meta: [{ title: "AI Stock Assistant — Atelier ERP" }] }),
  component: AIAssistant,
});

function AIAssistant() {
  // Compute pending fabric requirements from active orders + product BOM.
  const active = orders.filter((o) => o.production !== "Completed");
  const requirementByFabric = new Map<string, number>();
  for (const o of active) {
    const p = products.find((x) => x.name === o.product);
    if (!p) continue;
    // heuristic: assign requirement to a matching fabric type
    const guess =
      /Silk|Chanderi|Saree/.test(p.name) ? "FAB-1005"
      : /Denim|Jeans/.test(p.name) ? "FAB-1006"
      : /Linen/.test(p.name) ? "FAB-1004"
      : /Modal|Loungewear/.test(p.name) ? "FAB-1007"
      : /Kalamkari/.test(p.name) ? "FAB-1008"
      : /Palazzo|Anarkali|Kurta/.test(p.name) ? "FAB-1001"
      : /Chino/.test(p.name) ? "FAB-1010"
      : "FAB-1001";
    requirementByFabric.set(guess, (requirementByFabric.get(guess) ?? 0) + p.fabricPerUnit * o.qty);
  }

  const recs = fabrics.map((f) => {
    const need = requirementByFabric.get(f.id) ?? 0;
    const shortfall = Math.max(0, need + f.minStock - f.available);
    return { fabric: f, need: Math.round(need), reorder: Math.ceil(shortfall / 10) * 10 };
  })
  .filter((r) => r.reorder > 0 || r.fabric.available < r.fabric.minStock)
  .sort((a, b) => b.reorder - a.reorder);

  const lowCount = fabrics.filter((f) => f.available < f.minStock).length;
  const totalReorderCost = recs.reduce((a, r) => a + r.reorder * r.fabric.pricePerMetre, 0);

  return (
    <div>
      <PageHeader
        title="AI Stock Assistant"
        description="Smart recommendations for fabric procurement based on live orders"
      />

      <Card className="mb-6 overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Brain className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-lg font-semibold">AI Insights</h3>
                <Badge className="bg-accent text-accent-foreground"><Sparkles className="mr-1 h-3 w-3" /> Live</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on <strong className="text-foreground">{active.length} active orders</strong>, you have{" "}
                <strong className="text-foreground">{lowCount} fabric{lowCount !== 1 ? "s" : ""}</strong> below the safe threshold.
                We recommend a reorder of approximately{" "}
                <strong className="text-foreground">{recs.reduce((a, r) => a + r.reorder, 0)} metres</strong>{" "}
                (~<strong className="text-foreground">{inr(totalReorderCost)}</strong>) to keep the shop floor moving.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground"><TrendingDown className="h-4 w-4" /><p className="text-xs font-medium uppercase">Low-stock fabrics</p></div>
          <p className="text-2xl font-bold text-destructive">{lowCount}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground"><PackagePlus className="h-4 w-4" /><p className="text-xs font-medium uppercase">Suggested reorder</p></div>
          <p className="text-2xl font-bold">{recs.reduce((a, r) => a + r.reorder, 0)} m</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground"><Sparkles className="h-4 w-4" /><p className="text-xs font-medium uppercase">Estimated spend</p></div>
          <p className="text-2xl font-bold">{inr(totalReorderCost)}</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reorder Recommendations</CardTitle>
          <CardDescription>Prioritised by production impact and stock deficit</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fabric</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Pending Need</TableHead>
                <TableHead>Recommended Reorder</TableHead>
                <TableHead>Est. Cost</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recs.map((r) => (
                <TableRow key={r.fabric.id}>
                  <TableCell>
                    <p className="font-medium">{r.fabric.name}</p>
                    <p className="text-xs text-muted-foreground">{r.fabric.type} · {r.fabric.color}</p>
                  </TableCell>
                  <TableCell><span className={r.fabric.available < r.fabric.minStock ? "font-semibold text-destructive" : ""}>{r.fabric.available} m</span></TableCell>
                  <TableCell className="text-muted-foreground">{r.fabric.minStock} m</TableCell>
                  <TableCell>{r.need} m</TableCell>
                  <TableCell><Badge className="bg-primary/15 text-primary hover:bg-primary/15">{r.reorder} m</Badge></TableCell>
                  <TableCell className="font-medium">{inr(r.reorder * r.fabric.pricePerMetre)}</TableCell>
                  <TableCell className="text-muted-foreground">{r.fabric.supplier}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">Create PO <ArrowRight className="ml-1 h-3 w-3" /></Button>
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
