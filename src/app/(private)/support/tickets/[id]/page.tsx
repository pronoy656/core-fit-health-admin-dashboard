"use client"

import { use, useEffect, useState, useRef } from "react"
import { format } from "date-fns"
import { ArrowLeft, Paperclip, Send, User } from "lucide-react"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"

import { PageHeader } from "@/components/widgets/page-header"
import { StatBadge } from "@/components/widgets/stat-badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { 
  useSupportTicket, 
  useSupportTicketMessages, 
  useReplyToTicket, 
  useUpdateTicketStatus, 
  useUpdateTicketPriority,
  useAssignTicket,
  SUPPORT_TICKET_MESSAGES_KEY,
  SUPPORT_TICKETS_KEY
} from "@/hooks/use-support-tickets"
import { useSocket } from "@/hooks/use-socket"
import { TicketStatus, TicketPriority } from "@/types/support-ticket"


export default function TicketThreadPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the Promise params for Next.js app router conventions when params are async
  const { id } = use(params)
  const queryClient = useQueryClient()
  
  // Queries
  const { data: ticketRes, isLoading: isTicketLoading } = useSupportTicket(id)
  const { data: messagesRes, isLoading: isMessagesLoading } = useSupportTicketMessages(id, { limit: 50, sort: 'createdAt' }) // sort asc for chat
  
  // Mutations
  const { mutate: replyToTicket, isPending: isReplying } = useReplyToTicket()
  const { mutate: updateStatus } = useUpdateTicketStatus()
  const { mutate: updatePriority } = useUpdateTicketPriority()
  const { mutate: assignTicket } = useAssignTicket()

  // Real-time Socket
  const { joinTicket, leaveTicket, socket } = useSocket()
  
  // State
  const [messageText, setMessageText] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const ticket = ticketRes?.data
  const messages = messagesRes?.data || []

  useEffect(() => {
    if (id) {
      joinTicket(id)
    }
    return () => {
      if (id) leaveTicket(id)
    }
  }, [id, joinTicket, leaveTicket])

  // Socket event listeners
  useEffect(() => {
    if (!socket || !id) return;

    const onReply = (payload: any) => {
      // If the reply belongs to this ticket
      if (payload.ticket._id === id || payload.message.ticketId === id) {
        // Optimistically update query cache
        queryClient.setQueryData([...SUPPORT_TICKET_MESSAGES_KEY, id, { limit: 50, sort: 'createdAt' }], (old: any) => {
          if (!old) return old;
          // Avoid duplicate messages
          const exists = old.data.find((m: any) => m._id === payload.message._id);
          if (exists) return old;
          return {
            ...old,
            data: [...old.data, payload.message]
          };
        });
      }
    };

    const onStatusChanged = (payload: any) => {
      if (payload.ticketId === id) {
        queryClient.invalidateQueries({ queryKey: [...SUPPORT_TICKETS_KEY, id] });
      }
    };

    socket.on('TICKET_REPLY', onReply);
    socket.on('TICKET_STATUS_CHANGED', onStatusChanged);

    return () => {
      socket.off('TICKET_REPLY', onReply);
      socket.off('TICKET_STATUS_CHANGED', onStatusChanged);
    };
  }, [socket, id, queryClient])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleReplySubmit = () => {
    if (!messageText.trim() && files.length === 0) return;

    const formData = new FormData()
    formData.append('message', messageText)
    files.forEach(file => {
      formData.append('attachments', file)
    })

    replyToTicket({ id, formData }, {
      onSuccess: () => {
        setMessageText("")
        setFiles([])
      }
    })
  }

  const handleStatusChange = (val: TicketStatus) => {
    updateStatus({ id, status: val })
  }

  const handlePriorityChange = (val: TicketPriority) => {
    updatePriority({ id, priority: val })
  }

  if (isTicketLoading) {
    return <div className="p-8 text-center animate-pulse">Loading ticket...</div>
  }

  if (!ticket) {
    return <div className="p-8 text-center text-muted-foreground">Ticket not found.</div>
  }

  const ticketUser = typeof ticket.userId === 'object' ? ticket.userId : null

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card p-4 md:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/support/tickets">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-lg">{ticket.subject}</h2>
              <span className="text-muted-foreground text-sm font-mono">{ticket.ticketNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span>{ticketUser?.name || 'Unknown User'}</span>
              <span>•</span>
              <span>{format(new Date(ticket.createdAt), "MMM dd, yyyy h:mm a")}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={ticket.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
              <SelectItem value="REOPENED">Reopened</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={ticket.priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-muted/10">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {isMessagesLoading ? (
              <div className="text-center text-sm text-muted-foreground mt-10">Loading messages...</div>
            ) : (
              <>
                {messages.map((msg: any) => {
                  const isAdmin = msg.senderType === 'ADMIN'
                  const sender = typeof msg.senderId === 'object' ? msg.senderId : null

                  return (
                    <div key={msg._id} className={`flex gap-4 max-w-[80%] ${isAdmin ? 'ml-auto flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8 shrink-0 mt-1">
                        <AvatarImage src={sender?.profileImage} />
                        <AvatarFallback className={isAdmin ? 'bg-primary/20 text-primary' : ''}>
                          {isAdmin ? 'A' : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`flex flex-col gap-1 ${isAdmin ? 'items-end' : ''}`}>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {sender?.name || (isAdmin ? 'Admin' : 'User')}
                          </span>
                          <span>{format(new Date(msg.createdAt), "h:mm a")}</span>
                        </div>
                        
                        <div className={`rounded-2xl p-4 text-sm whitespace-pre-wrap shadow-sm border ${
                          isAdmin 
                            ? 'bg-primary text-primary-foreground border-transparent rounded-tr-sm' 
                            : 'bg-card border-border rounded-tl-sm'
                        }`}>
                          {msg.message}
                        </div>

                        {/* Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className={`flex flex-wrap gap-2 mt-2 ${isAdmin ? 'justify-end' : ''}`}>
                            {msg.attachments.map((att: any, idx: number) => (
                              <a 
                                key={idx} 
                                href={att.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-1 text-xs bg-card border rounded-md p-1.5 hover:bg-muted/50 transition-colors"
                              >
                                <Paperclip className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{att.name || 'Attachment'}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Reply Area */}
          <div className="p-4 bg-card border-t border-border shrink-0">
            {files.length > 0 && (
              <div className="flex gap-2 mb-3 pb-3 border-b border-border overflow-x-auto">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-muted rounded-md px-3 py-1.5 text-xs">
                    <span className="truncate max-w-[120px]">{f.name}</span>
                    <button 
                      onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-foreground font-medium"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Textarea 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="min-h-[60px] max-h-[200px] resize-y rounded-xl pr-12"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReplySubmit();
                    }
                  }}
                />
                <div className="absolute right-2 bottom-2">
                  <Input 
                    type="file" 
                    id="file-upload" 
                    multiple 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files) {
                        setFiles([...files, ...Array.from(e.target.files)])
                      }
                    }}
                  />
                  <Label 
                    htmlFor="file-upload" 
                    className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                  >
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                  </Label>
                </div>
              </div>
              <Button 
                onClick={handleReplySubmit} 
                disabled={isReplying || (!messageText.trim() && files.length === 0)}
                className="h-[60px] rounded-xl px-6"
              >
                {isReplying ? "Sending..." : <><Send className="h-4 w-4 mr-2" /> Send</>}
              </Button>
            </div>
            <div className="text-[10px] text-muted-foreground text-center mt-2">
              Press Enter to send, Shift + Enter for new line. Max 5 attachments (25MB total).
            </div>
          </div>
        </div>

        {/* Sidebar Info (Desktop) */}
        <div className="hidden lg:flex w-80 flex-col border-l border-border bg-card">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium">Ticket Information</h3>
          </div>
          <div className="p-4 space-y-6 text-sm">
            <div>
              <span className="text-muted-foreground block mb-1">Category</span>
              <div className="font-medium">{ticket.category}</div>
            </div>
            
            <div>
              <span className="text-muted-foreground block mb-1">Created At</span>
              <div>{format(new Date(ticket.createdAt), "PPP p")}</div>
            </div>

            <div>
              <span className="text-muted-foreground block mb-1">Last Reply</span>
              <div>{format(new Date(ticket.lastReplyAt), "PPP p")}</div>
              <div className="text-xs text-muted-foreground mt-0.5">by {ticket.lastReplyBy}</div>
            </div>

            {ticket.firstResponseAt && (
              <div>
                <span className="text-muted-foreground block mb-1">First Response Time</span>
                <div>{format(new Date(ticket.firstResponseAt), "PPP p")}</div>
              </div>
            )}
            
            {ticket.resolvedAt && (
              <div>
                <span className="text-muted-foreground block mb-1">Resolved At</span>
                <div>{format(new Date(ticket.resolvedAt), "PPP p")}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
