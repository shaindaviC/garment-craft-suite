import { createFileRoute } from "@tanstack/react-router";
import {
  ShoppingCart, Clock, Package, AlertTriangle, TrendingUp, Factory,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fabrics, orders, monthlySales, inr, productionStages } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Atelier ERP" },
      { name: "description", content: "Overview of orders, fabric stock, production and revenue." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.production !== "Completed").length;
  const totalStock = fabrics.reduce((a, f) => a + f.available, 0);
  const lowStock = fabrics.filter((f) => f.available < f.minStock);
  const revenue = monthlySales[monthlySales.length - 1].revenue;

  const stageCount = productionStages.map((s) => ({
    stage: s,
    count: orders.filter((o) => o.production === s).length,
  }));

  const recent = orders.slice(0, 5);
  const alerts = [
    ...lowStock.slice(0, 3).map((f) => ({ type: "warning" as const, msg: `${f.name} is low: ${f.available}m left (min ${f.minStock}m)` })),
    { type: "info" as const, msg: `${pending} orders currently in production` },
    { type: "destructive" as const, msg: `2 orders due within 48 hours` },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back — here's what's happening on the shop floor today."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Orders" value={String(totalOrders)} hint="This month" icon={ShoppingCart} />
        <StatCard label="Pending Orders" value={String(pending)} hint="In production" icon={Clock} tone="info" />
        <StatCard label="Fabric Stock" value={`${totalStock.toLocaleString()} m`} hint={`${fabrics.length} fabric types`} icon={Package} tone="success" />
        <StatCard label="Low Stock Alerts" value={String(lowStock.length)} hint="Reorder soon" icon={AlertTriangle} tone="warning" />
        <StatCard label="Monthly Revenue" value={inr(revenue)} hint="+13.6% vs May" icon={TrendingUp} tone="success" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales & Orders</CardTitle>
            <CardDescription>Monthly revenue and order volume — last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySales}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} formatter={(v: number) => inr(v)} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Factory className="h-4 w-4" /> Production Progress</CardTitle>
            <CardDescription>Orders by stage</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageCount}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="stage" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="count" fill="var(--color-accent)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{o.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{o.product}</TableCell>
                    <TableCell><Badge variant="secondary">{o.production}</Badge></TableCell>
                    <TableCell className="text-right font-medium">{inr(o.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning-foreground" /> Alerts</CardTitle>
            <CardDescription>Action items across the floor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a, i) => {
              const tone = a.type === "warning" ? "border-warning/40 bg-warning/10"
                : a.type === "destructive" ? "border-destructive/40 bg-destructive/5"
                : "border-info/40 bg-info/5";
              return (
                <div key={i} className={`rounded-lg border p-3 text-sm ${tone}`}>
                  {a.msg}
                </div>
              );
            })}
            <div className="pt-2">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Overall production</p>
              <Progress value={68} />
              <p className="mt-1 text-xs text-muted-foreground">68% of active orders past stitching</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
