import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Download, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { adminApi } from "../utils/api";
import { ReportsExample } from "./ReportsExample";
import { CertificateGenerator } from "./CertificateGenerator";
import { EmailTemplateManager } from "./EmailTemplateManager";
import { CustomReportBuilder } from "./CustomReportBuilder";

interface AdminDashboardProps {
  accessToken: string;
}

export function AdminDashboard({ accessToken }: AdminDashboardProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [progressRecords, setProgressRecords] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  useEffect(() => {
    loadUsers();
    loadProgress();
  }, []);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await adminApi.getUsers(accessToken);
      if (response.success) {
        setUsers(response.users);
      }
    } catch (error: any) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadProgress = async () => {
    setIsLoadingProgress(true);
    try {
      const response = await adminApi.getReports(accessToken);
      if (response.success) {
        setProgressRecords(response.progressRecords);
      }
    } catch (error: any) {
      console.error("Failed to load progress:", error);
      toast.error("Failed to load progress");
    } finally {
      setIsLoadingProgress(false);
    }
  };

  const handleGenerateReport = () => {
    const csvContent = [
      ["User ID", "Email", "Track", "Progress (%)", "Completed Modules", "Started At"],
      ...progressRecords.map(p => {
        const user = users.find(u => u.id === p.userId);
        return [
          p.userId,
          user?.email || "N/A",
          p.trackId,
          p.overallProgress?.toString() || "0",
          p.completedModules?.length?.toString() || "0",
          new Date(p.startedAt).toLocaleDateString()
        ];
      })
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `training-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Report downloaded successfully!");
  };

  const getUserProgress = (userId: string) => {
    return progressRecords.filter(p => p.userId === userId);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl text-[#c6930a]">Administrator Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage users, view progress, and generate reports</p>
        </div>
      </div>

      <Tabs defaultValue="trainees" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100">
          <TabsTrigger value="trainees" className="data-[state=active]:bg-[#c6930a] data-[state=active]:text-white">
            Trainees
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-[#c6930a] data-[state=active]:text-white">
            Progress
          </TabsTrigger>
          <TabsTrigger value="certificates" className="data-[state=active]:bg-[#c6930a] data-[state=active]:text-white">
            Certificates
          </TabsTrigger>
          <TabsTrigger value="emails" className="data-[state=active]:bg-[#c6930a] data-[state=active]:text-white">
            Emails
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-[#c6930a] data-[state=active]:text-white">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trainees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#c6930a]">User Management</CardTitle>
              <CardDescription>View and manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#c6930a]" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Selected Track</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={user.role === 'admin' ? "bg-[#c6930a] text-white" : "bg-gray-200 text-gray-700"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {user.selectedTrack?.replace(/-/g, ' ') || 'Not selected'}
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[#c6930a]">Trainee Progress</CardTitle>
                <CardDescription>Monitor all trainee progression</CardDescription>
              </div>
              <Button onClick={handleGenerateReport} className="bg-[#c6930a] hover:bg-[#a07808] text-white">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingProgress ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#c6930a]" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Track</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Completed Modules</TableHead>
                      <TableHead>Started</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {progressRecords.map((record, idx) => {
                      const user = users.find(u => u.id === record.userId);
                      return (
                        <TableRow key={idx}>
                          <TableCell>
                            {user ? `${user.firstName} ${user.lastName}` : record.userId}
                          </TableCell>
                          <TableCell className="capitalize">
                            {record.trackId?.replace(/-/g, ' ')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 h-2 rounded-full max-w-[100px]">
                                <div 
                                  className="bg-[#c6930a] h-2 rounded-full" 
                                  style={{ width: `${record.overallProgress || 0}%` }}
                                />
                              </div>
                              <span className="text-sm">{record.overallProgress || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.completedModules?.length || 0} of 5
                          </TableCell>
                          <TableCell>
                            {new Date(record.startedAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Certificate Management</CardTitle>
                  <CardDescription>Create, edit, and customize certificates for different tracks</CardDescription>
                </div>
                <Button onClick={handleCreateCertificate} className="bg-[#c6930a] hover:bg-[#a37808] gap-2">
                  <Plus className="h-4 w-4" />
                  Create Certificate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4>{cert.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {cert.track}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Template: {cert.template} • Created: {cert.createdDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditCertificate(cert.id)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteCertificate(cert.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="mb-3">Certificate Preview & Customization</h3>
                <div className="mb-4">
                  <CertificateGenerator 
                    traineeName="[Trainee Name]" 
                    trackName="[Track Name]" 
                    completionDate="November 20, 2025"
                    showCustomization={true}
                  />
                </div>
                <div className="bg-gradient-to-br from-black to-gray-800 p-6 rounded-lg">
                  <div className="bg-white border-[12px] border-[#c6930a] rounded-lg p-8 text-center relative">
                    <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-[#c6930a] rounded-lg pointer-events-none"></div>
                    
                    <div className="text-4xl mb-2">👑</div>
                    <div className="text-base text-[#c6930a] tracking-wider mb-1">
                      NATIONAL COALITION OF 100 BLACK WOMEN
                    </div>
                    <div className="text-xs text-gray-600 mb-4">
                      Queen City Metropolitan Chapter
                    </div>
                    
                    <div className="text-2xl text-[#c6930a] tracking-widest mb-3">
                      CERTIFICATE OF COMPLETION
                    </div>
                    
                    <div className="text-xs text-gray-600 italic mb-2">
                      This certificate is proudly presented to
                    </div>
                    
                    <div className="text-2xl mb-4 underline decoration-[#c6930a] decoration-2 underline-offset-4">
                      [Trainee Name]
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      For successfully completing the comprehensive leadership training program
                    </div>
                    
                    <div className="text-lg text-[#c6930a] mb-4">
                      [Track Name]
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-4">
                      Demonstrating dedication, knowledge, and commitment to excellence in leadership development
                    </div>
                    
                    <div className="flex justify-around gap-4 mt-6 pt-4 border-t border-gray-300">
                      <div className="flex-1 text-xs text-gray-600">Administrator Signature</div>
                      <div className="flex-1 text-xs text-gray-600">Chapter President</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#c6930a]">Email Management</CardTitle>
              <CardDescription>
                Customize email templates for trainee communication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Email Templates Section */}
                <div>
                  <h3 className="mb-4">Email Templates</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View, preview, and customize email templates
                  </p>
                  
                  <div className="space-y-3">
                    {/* Welcome Email */}
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4>Welcome Email</h4>
                            <Badge variant="outline" className="text-xs">
                              Onboarding
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Sent when a trainee first enrolls in a leadership track
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditEmailTemplate("welcome")}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Preview & Edit
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-[#c6930a] hover:bg-[#a37808]"
                            onClick={() => handleSendBulkEmail("welcome")}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Weekly Reminder Email */}
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4>Weekly Reminder Email</h4>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Engagement
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Weekly progress update sent to all active trainees
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditEmailTemplate("weekly_reminder")}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Preview & Edit
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-[#c6930a] hover:bg-[#a37808]"
                            onClick={() => handleSendBulkEmail("weekly_reminder")}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Certificate Award */}
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4>Certificate Award</h4>
                            <Badge variant="outline" className="text-xs bg-[#c6930a]/10 text-[#c6930a] border-[#c6930a]/30">
                              Completion
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Sent when a trainee completes an entire leadership track
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditEmailTemplate("certificate")}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Preview & Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Previews Section */}
                <div className="border-t pt-6">
                  <h3 className="mb-3">Email Template Previews</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Visual preview of email templates as they appear to recipients
                  </p>
                  
                  <div className="space-y-6">
                    {/* Welcome Email Preview */}
                    <div>
                      <h4 className="text-sm mb-2">Welcome Email</h4>
                      <div className="border rounded-lg overflow-hidden bg-white">
                        <div className="bg-black p-4 text-center border-b-4 border-[#c6930a]">
                          <div className="text-2xl mb-1">👑</div>
                          <div className="text-[#c6930a] text-sm tracking-wider">NATIONAL COALITION OF 100 BLACK WOMEN</div>
                          <p className="text-gray-400 text-xs mt-1">Queen City Metropolitan Chapter</p>
                        </div>
                        <div className="p-4 bg-gray-50">
                          <div className="bg-white p-4 rounded text-xs">
                            <p className="mb-2"><strong>Subject:</strong> Welcome to [Track] - Let's Begin Your Leadership Journey! 🎉</p>
                            <p className="text-gray-600">Dear [Trainee Name],</p>
                            <p className="text-gray-600 mt-2">Congratulations on taking the first step toward becoming an exceptional leader...</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Weekly Reminder Email Preview */}
                    <div>
                      <h4 className="text-sm mb-2">Weekly Reminder Email</h4>
                      <div className="border rounded-lg overflow-hidden bg-white">
                        <div className="bg-black p-4 text-center border-b-4 border-[#c6930a]">
                          <div className="text-2xl mb-1">👑</div>
                          <div className="text-[#c6930a] text-sm tracking-wider">NATIONAL COALITION OF 100 BLACK WOMEN</div>
                          <p className="text-gray-400 text-xs mt-1">Queen City Metropolitan Chapter</p>
                        </div>
                        <div className="p-4 bg-gray-50">
                          <div className="bg-white p-4 rounded text-xs">
                            <p className="mb-2"><strong>Subject:</strong> Weekly Training Update - Continue Your Leadership Journey 📚</p>
                            <p className="text-gray-600">Dear Trainee,</p>
                            <p className="text-gray-600 mt-2">We hope you're enjoying your leadership training journey...</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Certificate Award Email Preview */}
                    <div>
                      <h4 className="text-sm mb-2">Certificate Award Email</h4>
                      <div className="border rounded-lg overflow-hidden bg-white">
                        <div className="bg-black p-4 text-center border-b-4 border-[#c6930a]">
                          <div className="text-2xl mb-1">👑</div>
                          <div className="text-[#c6930a] text-sm tracking-wider">NATIONAL COALITION OF 100 BLACK WOMEN</div>
                          <p className="text-gray-400 text-xs mt-1">Queen City Metropolitan Chapter</p>
                        </div>
                        <div className="p-4 bg-gray-50">
                          <div className="bg-white p-4 rounded text-xs">
                            <p className="mb-2"><strong>Subject:</strong> 🏆 Congratulations! You've Earned Your [Track] Certificate!</p>
                            <p className="text-gray-600">Dear [Trainee Name],</p>
                            <p className="text-gray-600 mt-2">We are absolutely thrilled to announce that you have successfully completed...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#c6930a]">Reports Dashboard</CardTitle>
              <CardDescription>
                View analytics, generate custom reports, and download comprehensive data exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="analytics" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="analytics">
                    📊 Analytics & Insights
                  </TabsTrigger>
                  <TabsTrigger value="custom">
                    📝 Custom Report Builder
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="analytics" className="space-y-6">
                  <ReportsExample />
                </TabsContent>

                <TabsContent value="custom" className="space-y-6">
                  <CustomReportBuilder />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Certificate Editor Dialog */}
      <Dialog open={isEditingCertificate} onOpenChange={setIsEditingCertificate}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#c6930a]">Certificate Editor</DialogTitle>
            <DialogDescription>
              Customize certificate content and styling
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Certificate Name</Label>
              <Input 
                value={certificateTitle} 
                onChange={(e) => setCertificateTitle(e.target.value)}
                placeholder="e.g., Leadership Excellence Certificate"
              />
            </div>

            <div className="space-y-2">
              <Label>Assigned Track</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select track" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tracks</SelectItem>
                  {trackOrder.map((trackId) => (
                    <SelectItem key={trackId} value={trackId}>
                      {trainingData[trackId].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Main Message</Label>
              <Textarea 
                value={certificateMessage}
                onChange={(e) => setCertificateMessage(e.target.value)}
                placeholder="Primary achievement message"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Footer Message</Label>
              <Textarea 
                value={certificateFooter}
                onChange={(e) => setCertificateFooter(e.target.value)}
                placeholder="Additional accomplishment details"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Certificate Template</Label>
              <Select defaultValue="default">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default - Gold & Black</SelectItem>
                  <SelectItem value="gold">Premium Gold</SelectItem>
                  <SelectItem value="elegant">Elegant Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm mb-2">Certificate Preview</h3>
              <div className="bg-gradient-to-br from-black to-gray-800 p-4 rounded">
                <div className="bg-white border-8 border-[#c6930a] rounded p-6 text-center text-xs relative">
                  <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#c6930a] rounded pointer-events-none"></div>
                  <div className="text-2xl mb-1">👑</div>
                  <div className="text-[#c6930a] text-xs tracking-wider mb-1">NCBW</div>
                  <div className="text-[#c6930a] tracking-widest mb-2">CERTIFICATE</div>
                  <div className="text-xs text-gray-600 mb-1">{certificateMessage}</div>
                  <div className="text-base mb-2 underline decoration-[#c6930a]">[Name]</div>
                  <div className="text-xs text-gray-600">{certificateFooter}</div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingCertificate(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCertificate} className="bg-[#c6930a] hover:bg-[#a37808]">
              <Save className="h-4 w-4 mr-2" />
              Save Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Template Manager Dialog */}
      <EmailTemplateManager 
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        emailType={currentEmailType}
        recipientName={currentRecipient?.name}
        recipientEmail={currentRecipient?.email}
        trackName={currentRecipient?.track}
      />
    </div>
  );
}