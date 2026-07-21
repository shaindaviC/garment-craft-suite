import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { fabrics as seed, inr, type Fabric } from "@/lib/mock-data";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Fabric Inventory — Atelier ERP" }] }),
  component: Inventory,
});

function Inventory() {
  const [rows, setRows] = useState<Fabric[]>(seed);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Fabric>>({});

  const filtered = rows.filter((f) =>
    [f.name, f.type, f.color, f.supplier, f.id].some((v) => v.toLowerCase().includes(q.toLowerCase())),
  );
  const lowCount = rows.filter((f) => f.available < f.minStock).length;

  const save = () => {
    if (!draft.name || !draft.type) return toast.error("Name and type required");
    const f: Fabric = {
      id: draft.id ?? `FAB-${1000 + rows.length + 1}`,
      name: draft.name!, type: draft.type!, color: draft.color ?? "—",
      width: Number(draft.width ?? 58), available: Number(draft.available ?? 0),
      pricePerMetre: Number(draft.pricePerMetre ?? 0), supplier: draft.supplier ?? "—",
      minStock: Number(draft.minStock ?? 50),
    };
    setRows((r) => draft.id ? r.map((x) => x.id === f.id ? f : x) : [f, ...r]);
    setOpen(false); setDraft({});
    toast.success(draft.id ? "Fabric updated" : "Fabric added");
  };

  const edit = (f: Fabric) => { setDraft(f); setOpen(true); };
  const del = (id: string) => { setRows((r) => r.filter((x) => x.id !== id)); toast.success("Fabric removed"); };

  return (
    <div>
      <PageHeader
        title="Fabric Inventory"
        description={`${rows.length} fabrics tracked · ${lowCount} below minimum stock`}
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setDraft({}); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" /> Add Fabric</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{draft.id ? "Edit Fabric" : "Add Fabric"}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["name","Fabric name"],["type","Type"],["color","Colour"],["supplier","Supplier"],
                ].map(([k,l]) => (
                  <div key={k} className="col-span-2 sm:col-span-1">
                    <Label>{l}</Label>
                    <Input value={(draft as any)[k] ?? ""} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
                  </div>
                ))}
                {[
                  ["width","Width (in)"],["available","Available (m)"],["pricePerMetre","Price / m"],["minStock","Min stock"],
                ].map(([k,l]) => (
                  <div key={k}>
                    <Label>{l}</Label>
                    <Input type="number" value={(draft as any)[k] ?? ""} onChange={(e) => setDraft({ ...draft, [k]: e.target.value as any })} />
                  </div>
                ))}
              </div>
              <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {lowCount > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
          <AlertTriangle className="h-4 w-4 text-warning-foreground" />
          <span><strong>{lowCount} fabric{lowCount>1?"s":""}</strong> below minimum stock level — reorder recommended.</span>
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="relative mb-4 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, type, colour, supplier…" className="pl-9" />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Fabric</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Colour</TableHead>
                  <TableHead>Width</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price/m</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((f) => {
                  const low = f.available < f.minStock;
                  return (
                    <TableRow key={f.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{f.id}</TableCell>
                      <TableCell className="font-medium">{f.name}</TableCell>
                      <TableCell>{f.type}</TableCell>
                      <TableCell>{f.color}</TableCell>
                      <TableCell>{f.width}"</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={low ? "font-semibold text-destructive" : ""}>{f.available} m</span>
                          {low && <Badge variant="destructive" className="h-5">Low</Badge>}
                        </div>
                        <p className="text-[11px] text-muted-foreground">min {f.minStock}m</p>
                      </TableCell>
                      <TableCell>{inr(f.pricePerMetre)}</TableCell>
                      <TableCell className="text-muted-foreground">{f.supplier}</TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => edit(f)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => del(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
