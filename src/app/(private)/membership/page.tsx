"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/widgets/page-header"

import { PlansGrid } from "./components/plans-grid"
import { PromoCodesTable } from "./components/promo-codes-table"
import { PaymentHistoryTable } from "./components/payment-history-table"
import { FailedPaymentsAlert } from "./components/failed-payments-alert"

export default function MembershipPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6 animate-fade-up">
      <PageHeader 
        title="Membership & Subscriptions" 
        subtitle="Manage plans, promo codes, and payment history."
      />

      <FailedPaymentsAlert />

      <Tabs defaultValue="plans" className="space-y-4 mt-6">
        <TabsList>
          <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
          <TabsTrigger value="promo">Promo Codes</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>
        <TabsContent value="plans" className="space-y-4">
          <PlansGrid />
        </TabsContent>
        <TabsContent value="promo" className="space-y-4">
          <PromoCodesTable />
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <PaymentHistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
