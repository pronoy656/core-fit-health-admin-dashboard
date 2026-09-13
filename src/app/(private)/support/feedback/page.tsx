import { PageHeader } from "@/components/widgets/page-header"
import { FeedbackTable } from "../components/feedback-table"

export default function FeedbackPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6 animate-fade-up">
      <PageHeader 
        title="User Feedback" 
        subtitle="Review feedback and ratings from users."
      />
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <FeedbackTable />
      </div>
    </div>
  )
}
