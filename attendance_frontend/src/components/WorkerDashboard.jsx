import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock, 
  DollarSign, 
  Calendar,
  LogOut,
  CheckCircle,
  XCircle,
  Timer,
  User,
  Building2,
  TrendingUp,
  Activity,
  MapPin,
  Award
} from 'lucide-react'
import { toast } from 'sonner'

const API_BASE_URL = 'https://j6h5i7c1l0kj.manus.space/api'

export default function WorkerDashboard({ user, onLogout }) {
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchTodayAttendance()
    fetchAttendanceHistory()
  }, [])

  const fetchTodayAttendance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/today`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setTodayAttendance(data)
      }
    } catch (error) {
      toast.error('Failed to fetch today\'s attendance')
    }
  }

  const fetchAttendanceHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/history`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setAttendanceHistory(data.records || [])
      }
    } catch (error) {
      toast.error('Failed to fetch attendance history')
    } finally {
      setLoading(false)
    }
  }

  const markEntry = async () => {
    setActionLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/mark-entry`, {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Entry marked successfully!')
        setTodayAttendance(data.record)
      } else {
        toast.error(data.error || 'Failed to mark entry')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setActionLoading(false)
    }
  }

  const markExit = async () => {
    setActionLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/mark-exit`, {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Exit marked successfully!')
        setTodayAttendance(data.record)
        fetchAttendanceHistory() // Refresh history
      } else {
        toast.error(data.error || 'Failed to mark exit')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setActionLoading(false)
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'Not marked'
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const calculateSummary = () => {
    const totalHours = attendanceHistory.reduce((sum, record) => sum + (record.total_hours || 0), 0)
    const totalEarnings = attendanceHistory.reduce((sum, record) => sum + (record.daily_earning || 0), 0)
    const totalDays = attendanceHistory.length

    return { totalHours, totalEarnings, totalDays }
  }

  const summary = calculateSummary()

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      onLogout()
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      onLogout() // Logout anyway
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">Workshop Manager</h1>
                  <p className="text-sm text-muted-foreground">Worker Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">Welcome, {user.username}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="glass hover-lift"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glass">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Today
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-2">
                Today's Attendance
              </h2>
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Today's Status */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Attendance Status
                </CardTitle>
                <CardDescription>
                  Mark your entry and exit times for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Entry Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Entry Time</h3>
                      {todayAttendance?.entry_time ? (
                        <Badge className="status-online text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Marked
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="glass">
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Marked
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text mb-4">
                        {formatTime(todayAttendance?.entry_time)}
                      </div>
                      
                      <Button 
                        onClick={markEntry} 
                        disabled={actionLoading || todayAttendance?.entry_time}
                        className="w-full gradient-primary text-white hover-lift py-3"
                        size="lg"
                      >
                        {actionLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Marking Entry...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Mark Entry
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Exit Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Exit Time</h3>
                      {todayAttendance?.exit_time ? (
                        <Badge className="status-offline text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Marked
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="glass">
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Marked
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text mb-4">
                        {formatTime(todayAttendance?.exit_time)}
                      </div>
                      
                      <Button 
                        onClick={markExit} 
                        disabled={actionLoading || !todayAttendance?.entry_time || todayAttendance?.exit_time}
                        className="w-full gradient-secondary text-white hover-lift py-3"
                        size="lg"
                      >
                        {actionLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Marking Exit...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5" />
                            Mark Exit
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Today's Summary */}
                {todayAttendance && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Today's Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Timer className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">Total Hours</span>
                          </div>
                          <span className="text-xl font-bold gradient-text">
                            {todayAttendance.total_hours?.toFixed(2) || '0.00'} hrs
                          </span>
                        </div>
                      </div>
                      <div className="glass p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">Earnings</span>
                          </div>
                          <span className="text-xl font-bold gradient-text">
                            ₹{todayAttendance.daily_earning?.toFixed(0) || '0'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="modern-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Days</p>
                      <p className="text-3xl font-bold gradient-text">{summary.totalDays}</p>
                    </div>
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="modern-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                      <p className="text-3xl font-bold gradient-text">{summary.totalHours.toFixed(1)}</p>
                    </div>
                    <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center">
                      <Timer className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="modern-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                      <p className="text-3xl font-bold gradient-text">₹{summary.totalEarnings.toFixed(0)}</p>
                    </div>
                    <div className="w-12 h-12 status-online rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendance History */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Attendance History
                </CardTitle>
                <CardDescription>
                  Your complete attendance records and earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceHistory.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No attendance records found</p>
                      <p className="text-sm">Start marking your attendance to see records here</p>
                    </div>
                  ) : (
                    attendanceHistory.map((record) => (
                      <div key={record.id} className="glass p-4 rounded-lg hover-lift">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-3 h-3 gradient-primary rounded-full"></div>
                            <div>
                              <h4 className="font-semibold">{formatDate(record.date)}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatTime(record.entry_time)} - {formatTime(record.exit_time)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg gradient-text">
                              {record.total_hours?.toFixed(2) || '0.00'} hrs
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ₹{record.daily_earning?.toFixed(0) || '0'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your account details and work settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass p-4 rounded-lg">
                      <label className="text-sm font-medium text-muted-foreground">Username</label>
                      <p className="text-lg font-semibold mt-1">{user.username}</p>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <label className="text-sm font-medium text-muted-foreground">Role</label>
                      <p className="text-lg font-semibold mt-1 capitalize">{user.role}</p>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-lg font-semibold mt-1">{user.email || 'Not provided'}</p>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-lg font-semibold mt-1">{user.phone || 'Not provided'}</p>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <label className="text-sm font-medium text-muted-foreground">Daily Wage</label>
                      <p className="text-lg font-semibold mt-1 gradient-text">₹{user.daily_wage}</p>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <label className="text-sm font-medium text-muted-foreground">Standard Hours</label>
                      <p className="text-lg font-semibold mt-1">{user.standard_hours} hours</p>
                    </div>
                  </div>

                  {/* Performance Badge */}
                  <div className="glass p-6 rounded-lg text-center">
                    <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Performance Summary</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold gradient-text">{summary.totalDays}</p>
                        <p className="text-sm text-muted-foreground">Days Worked</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold gradient-text">{summary.totalHours.toFixed(0)}</p>
                        <p className="text-sm text-muted-foreground">Total Hours</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold gradient-text">₹{summary.totalEarnings.toFixed(0)}</p>
                        <p className="text-sm text-muted-foreground">Total Earned</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

