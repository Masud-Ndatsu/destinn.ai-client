"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Save, AlertCircle, Mail, GraduationCap, Briefcase, Heart } from "lucide-react";
import { useUserProfile, useUpdateProfile } from "@/lib/queries/useProfile";
import { useCurrentUser, useIsAuthenticated } from "@/store/auth";
import { ProfileUpdateFormData, profileUpdateSchema } from "@/types/user";
import { toast } from "react-toastify";

export const ProfilePage = () => {
  const currentUser = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const { data: profileData, isLoading, error, isError } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      educationLevel: "",
      experienceYears: 0,
      interests: "",
    },
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profileData?.data) {
      form.reset({
        firstName: profileData.data.first_name || "",
        lastName: profileData.data.last_name || "",
        educationLevel: profileData.data.education_level || "",
        experienceYears: profileData.data.experience_years || 0,
        interests: profileData.data.interests?.join(", ") || "",
      });
    }
  }, [profileData, form]);

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      await updateProfileMutation.mutateAsync({
        first_name: data.firstName,
        last_name: data.lastName,
        education_level: data.educationLevel,
        experience_years: data.experienceYears,
        interests: data.interests.split(",").map(i => i.trim()).filter(Boolean),
      });
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleCancelEdit = () => {
    if (profileData?.data) {
      form.reset({
        firstName: profileData.data.first_name || "",
        lastName: profileData.data.last_name || "",
        educationLevel: profileData.data.education_level || "",
        experienceYears: profileData.data.experience_years || 0,
        interests: profileData.data.interests?.join(", ") || "",
      });
    }
    setIsEditing(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Loading Profile</h2>
            <p className="text-muted-foreground">Please wait while we load your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error?.message || "Failed to load profile. Please try again."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Show auth required state
  if (!isAuthenticated || currentUser?.isGuest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto" />
          <h2 className="text-2xl font-semibold text-foreground">Authentication Required</h2>
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
          <Button onClick={() => window.location.href = "/?auth=signin"}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const profile = profileData?.data;

  return (
    <div className="min-h-screen bg-secondary py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and preferences
                    </CardDescription>
                  </div>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Email Address</span>
                  </Label>
                  <Input
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed
                  </p>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...form.register("firstName")}
                      disabled={!isEditing}
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...form.register("lastName")}
                      disabled={!isEditing}
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Education Level */}
                <div className="space-y-2">
                  <Label htmlFor="educationLevel" className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>Education Level</span>
                  </Label>
                  <Input
                    id="educationLevel"
                    {...form.register("educationLevel")}
                    disabled={!isEditing}
                    placeholder="e.g., Bachelor's Degree, Master's Degree"
                  />
                  {form.formState.errors.educationLevel && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.educationLevel.message}
                    </p>
                  )}
                </div>

                {/* Experience Years */}
                <div className="space-y-2">
                  <Label htmlFor="experienceYears" className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>Years of Experience</span>
                  </Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    min="0"
                    max="50"
                    {...form.register("experienceYears")}
                    disabled={!isEditing}
                  />
                  {form.formState.errors.experienceYears && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.experienceYears.message}
                    </p>
                  )}
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <Label htmlFor="interests" className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>Interests</span>
                  </Label>
                  <Input
                    id="interests"
                    {...form.register("interests")}
                    disabled={!isEditing}
                    placeholder="e.g., Technology, Design, Marketing"
                  />
                  {form.formState.errors.interests && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.interests.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Separate multiple interests with commas
                  </p>
                </div>

                {/* Display Current Interests as Badges */}
                {profile?.interests && profile.interests.length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Interests</Label>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="bg-gradient-to-r from-blue-600 to-[#3498db]/100 hover:from-blue-700 hover:to-[#3498db]/700"
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={updateProfileMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Type</span>
                  <Badge variant="outline">
                    {profile?.role || "User"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Member Since</span>
                  <span className="text-sm text-muted-foreground">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm text-muted-foreground">
                    {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : "Unknown"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};