"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { AddChildForm } from "@/components/forms/add-child-form"

export function AddChildDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Child
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Child</DialogTitle>
          <DialogDescription>
            Enter your child's details to add them to your account. You can track their progress from your dashboard.
          </DialogDescription>
        </DialogHeader>
        <AddChildForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
