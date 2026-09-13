"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/widgets/page-header"

import { PushNotificationsTable } from "./components/push-notifications-table"
import { EmailCampaignsTable } from "./components/email-campaigns-table"

export default function NotificationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6 animate-fade-up">
      <PageHeader 
        title="Notifications & Campaigns" 
        subtitle="Manage push notifications, email campaigns, and automated reminders."
      />

      <Tabs defaultValue="push" className="space-y-4">
        <TabsList>
          <TabsTrigger value="push">Push Notifications</TabsTrigger>
          <TabsTrigger value="email">Email Campaigns</TabsTrigger>
        </TabsList>
        <TabsContent value="push" className="space-y-4">
          <PushNotificationsTable />
        </TabsContent>
        <TabsContent value="email" className="space-y-4">
          <EmailCampaignsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
