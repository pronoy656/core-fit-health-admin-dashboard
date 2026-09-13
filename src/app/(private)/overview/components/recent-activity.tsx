import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockMembership, mockUsers } from "@/data"
import { StatBadge } from "@/components/widgets/stat-badge"

export function RecentActivity() {
  // Generate some combined recent activity from our mocks
  const activities = [
    { id: 1, user: mockUsers[0], action: "upgraded to", target: "Yearly Plan", date: "Just now", type: "upgrade" },
    { id: 2, user: mockUsers[4], action: "payment failed for", target: "Premium", date: "2 hours ago", type: "failed" },
    { id: 3, user: mockUsers[1], action: "completed", target: "Metabolic Lab Analysis", date: "5 hours ago", type: "action" },
    { id: 4, user: mockUsers[3], action: "signed up for", target: "Free Plan", date: "Yesterday", type: "signup" },
    { id: 5, user: mockUsers[7], action: "canceled", target: "Premium Subscription", date: "Yesterday", type: "churn" },
  ]

  return (
    <Card className="h-full border-t-4 border-t-primary/80 animate-fade-up" style={{ animationDelay: "0.1s" }}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest user actions across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{activity.user.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col justify-center space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.action} <span className="font-medium text-foreground">{activity.target}</span>
                </p>
              </div>
              <div className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                {activity.date}
              </div>
              {activity.type === 'upgrade' && <StatBadge label="Revenue" color="success" />}
              {activity.type === 'failed' && <StatBadge label="Alert" color="warning" />}
              {activity.type === 'churn' && <StatBadge label="Churn" color="warning" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
