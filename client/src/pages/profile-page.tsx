import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, User, Settings, Mail, Image, Save, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// Form validation schemas
const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  bio: z.string().max(250, "Bio must be less than 250 characters").optional(),
});

const securitySchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});

// Component types
type ProfileFormValues = z.infer<typeof profileSchema>;
type SecurityFormValues = z.infer<typeof securitySchema>;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  // Profile form setup
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Sarah Johnson",
      username: "sarahreader",
      email: "sarah.johnson@example.com",
      bio: "Book enthusiast and avid reader. I love fantasy novels and historical fiction. Currently working through my 2025 reading challenge!",
    },
  });

  // Security form setup
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Profile form submission
  const onProfileSubmit = (data: ProfileFormValues) => {
    console.log("Profile data:", data);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  // Security form submission
  const onSecuritySubmit = (data: SecurityFormValues) => {
    console.log("Security data:", data);
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    
    securityForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Handle avatar upload
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left sidebar with user info */}
        <div className="md:w-1/4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={avatarPreview || "https://images.unsplash.com/photo-1517841905240-472988babdf9"} alt="User avatar" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">Sarah Johnson</h2>
                <p className="text-sm text-muted-foreground mb-2">@sarahreader</p>
                
                <div className="w-full mt-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium">Books Read</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">42</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium">Reviews</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">18</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium">Reading Goal</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">56%</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium">Member Since</span>
                    <span className="text-sm text-muted-foreground">Jan 2025</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side with tabs */}
        <div className="md:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>
                    Update your personal information and public profile.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <CardContent className="space-y-6">
                    <div className="space-y-1">
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <div className="flex items-start mt-2">
                        <Avatar className="h-16 w-16 mr-4">
                          <AvatarImage 
                            src={avatarPreview || "https://images.unsplash.com/photo-1517841905240-472988babdf9"} 
                            alt="Avatar preview" 
                          />
                          <AvatarFallback>SJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <Label 
                            htmlFor="avatar-upload" 
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50"
                          >
                            <Image className="h-4 w-4 mr-2" />
                            Change Picture
                          </Label>
                          <Input 
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                          <p className="mt-1 text-xs text-muted-foreground">
                            JPG, PNG or GIF. Max 1MB.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        {...profileForm.register("name")}
                        placeholder="Your full name"
                      />
                      {profileForm.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        {...profileForm.register("username")}
                        placeholder="Your username"
                      />
                      {profileForm.formState.errors.username && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...profileForm.register("email")}
                        placeholder="Your email address"
                      />
                      {profileForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        {...profileForm.register("bio")}
                        placeholder="Tell us about yourself and your reading preferences"
                        rows={5}
                      />
                      <p className="text-xs text-muted-foreground">
                        {profileForm.watch("bio")?.length || 0}/250 characters
                      </p>
                      {profileForm.formState.errors.bio && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.bio.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full md:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and account security.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        {...securityForm.register("currentPassword")}
                        placeholder="Enter your current password"
                      />
                      {securityForm.formState.errors.currentPassword && (
                        <p className="text-sm text-red-500">
                          {securityForm.formState.errors.currentPassword.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        {...securityForm.register("newPassword")}
                        placeholder="Enter your new password"
                      />
                      {securityForm.formState.errors.newPassword && (
                        <p className="text-sm text-red-500">
                          {securityForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        {...securityForm.register("confirmPassword")}
                        placeholder="Confirm your new password"
                      />
                      {securityForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {securityForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-md font-medium mb-4">Security Options</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="two-factor" className="text-sm font-medium">Two-factor authentication</Label>
                            <p className="text-xs text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch id="two-factor" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="login-alerts" className="text-sm font-medium">Login alerts</Label>
                            <p className="text-xs text-muted-foreground">
                              Receive email notifications for new sign-ins
                            </p>
                          </div>
                          <Switch id="login-alerts" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full md:w-auto">
                      Update Password
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}