import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Label } from "./ui/label";
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Award, 
  Clock, 
  Target,
  BookOpen,
  BarChart3,
  FileText,
  Calendar
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner@2.0.3";

export function ReportsExample() {
  const [selectedMonth, setSelectedMonth] = useState("november");
  const [selectedTrack, setSelectedTrack] = useState("all");

  // Overall Statistics
  const overallStats = {
    totalTrainees: 45,
    activeTrainees: 38,
    completedPrograms: 12,
    averageProgress: 58,
    averageQuizScore: 84,
    certificatesIssued: 12,
    totalModulesCompleted: 342,
    averageTimePerModule: "42 mins"
  };

  // Track-wise enrollment data
  const trackEnrollmentData = [
    { track: "President", enrolled: 8, active: 7, completed: 3, avgProgress: 65 },
    { track: "Vice President", enrolled: 6, active: 5, completed: 2, avgProgress: 58 },
    { track: "2nd VP", enrolled: 5, active: 4, completed: 1, avgProgress: 48 },
    { track: "3rd VP", enrolled: 4, active: 3, completed: 1, avgProgress: 42 },
    { track: "Treasurer", enrolled: 7, active: 6, completed: 2, avgProgress: 55 },
    { track: "Fin. Secretary", enrolled: 4, active: 3, completed: 1, avgProgress: 38 },
    { track: "Corr. Secretary", enrolled: 5, active: 5, completed: 1, avgProgress: 52 },
    { track: "Chaplain", enrolled: 3, active: 3, completed: 1, avgProgress: 61 },
    { track: "Parliamentarian", enrolled: 3, active: 2, completed: 0, avgProgress: 35 }
  ];

  // Progress over time data
  const progressOverTimeData = [
    { month: "Jul", avgProgress: 12, completions: 0 },
    { month: "Aug", avgProgress: 24, completions: 2 },
    { month: "Sep", avgProgress: 38, completions: 3 },
    { month: "Oct", avgProgress: 48, completions: 4 },
    { month: "Nov", avgProgress: 58, completions: 3 }
  ];

  // Quiz performance data
  const quizPerformanceData = [
    { name: "Leadership & Vision", avgScore: 88, passRate: 92, attempts: 38 },
    { name: "Communication", avgScore: 85, passRate: 87, attempts: 35 },
    { name: "Conflict Resolution", avgScore: 82, passRate: 84, attempts: 32 },
    { name: "Financial Management", avgScore: 79, passRate: 78, attempts: 28 },
    { name: "Strategic Planning", avgScore: 86, passRate: 89, attempts: 30 }
  ];

  // Engagement metrics
  const engagementData = [
    { name: "Highly Active", value: 18, color: "#16a34a" },
    { name: "Active", value: 20, color: "#c6930a" },
    { name: "At Risk", value: 5, color: "#ea580c" },
    { name: "Inactive", value: 2, color: "#dc2626" }
  ];

  // Top performing trainees
  const topPerformers = [
    { rank: 1, name: "Keisha Williams", track: "Treasurer", progress: 92, quizAvg: 94, modules: 23 },
    { rank: 2, name: "Sarah Johnson", track: "President", progress: 88, quizAvg: 92, modules: 22 },
    { rank: 3, name: "Angela Davis", track: "Chaplain", progress: 85, quizAvg: 91, modules: 21 },
    { rank: 4, name: "Michelle Robinson", track: "Vice President", progress: 82, quizAvg: 89, modules: 20 },
    { rank: 5, name: "Nicole Patterson", track: "Corr. Secretary", progress: 78, quizAvg: 88, modules: 19 }
  ];

  // At-risk trainees
  const atRiskTrainees = [
    { name: "Jennifer Martinez", track: "Parliamentarian", progress: 15, lastActive: "14 days ago", quizAvg: 65 },
    { name: "Lisa Thompson", track: "3rd VP", progress: 22, lastActive: "10 days ago", quizAvg: 68 },
    { name: "Donna Richards", track: "Fin. Secretary", progress: 28, lastActive: "8 days ago", quizAvg: 70 },
    { name: "Crystal Hayes", track: "2nd VP", progress: 32, lastActive: "7 days ago", quizAvg: 72 }
  ];

  // Module completion by track
  const moduleCompletionData = [
    { module: "Module 1", completed: 42, inProgress: 3 },
    { module: "Module 2", completed: 38, inProgress: 5 },
    { module: "Module 3", completed: 32, inProgress: 8 },
    { module: "Module 4", completed: 28, inProgress: 6 },
    { module: "Module 5", completed: 22, inProgress: 7 }
  ];

  // Recent activity
  const recentActivity = [
    { date: "Nov 6, 2025 - 2:30 PM", activity: "Keisha Williams completed 'Financial Management' quiz with 94%", type: "quiz" },
    { date: "Nov 6, 2025 - 1:15 PM", activity: "Sarah Johnson earned 'President Track' certificate", type: "certificate" },
    { date: "Nov 6, 2025 - 11:45 AM", activity: "Michelle Robinson completed Module 4 - Strategic Planning", type: "module" },
    { date: "Nov 5, 2025 - 4:20 PM", activity: "Angela Davis completed 'Leadership & Vision' quiz with 91%", type: "quiz" },
    { date: "Nov 5, 2025 - 3:10 PM", activity: "Nicole Patterson started Module 5 - Advanced Communication", type: "module" },
    { date: "Nov 5, 2025 - 2:05 PM", activity: "Maria Garcia earned 'Vice President Track' certificate", type: "certificate" }
  ];

  const handleDownloadReport = (reportType: string) => {
    toast.success(`${reportType} report downloaded successfully!`);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl">Training Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into trainee performance and program effectiveness</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="november">November 2025</SelectItem>
              <SelectItem value="october">October 2025</SelectItem>
              <SelectItem value="september">September 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#c6930a] hover:bg-[#a37808] gap-2">
            <Download className="h-4 w-4" />
            Export All Reports
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trainees</p>
                <p className="text-3xl mt-1">{overallStats.totalTrainees}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+8 this month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-3xl mt-1">{overallStats.averageProgress}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+10% from last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-[#c6930a]/20 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-[#c6930a]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certificates Issued</p>
                <p className="text-3xl mt-1">{overallStats.certificatesIssued}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+3 this month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Quiz Score</p>
                <p className="text-3xl mt-1">{overallStats.averageQuizScore}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+2% improvement</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tracks">Track Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
                <CardDescription>Average trainee progress and completion trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressOverTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgProgress" stroke="#c6930a" strokeWidth={2} name="Avg Progress %" />
                    <Line type="monotone" dataKey="completions" stroke="#16a34a" strokeWidth={2} name="Completions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trainee Engagement Status</CardTitle>
                <CardDescription>Distribution of trainee activity levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {engagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Module Completion Rates</CardTitle>
              <CardDescription>Number of trainees who completed each module</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moduleCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="module" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#16a34a" name="Completed" />
                  <Bar dataKey="inProgress" fill="#c6930a" name="In Progress" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Track Analytics Tab */}
        <TabsContent value="tracks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Track-Wise Performance</CardTitle>
                  <CardDescription>Enrollment, completion, and progress metrics by leadership track</CardDescription>
                </div>
                <Button 
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleDownloadReport("Track Analytics")}
                >
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leadership Track</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Avg Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trackEnrollmentData.map((track, index) => (
                    <TableRow key={index}>
                      <TableCell>{track.track}</TableCell>
                      <TableCell>{track.enrolled}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {track.active}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700">
                          {track.completed}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#c6930a]"
                              style={{ width: `${track.avgProgress}%` }}
                            />
                          </div>
                          <span className="text-sm">{track.avgProgress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {track.avgProgress >= 60 ? (
                          <Badge className="bg-green-100 text-green-700">On Track</Badge>
                        ) : track.avgProgress >= 40 ? (
                          <Badge className="bg-yellow-100 text-yellow-700">Moderate</Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-700">Needs Attention</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Track Enrollment Distribution</CardTitle>
              <CardDescription>Visual representation of trainee distribution across tracks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={trackEnrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="track" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrolled" fill="#3b82f6" name="Enrolled" />
                  <Bar dataKey="active" fill="#c6930a" name="Active" />
                  <Bar dataKey="completed" fill="#16a34a" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Trainees</CardTitle>
                <CardDescription>Highest achieving trainees based on progress and quiz scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((trainee) => (
                    <div key={trainee.rank} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#c6930a] text-white">
                        {trainee.rank}
                      </div>
                      <div className="flex-1">
                        <p>{trainee.name}</p>
                        <p className="text-sm text-gray-600">{trainee.track}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{trainee.progress}% Progress</p>
                        <p className="text-sm text-gray-600">{trainee.quizAvg}% Quiz Avg</p>
                      </div>
                      <Badge className="bg-[#c6930a] text-white">
                        {trainee.modules} modules
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>At-Risk Trainees</CardTitle>
                <CardDescription>Trainees requiring attention and support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {atRiskTrainees.map((trainee, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                      <div className="flex-1">
                        <p>{trainee.name}</p>
                        <p className="text-sm text-gray-600">{trainee.track}</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-sm">{trainee.progress}% Progress</p>
                        <p className="text-sm text-gray-600">Quiz: {trainee.quizAvg}%</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="bg-red-100 text-red-700">
                          {trainee.lastActive}
                        </Badge>
                        <Button size="sm" className="mt-2 bg-[#c6930a] hover:bg-[#a37808]">
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quiz Performance Analysis</CardTitle>
              <CardDescription>Average scores, pass rates, and attempts across all quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz Name</TableHead>
                    <TableHead>Total Attempts</TableHead>
                    <TableHead>Average Score</TableHead>
                    <TableHead>Pass Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizPerformanceData.map((quiz, index) => (
                    <TableRow key={index}>
                      <TableCell>{quiz.name}</TableCell>
                      <TableCell>{quiz.attempts}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={quiz.avgScore} className="w-24" />
                          <span>{quiz.avgScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={quiz.passRate >= 85 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                          {quiz.passRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {quiz.avgScore >= 85 ? (
                          <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                        ) : quiz.avgScore >= 75 ? (
                          <Badge className="bg-blue-100 text-blue-700">Good</Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-700">Needs Review</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 mx-auto text-[#c6930a] mb-2" />
                  <p className="text-sm text-gray-600">Total Modules Completed</p>
                  <p className="text-3xl mt-1">{overallStats.totalModulesCompleted}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Avg Time per Module</p>
                  <p className="text-3xl mt-1">{overallStats.averageTimePerModule}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Active This Week</p>
                  <p className="text-3xl mt-1">{overallStats.activeTrainees}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
              <CardDescription>Detailed view of trainee activity levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engagementData.map((segment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        />
                        <span>{segment.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {segment.value} trainees ({Math.round((segment.value / overallStats.totalTrainees) * 100)}%)
                      </span>
                    </div>
                    <Progress 
                      value={(segment.value / overallStats.totalTrainees) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <h4>Activity Definitions</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700">Highly Active</p>
                    <p className="text-gray-600 mt-1">Active within 24 hours, 75%+ progress</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-yellow-700">Active</p>
                    <p className="text-gray-600 mt-1">Active within 3 days, 40-75% progress</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-orange-700">At Risk</p>
                    <p className="text-gray-600 mt-1">Inactive 4-7 days or &lt;40% progress</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-red-700">Inactive</p>
                    <p className="text-gray-600 mt-1">No activity for 7+ days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed Reports Tab */}
        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Detailed Reports</CardTitle>
              <CardDescription>Generate and download comprehensive reports for specific needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 hover:bg-gray-50 space-y-3">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-[#c6930a] mt-1" />
                    <div className="flex-1">
                      <h4>Complete Trainee Progress Report</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Includes: Name, email, track, progress %, quiz scores, modules completed, last active date, time spent
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-[#c6930a] hover:bg-[#a37808] gap-2"
                    onClick={() => handleDownloadReport("Complete Trainee Progress")}
                  >
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                </div>

                <div className="border rounded-lg p-4 hover:bg-gray-50 space-y-3">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h4>Quiz Performance Analysis</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Includes: Quiz name, track, average score, pass rate, number of attempts, question-level analytics
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-[#c6930a] hover:bg-[#a37808] gap-2"
                    onClick={() => handleDownloadReport("Quiz Performance Analysis")}
                  >
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                </div>

                <div className="border rounded-lg p-4 hover:bg-gray-50 space-y-3">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-green-600 mt-1" />
                    <div className="flex-1">
                      <h4>Track Completion Summary</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Includes: Track name, enrolled count, completion rate, average time to complete, dropout rate
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-[#c6930a] hover:bg-[#a37808] gap-2"
                    onClick={() => handleDownloadReport("Track Completion Summary")}
                  >
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                </div>

                <div className="border rounded-lg p-4 hover:bg-gray-50 space-y-3">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <h4>Certificate Issuance Log</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Includes: Trainee name, track, certificate ID, issue date, completion time, final quiz score
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-[#c6930a] hover:bg-[#a37808] gap-2"
                    onClick={() => handleDownloadReport("Certificate Issuance Log")}
                  >
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                </div>

                <div className="border rounded-lg p-4 hover:bg-gray-50 space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-orange-600 mt-1" />
                    <div className="flex-1">
                      <h4>At-Risk Trainees Report</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Includes: Trainees with &lt;40% progress or inactive 7+ days, recommended interventions
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-[#c6930a] hover:bg-[#a37808] gap-2"
                    onClick={() => handleDownloadReport("At-Risk Trainees")}
                  >
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                </div>

                <div className="border rounded-lg p-4 hover:bg-gray-50 space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-pink-600 mt-1" />
                    <div className="flex-1">
                      <h4>Monthly Activity Report</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Includes: Month-over-month progress, new enrollments, completions, engagement metrics
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-[#c6930a] hover:bg-[#a37808] gap-2"
                    onClick={() => handleDownloadReport("Monthly Activity")}
                  >
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Create a customized report with specific fields and filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Track</Label>
                  <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tracks</SelectItem>
                      <SelectItem value="president">President</SelectItem>
                      <SelectItem value="vice-president">Vice President</SelectItem>
                      <SelectItem value="treasurer">Treasurer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Include Fields</Label>
                <div className="grid grid-cols-3 gap-3 p-4 border rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Progress %</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Quiz Scores</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Last Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Time Spent</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Modules Completed</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Certificates</span>
                  </label>
                </div>
              </div>

              <Button className="w-full bg-[#c6930a] hover:bg-[#a37808] gap-2">
                <Download className="h-4 w-4" />
                Generate Custom Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Training Activity</CardTitle>
              <CardDescription>Real-time feed of trainee accomplishments and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      activity.type === 'quiz' ? 'bg-purple-100' :
                      activity.type === 'certificate' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.type === 'quiz' && <BarChart3 className="h-5 w-5 text-purple-600" />}
                      {activity.type === 'certificate' && <Award className="h-5 w-5 text-green-600" />}
                      {activity.type === 'module' && <BookOpen className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p>{activity.activity}</p>
                      <p className="text-sm text-gray-600 mt-1">{activity.date}</p>
                    </div>
                    <Badge variant="outline">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}