
import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Users, 
  Bot,
  Save,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  RotateCcw
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { http } from "@/lib/http";

interface SystemSettingsData {
  general: {
    siteName: string;
    adminEmail: string;
    siteDescription: string;
    timezone: string;
    language: string;
  };
  notifications: {
    dailyAlerts: boolean;
    weeklyReports: boolean;
    errorAlerts: boolean;
    draftReviews: boolean;
    slackWebhook: string;
    emailRecipients: string;
  };
  privacy: {
    gdprCompliance: boolean;
    dataRetention: string;
    anonymizeData: boolean;
  };
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface LoadingStates {
  loading: boolean;
  saving: boolean;
  testing: { [key: string]: boolean };
}

export function SystemSettings() {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<SystemSettingsData>({
    general: {
      siteName: "AmbitFul",
      adminEmail: "admin@ambitful.com",
      siteDescription: "AI-powered career guidance and opportunity discovery platform",
      timezone: "utc",
      language: "en",
    },
    notifications: {
      dailyAlerts: true,
      weeklyReports: true,
      errorAlerts: true,
      draftReviews: true,
      slackWebhook: "",
      emailRecipients: "",
    },
    privacy: {
      gdprCompliance: true,
      dataRetention: "365",
      anonymizeData: false,
    },
  });

  const [originalSettings, setOriginalSettings] = useState<SystemSettingsData>(settings);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: true,
    saving: false,
    testing: {},
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Load settings from API
  const loadSettings = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, loading: true }));
      const response = await http.get('/admin/settings');
      const data = response.data.data;
      setSettings(data);
      setOriginalSettings(data);
      setHasUnsavedChanges(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }
  }, [toast]);

  // Save settings to API
  const saveSettings = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));
      setErrors({});
      
      // Validate required fields
      const newErrors: FormErrors = {};
      if (!settings.general.siteName.trim()) {
        newErrors.siteName = "Site name is required";
      }
      if (!settings.general.adminEmail.trim()) {
        newErrors.adminEmail = "Admin email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.general.adminEmail)) {
        newErrors.adminEmail = "Invalid email format";
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast({
          title: "Validation Error",
          description: "Please fix the errors before saving",
          variant: "destructive",
        });
        return;
      }

      await http.put('/admin/settings', settings);
      setOriginalSettings({ ...settings });
      setHasUnsavedChanges(false);
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [settings, toast]);

  // Reset settings
  const resetSettings = useCallback(() => {
    setSettings({ ...originalSettings });
    setHasUnsavedChanges(false);
    setErrors({});
    toast({
      title: "Settings Reset",
      description: "All changes have been reverted",
    });
  }, [originalSettings, toast]);

  // Test webhook/integration
  const testIntegration = useCallback(async (type: string, url: string) => {
    try {
      setLoadingStates(prev => ({ 
        ...prev, 
        testing: { ...prev.testing, [type]: true } 
      }));
      
      await http.post('/admin/settings/test-integration', { type, url });
      toast({
        title: "Test Successful",
        description: `${type} integration is working correctly`,
      });
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: error.response?.data?.message || `Failed to test ${type} integration`,
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ 
        ...prev, 
        testing: { ...prev.testing, [type]: false } 
      }));
    }
  }, [toast]);

  // Update settings helper
  const updateSettings = useCallback((section: keyof SystemSettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasUnsavedChanges(hasChanges);
  }, [settings, originalSettings]);

  if (loadingStates.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <Button
              variant="outline"
              onClick={resetSettings}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
          )}
          <Button 
            onClick={saveSettings}
            disabled={loadingStates.saving || !hasUnsavedChanges}
            className="flex items-center space-x-2"
          >
            {loadingStates.saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{loadingStates.saving ? "Saving..." : "Save All Changes"}</span>
          </Button>
        </div>
      </div>

      {/* Unsaved changes alert */}
      {hasUnsavedChanges && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Don't forget to save your settings.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="roles">Roles & Access</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Data</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>General Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name *</Label>
                  <Input 
                    id="site-name" 
                    value={settings.general.siteName}
                    onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                    className={errors.siteName ? "border-red-500" : ""}
                  />
                  {errors.siteName && (
                    <p className="text-sm text-red-500">{errors.siteName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email *</Label>
                  <Input 
                    id="admin-email" 
                    type="email"
                    value={settings.general.adminEmail}
                    onChange={(e) => updateSettings('general', 'adminEmail', e.target.value)}
                    className={errors.adminEmail ? "border-red-500" : ""}
                  />
                  {errors.adminEmail && (
                    <p className="text-sm text-red-500">{errors.adminEmail}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select 
                    value={settings.general.timezone}
                    onValueChange={(value) => updateSettings('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select 
                    value={settings.general.language}
                    onValueChange={(value) => updateSettings('general', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Access */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Role-Based Access Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Administrator</h4>
                    <Button size="sm" variant="outline">Edit Permissions</Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Full Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>User Management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>System Settings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Analytics</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Content Reviewer</h4>
                    <Button size="sm" variant="outline">Edit Permissions</Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Review Drafts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Edit Opportunities</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span>User Management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span>System Settings</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Content Creator</h4>
                    <Button size="sm" variant="outline">Edit Permissions</Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Create Content</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Edit Own Content</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span>Review Drafts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span>Analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Daily Alerts</Label>
                    <p className="text-sm text-gray-600">Receive daily summary of platform activity</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.dailyAlerts}
                    onCheckedChange={(checked) => updateSettings('notifications', 'dailyAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Weekly Reports</Label>
                    <p className="text-sm text-gray-600">Comprehensive weekly analytics report</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.weeklyReports}
                    onCheckedChange={(checked) => updateSettings('notifications', 'weeklyReports', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Error Alerts</Label>
                    <p className="text-sm text-gray-600">Immediate notifications for system errors</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.errorAlerts}
                    onCheckedChange={(checked) => updateSettings('notifications', 'errorAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Draft Reviews</Label>
                    <p className="text-sm text-gray-600">Notifications when AI drafts need review</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.draftReviews}
                    onCheckedChange={(checked) => updateSettings('notifications', 'draftReviews', checked)}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Integration Settings</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Slack Webhook URL</Label>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="https://hooks.slack.com/services/..."
                        value={settings.notifications.slackWebhook}
                        onChange={(e) => updateSettings('notifications', 'slackWebhook', e.target.value)}
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => testIntegration('slack', settings.notifications.slackWebhook)}
                        disabled={!settings.notifications.slackWebhook || loadingStates.testing.slack}
                      >
                        {loadingStates.testing.slack ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Test"
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Recipients</Label>
                    <Input 
                      placeholder="admin@example.com, team@example.com"
                      value={settings.notifications.emailRecipients}
                      onChange={(e) => updateSettings('notifications', 'emailRecipients', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy & Data */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy & Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Important</h4>
                    <p className="text-sm text-yellow-700">
                      Changes to privacy settings may require user consent and system restart.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">GDPR Compliance</Label>
                    <p className="text-sm text-gray-600">Enable GDPR compliance features and consent management</p>
                  </div>
                  <Switch 
                    checked={settings.privacy.gdprCompliance}
                    onCheckedChange={(checked) => updateSettings('privacy', 'gdprCompliance', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data Retention Period (Days)</Label>
                  <Select 
                    value={settings.privacy.dataRetention}
                    onValueChange={(value) => updateSettings('privacy', 'dataRetention', value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="180">180 Days</SelectItem>
                      <SelectItem value="365">1 Year</SelectItem>
                      <SelectItem value="730">2 Years</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Anonymize Analytics Data</Label>
                    <p className="text-sm text-gray-600">Remove personally identifiable information from analytics</p>
                  </div>
                  <Switch 
                    checked={settings.privacy.anonymizeData}
                    onCheckedChange={(checked) => updateSettings('privacy', 'anonymizeData', checked)}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Data Export & Deletion</h4>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => testIntegration('export-users', '')}
                    disabled={loadingStates.testing['export-users']}
                  >
                    {loadingStates.testing['export-users'] ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Export All User Data
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => testIntegration('export-analytics', '')}
                    disabled={loadingStates.testing['export-analytics']}
                  >
                    {loadingStates.testing['export-analytics'] ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Export Analytics Data
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete old data? This action cannot be undone.')) {
                        testIntegration('delete-old-data', '');
                      }
                    }}
                    disabled={loadingStates.testing['delete-old-data']}
                  >
                    {loadingStates.testing['delete-old-data'] ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Delete Old Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
