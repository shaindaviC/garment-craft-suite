import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { products as seed, inr } from "@/lib/mock-data";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "Products — Atelier ERP" }] }),
  component: Products,
});

function Products() {
  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState("");
  const filtered = rows.filter((p) => [p.name, p.category, p.designNo].some((v) => v.toLowerCase().includes(q.toLowerCase())));

  return (
    <div>
      <PageHeader
        title="Product Management"
        description={`${rows.length} products in the catalogue`}
        actions={<Button><Plus className="mr-1 h-4 w-4" /> New Product</Button>}
      />
      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="pl-9" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <div className="grid h-40 place-items-center bg-gradient-to-br from-secondary to-muted text-6xl">
              {p.image}
            </div>
            <CardContent className="p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.designNo} · {p.category}</p>
                </div>
                <Badge variant={p.active ? "default" : "secondary"} className={p.active ? "bg-success text-success-foreground" : ""}>
                  {p.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="mb-3 flex flex-wrap gap-1">
                {p.size.map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-bold">{inr(p.sellingPrice)}</p>
                  <p className="text-[11px] text-muted-foreground">{p.fabricPerUnit} m fabric / unit</p>
                </div>
                <Switch
                  checked={p.active}
                  onCheckedChange={(v) => setRows((r) => r.map((x) => x.id === p.id ? { ...x, active: v } : x))}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
