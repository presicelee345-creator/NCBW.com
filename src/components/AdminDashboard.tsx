import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Download, Edit, Plus, Mail, FileText, Trash2, Save, GripVertical } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { trainingData, trackOrder } from "../data/trainingData";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { ReportsExample } from "./ReportsExample";
import { CertificateGenerator } from "./CertificateGenerator";
import { EmailTemplateManager } from "./EmailTemplateManager";
import { CustomReportBuilder } from "./CustomReportBuilder";

export function AdminDashboard() {
  const [selectedTrack, setSelectedTrack] = useState("president");
  const [reportFilter, setReportFilter] = useState("all");
  const [isEditingTrack, setIsEditingTrack] = useState(false);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<number | null>(null);

  // Email template state
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [currentEmailType, setCurrentEmailType] = useState<"welcome" | "weekly_reminder" | "individual_reminder" | "quiz_passed" | "certificate" | "at_risk">("individual_reminder");
  const [currentRecipient, setCurrentRecipient] = useState<{ name: string; email: string; track: string } | null>(null);
  const [isEditingEmailTemplate, setIsEditingEmailTemplate] = useState(false);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<"welcome" | "weekly_reminder" | "individual_reminder" | "quiz_passed" | "certificate" | "at_risk">("welcome");

  // Track editing state
  const [trackName, setTrackName] = useState("");
  const [trackDescription, setTrackDescription] = useState("");
  const [attributes, setAttributes] = useState<any[]>([]);

  // Quiz creation state
  const [quizTitle, setQuizTitle] = useState("");
  const [quizTrack, setQuizTrack] = useState("");
  const [quizDuration, setQuizDuration] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<any[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);

  // Certificate management state
  const [isManagingCertificates, setIsManagingCertificates] = useState(false);
  const [isEditingCertificate, setIsEditingCertificate] = useState(false);
  const [certificateTitle, setCertificateTitle] = useState("Certificate of Completion");
  const [certificateMessage, setCertificateMessage] = useState("For successfully completing the comprehensive leadership training program");
  const [certificateFooter, setCertificateFooter] = useState("Demonstrating dedication, knowledge, and commitment to excellence in leadership development");
  const [certificates, setCertificates] = useState([
    { id: 1, name: "Standard Leadership Certificate", track: "All Tracks", template: "default", createdDate: "Oct 15, 2025" },
    { id: 2, name: "President Track Certificate", track: "President", template: "gold", createdDate: "Oct 20, 2025" },
    { id: 3, name: "Treasurer Certification", track: "Treasurer", template: "default", createdDate: "Nov 1, 2025" },
  ]);

  // Mock trainee data
  const trainees = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", track: "President", progress: 65, lastActive: "2 hours ago", quizScores: [85, 90, 78] },
    { id: 2, name: "Maria Garcia", email: "maria.g@example.com", track: "Vice President", progress: 42, lastActive: "1 day ago", quizScores: [75, 82] },
    { id: 3, name: "Keisha Williams", email: "keisha.w@example.com", track: "Treasurer", progress: 78, lastActive: "3 hours ago", quizScores: [92, 88, 85, 90] },
    { id: 4, name: "Tamika Brown", email: "tamika.b@example.com", track: "President", progress: 30, lastActive: "2 days ago", quizScores: [70] },
    { id: 5, name: "Angela Davis", email: "angela.d@example.com", track: "Chaplain", progress: 55, lastActive: "5 hours ago", quizScores: [88, 92, 85] },
  ];

  const handleSendReminder = (traineeId: number) => {
    const trainee = trainees.find(t => t.id === traineeId);
    if (trainee) {
      setCurrentRecipient({ name: trainee.name, email: trainee.email, track: trainee.track });
      setCurrentEmailType("individual_reminder");
      setIsEmailDialogOpen(true);
    }
  };

  const handleSendWeeklyReminders = () => {
    setCurrentRecipient(null);
    setCurrentEmailType("weekly_reminder");
    setIsEmailDialogOpen(true);
  };

  const handleGenerateReport = () => {
    const filteredTrainees = reportFilter === "all" 
      ? trainees 
      : trainees.filter(t => t.progress < 100);

    const csvContent = [
      ["Name", "Email", "Track", "Progress (%)", "Last Active", "Avg Quiz Score"],
      ...filteredTrainees.map(t => [
        t.name,
        t.email,
        t.track,
        t.progress.toString(),
        t.lastActive,
        t.quizScores.length > 0 ? Math.round(t.quizScores.reduce((a, b) => a + b, 0) / t.quizScores.length).toString() : "N/A"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `training-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Report downloaded successfully!");
  };

  const handleOpenTrackEditor = () => {
    const track = trainingData[selectedTrack];
    setTrackName(track.name);
    setTrackDescription(track.description);
    setAttributes(JSON.parse(JSON.stringify(track.attributes)));
    setIsEditingTrack(true);
  };

  const handleSaveTrack = () => {
    toast.success(`Track "${trackName}" updated successfully!`);
    setIsEditingTrack(false);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, {
      title: "New Module",
      description: "Module description",
      courses: [],
      quiz: { title: "New Quiz", duration: "15 mins" }
    }]);
  };

  const handleDeleteAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAddCourse = (attrIndex: number) => {
    const newAttributes = [...attributes];
    newAttributes[attrIndex].courses.push({
      title: "New Course",
      platform: "LinkedIn Learning",
      duration: "30 mins"
    });
    setAttributes(newAttributes);
  };

  const handleDeleteCourse = (attrIndex: number, courseIndex: number) => {
    const newAttributes = [...attributes];
    newAttributes[attrIndex].courses = newAttributes[attrIndex].courses.filter((_: any, i: number) => i !== courseIndex);
    setAttributes(newAttributes);
  };

  const handleCreateQuiz = () => {
    setQuizTitle("");
    setQuizTrack("");
    setQuizDuration("");
    setQuizQuestions([
      { question: "", options: ["", "", "", ""], correctAnswer: 0 }
    ]);
    setIsCreatingQuiz(true);
  };

  const handleSaveQuiz = () => {
    toast.success(`Quiz "${quizTitle}" created successfully!`);
    setIsCreatingQuiz(false);
  };

  const handleAddQuestion = () => {
    setQuizQuestions([...quizQuestions, {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    }]);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };

  const handleCreateCertificate = () => {
    setCertificateTitle("Certificate of Completion");
    setCertificateMessage("For successfully completing the comprehensive leadership training program");
    setCertificateFooter("Demonstrating dedication, knowledge, and commitment to excellence in leadership development");
    setIsEditingCertificate(true);
  };

  const handleEditCertificate = (certId: number) => {
    const cert = certificates.find(c => c.id === certId);
    if (cert) {
      setCertificateTitle(cert.name);
      setIsEditingCertificate(true);
    }
  };

  const handleSaveCertificate = () => {
    toast.success(`Certificate "${certificateTitle}" saved successfully!`);
    setIsEditingCertificate(false);
  };

  const handleDeleteCertificate = (certId: number) => {
    setCertificates(certificates.filter(c => c.id !== certId));
    toast.success("Certificate deleted successfully!");
  };

  const handleEditEmailTemplate = (templateType: typeof selectedEmailTemplate) => {
    setSelectedEmailTemplate(templateType);
    setCurrentRecipient(null);
    setCurrentEmailType(templateType);
    setIsEmailDialogOpen(true);
  };

  const handleSendBulkEmail = (emailType: typeof currentEmailType) => {
    setCurrentRecipient(null);
    setCurrentEmailType(emailType);
    setIsEmailDialogOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl">Administrator Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage tracks, quizzes, trainees, and generate reports</p>
        </div>
      </div>

      <Tabs defaultValue="trainees" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="trainees">Trainees</TabsTrigger>
          <TabsTrigger value="tracks">Manage Tracks</TabsTrigger>
          <TabsTrigger value="quizzes">Manage Quizzes</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="trainees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trainee Progress Overview</CardTitle>
              <CardDescription>Monitor and manage all trainee progression and quiz scores</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Track</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Avg Quiz Score</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainees.map((trainee) => (
                    <TableRow key={trainee.id}>
                      <TableCell>{trainee.name}</TableCell>
                      <TableCell className="text-gray-600">{trainee.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{trainee.track}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#c6930a]"
                              style={{ width: `${trainee.progress}%` }}
                            />
                          </div>
                          <span className="text-sm">{trainee.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {trainee.quizScores.length > 0 ? (
                          <Badge className="bg-green-100 text-green-700">
                            {Math.round(trainee.quizScores.reduce((a, b) => a + b, 0) / trainee.quizScores.length)}%
                          </Badge>
                        ) : (
                          <span className="text-gray-400">No quizzes</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">{trainee.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendReminder(trainee.id)}
                            className="gap-1"
                          >
                            <Mail className="h-3 w-3" />
                            Remind
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Leadership Track Management</CardTitle>
                  <CardDescription>Edit track content, add modules, and manage courses</CardDescription>
                </div>
                <Button onClick={handleOpenTrackEditor} className="bg-[#c6930a] hover:bg-[#a37808] gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Selected Track
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Track to Edit</Label>
                <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {trackOrder.map((trackId) => (
                      <SelectItem key={trackId} value={trackId}>
                        {trainingData[trackId].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h3>{trainingData[selectedTrack].name}</h3>
                <p className="text-sm text-gray-600">{trainingData[selectedTrack].description}</p>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Modules:</span>
                    <p className="text-lg text-[#c6930a]">{trainingData[selectedTrack].attributes.length}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Total Courses:</span>
                    <p className="text-lg text-[#c6930a]">
                      {trainingData[selectedTrack].attributes.reduce((sum: number, attr: any) => sum + attr.courses.length, 0)}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Quizzes:</span>
                    <p className="text-lg text-[#c6930a]">{trainingData[selectedTrack].attributes.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Quiz Management</CardTitle>
                  <CardDescription>Create, edit, and manage training quizzes</CardDescription>
                </div>
                <Button onClick={handleCreateQuiz} className="bg-[#c6930a] hover:bg-[#a37808] gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Quiz
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trackOrder.map((trackId) => {
                  const track = trainingData[trackId];
                  return (
                    <div key={trackId} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4>{track.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {track.attributes.length} quizzes
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit Quizzes
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                Customize and send email templates to trainees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={handleSendWeeklyReminders}
                    className="bg-[#c6930a] hover:bg-[#a37808] gap-2 h-auto py-4"
                  >
                    <Mail className="h-5 w-5" />
                    <div className="text-left">
                      <div>Send Weekly Reminders</div>
                      <div className="text-xs opacity-90">Send to all active trainees</div>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => handleSendBulkEmail("at_risk")}
                    variant="outline"
                    className="gap-2 h-auto py-4"
                  >
                    <Mail className="h-5 w-5" />
                    <div className="text-left">
                      <div>Re-engage At-Risk Trainees</div>
                      <div className="text-xs text-gray-600">Send to inactive trainees</div>
                    </div>
                  </Button>
                </div>

                {/* Email Templates Section */}
                <div className="border-t pt-6">
                  <h3 className="mb-4">Email Templates</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View and customize email templates for different scenarios
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
                            Edit Template
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

                    {/* Weekly Reminder */}
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4>Weekly Reminder</h4>
                            <Badge variant="outline" className="text-xs">
                              Engagement
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            General weekly progress update for all active trainees
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditEmailTemplate("weekly_reminder")}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit Template
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

                    {/* Individual Reminder */}
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4>Individual Reminder</h4>
                            <Badge variant="outline" className="text-xs">
                              Follow-up
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Personalized reminder for individual trainees
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditEmailTemplate("individual_reminder")}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit Template
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Quiz Passed Notification */}
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4>Quiz Passed Notification</h4>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              Achievement
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Congratulatory email sent when trainee passes a quiz
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditEmailTemplate("quiz_passed")}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit Template
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
                            Edit Template
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* At-Risk Alert */}
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4>At-Risk Alert</h4>
                            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                              Re-engagement
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Sent to trainees who haven't been active recently
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditEmailTemplate("at_risk")}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit Template
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-[#c6930a] hover:bg-[#a37808]"
                            onClick={() => handleSendBulkEmail("at_risk")}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Send
                          </Button>
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

      {/* Track Editor Dialog */}
      <Dialog open={isEditingTrack} onOpenChange={setIsEditingTrack}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#c6930a]">Edit Leadership Track</DialogTitle>
            <DialogDescription>
              Modify track details, add/remove modules, and manage courses
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Track Name</Label>
              <Input value={trackName} onChange={(e) => setTrackName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Track Description</Label>
              <Textarea 
                value={trackDescription} 
                onChange={(e) => setTrackDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Training Modules</Label>
                <Button size="sm" onClick={handleAddAttribute} className="bg-[#c6930a] hover:bg-[#a37808]">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Module
                </Button>
              </div>

              {attributes.map((attr, attrIndex) => (
                <div key={attrIndex} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-2">
                      <Input 
                        value={attr.title}
                        onChange={(e) => {
                          const newAttrs = [...attributes];
                          newAttrs[attrIndex].title = e.target.value;
                          setAttributes(newAttrs);
                        }}
                        placeholder="Module title"
                      />
                      <Textarea 
                        value={attr.description}
                        onChange={(e) => {
                          const newAttrs = [...attributes];
                          newAttrs[attrIndex].description = e.target.value;
                          setAttributes(newAttrs);
                        }}
                        placeholder="Module description"
                        rows={2}
                      />
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteAttribute(attrIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Courses</Label>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleAddCourse(attrIndex)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Course
                      </Button>
                    </div>

                    {attr.courses.map((course: any, courseIndex: number) => (
                      <div key={courseIndex} className="flex gap-2 items-start bg-gray-50 p-2 rounded">
                        <div className="flex-1 space-y-2">
                          <Input 
                            value={course.title}
                            onChange={(e) => {
                              const newAttrs = [...attributes];
                              newAttrs[attrIndex].courses[courseIndex].title = e.target.value;
                              setAttributes(newAttrs);
                            }}
                            placeholder="Course title"
                            className="text-sm"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input 
                              value={course.platform}
                              onChange={(e) => {
                                const newAttrs = [...attributes];
                                newAttrs[attrIndex].courses[courseIndex].platform = e.target.value;
                                setAttributes(newAttrs);
                              }}
                              placeholder="Platform"
                              className="text-sm"
                            />
                            <Input 
                              value={course.duration}
                              onChange={(e) => {
                                const newAttrs = [...attributes];
                                newAttrs[attrIndex].courses[courseIndex].duration = e.target.value;
                                setAttributes(newAttrs);
                              }}
                              placeholder="Duration"
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteCourse(attrIndex, courseIndex)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingTrack(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTrack} className="bg-[#c6930a] hover:bg-[#a37808]">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Quiz Creator Dialog */}
      <Dialog open={isCreatingQuiz} onOpenChange={setIsCreatingQuiz}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#c6930a]">Create New Quiz</DialogTitle>
            <DialogDescription>
              Build a comprehensive quiz with multiple choice questions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Quiz Title</Label>
                <Input value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="e.g., Leadership Assessment" />
              </div>
              <div className="space-y-2">
                <Label>Track</Label>
                <Select value={quizTrack} onValueChange={setQuizTrack}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select track" />
                  </SelectTrigger>
                  <SelectContent>
                    {trackOrder.map((trackId) => (
                      <SelectItem key={trackId} value={trackId}>
                        {trainingData[trackId].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input value={quizDuration} onChange={(e) => setQuizDuration(e.target.value)} placeholder="e.g., 15 mins" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Questions</Label>
                <Button size="sm" onClick={handleAddQuestion} className="bg-[#c6930a] hover:bg-[#a37808]">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Question
                </Button>
              </div>

              {quizQuestions.map((question, qIndex) => (
                <div key={qIndex} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm">Question {qIndex + 1}</Label>
                        <Textarea 
                          value={question.question}
                          onChange={(e) => {
                            const newQuestions = [...quizQuestions];
                            newQuestions[qIndex].question = e.target.value;
                            setQuizQuestions(newQuestions);
                          }}
                          placeholder="Enter your question"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Answer Options</Label>
                        {question.options.map((option: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name={`correct-${qIndex}`}
                              checked={question.correctAnswer === optIndex}
                              onChange={() => {
                                const newQuestions = [...quizQuestions];
                                newQuestions[qIndex].correctAnswer = optIndex;
                                setQuizQuestions(newQuestions);
                              }}
                              className="text-[#c6930a]"
                            />
                            <Input 
                              value={option}
                              onChange={(e) => {
                                const newQuestions = [...quizQuestions];
                                newQuestions[qIndex].options[optIndex] = e.target.value;
                                setQuizQuestions(newQuestions);
                              }}
                              placeholder={`Option ${optIndex + 1}`}
                              className="text-sm"
                            />
                          </div>
                        ))}
                        <p className="text-xs text-gray-500">Select the correct answer using the radio button</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteQuestion(qIndex)}
                      className="text-red-600"
                      disabled={quizQuestions.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingQuiz(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuiz} className="bg-[#c6930a] hover:bg-[#a37808]">
              <Save className="h-4 w-4 mr-2" />
              Create Quiz
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