import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Search, MessageSquare, BookOpen, BookCopy, BarChart, CheckCircle2, HelpCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("faq");
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  // FAQ data
  const faqCategories = [
    {
      id: "account",
      title: "Account & Profile",
      faqs: [
        {
          id: "create-account",
          question: "How do I create an account?",
          answer: "To create an account, click on the 'Sign Up' button at the top right of the page. Enter your email, choose a username and password, and you're all set! You can then customize your profile by adding a profile picture and bio."
        },
        {
          id: "forgot-password",
          question: "I forgot my password. How do I reset it?",
          answer: "On the login page, click 'Forgot Password?' and enter your email address. We'll send you a link to reset your password. If you don't receive the email, check your spam folder or contact our support team."
        },
        {
          id: "change-username",
          question: "Can I change my username?",
          answer: "Yes, you can change your username in your profile settings. Go to Profile > Edit Profile, enter a new username, and save your changes. Note that usernames must be unique."
        },
        {
          id: "delete-account",
          question: "How do I delete my account?",
          answer: "You can delete your account by going to Settings > Account > Delete Account. Please note that this action is permanent and will delete all your data, including your reading lists, reviews, and progress."
        }
      ]
    },
    {
      id: "books",
      title: "Books & Reading",
      faqs: [
        {
          id: "add-book",
          question: "How do I add books to my library?",
          answer: "You can add books to your library by clicking the '+ Add Book' button on the Library page. Enter the book details manually or search for a book title to automatically fill in the information."
        },
        {
          id: "track-progress",
          question: "How do I track my reading progress?",
          answer: "When viewing a book in your library, click 'Track Progress' to update your current page or percentage. You can also log reading sessions with the time spent reading and pages read to track your progress over time."
        },
        {
          id: "reading-goals",
          question: "How do reading goals work?",
          answer: "You can set annual reading goals by going to Statistics > Reading Goals. Set a target number of books to read for the year, and BookTrack will automatically update your progress as you mark books as completed."
        },
        {
          id: "collections",
          question: "What are collections and how do I use them?",
          answer: "Collections are a way to organize your books into groups. You can create collections for genres, themes, or any other category you prefer. To create a collection, go to Library > Collections > Create New Collection."
        }
      ]
    },
    {
      id: "reviews",
      title: "Reviews & Ratings",
      faqs: [
        {
          id: "write-review",
          question: "How do I write a book review?",
          answer: "To write a review, navigate to the book in your library, click on the book card, and select 'Add Review'. You can rate the book, write your thoughts, and add tags to categorize your review."
        },
        {
          id: "edit-review",
          question: "Can I edit or delete my reviews?",
          answer: "Yes, you can edit or delete your reviews at any time. Go to Reviews, find the review you want to modify, and click 'Edit' or 'Delete' from the menu options."
        },
        {
          id: "rating-system",
          question: "How does the rating system work?",
          answer: "BookTrack uses a 5-star rating system. You can rate books in half-star increments from 0.5 to 5 stars. The overall rating for a book is the average of all user ratings."
        }
      ]
    },
    {
      id: "technical",
      title: "Technical Help",
      faqs: [
        {
          id: "browser-support",
          question: "Which browsers are supported?",
          answer: "BookTrack works best on modern browsers like Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for the best experience."
        },
        {
          id: "mobile-app",
          question: "Is there a mobile app available?",
          answer: "Currently, BookTrack is available as a responsive web application that works well on mobile browsers. Dedicated iOS and Android apps are in development and will be released soon."
        },
        {
          id: "data-backup",
          question: "How can I back up my data?",
          answer: "Your data is automatically backed up to our secure servers. You can also export your library and reading history by going to Settings > Privacy > Download Your Data."
        },
        {
          id: "cookies",
          question: "How does BookTrack use cookies?",
          answer: "BookTrack uses cookies to remember your login status, preferences, and to provide a personalized experience. You can review our Cookie Policy for more details about how we use cookies."
        }
      ]
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0)
    : faqCategories;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactFormData);
    
    toast({
      title: "Message sent!",
      description: "We've received your message and will respond shortly.",
    });
    
    setContactFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
        <p className="text-muted-foreground mb-6">
          Find answers to common questions or contact our support team
        </p>
        
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for help..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setSearchQuery("")}
            >
              &times;
            </Button>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <button
            onClick={() => setActiveTab("faq")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "faq" 
                ? "bg-background text-foreground shadow-sm" 
                : ""
            }`}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQ
          </button>
          <button
            onClick={() => setActiveTab("guides")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "guides" 
                ? "bg-background text-foreground shadow-sm" 
                : ""
            }`}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Guides
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "contact" 
                ? "bg-background text-foreground shadow-sm" 
                : ""
            }`}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Us
          </button>
        </div>
      </div>

      {/* FAQ Tab */}
      {activeTab === "faq" && (
        <div className="space-y-8">
          {searchQuery && filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any FAQs matching "{searchQuery}"
              </p>
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            </div>
          ) : (
            filteredFaqs.map(category => (
              <div key={category.id}>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  {category.id === "account" && <HelpCircle className="mr-2 h-5 w-5" />}
                  {category.id === "books" && <BookCopy className="mr-2 h-5 w-5" />}
                  {category.id === "reviews" && <MessageSquare className="mr-2 h-5 w-5" />}
                  {category.id === "technical" && <BarChart className="mr-2 h-5 w-5" />}
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="mb-6">
                  {category.faqs.map(faq => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))
          )}
        </div>
      )}

      {/* Guides Tab */}
      {activeTab === "guides" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Getting Started",
              description: "Learn the basics of BookTrack and set up your account",
              icon: CheckCircle2,
              badge: "Beginner"
            },
            {
              title: "Managing Your Library",
              description: "Organize books, create collections, and customize your library",
              icon: BookCopy,
              badge: "Essential"
            },
            {
              title: "Tracking Reading Progress",
              description: "Log reading sessions and track your reading habits",
              icon: BarChart,
              badge: "Popular"
            },
            {
              title: "Writing Effective Reviews",
              description: "Tips for writing helpful and insightful book reviews",
              icon: MessageSquare,
              badge: "Tips"
            },
            {
              title: "Setting Reading Goals",
              description: "Create and achieve your yearly reading challenges",
              icon: CheckCircle2,
              badge: "Motivation"
            },
            {
              title: "Advanced Features",
              description: "Discover all the powerful features of BookTrack",
              icon: BookOpen,
              badge: "Advanced"
            }
          ].map((guide, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="bg-primary/10 p-4 flex items-center justify-center">
                <guide.icon className="h-12 w-12 text-primary" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <Badge variant="secondary">{guide.badge}</Badge>
                </div>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Read Guide</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contact Us Tab */}
      {activeTab === "contact" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have a question, suggestion, or just want to say hello? Fill out the form and our team will get back to you as soon as possible.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-sm text-muted-foreground">support@booktrack.example.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Support Hours</h3>
                  <p className="text-sm text-muted-foreground">Monday to Friday, 9am to 5pm ET</p>
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Support Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="response-time">
                    <AccordionTrigger>What's your typical response time?</AccordionTrigger>
                    <AccordionContent>
                      We aim to respond to all inquiries within 24 hours during business days.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="report-bug">
                    <AccordionTrigger>How do I report a bug?</AccordionTrigger>
                    <AccordionContent>
                      Please use the contact form and include detailed steps to reproduce the issue, along with screenshots if possible.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="feature-request">
                    <AccordionTrigger>Can I request a new feature?</AccordionTrigger>
                    <AccordionContent>
                      Absolutely! We love hearing your ideas. Please submit feature requests through the contact form.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>
                  We'll respond to your message as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={contactFormData.name}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={contactFormData.email}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="What's this about?"
                        value={contactFormData.subject}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="How can we help you?"
                        rows={6}
                        value={contactFormData.message}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}