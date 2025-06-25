"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { 
  SearchIcon,
  BookOpenIcon,
  FolderIcon,
  TagIcon,
  ClockIcon,
  UserIcon,
  MoreVerticalIcon,
  StarIcon,
  DownloadIcon,
  ShareIcon,
  FileTextIcon,
  AlertTriangleIcon,
  BugIcon,
  ShieldAlertIcon,
  HelpCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon,
  PackageIcon,
  DollarSignIcon,
  PlusIcon,
  UploadIcon,
  SaveIcon,
  XIcon
} from "lucide-react"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useProjects } from '@/hooks/use-projects'

// Knowledge base items (existing)
const contextItems = [
  {
    id: 1,
    title: "AI Agent Development Guide",
    type: "Document",
    category: "Development",
    description: "Comprehensive guide for building and deploying AI agents with best practices and examples.",
    author: "Technical Team",
    lastModified: "2 hours ago",
    tags: ["AI", "Development", "Guide"],
    icon: FileTextIcon,
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Customer Support Workflows",
    type: "Folder",
    category: "Support",
    description: "Collection of support workflows, templates, and escalation procedures.",
    author: "Support Team",
    lastModified: "1 day ago",
    tags: ["Support", "Workflows", "Templates"],
    icon: FolderIcon,
    color: "bg-green-500"
  },
  {
    id: 3,
    title: "API Integration Handbook",
    type: "Document",
    category: "Technical",
    description: "Step-by-step instructions for integrating with third-party APIs and services.",
    author: "Engineering",
    lastModified: "3 days ago",
    tags: ["API", "Integration", "Technical"],
    icon: BookOpenIcon,
    color: "bg-purple-500"
  },
  {
    id: 4,
    title: "Training Data Guidelines",
    type: "Document",
    category: "AI/ML",
    description: "Best practices for collecting, cleaning, and preparing training data for AI models.",
    author: "Data Science",
    lastModified: "5 days ago",
    tags: ["Training", "Data", "ML"],
    icon: FileTextIcon,
    color: "bg-orange-500"
  },
  {
    id: 5,
    title: "Security Protocols",
    type: "Folder",
    category: "Security",
    description: "Security guidelines, protocols, and compliance documentation.",
    author: "Security Team",
    lastModified: "1 week ago",
    tags: ["Security", "Compliance", "Protocols"],
    icon: FolderIcon,
    color: "bg-red-500"
  },
  {
    id: 6,
    title: "User Experience Research",
    type: "Document",
    category: "UX",
    description: "User research findings, personas, and design recommendations.",
    author: "UX Team",
    lastModified: "1 week ago",
    tags: ["UX", "Research", "Design"],
    icon: BookOpenIcon,
    color: "bg-pink-500"
  }
]

// Inquiries data (similar to issues but for questions)
const inquiries = [
  {
    id: 1,
    title: "How to integrate custom webhooks with Slack notifications?",
    description: "User asking about setting up automated notifications from our platform to their Slack workspace",
    priority: "medium",
    askedBy: "Jennifer Walsh",
    timeAgo: "5 minutes ago",
    votes: 8,
    icon: HelpCircleIcon,
    bgColor: "bg-blue-500",
    status: "open",
    category: "Integration"
  },
  {
    id: 2,
    title: "Best practices for training AI with industry-specific terminology?",
    description: "Question about optimizing AI training for specialized vocabulary and domain knowledge",
    priority: "high",
    askedBy: "Robert Chen",
    timeAgo: "20 minutes ago",
    votes: 12,
    icon: HelpCircleIcon,
    bgColor: "bg-purple-500",
    status: "open",
    category: "AI Training"
  },
  {
    id: 3,
    title: "How to set up role-based access control for team members?",
    description: "Inquiry about configuring different permission levels for various team roles",
    priority: "medium",
    askedBy: "Lisa Anderson",
    timeAgo: "45 minutes ago",
    votes: 6,
    icon: HelpCircleIcon,
    bgColor: "bg-green-500",
    status: "answered",
    category: "Security"
  },
  {
    id: 4,
    title: "Can I use custom CSS to style the chat widget?",
    description: "Question about customization options for the embedded chat interface",
    priority: "low",
    askedBy: "Mark Thompson",
    timeAgo: "2 hours ago",
    votes: 4,
    icon: HelpCircleIcon,
    bgColor: "bg-orange-500",
    status: "answered",
    category: "Customization"
  },
  {
    id: 5,
    title: "What are the rate limits for API calls?",
    description: "Developer asking about API usage limits and best practices for handling rate limiting",
    priority: "medium",
    askedBy: "David Kim",
    timeAgo: "3 hours ago",
    votes: 9,
    icon: HelpCircleIcon,
    bgColor: "bg-indigo-500",
    status: "open",
    category: "API"
  }
]

