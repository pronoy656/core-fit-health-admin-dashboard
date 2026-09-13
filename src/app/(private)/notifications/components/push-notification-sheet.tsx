"use client"

import { ReactNode } from "react"
import { BellRing } from "lucide-react"

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

export function PushNotificationSheet({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Send Push Notification</SheetTitle>
          <SheetDescription>
            Send a direct push notification to users' mobile devices.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="pn-title">Notification Title</Label>
            <Input id="pn-title" placeholder="e.g. Time for your workout!" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pn-body">Body Text</Label>
            <Textarea 
              id="pn-body" 
              placeholder="Keep it short and engaging..." 
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pn-audience">Audience</Label>
            <Input id="pn-audience" placeholder="e.g. Inactive Users (7+ days)" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pn-link">Deep Link (Optional)</Label>
            <Input id="pn-link" placeholder="corefit://workout/today" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit">
            <BellRing className="w-4 h-4 mr-2" />
            Send Push
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
