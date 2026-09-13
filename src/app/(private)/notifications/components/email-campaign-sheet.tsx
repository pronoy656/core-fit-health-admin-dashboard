"use client"

import { ReactNode } from "react"
import { MailPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

export function EmailCampaignSheet({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Create Email Campaign</SheetTitle>
          <SheetDescription>
            Draft and schedule an email campaign.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="ec-subject">Subject Line</Label>
            <Input id="ec-subject" placeholder="e.g. Your Weekly Metabolic Report" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ec-audience">Audience Segment</Label>
            <Input id="ec-audience" placeholder="e.g. Premium Subscribers" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ec-content">Email HTML/Content</Label>
            <Textarea 
              id="ec-content" 
              placeholder="<h1>Hello {{user.name}}</h1>..." 
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit">
            <MailPlus className="w-4 h-4 mr-2" />
            Schedule Campaign
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