// Issues data (from dashboard)
const issueReports = [
  {
    id: 1,
    title: "AI Response Delays During Peak Hours",
    description: "Multiple users reporting slow response times between 2-4 PM EST",
    priority: "high",
    reportedBy: "Sarah Chen",
    timeAgo: "2 minutes ago",
    reportCount: 12,
    icon: AlertTriangleIcon,
    bgColor: "bg-red-500",
    status: "investigating"
  },
  {
    id: 2,
    title: "Knowledge Base Sync Issues",
    description: "Documents not updating properly after upload",
    priority: "medium",
    reportedBy: "Mike Johnson",
    timeAgo: "15 minutes ago",
    reportCount: 8,
    icon: FolderIcon,
    bgColor: "bg-orange-500",
    status: "pending"
  },
  {
    id: 3,
    title: "Login Authentication Errors",
    description: "Google SSO failing for some enterprise users",
    priority: "medium",
    reportedBy: "Alex Rodriguez",
    timeAgo: "1 hour ago",
    reportCount: 5,
    icon: ShieldAlertIcon,
    bgColor: "bg-yellow-500",
    status: "pending"
  },
  {
    id: 4,
    title: "Mobile App Crashes on iOS 17",
    description: "App crashes when accessing chat history on latest iOS",
    priority: "low",
    reportedBy: "Emma Davis",
    timeAgo: "3 hours ago",
    reportCount: 3,
    icon: BugIcon,
    bgColor: "bg-blue-500",
    status: "pending"
  }
]

// Products data
const products = [
  {
    id: 1,
    name: "AI Chat Pro",
    price: 29.99,
    description: "Advanced AI chatbot with custom training capabilities and analytics dashboard.",
    category: "Software",
    status: "active",
    sales: 1247,
    rating: 4.8,
    lastUpdated: "2 days ago"
  },
  {
    id: 2,
    name: "Knowledge Base Starter",
    price: 9.99,
    description: "Essential knowledge management tools for small teams and startups.",
    category: "Software",
    status: "active",
    sales: 892,
    rating: 4.6,
    lastUpdated: "1 week ago"
  },
  {
    id: 3,
    name: "Enterprise AI Suite",
    price: 199.99,
    description: "Complete AI solution with advanced security, compliance, and integration features.",
    category: "Enterprise",
    status: "active",
    sales: 156,
    rating: 4.9,
    lastUpdated: "3 days ago"
  },
  {
    id: 4,
    name: "API Integration Pack",
    price: 49.99,
    description: "Pre-built integrations for popular services like Slack, Discord, and Microsoft Teams.",
    category: "Integration",
    status: "beta",
    sales: 234,
    rating: 4.4,
    lastUpdated: "5 days ago"
  },
  {
    id: 5,
    name: "Custom Training Module",
    price: 79.99,
    description: "Advanced AI training tools with custom datasets and fine-tuning capabilities.",
    category: "AI/ML",
    status: "active",
    sales: 445,
    rating: 4.7,
    lastUpdated: "1 day ago"
  }
]

