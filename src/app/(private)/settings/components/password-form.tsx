"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { useChangePassword } from "@/hooks/use-admin-profile"

// Strong password regex requirement
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]|;:'",.<>/?]).{8,}$/

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().regex(
    passwordRegex, 
    "Password must include upper, lower, number, special and be 8+ chars"
  ),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: "Please give different password from current password",
  path: ["newPassword"],
})

type PasswordFormValues = z.infer<typeof passwordSchema>

export function PasswordForm() {
  const { mutate: changePassword, isPending } = useChangePassword()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (data: PasswordFormValues) => {
    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
  }

  return (
    <Card className="border shadow-sm animate-fade-up">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Update your account password. We recommend using a strong password that you don't use elsewhere.
          <br/>
          <span className="text-destructive text-xs mt-1 block font-medium">
            Note: Changing your password will log you out of all active sessions.
          </span>
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter current password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Create new password" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Re-enter new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="bg-muted/10 border-t px-6 py-4 flex justify-end">
            <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[170px]">
              {isPending ? (
                <>Updating...</>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
