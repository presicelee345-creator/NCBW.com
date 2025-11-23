import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Mail, Award, AlertCircle, PartyPopper, BookOpen, Clock } from "lucide-react";

export function EmailExample() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl">Email Notifications Examples</h1>
        <p className="text-gray-600 mt-1">Preview of automated emails sent to trainees throughout their learning journey</p>
      </div>

      <Tabs defaultValue="welcome" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
          <TabsTrigger value="reminder">Weekly Reminder</TabsTrigger>
          <TabsTrigger value="individual">Individual Reminder</TabsTrigger>
          <TabsTrigger value="quiz">Quiz Passed</TabsTrigger>
          <TabsTrigger value="certificate">Certificate</TabsTrigger>
          <TabsTrigger value="atrisk">At-Risk Alert</TabsTrigger>
        </TabsList>

        {/* Welcome Email */}
        <TabsContent value="welcome">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#c6930a]" />
                <CardTitle>Welcome Email</CardTitle>
              </div>
              <CardDescription>Sent when a trainee first enrolls in the training program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg overflow-hidden">
                {/* Email Header */}
                <div className="bg-black p-6 text-center border-b-4 border-[#c6930a]">
                  <div className="text-4xl mb-2">👑</div>
                  <h2 className="text-[#c6930a] text-2xl">National Coalition of 100 Black Women</h2>
                  <p className="text-gray-400 text-sm mt-1">Queen City Metropolitan Chapter</p>
                </div>

                {/* Email Body */}
                <div className="p-8 bg-gray-50">
                  <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
                    <h3 className="text-2xl mb-4">Welcome to Your Leadership Journey, Sarah! 🎉</h3>
                    
                    <p className="text-gray-700 mb-4">
                      Congratulations on taking the first step toward becoming an exceptional leader! We're thrilled to have you join our 
                      <span className="text-[#c6930a]"> President Leadership Track</span>.
                    </p>

                    <div className="bg-[#c6930a]/10 border-l-4 border-[#c6930a] p-4 mb-6">
                      <h4 className="mb-2">🎯 Your Training Program Details</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li><strong>Track:</strong> President Leadership Track</li>
                        <li><strong>Total Modules:</strong> 5 comprehensive modules</li>
                        <li><strong>Estimated Duration:</strong> 6-8 weeks</li>
                        <li><strong>Quiz Pass Rate Required:</strong> 70% or higher</li>
                      </ul>
                    </div>

                    <h4 className="mb-3">What You'll Learn:</h4>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-[#c6930a] text-white flex items-center justify-center text-sm flex-shrink-0">1</div>
                        <div>
                          <p className="text-sm">Leadership & Strategic Visioning</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-[#c6930a] text-white flex items-center justify-center text-sm flex-shrink-0">2</div>
                        <div>
                          <p className="text-sm">Effective Communication & Public Speaking</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-[#c6930a] text-white flex items-center justify-center text-sm flex-shrink-0">3</div>
                        <div>
                          <p className="text-sm">Team Building & Delegation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-[#c6930a] text-white flex items-center justify-center text-sm flex-shrink-0">4</div>
                        <div>
                          <p className="text-sm">Conflict Resolution & Mediation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-[#c6930a] text-white flex items-center justify-center text-sm flex-shrink-0">5</div>
                        <div>
                          <p className="text-sm">Organizational Management & Oversight</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <h4 className="text-green-800 mb-2">✨ Getting Started</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Your first module is now available! Log in to the training portal to begin your journey.
                      </p>
                      <a href="#" className="inline-block bg-[#c6930a] text-white px-6 py-3 rounded-lg hover:bg-[#a37808] transition-colors">
                        Access Your Dashboard
                      </a>
                    </div>

                    <div className="border-t pt-6 mt-6">
                      <h4 className="mb-3">📚 Important Information:</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Complete modules sequentially - each builds on the previous one</li>
                        <li>• Score 70% or higher on module quizzes to unlock the next module</li>
                        <li>• You can retake quizzes if needed</li>
                        <li>• Track your progress anytime in your dashboard</li>
                        <li>• Upon completion, you'll receive a certificate of achievement</li>
                      </ul>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4 mt-6">
                      <p className="text-sm text-gray-700">
                        <strong>Need Help?</strong> Contact our training administrator at 
                        <a href="mailto:training@ncbwqcmc.org" className="text-[#c6930a] ml-1">training@ncbwqcmc.org</a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Footer */}
                <div className="bg-black p-6 text-center">
                  <p className="text-gray-400 text-sm">
                    National Coalition of 100 Black Women - Queen City Metropolitan Chapter
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    This is an automated message from the NCBW Leadership Training Portal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weekly Reminder Email */}
        <TabsContent value="reminder">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <CardTitle>Weekly Reminder Email</CardTitle>
              </div>
              <CardDescription>Sent every Monday to trainees with incomplete courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg overflow-hidden">
                {/* Email Header */}
                <div className="bg-black p-6 text-center border-b-4 border-[#c6930a]">
                  <div className="text-4xl mb-2">👑</div>
                  <h2 className="text-[#c6930a] text-2xl">NCBW Training Portal</h2>
                  <p className="text-gray-400 text-sm mt-1">Weekly Progress Update</p>
                </div>

                {/* Email Body */}
                <div className="p-8 bg-gray-50">
                  <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
                    <h3 className="text-2xl mb-4">Keep Up the Great Work! 💪</h3>
                    
                    <p className="text-gray-700 mb-6">
                      Hi Sarah,
                    </p>

                    <p className="text-gray-700 mb-6">
                      This is your weekly reminder to continue your leadership training journey. You're making excellent progress, 
                      and we want to help you stay on track!
                    </p>

                    <div className="bg-[#c6930a]/10 border-l-4 border-[#c6930a] p-6 mb-6">
                      <h4 className="text-xl mb-4">📊 Your Current Progress</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Overall Completion</span>
                            <span className="text-sm">65%</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#c6930a] rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                          <div className="text-center">
                            <p className="text-2xl text-[#c6930a]">3</p>
                            <p className="text-xs text-gray-600">Modules Completed</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl text-blue-600">2</p>
                            <p className="text-xs text-gray-600">Modules Remaining</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl text-green-600">87%</p>
                            <p className="text-xs text-gray-600">Avg Quiz Score</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h4 className="text-blue-800 mb-3">📖 Next Up: Module 4</h4>
                      <p className="mb-2">Conflict Resolution & Mediation</p>
                      <p className="text-sm text-gray-700 mb-4">
                        You passed Module 3 with an excellent score of 85%! Module 4 is now unlocked and ready for you.
                      </p>
                      <a href="#" className="inline-block bg-[#c6930a] text-white px-6 py-3 rounded-lg hover:bg-[#a37808] transition-colors">
                        Continue Learning
                      </a>
                    </div>

                    <div className="border-t pt-6 mt-6">
                      <h4 className="mb-3">🎯 This Week's Goal:</h4>
                      <p className="text-sm text-gray-700 mb-4">
                        Complete Module 4: Conflict Resolution & Mediation. This module includes 3 courses and a final assessment.
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Estimated Time:</strong> 2-3 hours
                      </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                      <p className="text-sm text-green-800">
                        💡 <strong>Tip:</strong> Set aside dedicated time this week to complete your next module. 
                        Consistency is key to achieving your leadership goals!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Footer */}
                <div className="bg-black p-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Questions? Reply to this email or contact training@ncbwqcmc.org
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    You're receiving this because you're enrolled in NCBW Leadership Training
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual Reminder Email */}
        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-orange-600" />
                <CardTitle>Individual Reminder Email</CardTitle>
              </div>
              <CardDescription>Sent by admin to specific trainees who need encouragement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg overflow-hidden">
                {/* Email Header */}
                <div className="bg-black p-6 text-center border-b-4 border-[#c6930a]">
                  <div className="text-4xl mb-2">👑</div>
                  <h2 className="text-[#c6930a] text-2xl">NCBW Training Portal</h2>
                </div>

                {/* Email Body */}
                <div className="p-8 bg-gray-50">
                  <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
                    <h3 className="text-2xl mb-4">We're Here to Support You! 🤝</h3>
                    
                    <p className="text-gray-700 mb-4">
                      Hi Maria,
                    </p>

                    <p className="text-gray-700 mb-6">
                      We noticed you haven't logged into the training portal in a while, and we wanted to check in with you. 
                      Your leadership development is important to us, and we're here to help you succeed!
                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                      <p className="text-sm text-gray-700">
                        <strong>Last Activity:</strong> 10 days ago<br />
                        <strong>Current Progress:</strong> 42% complete
                      </p>
                    </div>

                    <h4 className="mb-3">We understand life gets busy! Here's what we can do to help:</h4>
                    <ul className="space-y-2 text-sm text-gray-700 mb-6">
                      <li>✓ Extend your completion deadline if needed</li>
                      <li>✓ Provide one-on-one support or mentorship</li>
                      <li>✓ Answer any questions about course content</li>
                      <li>✓ Help you create a personalized study schedule</li>
                    </ul>

                    <div className="bg-[#c6930a]/10 border border-[#c6930a] rounded-lg p-4 mb-6">
                      <h4 className="mb-2">🎯 Your Progress So Far:</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        You've completed 2 out of 5 modules with an average quiz score of 82%. That's excellent work!
                      </p>
                      <p className="text-sm text-gray-700">
                        You're so close to unlocking Module 3. Let's keep that momentum going!
                      </p>
                    </div>

                    <div className="text-center bg-gradient-to-r from-[#c6930a]/20 to-black/5 rounded-lg p-6 mb-6">
                      <p className="mb-4">Ready to continue your journey?</p>
                      <a href="#" className="inline-block bg-[#c6930a] text-white px-8 py-3 rounded-lg hover:bg-[#a37808] transition-colors">
                        Resume Training
                      </a>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong>Need to talk?</strong> We're always here to help. Reply to this email or call us at (555) 123-4567.
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 mt-6 italic">
                      "The only impossible journey is the one you never begin." - We believe in you! 💫
                    </p>
                  </div>
                </div>

                {/* Email Footer */}
                <div className="bg-black p-6 text-center">
                  <p className="text-gray-400 text-sm">
                    National Coalition of 100 Black Women - Queen City Metropolitan Chapter
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Passed Email */}
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PartyPopper className="h-5 w-5 text-green-600" />
                <CardTitle>Quiz Passed Email</CardTitle>
              </div>
              <CardDescription>Sent when a trainee successfully passes a module quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg overflow-hidden">
                {/* Email Header */}
                <div className="bg-gradient-to-r from-black to-[#c6930a]/20 p-6 text-center border-b-4 border-green-500">
                  <div className="text-5xl mb-2">🎉</div>
                  <h2 className="text-[#c6930a] text-2xl">Congratulations!</h2>
                </div>

                {/* Email Body */}
                <div className="p-8 bg-gray-50">
                  <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
                    <h3 className="text-2xl mb-4 text-center">You Passed! 🌟</h3>
                    
                    <p className="text-gray-700 mb-6 text-center">
                      Excellent work, Keisha!
                    </p>

                    <div className="bg-gradient-to-br from-green-50 to-[#c6930a]/10 border-2 border-green-500 rounded-lg p-6 mb-6 text-center">
                      <h4 className="text-xl mb-4">Module 4 Quiz Results</h4>
                      <div className="text-5xl text-green-600 mb-2">94%</div>
                      <p className="text-lg mb-4">Conflict Resolution & Mediation Assessment</p>
                      <Badge className="bg-green-600 text-white px-4 py-2 text-base">PASSED ✓</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Questions Correct</p>
                        <p className="text-2xl text-[#c6930a]">17/18</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Time Taken</p>
                        <p className="text-2xl text-[#c6930a]">12 min</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Attempt</p>
                        <p className="text-2xl text-[#c6930a]">1st</p>
                      </div>
                    </div>

                    <div className="bg-[#c6930a]/10 border-l-4 border-[#c6930a] p-6 mb-6">
                      <h4 className="mb-3">🎯 What's Next?</h4>
                      <p className="text-sm text-gray-700 mb-4">
                        You've unlocked <strong>Module 5: Organizational Management & Oversight</strong>
                      </p>
                      <p className="text-sm text-gray-700 mb-4">
                        This is your final module! Complete it to earn your President Leadership Track certificate.
                      </p>
                      <a href="#" className="inline-block bg-[#c6930a] text-white px-6 py-3 rounded-lg hover:bg-[#a37808] transition-colors">
                        Start Module 5
                      </a>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        📊 <strong>Overall Progress:</strong> You're now 80% complete with your leadership training! 
                        You've completed 4 out of 5 modules with an outstanding average quiz score of 92%.
                      </p>
                    </div>

                    <p className="text-center text-gray-600 mt-6 italic">
                      "Excellence is not a destination; it is a continuous journey that never ends." - Keep going! 🚀
                    </p>
                  </div>
                </div>

                {/* Email Footer */}
                <div className="bg-black p-6 text-center">
                  <p className="text-gray-400 text-sm">
                    NCBW Leadership Training Portal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificate Email */}
        <TabsContent value="certificate">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#c6930a]" />
                <CardTitle>Certificate Award Email</CardTitle>
              </div>
              <CardDescription>Sent when a trainee completes all modules and earns their certificate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg overflow-hidden">
                {/* Email Header */}
                <div className="bg-gradient-to-r from-black via-[#c6930a]/30 to-black p-8 text-center border-b-4 border-[#c6930a]">
                  <div className="text-6xl mb-3">🏆</div>
                  <h2 className="text-[#c6930a] text-3xl mb-2">Achievement Unlocked!</h2>
                  <p className="text-gray-300">You've Earned Your Leadership Certificate</p>
                </div>

                {/* Email Body */}
                <div className="p-8 bg-gray-50">
                  <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
                    <h3 className="text-3xl mb-4 text-center">Congratulations, Sarah! 🎊</h3>
                    
                    <p className="text-gray-700 mb-6 text-center text-lg">
                      You have successfully completed the <strong className="text-[#c6930a]">President Leadership Track</strong>!
                    </p>

                    <div className="bg-gradient-to-br from-[#c6930a]/20 to-black/5 border-2 border-[#c6930a] rounded-lg p-8 mb-6">
                      <h4 className="text-center text-xl mb-4">🎓 Your Achievements</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg">
                          <p className="text-3xl text-[#c6930a] mb-1">5/5</p>
                          <p className="text-sm text-gray-600">Modules Completed</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <p className="text-3xl text-green-600 mb-1">92%</p>
                          <p className="text-sm text-gray-600">Average Quiz Score</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <p className="text-3xl text-blue-600 mb-1">18</p>
                          <p className="text-sm text-gray-600">Courses Completed</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <p className="text-3xl text-purple-600 mb-1">6.5</p>
                          <p className="text-sm text-gray-600">Weeks to Complete</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6 text-center">
                      <h4 className="text-xl mb-3 text-green-800">📜 Your Certificate is Ready!</h4>
                      <p className="text-sm text-gray-700 mb-4">
                        Download your official certificate of completion to share with your network, 
                        add to your resume, or display proudly!
                      </p>
                      <a href="#" className="inline-block bg-[#c6930a] text-white px-8 py-3 rounded-lg hover:bg-[#a37808] transition-colors mr-3">
                        Download Certificate
                      </a>
                      <a href="#" className="inline-block bg-white text-[#c6930a] border-2 border-[#c6930a] px-8 py-3 rounded-lg hover:bg-[#c6930a]/10 transition-colors">
                        Share on LinkedIn
                      </a>
                    </div>

                    <div className="border-t pt-6 mb-6">
                      <h4 className="mb-4 text-center">🌟 Skills You've Mastered:</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <span className="text-green-600">✓</span>
                          <span className="text-sm">Strategic Leadership</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <span className="text-green-600">✓</span>
                          <span className="text-sm">Effective Communication</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <span className="text-green-600">✓</span>
                          <span className="text-sm">Team Building</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <span className="text-green-600">✓</span>
                          <span className="text-sm">Conflict Resolution</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <span className="text-green-600">✓</span>
                          <span className="text-sm">Organizational Management</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <span className="text-green-600">✓</span>
                          <span className="text-sm">Visionary Planning</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#c6930a]/10 border-l-4 border-[#c6930a] p-6 mb-6">
                      <h4 className="mb-3">🚀 What's Next?</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Continue your leadership development journey! Consider exploring:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Advanced leadership workshops</li>
                        <li>• Mentorship opportunities within NCBW</li>
                        <li>• Leadership roles in our chapter</li>
                        <li>• Additional certification tracks</li>
                      </ul>
                    </div>

                    <div className="text-center bg-gradient-to-r from-black/5 to-[#c6930a]/5 rounded-lg p-6">
                      <p className="text-lg mb-3">
                        "Leadership and learning are indispensable to each other."
                      </p>
                      <p className="text-sm text-gray-600">- John F. Kennedy</p>
                      <p className="text-sm text-gray-700 mt-4">
                        We're incredibly proud of your dedication and achievement. You are now equipped 
                        to lead with confidence, wisdom, and excellence!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Footer */}
                <div className="bg-black p-6 text-center">
                  <p className="text-[#c6930a] mb-2">Congratulations from everyone at NCBW!</p>
                  <p className="text-gray-400 text-sm">
                    National Coalition of 100 Black Women - Queen City Metropolitan Chapter
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* At-Risk Alert Email */}
        <TabsContent value="atrisk">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <CardTitle>At-Risk Trainee Alert</CardTitle>
              </div>
              <CardDescription>Sent to trainees who have been inactive or are struggling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg overflow-hidden">
                {/* Email Header */}
                <div className="bg-black p-6 text-center border-b-4 border-orange-500">
                  <div className="text-4xl mb-2">💛</div>
                  <h2 className="text-[#c6930a] text-2xl">We Miss You!</h2>
                </div>

                {/* Email Body */}
                <div className="p-8 bg-gray-50">
                  <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
                    <h3 className="text-2xl mb-4">Your Success Matters to Us</h3>
                    
                    <p className="text-gray-700 mb-4">
                      Hi Jennifer,
                    </p>

                    <p className="text-gray-700 mb-6">
                      We haven't seen you in the training portal for 14 days, and we wanted to reach out personally. 
                      Your growth and success are incredibly important to us, and we're committed to supporting you 
                      every step of the way.
                    </p>

                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
                      <h4 className="text-orange-800 mb-2">⚠️ Your Account Status</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Last Login:</strong> 14 days ago<br />
                        <strong>Current Progress:</strong> 15% complete<br />
                        <strong>Modules Completed:</strong> 0 of 5
                      </p>
                      <p className="text-sm text-orange-700 mt-3">
                        We want to make sure you have everything you need to succeed!
                      </p>
                    </div>

                    <h4 className="mb-3">💬 Let's Talk - We're Here to Help</h4>
                    <p className="text-sm text-gray-700 mb-4">
                      Everyone learns differently, and we understand that challenges can arise. We'd love to:
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0">1</div>
                        <div>
                          <p className="text-sm"><strong>Schedule a one-on-one session</strong></p>
                          <p className="text-xs text-gray-600">Meet with a training coordinator to discuss your goals and challenges</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0">2</div>
                        <div>
                          <p className="text-sm"><strong>Adjust your timeline</strong></p>
                          <p className="text-xs text-gray-600">Life happens! We can extend deadlines or create a flexible schedule</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0">3</div>
                        <div>
                          <p className="text-sm"><strong>Provide additional resources</strong></p>
                          <p className="text-xs text-gray-600">We can recommend supplementary materials or study groups</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#c6930a]/10 border border-[#c6930a] rounded-lg p-6 mb-6">
                      <h4 className="mb-3">🎯 Easy Ways to Get Back on Track:</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>✓ Start with just 15 minutes today - review Module 1 materials</li>
                        <li>✓ Set a specific time each week for your training</li>
                        <li>✓ Connect with other trainees in your cohort</li>
                        <li>✓ Reach out if you're facing any technical difficulties</li>
                      </ul>
                    </div>

                    <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
                      <p className="mb-4">Let's restart your journey together!</p>
                      <a href="#" className="inline-block bg-[#c6930a] text-white px-8 py-3 rounded-lg hover:bg-[#a37808] transition-colors mb-3">
                        Login to Dashboard
                      </a>
                      <p className="text-sm text-gray-600">or</p>
                      <a href="mailto:training@ncbwqcmc.org" className="text-[#c6930a] hover:underline">
                        Schedule a Support Call
                      </a>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong>⏰ Important:</strong> To maintain active enrollment status, please log in within the next 7 days. 
                        If you need more time or have concerns, please contact us - we're always happy to accommodate your needs!
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 mt-6 text-center italic">
                      "It's not about being the best. It's about being better than you were yesterday." 
                      We believe in you and your potential! 💫
                    </p>
                  </div>
                </div>

                {/* Email Footer */}
                <div className="bg-black p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">
                    Questions or concerns? We're here to help!
                  </p>
                  <p className="text-[#c6930a] text-sm mb-2">
                    training@ncbwqcmc.org | (555) 123-4567
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    National Coalition of 100 Black Women - Queen City Metropolitan Chapter
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
