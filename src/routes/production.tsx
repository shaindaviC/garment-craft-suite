import { createFileRoute } from "@tanstack/react-router";
import { Check, Scissors, Shirt, ShieldCheck, Flame, Package, PackageCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orders, productionStages, type ProductionStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/production")({
  head: () => ({ meta: [{ title: "Production Tracking — Atelier ERP" }] }),
  component: Production,
});

const icons: Record<ProductionStatus, any> = {
  Cutting: Scissors, Stitching: Shirt, Quality: ShieldCheck,
  Ironing: Flame, Packing: Package, Completed: PackageCheck,
};

function stageIndex(s: ProductionStatus) { return productionStages.indexOf(s); }
function pct(s: ProductionStatus) { return Math.round(((stageIndex(s) + 1) / productionStages.length) * 100); }

function Production() {
  const active = orders.filter((o) => o.production !== "Completed");

  return (
    <div>
      <PageHeader title="Production Tracking" description={`${active.length} orders currently on the shop floor`} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {productionStages.map((s) => {
          const count = orders.filter((o) => o.production === s).length;
          const Icon = icons[s];
          return (
            <Card key={s}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  <p className="text-xs font-medium uppercase tracking-wide">{s}</p>
                </div>
                <p className="mt-2 text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">orders</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        {orders.map((o) => {
          const idx = stageIndex(o.production);
          const p = pct(o.production);
          return (
            <Card key={o.id}>
              <CardHeader className="pb-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base">
                      {o.id} · <span className="font-normal text-muted-foreground">{o.customer}</span>
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground truncate">
                      {o.product} · Size {o.size} · Qty {o.qty} · Due {o.deliveryDate}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">{p}%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={p} className="mb-4" />
                <div className="flex items-center justify-between gap-2 overflow-x-auto">
                  {productionStages.map((s, i) => {
                    const Icon = icons[s];
                    const done = i < idx || o.production === "Completed";
                    const current = i === idx && o.production !== "Completed";
                    return (
                      <div key={s} className="flex min-w-0 flex-1 items-center gap-2">
                        <div className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-xs",
                          done && "border-success bg-success text-success-foreground",
                          current && "border-primary bg-primary text-primary-foreground",
                          !done && !current && "border-border bg-muted text-muted-foreground",
                        )}>
                          {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </div>
                        <span className={cn(
                          "hidden truncate text-xs sm:inline",
                          current && "font-semibold text-foreground",
                          !current && "text-muted-foreground",
                        )}>{s}</span>
                        {i < productionStages.length - 1 && (
                          <div className={cn("hidden h-0.5 flex-1 md:block", done ? "bg-success" : "bg-border")} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
