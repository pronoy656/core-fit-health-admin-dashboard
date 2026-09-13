"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/widgets/page-header"
import { DataTable } from "@/components/widgets/data-table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type FAQ = {
  id: number
  question: string
  answer: string
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([
    { id: 1, question: "How do I reset my password?", answer: "Users can reset their password from the login screen using the 'Forgot Password' link." },
    { id: 2, question: "How do I log my meals?", answer: "Go to the Nutrition tab and tap the '+' button to log meals or scan barcodes." },
    { id: 3, question: "How do I connect Apple Health?", answer: "Navigate to Settings > Integrations and toggle the Apple Health connection." }
  ])

  const [open, setOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")

  const handleAddFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return
    const newFaq = {
      id: Date.now(),
      question: newQuestion,
      answer: newAnswer,
    }
    setFaqs([...faqs, newFaq])
    setNewQuestion("")
    setNewAnswer("")
    setOpen(false)
  }

  const handleDelete = (id: number) => {
    setFaqs(faqs.filter(f => f.id !== id))
  }

  const columns: ColumnDef<FAQ>[] = [
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => <div className="font-medium text-foreground max-w-[300px] truncate">{row.getValue("question")}</div>,
    },
    {
      accessorKey: "answer",
      header: "Answer",
      cell: ({ row }) => <div className="text-muted-foreground max-w-[400px] truncate">{row.getValue("answer")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const faq = row.original
        return (
          <div className="flex justify-end pr-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleDelete(faq.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 pt-6 animate-fade-up">
      <PageHeader 
        title="FAQ Management" 
        subtitle="Manage frequently asked questions displayed in the user app."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="size-4" />
                New FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New FAQ</DialogTitle>
                <DialogDescription>
                  Create a new frequently asked question to display to users.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="question">Question</Label>
                  <Input 
                    id="question" 
                    placeholder="e.g. How do I reset my password?" 
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea 
                    id="answer" 
                    placeholder="Provide the answer here..." 
                    rows={4}
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleAddFaq}>Save FAQ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <DataTable 
          columns={columns} 
          data={faqs} 
          searchKey="question" 
          searchPlaceholder="Search FAQs by question..."
        />
      </div>
    </div>
  )
}
