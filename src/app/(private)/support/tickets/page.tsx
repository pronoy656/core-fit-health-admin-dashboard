import { PageHeader } from "@/components/widgets/page-header"
import { SupportTicketsTable } from "../components/support-tickets-table"

export default function TicketsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6 animate-fade-up">
      <PageHeader 
        title="Support Tickets" 
        subtitle="Manage and respond to user support requests."
      />
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <SupportTicketsTable />
      </div>
    </div>
  )
}
