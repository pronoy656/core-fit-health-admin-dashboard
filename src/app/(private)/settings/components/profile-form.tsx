"use client"

import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfileForm() {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Admin Profile</CardTitle>
        <CardDescription>
          Update your personal information. These details will be visible to the team.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" defaultValue="Dr. Sarah" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" defaultValue="Jenkins" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="admin@corefit.health" disabled />
            <p className="text-xs text-muted-foreground">
              To change your email address, contact system administration.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue="Chief Medical Officer" />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              className="min-h-[100px]"
              defaultValue="Overseeing clinical protocols and lab marker accuracy for the CoreFit platform."
            />
          </div> */}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/10 border-t px-6 py-4 flex justify-end">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  )
}
