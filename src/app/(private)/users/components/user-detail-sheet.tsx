"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { StatBadge } from "@/components/widgets/stat-badge"
import { MockUser } from "@/data"
import { toast } from "sonner"
import { MessageSquare, RefreshCcw, Ban, CheckCircle, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SendMessageModal({ user, trigger }: { user: MockUser, trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm"><MessageSquare className="w-4 h-4 mr-2" />Message</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message to {user.name}</DialogTitle>
          <DialogDescription>
            This message will appear in their in-app inbox and also be sent via email.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="msg">Message</Label>
          <Textarea id="msg" placeholder="Type your message here..." className="mt-2 min-h-[100px]" />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild>
            <Button onClick={() => toast.success(`Message sent to ${user.name}`)}>
              <MessageSquare className="w-4 h-4 mr-2"/>Send
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ChangePlanModal({ user, trigger }: { user: MockUser, trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm"><RefreshCcw className="w-4 h-4 mr-2" />Plan</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Plan for {user.name}</DialogTitle>
          <DialogDescription>
            Upgrade or downgrade the user's subscription tier.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Current Plan</Label>
            <div className="text-sm font-medium capitalize">{user.plan}</div>
          </div>
          <div className="space-y-2">
            <Label>New Plan</Label>
            <Select defaultValue={user.plan}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="monthly">Monthly Premium</SelectItem>
                <SelectItem value="yearly">Yearly Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild>
            <Button onClick={() => toast.success(`Plan updated for ${user.name}`)}>
              <Save className="w-4 h-4 mr-2"/>Update Plan
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function SuspendUserModal({ user, trigger }: { user: MockUser, trigger?: React.ReactNode }) {
  const isSuspended = user.status === "suspended"
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={isSuspended ? "default" : "destructive"} size="sm">
            {isSuspended ? <CheckCircle className="w-4 h-4 mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
            {isSuspended ? "Unsuspend" : "Suspend"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSuspended ? "Unsuspend User" : "Suspend User"}</DialogTitle>
          <DialogDescription>
            {isSuspended 
              ? `Are you sure you want to restore access for ${user.name}?` 
              : `Are you sure you want to suspend ${user.name}? They will not be able to log in.`}
          </DialogDescription>
        </DialogHeader>
        {!isSuspended && (
          <div className="py-4">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea id="reason" placeholder="Explain why the user is being suspended..." className="mt-2" />
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild>
            <Button 
              variant={isSuspended ? "default" : "destructive"}
              onClick={() => toast.success(isSuspended ? `Access restored for ${user.name}` : `${user.name} has been suspended`)}
            >
              {isSuspended ? "Confirm Unsuspend" : "Confirm Suspend"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface UserDetailSheetProps {
  user: MockUser
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailSheet({ user, open, onOpenChange }: UserDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>User Profile</SheetTitle>
          <SheetDescription>
            Detailed view of user activity and metabolic profile.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 flex flex-col items-center text-center space-y-3">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarFallback className="text-2xl">{user.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <StatBadge label={user.plan} color={user.plan === "yearly" || user.plan === "premium" ? "info" : "default"} />
            <StatBadge label={user.status} variant="outline" color={user.status === "active" ? "success" : "warning"} />
          </div>
          <div className="flex gap-2 justify-center mt-2">
            <SendMessageModal user={user} />
            <ChangePlanModal user={user} />
            <SuspendUserModal user={user} />
          </div>
        </div>

        <Separator />
        
        <div className="py-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-3">Metabolic Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Metabolic Score</div>
                <div className="text-2xl font-bold font-sans text-health-teal">{user.metabolicScore}</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Lab Results</div>
                <div className="text-2xl font-bold font-sans">{user.labResultsCount}</div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-semibold mb-3">Platform Engagement</h4>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <div className="text-xs text-muted-foreground">Joined</div>
                <div className="text-sm font-medium">{user.joinDate}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Last Login</div>
                <div className="text-sm font-medium">{user.lastLogin}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Active Days</div>
                <div className="text-sm font-medium">{user.appUsageDays}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total Sessions</div>
                <div className="text-sm font-medium">{user.totalSessions}</div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
