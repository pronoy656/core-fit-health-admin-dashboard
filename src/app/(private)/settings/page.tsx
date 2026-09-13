"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/widgets/page-header"

import { ProfileForm } from "./components/profile-form"
import { PasswordForm } from "./components/password-form"

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6 animate-fade-up">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your account profile and security."
      />

      <div className="max-w-4xl mt-6">
        <Tabs defaultValue="profile" orientation="vertical" className="flex flex-col md:flex-row gap-6">
          <TabsList className="flex flex-col h-auto w-full md:w-64 bg-transparent space-y-1 p-1">
            <TabsTrigger value="profile" className="w-full justify-start px-4 py-2 text-left data-[state=active]:bg-muted data-[state=active]:shadow-none">
              Admin Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="w-full justify-start px-4 py-2 text-left data-[state=active]:bg-muted data-[state=active]:shadow-none">
              Security
            </TabsTrigger>
          </TabsList>

          <div className="flex-1">
            <TabsContent value="profile" className="m-0 space-y-4">
              <ProfileForm />
            </TabsContent>
            
            <TabsContent value="security" className="m-0 space-y-4">
              <PasswordForm />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
