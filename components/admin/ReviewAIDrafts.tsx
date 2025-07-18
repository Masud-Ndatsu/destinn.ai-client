
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Check, 
  X, 
  Edit, 
  RefreshCw, 
  FileText, 
  ExternalLink,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const drafts = [
  {
    id: 1,
    title: "Remote Frontend Developer",
    source: "TechCorp",
    status: "pending",
    originalContent: `We are looking for a talented Frontend Developer to join our remote team. The ideal candidate should have experience with React, TypeScript, and modern web development practices. This is a full-time position offering competitive salary and benefits. Requirements include 3+ years of experience, proficiency in JavaScript frameworks, and strong communication skills for remote collaboration.`,
    aiSummary: `🚀 Remote Frontend Developer Opportunity at TechCorp\n\n💼 What You'll Do:\n• Build modern web applications using React & TypeScript\n• Collaborate with distributed teams\n• Implement responsive user interfaces\n\n✅ What We're Looking For:\n• 3+ years frontend development experience\n• Strong React/JavaScript skills\n• Excellent remote communication abilities\n\n💰 What We Offer:\n• Competitive salary & benefits\n• Full remote flexibility\n• Growth opportunities`,
    url: "https://techcorp.com/careers/frontend-dev"
  },
  {
    id: 2,
    title: "Product Manager - SaaS",
    source: "StartupHub",
    status: "pending",
    originalContent: `StartupHub is seeking an experienced Product Manager to lead our SaaS product development. You will work closely with engineering, design, and sales teams to drive product strategy and execution. We need someone with 5+ years in product management, experience with B2B SaaS, and strong analytical skills.`,
    aiSummary: `🎯 Product Manager - SaaS at StartupHub\n\n🏢 Role Overview:\n• Lead SaaS product strategy & roadmap\n• Cross-functional collaboration with eng/design/sales\n• Drive product development from concept to launch\n\n🎯 Requirements:\n• 5+ years product management experience\n• B2B SaaS background preferred\n• Strong analytical & strategic thinking\n\n🌟 Join a fast-growing startup environment!`,
    url: "https://startuphub.com/careers/pm"
  }
];

export function ReviewAIDrafts() {
  const [selectedDraft, setSelectedDraft] = useState(drafts[0]);
  const [editedSummary, setEditedSummary] = useState(selectedDraft.aiSummary);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDraftChange = (index: number) => {
    setCurrentIndex(index);
    setSelectedDraft(drafts[index]);
    setEditedSummary(drafts[index].aiSummary);
  };

  const handleApprove = () => {
    console.log("Approved:", selectedDraft.title);
    // Move to next draft or handle approval logic
  };

  const handleReject = () => {
    console.log("Rejected:", selectedDraft.title);
    // Move to next draft or handle rejection logic
  };

  const handleRegenerate = (prompt: string) => {
    console.log("Regenerating with prompt:", prompt);
    // API call to regenerate content
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Review AI Drafts</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDraftChange(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} of {drafts.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDraftChange(Math.min(drafts.length - 1, currentIndex + 1))}
            disabled={currentIndex === drafts.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Draft Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{selectedDraft.title}</h3>
              <p className="text-sm text-gray-500">Source: {selectedDraft.source}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Pending Review</Badge>
              <Button variant="outline" size="sm" asChild>
                <a href={selectedDraft.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Original
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Original Scraped Content</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg h-80 overflow-y-auto">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {selectedDraft.originalContent}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5" />
              <span>AI-Generated Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              className="h-80 resize-none"
              placeholder="AI-generated summary will appear here..."
            />
          </CardContent>
        </Card>
      </div>

      {/* Regeneration Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Regeneration Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRegenerate("concise")}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Make More Concise</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRegenerate("simple")}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Simplify Language</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRegenerate("detailed")}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Add More Detail</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRegenerate("professional")}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>More Professional Tone</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Publish</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log("Save as draft")}
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Save as Draft</span>
              </Button>
            </div>
            <Button
              variant="destructive"
              onClick={handleReject}
              className="flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Reject</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
