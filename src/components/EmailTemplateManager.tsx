import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface EmailTemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  emailType: "welcome" | "weekly_reminder" | "individual_reminder" | "quiz_passed" | "certificate" | "at_risk";
  recipientName?: string;
  recipientEmail?: string;
  trackName?: string;
}

export function EmailTemplateManager({ 
  isOpen, 
  onClose, 
  emailType: initialEmailType, 
  recipientName = "Trainee",
  recipientEmail = "",
  trackName = "Leadership Track"
}: EmailTemplateManagerProps) {
  const [emailType, setEmailType] = useState(initialEmailType);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [headerText, setHeaderText] = useState("National Coalition of 100 Black Women");
  const [subheaderText, setSubheaderText] = useState("Queen City Metropolitan Chapter");

  // Email templates
  const emailTemplates = {
    welcome: {
      subject: `Welcome to ${trackName} - Let's Begin Your Leadership Journey! 🎉`,
      body: `Dear ${recipientName},

Congratulations on taking the first step toward becoming an exceptional leader! We're thrilled to have you join our ${trackName}.

🎯 Your Training Program Details:
• Track: ${trackName}
• Total Modules: 5 comprehensive modules
• Estimated Duration: 6-8 weeks
• Quiz Pass Rate Required: 70% or higher

What You'll Learn:
1. Leadership & Strategic Visioning
2. Effective Communication & Public Speaking
3. Team Building & Delegation
4. Conflict Resolution & Mediation
5. Organizational Management & Oversight

✨ Getting Started:
Your first module is now available! Log in to the training portal to begin your journey.

We're here to support you every step of the way. If you have any questions, please don't hesitate to reach out.

Welcome aboard!

Best regards,
NC100BW Queen City Metropolitan Chapter Leadership Team`
    },
    weekly_reminder: {
      subject: `Weekly Training Update - Continue Your Leadership Journey 📚`,
      body: `Dear Trainee,

We hope you're enjoying your leadership training journey! This is your weekly reminder to continue making progress in your program.

📊 Quick Training Stats:
• Total Enrolled Trainees: 45
• Active This Week: 38
• Certificates Issued This Month: 12

🎯 This Week's Focus:
Continue working through your assigned modules and complete any pending quizzes. Remember, you need 70% or higher to unlock the next module.

💡 Training Tips:
• Set aside dedicated time each week for training
• Complete modules sequentially for the best learning experience
• Take notes during courses to prepare for quizzes
• Reach out if you need support or have questions

Keep up the great work! Your dedication to leadership development is making a difference.

Best regards,
NC100BW Queen City Metropolitan Chapter Leadership Team`
    },
    individual_reminder: {
      subject: `${recipientName}, Continue Your ${trackName} Journey 🌟`,
      body: `Dear ${recipientName},

We noticed it's been a while since your last activity in the ${trackName}. We wanted to check in and encourage you to continue your leadership development journey!

📈 Your Current Progress:
Your dedication matters, and we're here to support you in reaching your goals.

🎯 Next Steps:
• Log in to see your current module
• Complete any pending courses
• Take the module quiz when ready
• Unlock your next learning milestone

💬 Need Help?
If you're facing any challenges or have questions about the training material, please don't hesitate to reach out to our support team. We're here to help you succeed!

Remember: Leadership development is a journey, not a race. Take it at your own pace, but keep moving forward!

We believe in you! 🌟

Best regards,
NC100BW Queen City Metropolitan Chapter Leadership Team`
    },
    quiz_passed: {
      subject: `🎉 Congratulations! You Passed Your Quiz - ${trackName}`,
      body: `Dear ${recipientName},

Excellent work! You've successfully passed your module quiz!

✅ Quiz Results:
• Status: PASSED
• Required Score: 70%
• Module Completed: Ready for next module

🎯 What's Next:
Your next module is now unlocked! Continue building on this momentum and keep advancing through your leadership training.

💡 Keep It Up:
Your dedication and hard work are paying off. Each completed module brings you closer to earning your leadership certificate and developing essential skills for your role.

Ready to continue? Log in now to start your next module!

Congratulations again on this achievement! 🌟

Best regards,
NC100BW Queen City Metropolitan Chapter Leadership Team`
    },
    certificate: {
      subject: `🏆 Congratulations! You've Earned Your ${trackName} Certificate!`,
      body: `Dear ${recipientName},

We are absolutely thrilled to announce that you have successfully completed the ${trackName}!

🎓 Certificate Award:
This is a significant achievement that demonstrates your commitment to leadership excellence and professional development. Your certificate is now available for download in your training portal.

📊 Your Accomplishments:
• Completed all 5 modules
• Passed all quizzes with 70% or higher
• Demonstrated dedication and commitment
• Gained essential leadership skills

🌟 What This Means:
You are now certified in ${trackName} and have acquired the knowledge and skills necessary to excel in this leadership position. This certificate represents your hard work, dedication, and commitment to excellence.

📥 Download Your Certificate:
Log in to your training portal and navigate to the Certificates section to download your official certificate.

🎯 Continue Your Journey:
Consider exploring additional leadership tracks to further enhance your skills and broaden your leadership capabilities.

Congratulations on this remarkable achievement! We're proud to have you as part of our leadership community.

Best regards,
NC100BW Queen City Metropolitan Chapter Leadership Team`
    },
    at_risk: {
      subject: `${recipientName}, We Miss You! Let's Get Back on Track 🤝`,
      body: `Dear ${recipientName},

We noticed that you haven't been active in your ${trackName} recently, and we wanted to reach out to see how you're doing.

⚠️ Account Status:
Your account has been marked as "at risk" due to inactivity. We want to help you get back on track and complete your leadership training!

📊 Your Current Status:
We understand that life gets busy, and sometimes training takes a back seat. That's completely normal!

💬 How Can We Help?
• Are you facing technical difficulties?
• Do you need help understanding the material?
• Is the time commitment challenging?
• Would you benefit from a one-on-one support session?

🎯 Let's Reconnect:
We're here to support you! Please reply to this email or contact us to discuss how we can help you succeed. Your leadership development is important to us, and we don't want you to fall behind.

🌟 You've Got This:
Remember why you started this journey. The skills you're developing will benefit you, your organization, and your community. We believe in your potential!

Please log in this week and take one small step forward. Even completing one course can help build momentum!

We're rooting for you! 💪

Best regards,
NC100BW Queen City Metropolitan Chapter Leadership Team

P.S. If you need to pause or adjust your training schedule, please let us know. We're flexible and want to work with you!`
    }
  };

  // Initialize with template when dialog opens
  useEffect(() => {
    const template = emailTemplates[emailType];
    setSubject(template.subject);
    setBody(template.body);
  }, [emailType]);

  const handleEmailTypeChange = (newType: typeof emailType) => {
    setEmailType(newType);
    const template = emailTemplates[newType];
    setSubject(template.subject);
    setBody(template.body);
  };

  const handleSendEmail = () => {
    toast.success(recipientEmail 
      ? `Email sent to ${recipientEmail}!` 
      : "Emails sent successfully!"
    );
    onClose();
  };

  const handleResetTemplate = () => {
    const template = emailTemplates[emailType];
    setSubject(template.subject);
    setBody(template.body);
    toast.info("Template reset to default");
  };

  const getEmailTitle = () => {
    const titles = {
      welcome: "Welcome Email",
      weekly_reminder: "Weekly Reminder Email",
      individual_reminder: "Individual Reminder Email",
      quiz_passed: "Quiz Passed Notification",
      certificate: "Certificate Award Email",
      at_risk: "At-Risk Alert Email"
    };
    return titles[emailType];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#c6930a] flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {getEmailTitle()}
          </DialogTitle>
          <DialogDescription>
            Review and customize the email before sending
            {recipientEmail && ` to ${recipientEmail}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Email Type Selector - Only shown for bulk emails */}
          {!recipientEmail && (
            <div className="space-y-2 pb-4 border-b">
              <Label>Email Template Type</Label>
              <Select value={emailType} onValueChange={handleEmailTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">
                    Welcome Email - New trainee onboarding
                  </SelectItem>
                  <SelectItem value="weekly_reminder">
                    Weekly Reminder - General progress update
                  </SelectItem>
                  <SelectItem value="individual_reminder">
                    Individual Reminder - Encourage inactive trainees
                  </SelectItem>
                  <SelectItem value="quiz_passed">
                    Quiz Passed - Congratulate on achievement
                  </SelectItem>
                  <SelectItem value="certificate">
                    Certificate Award - Program completion
                  </SelectItem>
                  <SelectItem value="at_risk">
                    At-Risk Alert - Re-engage inactive trainees
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">
                Select which type of email to send to all trainees or a filtered group
              </p>
            </div>
          )}

          {/* Email Header Customization */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
            <div className="space-y-2">
              <Label className="text-sm">Email Header</Label>
              <Input 
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="Organization name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Email Subheader</Label>
              <Input 
                value={subheaderText}
                onChange={(e) => setSubheaderText(e.target.value)}
                placeholder="Chapter name"
              />
            </div>
          </div>

          {/* Email Preview */}
          <div className="space-y-4">
            <Label>Email Preview</Label>
            <div className="border rounded-lg overflow-hidden bg-white">
              {/* Email Header */}
              <div className="bg-black p-6 text-center border-b-4 border-[#c6930a]">
                <div className="text-4xl mb-2">👑</div>
                <h2 className="text-[#c6930a] text-2xl">{headerText}</h2>
                <p className="text-gray-400 text-sm mt-1">{subheaderText}</p>
              </div>

              {/* Email Content */}
              <div className="p-8 bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <div className="mb-6">
                    <Label className="text-sm text-gray-600">Subject Line</Label>
                    <Input 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600">Email Body</Label>
                    <Textarea 
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={20}
                      className="mt-2 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Email Footer */}
              <div className="bg-gray-800 p-6 text-center text-gray-400 text-xs">
                <p>© 2025 National Coalition of 100 Black Women - Queen City Metropolitan Chapter</p>
                <p className="mt-1">Leadership Training Portal</p>
              </div>
            </div>
          </div>

          {/* Recipient Info */}
          {recipientEmail && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm mb-2">📧 Recipient Information</h4>
              <div className="text-sm text-gray-700">
                <p><strong>Name:</strong> {recipientName}</p>
                <p><strong>Email:</strong> {recipientEmail}</p>
                {trackName && <p><strong>Track:</strong> {trackName}</p>}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleResetTemplate}>
            Reset to Default
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendEmail}
            className="bg-[#c6930a] hover:bg-[#a37808] gap-2"
          >
            <Send className="h-4 w-4" />
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}