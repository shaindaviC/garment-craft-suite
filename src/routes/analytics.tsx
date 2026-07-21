import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { bestSellers, monthlySales, fabricConsumption, orders, inr } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Atelier ERP" }] }),
  component: Analytics,
});

const COLORS = ["var(--color-chart-1)","var(--color-chart-2)","var(--color-chart-3)","var(--color-chart-4)","var(--color-chart-5)"];

function Analytics() {
  const revenue = monthlySales.reduce((a, m) => a + m.revenue, 0);
  const cost = Math.round(revenue * 0.62);
  const profit = revenue - cost;

  const statusData = Array.from(
    orders.reduce((m, o) => m.set(o.production, (m.get(o.production) ?? 0) + 1), new Map<string, number>()),
  ).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <PageHeader title="Analytics" description="Business intelligence across sales, production and fabric consumption" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">6-month Revenue</p>
          <p className="mt-1 text-2xl font-bold">{inr(revenue)}</p>
          <p className="text-xs text-success">+21% YoY</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">Production Cost</p>
          <p className="mt-1 text-2xl font-bold">{inr(cost)}</p>
          <p className="text-xs text-muted-foreground">62% of revenue</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">Estimated Profit</p>
          <p className="mt-1 text-2xl font-bold text-success">{inr(profit)}</p>
          <p className="text-xs text-muted-foreground">38% margin</p>
        </CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Best-Selling Products</CardTitle><CardDescription>Units sold — last quarter</CardDescription></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestSellers} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} width={140} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="units" fill="var(--color-primary)" radius={[0,6,6,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Monthly Sales Trend</CardTitle><CardDescription>Revenue vs. order count</CardDescription></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="var(--color-primary)" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-accent)" strokeWidth={2} yAxisId={0} hide />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Fabric Consumption</CardTitle><CardDescription>Metres used by fabric type</CardDescription></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fabricConsumption}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="type" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="metres" fill="var(--color-accent)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Order Status Distribution</CardTitle><CardDescription>Where orders sit right now</CardDescription></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
