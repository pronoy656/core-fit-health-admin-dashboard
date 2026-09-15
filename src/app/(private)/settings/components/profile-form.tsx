"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { useGetAdminProfile, useUpdateAdminProfile } from "@/hooks/use-admin-profile"
import { Skeleton } from "@/components/ui/skeleton"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().optional(),
  location: z.string().optional(),
  dateOfBirth: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
  const { data: profileResponse, isLoading } = useGetAdminProfile()
  const { mutate: updateProfile, isPending } = useUpdateAdminProfile()
  const [profileImageFile, setProfileImageFile] = useState<File | undefined>()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      dateOfBirth: "",
    },
  })

  useEffect(() => {
    if (profileResponse?.data) {
      form.reset({
        name: profileResponse.data.name || "",
        phone: profileResponse.data.phone || "",
        location: profileResponse.data.location || "",
        dateOfBirth: profileResponse.data.dateOfBirth || "",
      })
    }
  }, [profileResponse, form])

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile({
      ...data,
      profileImage: profileImageFile,
    })
  }

  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  const existingProfileImage = profileResponse?.data?.profileImage
  const previewUrl = profileImageFile ? URL.createObjectURL(profileImageFile) : existingProfileImage

  return (
    <Card className="border shadow-sm animate-fade-up">
      <CardHeader>
        <CardTitle>Admin Profile</CardTitle>
        <CardDescription>
          Update your personal information. These details will be visible to the team.
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <label 
                htmlFor="profile-image" 
                className="relative block h-24 w-24 rounded-full overflow-hidden border-4 border-background shadow-md cursor-pointer group bg-muted flex-shrink-0"
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={previewUrl} 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/50">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-[10px] font-medium text-center px-1">Change<br/>Avatar</span>
                </div>
              </label>
              <Input 
                id="profile-image" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setProfileImageFile(file)
                }}
              />
              <div className="space-y-1">
                <h3 className="font-medium">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a new profile picture. JPG, PNG, WEBP.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input defaultValue={profileResponse?.data?.email || ""} disabled />
                  </FormControl>
                  <FormDescription>
                    Email cannot be changed directly.
                  </FormDescription>
                </FormItem>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input defaultValue={profileResponse?.data?.role || "ADMIN"} disabled />
                  </FormControl>
                </FormItem>
              </div>
            </div>

          </CardContent>
          <CardFooter className="bg-muted/10 border-t px-6 py-4 flex justify-end">
            <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]">
              {isPending ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
