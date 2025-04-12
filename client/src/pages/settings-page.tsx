import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Bell, Moon, Sun, Monitor, Globe, Save, Trash2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("appearance");
  const { toast } = useToast();
  
  // Preferences states
  const [theme, setTheme] = useState("system");
  const [fontSize, setFontSize] = useState([16]);
  const [language, setLanguage] = useState("english");
  
  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [goalReminders, setGoalReminders] = useState(true);
  
  // Privacy states
  const [publicProfile, setPublicProfile] = useState(true);
  const [showReadingActivity, setShowReadingActivity] = useState(true);
  const [shareReviews, setShareReviews] = useState(true);
  
  const saveAppearanceSettings = () => {
    toast({
      title: "Appearance settings saved",
      description: "Your appearance preferences have been updated.",
    });
  };
  
  const saveNotificationSettings = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated.",
    });
  };
  
  const savePrivacySettings = () => {
    toast({
      title: "Privacy settings saved",
      description: "Your privacy preferences have been updated.",
    });
  };
  
  const handleLogout = () => {
    window.location.href = "/auth";
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar navigation */}
        <div className="md:col-span-1">
          <div className="flex flex-col space-y-1">
            <button 
              onClick={() => setActiveTab("appearance")}
              className={`flex items-center justify-start px-4 py-2 text-left rounded-md hover:bg-gray-100 ${activeTab === "appearance" ? "bg-gray-100 text-primary font-medium" : ""}`}
            >
              <Monitor className="mr-2 h-4 w-4" />
              <span>Appearance</span>
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center justify-start px-4 py-2 text-left rounded-md hover:bg-gray-100 ${activeTab === "notifications" ? "bg-gray-100 text-primary font-medium" : ""}`}
            >
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </button>
            <button 
              onClick={() => setActiveTab("privacy")}
              className={`flex items-center justify-start px-4 py-2 text-left rounded-md hover:bg-gray-100 ${activeTab === "privacy" ? "bg-gray-100 text-primary font-medium" : ""}`}
            >
              <Globe className="mr-2 h-4 w-4" />
              <span>Privacy</span>
            </button>
            <button 
              onClick={() => setActiveTab("account")}
              className={`flex items-center justify-start px-4 py-2 text-left rounded-md hover:bg-gray-100 ${activeTab === "account" ? "bg-gray-100 text-primary font-medium" : ""}`}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Account</span>
            </button>
          </div>
        </div>
        
        {/* Settings content */}
        <div className="md:col-span-2">
          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how BookTrack looks on your device.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="flex flex-col items-center justify-center h-20 w-full"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="mb-1 h-5 w-5" />
                      <span>Light</span>
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="flex flex-col items-center justify-center h-20 w-full"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="mb-1 h-5 w-5" />
                      <span>Dark</span>
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className="flex flex-col items-center justify-center h-20 w-full"
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className="mb-1 h-5 w-5" />
                      <span>System</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Font Size</Label>
                    <span className="text-sm text-muted-foreground">{fontSize}px</span>
                  </div>
                  <Slider
                    value={fontSize}
                    min={12}
                    max={24}
                    step={1}
                    onValueChange={setFontSize}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveAppearanceSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-sm font-medium">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive email updates about your account activity
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications" className="text-sm font-medium">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive push notifications on this device
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-md font-medium mb-4">Types of Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="goal-reminders" className="text-sm font-medium">Reading Goal Reminders</Label>
                        <p className="text-xs text-muted-foreground">
                          Get reminders about your reading progress and goals
                        </p>
                      </div>
                      <Switch
                        id="goal-reminders"
                        checked={goalReminders}
                        onCheckedChange={setGoalReminders}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-digest" className="text-sm font-medium">Weekly Digest</Label>
                        <p className="text-xs text-muted-foreground">
                          Receive a weekly summary of your reading activity
                        </p>
                      </div>
                      <Switch
                        id="weekly-digest"
                        checked={weeklyDigest}
                        onCheckedChange={setWeeklyDigest}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveNotificationSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>
                  Control what information is visible to others.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="public-profile" className="text-sm font-medium">Public Profile</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow others to see your profile information
                      </p>
                    </div>
                    <Switch
                      id="public-profile"
                      checked={publicProfile}
                      onCheckedChange={setPublicProfile}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-reading-activity" className="text-sm font-medium">Show Reading Activity</Label>
                      <p className="text-xs text-muted-foreground">
                        Display your reading progress and recently read books
                      </p>
                    </div>
                    <Switch
                      id="show-reading-activity"
                      checked={showReadingActivity}
                      onCheckedChange={setShowReadingActivity}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="share-reviews" className="text-sm font-medium">Share Reviews</Label>
                      <p className="text-xs text-muted-foreground">
                        Make your book reviews visible to others
                      </p>
                    </div>
                    <Switch
                      id="share-reviews"
                      checked={shareReviews}
                      onCheckedChange={setShareReviews}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-md font-medium mb-2">Data & Privacy</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Control your data and privacy settings
                  </p>
                  
                  <Button variant="outline" className="w-full justify-start">
                    Download Your Data
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={savePrivacySettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Account Tab */}
          {activeTab === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Manage your account and subscription settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-4">Account Information</h3>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Email: </span>
                    sarah.johnson@example.com
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Username: </span>
                    sarahreader
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Member since: </span>
                    January 12, 2025
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-md font-medium mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full justify-start">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers, including your book lists, reviews, and reading history.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground">
                            Yes, delete my account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}