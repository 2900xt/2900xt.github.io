import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal, Award, Users, Zap } from "lucide-react"

export function About() {
  const experiences = [
    {
      title: "Incoming Cybersecurity Intern • Maximus",
      description: "...",
      date: "Jun 2025 - Present",
      color: "bg-red-500"
    },
    {
      title: "Co-founder • Cognicade Studios",
      description: "Working with LCPS to integrate an educational games platform in elementary schools",
      date: "Aug 2024 - Present",
      color: "bg-blue-500"
    },
    {
      title: "Level 1 Instructor • Mathnasium",
      description: "Teaching K-12 mathematics concepts",
      date: "Mar 2024 - Present",
      color: "bg-green-500"
    },
    {
      title: "App Development Intern • Syz Tech Logistics",
      description: "Developed a Java interface for Amazon/Walmart barcode processing",
      date: "Jul - Aug 2023",
      color: "bg-purple-500"
    },
    {
      title: "App Development Intern • Remindrop",
      description: "Created Android app with Bluetooth sensor integration",
      date: "Apr - Jun 2023",
      color: "bg-orange-500"
    }
  ]

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-4">About Me</h2>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                I'm a senior at Independence High School and Academies of Loudoun. At school,
                I lead a successful science olympiad team and a competitive programming club. 
                I also love creating cool science projects and learning new things.
              </p>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                I compete at the national level in programming competitions and have won first place at
                multiple competitions including UPenn's PClassic and Lockheed Martin's CodeQuest. My technical
                expertise ranges from low-level kernel development in C++ and assembly to machine learning
                applications using Python and MATLAB.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Beyond individual projects, I created a competitive programming club with over 100 members
                and helped host the first ever competitive programming tournament in Loudoun County.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Terminal className="h-8 w-8 text-blue-400 mr-3" />
                    <div className="font-bold text-lg">Technical Skills</div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>C++ & Assembly</span>
                        <span className="text-blue-400">Expert</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full w-[95%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Java & Python</span>
                        <span className="text-green-400">Advanced</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full w-[90%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>AI/ML & Data Science</span>
                        <span className="text-purple-400">Advanced</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full w-[85%]"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Award className="h-8 w-8 text-yellow-300 mr-3" />
                    <div className="font-bold text-lg">Quick Stats</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Competition Wins</span>
                      <span className="font-bold text-yellow-300">6+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GitHub Repositories</span>
                      <span className="font-bold text-yellow-300">22</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Programming Languages</span>
                      <span className="font-bold text-yellow-300">8+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Years Coding</span>
                      <span className="font-bold text-yellow-300">6+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
              <CardHeader>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-200 mr-3" />
                  <CardTitle className="text-xl">Education</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="font-semibold">Independence High School</div>
                  <div className="text-purple-200 text-sm">Academies of Loudoun - IT Pathway</div>
                  <div className="text-purple-200 text-sm">3.96 UW GPA • 1540 SAT</div>
                  <div className="text-purple-200 text-sm">Expected Graduation: 2026</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
              <CardHeader>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-200 mr-3" />
                  <CardTitle className="text-xl">Leadership</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold">Competitive Programming Club</div>
                    <div className="text-green-200 text-sm">President & Co-founder • 100+ members</div>
                  </div>
                  <div>
                    <div className="font-semibold">Science Olympiad</div>
                    <div className="text-green-200 text-sm">Club President • 3x State medalist</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
              <CardHeader>
                <div className="flex items-center">
                  <Zap className="h-8 w-8 text-orange-200 mr-3" />
                  <CardTitle className="text-xl">Current Projects</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold">Clara.so</div>
                    <div className="text-orange-200 text-sm">AI Video Marketing</div>
                  </div>
                  <div>
                    <div className="font-semibold">RAPTOR</div>
                    <div className="text-orange-200 text-sm">Peatland Monitoring & Response System</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Experience Timeline</h3>
          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-4 h-4 ${experience.color} rounded-full mt-2`}></div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">{experience.title}</h4>
                      <p className="text-slate-600">{experience.description}</p>
                    </div>
                    <span className="text-sm text-slate-500 mt-1 sm:mt-0">{experience.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 