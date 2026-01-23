'use client'

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

import { EditorState, LinkItem } from "@/lib/editor"

export function LinkCardEditor({ state, onUpdate }: { 
  state: EditorState, 
  onUpdate: (updates: Partial<EditorState>) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [newLink, setNewLink] = useState<Partial<LinkItem>>({
    title: "", url: "", description: "", videoUrl: "", isStripeEnabled: false
  })

  const handleAdd = () => {
    const item = { ...newLink, id: Math.random().toString() } as LinkItem
    onUpdate({ links: [...(state.links || []), item] })
    setIsOpen(false)
    setNewLink({ title: "", url: "", description: "", videoUrl: "", isStripeEnabled: false })
  }

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button className="w-full gap-2 py-6 border-2 border-dashed" variant="outline">
            <Plus className="h-4 w-4" /> Add New Link
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Item</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Title (Required)</Label>
              <Input value={newLink.title} onChange={e => setNewLink({...newLink, title: e.target.value})} placeholder="e.g. My Portfolio" />
            </div>
            <div className="space-y-2">
              <Label>URL (Required)</Label>
              <Input value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea value={newLink.description} onChange={e => setNewLink({...newLink, description: e.target.value})} placeholder="Short bio about this link" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label>Enable Stripe Connect</Label>
              <Switch checked={newLink.isStripeEnabled} onCheckedChange={val => setNewLink({...newLink, isStripeEnabled: val})} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAdd}>Add to List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* List of Links (Draggable placeholder) */}
      <div className="space-y-2">
        {state.links?.map((link: any) => (
          <div key={link.id} className="flex items-center justify-between p-3 border rounded-xl bg-card">
            <span className="font-medium text-sm">{link.title}</span>
            <Button variant="ghost" size="icon" onClick={() => onUpdate({ links: state.links.filter((l: any) => l.id !== link.id)})}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}