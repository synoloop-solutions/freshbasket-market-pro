import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLists } from "@/stores";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ListPlus, Plus } from "lucide-react";

export function AddToListMenu({ slug, label = true }: { slug: string; label?: boolean }) {
  const { lists, addToList, createList } = useLists();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={label ? "default" : "icon"} aria-label="Add to shopping list">
            <ListPlus className="h-4 w-4" />
            {label && <span className="ml-2">Add to list</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Your lists</DropdownMenuLabel>
          {lists.length === 0 && (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">No saved lists yet</div>
          )}
          {lists.map((l) => (
            <DropdownMenuItem
              key={l.id}
              onSelect={() => {
                addToList(l.id, slug);
                toast.success(`Added to "${l.name}"`);
              }}
            >
              {l.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New list…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new list</DialogTitle>
            <DialogDescription>Lists help you organize your weekly shopping.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              const id = createList(name.trim());
              addToList(id, slug);
              toast.success(`Created "${name}" and added item`);
              setName("");
              setOpen(false);
            }}
            className="space-y-3"
          >
            <div className="space-y-1.5">
              <Label htmlFor="new-list-name">List name</Label>
              <Input
                id="new-list-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sunday meal prep"
                maxLength={50}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Create list</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