export function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [activeTab, setActiveTab] = useState<'context' | 'issues' | 'products' | 'inquiries'>('context')
  const [isContextDialogOpen, setIsContextDialogOpen] = useState(false)
  const [isAddContextDialogOpen, setIsAddContextDialogOpen] = useState(false)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [contextForm, setContextForm] = useState({
    title: '',
    description: '',
    content: '',
    type: 'Document',
    tags: '',
    file: null as File | null
  })
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Software',
    file: null as File | null
  })
  const { projects, loading: projectsLoading } = useProjects()

  // Filter content based on active tab and search term
  const getFilteredContent = () => {
    switch (activeTab) {
      case 'context':
        return contextItems.filter(item => {
          const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
          return matchesSearch
        })
      case 'issues':
        return issueReports.filter(item => {
          const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               item.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
          return matchesSearch
        })
      case 'inquiries':
        return inquiries.filter(item => {
          const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               item.askedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               item.category.toLowerCase().includes(searchTerm.toLowerCase())
          return matchesSearch
        })
      case 'products':
        return products.filter(item => {
          const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               item.category.toLowerCase().includes(searchTerm.toLowerCase())
          return matchesSearch
        })
      default:
        return []
    }
  }

  const filteredContent = getFilteredContent()

  // Set first project as default when projects load
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id)
    }
  }, [projects, selectedProject])

  const currentProject = projects.find(p => p.id === selectedProject)

  const getStatusBadge = (status: string) => {
    if (status === 'investigating') {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
          Investigating
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20 text-xs">
        <div className="w-2 h-2 bg-gray-500 rounded-full mr-1"></div>
        Pending
      </Badge>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'medium':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
      case 'low':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getProductStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case 'beta':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
            <PendingIcon className="h-3 w-3 mr-1" />
            Beta
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20 text-xs">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        )
    }
  }

  const getInquiryStatusBadge = (status: string) => {
    switch (status) {
      case 'answered':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Answered
          </Badge>
        )
      case 'open':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
            <HelpCircleIcon className="h-3 w-3 mr-1" />
            Open
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20 text-xs">
            <PendingIcon className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const handleCreateContext = () => {
    // Validate required fields
    if (!contextForm.title || !contextForm.description) {
      console.log('Please fill in all required fields')
      return
    }

    // Log the context data (in a real app, this would be sent to the server)
    console.log('Creating context:', {
      ...contextForm,
      fileName: contextForm.file?.name || null,
      projectId: selectedProject
    })

    // Reset form and close dialog
    setContextForm({
      title: '',
      description: '',
      content: '',
      type: 'Document',
      tags: '',
      file: null
    })
    setIsAddContextDialogOpen(false)
    
    // Show success message (you can replace with actual toast notification)
    console.log('Context created successfully!')
  }

  const handleCreateProduct = () => {
    // Validate required fields
    if (!productForm.name || !productForm.price || !productForm.description) {
      console.log('Please fill in all required fields')
      return
    }

    // Log the product data (in a real app, this would be sent to the server)
    console.log('Creating product:', {
      ...productForm,
      fileName: productForm.file?.name || null,
      projectId: selectedProject
    })

    // Reset form and close dialog
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'Software',
      file: null
    })
    setIsProductDialogOpen(false)
    
    // Show success message (you can replace with actual toast notification)
    console.log('Product created successfully!')
  }

  const renderContextContent = () => (
    <div className="space-y-6">
      {/* Add Context Button */}
      <div className="flex justify-center">
        <Dialog open={isAddContextDialogOpen} onOpenChange={setIsAddContextDialogOpen}>
          <DialogTrigger asChild>
            <Card className="bg-sidebar-accent border-sidebar-border hover:border-sidebar-foreground/20 transition-all duration-200 cursor-pointer p-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-sidebar-foreground font-semibold mb-2">Add Context</h3>
                <p className="text-sidebar-foreground/70 text-sm">
                  Upload documents, add text content, or create knowledge sources
                </p>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Context Source</DialogTitle>
              <DialogDescription className="text-sidebar-foreground/70">
                Create a new context source with content and optional file upload
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="context-title">Title *</Label>
                <Input
                  id="context-title"
                  value={contextForm.title}
                  onChange={(e) => setContextForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter context title..."
                  className="bg-sidebar border-sidebar-border text-sidebar-foreground"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="context-type">Type</Label>
                  <Select value={contextForm.type} onValueChange={(value) => setContextForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="bg-sidebar border-sidebar-border text-sidebar-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Document">Document</SelectItem>
                      <SelectItem value="Folder">Folder</SelectItem>
                      <SelectItem value="URL">URL</SelectItem>
                      <SelectItem value="Text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="context-tags">Tags</Label>
                  <Input
                    id="context-tags"
                    value={contextForm.tags}
                    onChange={(e) => setContextForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="AI, Guide, Development"
                    className="bg-sidebar border-sidebar-border text-sidebar-foreground"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="context-description">Description *</Label>
                <Textarea
                  id="context-description"
                  value={contextForm.description}
                  onChange={(e) => setContextForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this context source..."
                  className="bg-sidebar border-sidebar-border text-sidebar-foreground min-h-[80px] resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="context-content">Content</Label>
                <Textarea
                  id="context-content"
                  value={contextForm.content}
                  onChange={(e) => setContextForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter text content or leave empty if uploading a file..."
                  className="bg-sidebar border-sidebar-border text-sidebar-foreground min-h-[120px] resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="context-file">File Upload (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="context-file"
                    type="file"
                    onChange={(e) => setContextForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    className="bg-sidebar border-sidebar-border text-sidebar-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sidebar-foreground file:text-sidebar hover:file:bg-sidebar-foreground/90"
                    accept=".txt,.pdf,.doc,.docx,.md"
                  />
                  {contextForm.file && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setContextForm(prev => ({ ...prev, file: null }))}
                      className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {contextForm.file && (
                  <p className="text-xs text-sidebar-foreground/60">
                    Selected: {contextForm.file.name}
                  </p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddContextDialogOpen(false)}
                className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateContext}
                disabled={!contextForm.title || !contextForm.description}
                className="bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
              >
                <SaveIcon className="h-4 w-4 mr-2" />
                Create Context
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Existing Context Items */}
      {filteredContent.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContent.map((item: any) => (
            <Card
              key={item.id}
              className="group bg-sidebar-accent border-sidebar-border hover:border-sidebar-foreground/20 transition-all duration-200 cursor-pointer p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`${item.color} p-2 rounded-lg flex-shrink-0`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sidebar-foreground font-semibold mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    <Badge variant="outline" className="text-xs bg-sidebar-foreground/10 text-sidebar-foreground/70 border-sidebar-foreground/20">
                      {item.type}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <StarIcon className="h-4 w-4 mr-2" />
                      Favorite
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ShareIcon className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sidebar-foreground/70 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-sidebar-foreground/5 text-sidebar-foreground/60 border-sidebar-foreground/10"
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-sidebar-foreground/60 pt-4 border-t border-sidebar-border">
                <div className="flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  <span>{item.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  <span>{item.lastModified}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderIssuesContent = () => (
    <div className="space-y-4">
      {filteredContent.map((issue: any) => (
        <Card
          key={issue.id}
          className="bg-sidebar-accent border-sidebar-border hover:bg-sidebar-accent/80 transition-colors cursor-pointer p-6"
        >
          <div className="flex items-start gap-4">
            <div className={`${issue.bgColor} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
              <issue.icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sidebar-foreground font-semibold text-lg line-clamp-1">
                  {issue.title}
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <Badge variant="outline" className={`text-xs ${getPriorityColor(issue.priority)}`}>
                    {issue.priority}
                  </Badge>
                  {getStatusBadge(issue.status)}
                </div>
              </div>
              <p className="text-sidebar-foreground/70 text-sm line-clamp-2 mb-4">
                {issue.description}
              </p>
              <div className="flex items-center justify-between text-sm text-sidebar-foreground/60">
                <span>Reported by {issue.reportedBy}</span>
                <div className="flex items-center gap-4">
                  <span>{issue.reportCount} reports</span>
                  <span>{issue.timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  const renderInquiriesContent = () => (
    <div className="space-y-4">
      {filteredContent.map((inquiry: any) => (
        <Card
          key={inquiry.id}
          className="bg-sidebar-accent border-sidebar-border hover:bg-sidebar-accent/80 transition-colors cursor-pointer p-6"
        >
          <div className="flex items-start gap-4">
            <div className={`${inquiry.bgColor} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
              <inquiry.icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sidebar-foreground font-semibold text-lg line-clamp-2 leading-relaxed">
                  {inquiry.title}
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <Badge variant="outline" className={`text-xs ${getPriorityColor(inquiry.priority)}`}>
                    {inquiry.priority}
                  </Badge>
                  {getInquiryStatusBadge(inquiry.status)}
                </div>
              </div>
              <p className="text-sidebar-foreground/70 text-sm line-clamp-2 mb-4">
                {inquiry.description}
              </p>
              <div className="flex items-center justify-between text-sm text-sidebar-foreground/60">
                <div className="flex items-center gap-4">
                  <span>Asked by {inquiry.askedBy}</span>
                  <Badge variant="outline" className="text-xs bg-sidebar-foreground/10 text-sidebar-foreground/70 border-sidebar-foreground/20">
                    {inquiry.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-3 w-3 text-yellow-500" />
                    <span>{inquiry.votes} votes</span>
                  </div>
                  <span>{inquiry.timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  const renderProductsContent = () => (
    <div className="space-y-6">
      {/* Add Product Button */}
      <div className="flex justify-center">
        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
          <DialogTrigger asChild>
            <Card className="bg-sidebar-accent border-sidebar-border hover:border-sidebar-foreground/20 transition-all duration-200 cursor-pointer p-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-sidebar-foreground font-semibold mb-2">Add Product</h3>
                <p className="text-sidebar-foreground/70 text-sm">
                  Create a new product listing with pricing and details
                </p>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription className="text-sidebar-foreground/70">
                Create a new product with pricing and description
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name *</Label>
                <Input
                  id="product-name"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name..."
                  className="bg-sidebar border-sidebar-border text-sidebar-foreground"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-price">Price *</Label>
                  <Input
                    id="product-price"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="bg-sidebar border-sidebar-border text-sidebar-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-category">Category</Label>
                  <Select value={productForm.category} onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-sidebar border-sidebar-border text-sidebar-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                      <SelectItem value="Integration">Integration</SelectItem>
                      <SelectItem value="AI/ML">AI/ML</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product-description">Description *</Label>
                <Textarea
                  id="product-description"
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your product..."
                  className="bg-sidebar border-sidebar-border text-sidebar-foreground min-h-[100px] resize-none"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsProductDialogOpen(false)}
                className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateProduct}
                disabled={!productForm.name || !productForm.price || !productForm.description}
                className="bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
              >
                <SaveIcon className="h-4 w-4 mr-2" />
                Create Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Existing Products */}
      {filteredContent.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContent.map((product: any) => (
            <Card
              key={product.id}
              className="group bg-sidebar-accent border-sidebar-border hover:border-sidebar-foreground/20 transition-all duration-200 cursor-pointer p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
                    <PackageIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sidebar-foreground font-semibold mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-500">${product.price}</span>
                      {getProductStatusBadge(product.status)}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <StarIcon className="h-4 w-4 mr-2" />
                      Edit Product
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ShareIcon className="h-4 w-4 mr-2" />
                      View Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Export Data
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sidebar-foreground/70 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* Product Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-sidebar-foreground/60">
                  <span>Sales</span>
                  <span className="font-medium text-sidebar-foreground">{product.sales.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-sidebar-foreground/60">
                  <span>Rating</span>
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="font-medium text-sidebar-foreground">{product.rating}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-sidebar-foreground/60 pt-4 border-t border-sidebar-border">
                <Badge variant="outline" className="text-xs bg-sidebar-foreground/10 text-sidebar-foreground/70 border-sidebar-foreground/20">
                  {product.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  <span>Updated {product.lastUpdated}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-medium text-white mb-2">
                    Data Library
                  </h1>
                  <p className="text-gray-400">
                    Manage knowledge sources and training data for your AI projects
                  </p>
                </div>
              </div>

              {/* Project Selector */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <label htmlFor="project-select" className="text-sidebar-foreground font-medium whitespace-nowrap">
                      Select Project:
                    </label>
                    <Select 
                      value={selectedProject} 
                      onValueChange={setSelectedProject}
                      disabled={projectsLoading || projects.length === 0}
                    >
                      <SelectTrigger className="w-64 bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
                        <SelectValue placeholder={projectsLoading ? "Loading projects..." : "Select a project"} />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {currentProject && (
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>RAG Storage: 0 B / 1.0 MB</span>
                      </div>
                      <Badge variant="outline" className="text-xs bg-sidebar-foreground/10 text-sidebar-foreground/70 border-sidebar-foreground/20">
                        {currentProject.plan.charAt(0).toUpperCase() + currentProject.plan.slice(1)} Plan
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sidebar-foreground/40" />
                  <Input
                    placeholder={`Search ${activeTab === 'context' ? 'context sources' : activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Content Type Toggle */}
            <div className="mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Button
                  variant={activeTab === 'context' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab('context')}
                  className={`whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'context'
                      ? "bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  Context
                </Button>
                <Button
                  variant={activeTab === 'issues' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab('issues')}
                  className={`whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'issues'
                      ? "bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  Issues
                </Button>
                <Button
                  variant={activeTab === 'inquiries' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab('inquiries')}
                  className={`whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'inquiries'
                      ? "bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  Inquiries
                </Button>
                <Button
                  variant={activeTab === 'products' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab('products')}
                  className={`whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'products'
                      ? "bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  Products
                </Button>
              </div>
            </div>

            {/* Main Content Area */}
            {!currentProject ? (
              <Card className="bg-sidebar-accent border-sidebar-border p-12">
                <div className="text-center">
                  <div className="bg-sidebar p-4 rounded-lg inline-block mb-4">
                    <BookOpenIcon className="h-12 w-12 text-sidebar-foreground/40 mx-auto" />
                  </div>
                  <h3 className="text-sidebar-foreground text-lg font-semibold mb-2">
                    {projectsLoading ? "Loading projects..." : "No projects found"}
                  </h3>
                  <p className="text-sidebar-foreground/70 mb-6">
                    {projectsLoading 
                      ? "Please wait while we load your projects."
                      : "Create a project first to manage its knowledge base."
                    }
                  </p>
                  {!projectsLoading && projects.length === 0 && (
                    <Button
                      onClick={() => {
                        window.history.pushState({}, '', '/dashboard/quick-create')
                        window.dispatchEvent(new PopStateEvent('popstate'))
                      }}
                      className="bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
                    >
                      Create Your First Project
                    </Button>
                  )}
                </div>
              </Card>
            ) : filteredContent.length === 0 ? (
              <Card className="bg-sidebar-accent border-sidebar-border p-12">
                <div className="text-center">
                  <div className="bg-sidebar p-4 rounded-lg inline-block mb-4">
                    {activeTab === 'context' && <BookOpenIcon className="h-12 w-12 text-sidebar-foreground/40 mx-auto" />}
                    {activeTab === 'issues' && <AlertTriangleIcon className="h-12 w-12 text-sidebar-foreground/40 mx-auto" />}
                    {activeTab === 'inquiries' && <HelpCircleIcon className="h-12 w-12 text-sidebar-foreground/40 mx-auto" />}
                    {activeTab === 'products' && <PackageIcon className="h-12 w-12 text-sidebar-foreground/40 mx-auto" />}
                  </div>
                  <h3 className="text-sidebar-foreground text-lg font-semibold mb-2">
                    No {activeTab === 'context' ? 'context sources' : activeTab} found
                  </h3>
                  <p className="text-sidebar-foreground/70 mb-6">
                    {searchTerm 
                      ? `No ${activeTab} match your search criteria.`
                      : `${currentProject.name} doesn't have any ${activeTab === 'context' ? 'context sources' : activeTab} yet.`
                    }
                  </p>
                  {!searchTerm && (
                    <p className="text-sidebar-foreground/60 text-sm">
                      {activeTab === 'context' && 'Context management features coming soon.'}
                      {activeTab === 'issues' && 'Issue tracking features coming soon.'}
                      {activeTab === 'inquiries' && 'Inquiry management features coming soon.'}
                      {activeTab === 'products' && 'Product management features coming soon.'}
                    </p>
                  )}
                </div>
              </Card>
            ) : (
              <>
                {activeTab === 'context' && renderContextContent()}
                {activeTab === 'issues' && renderIssuesContent()}
                {activeTab === 'inquiries' && renderInquiriesContent()}
                {activeTab === 'products' && renderProductsContent()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}