"use client"

import { KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function PasswordForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Password updated successfully.")
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Update your account password. We recommend using a strong password that you don't use elsewhere.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" required />
          </div>
        </CardContent>
        
      </form>
      <CardFooter className="bg-muted/10 border-t px-6 py-4 flex justify-end">
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <KeyRound className="mr-2 h-4 w-4" />
            Update Password
          </Button>
        </CardFooter>
    </Card>
  )
}
