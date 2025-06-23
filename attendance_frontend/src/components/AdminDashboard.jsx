import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Clock, 
  DollarSign, 
  LogOut,
  UserPlus,
  BarChart3,
  Building2,
  TrendingUp,
  Activity,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

// Sub-components
import WorkerManagement from './admin/WorkerManagement'
import AttendanceOverview from './admin/AttendanceOverview'
import PaymentManagement from './admin/PaymentManagement'
import Reports from './admin/Reports'

const API_BASE_URL = 'https://j6h5i7c1l0kj.manus.space/api'

export default function AdminDashboard({ user, onLogout }) {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      } else {
        toast.error('Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Dashboard error:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
          <p className="text-muted-foreground">Loading dashboard...</p>
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
                  <p className="text-sm text-muted-foreground">Admin Dashboard</p>
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
        <Routes>
          <Route path="/" element={
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold gradient-text mb-2">
                  Dashboard Overview
                </h2>
                <p className="text-muted-foreground">
                  Monitor your workshop's attendance and manage payments efficiently
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="modern-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Workers</p>
                        <p className="text-3xl font-bold gradient-text">
                          {dashboardData?.total_workers || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="modern-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Present Today</p>
                        <p className="text-3xl font-bold gradient-text">
                          {dashboardData?.present_today || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="modern-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Hours Today</p>
                        <p className="text-3xl font-bold gradient-text">
                          {dashboardData?.total_hours_today || 0}h
                        </p>
                      </div>
                      <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="modern-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Today's Earnings</p>
                        <p className="text-3xl font-bold gradient-text">
                          ₹{dashboardData?.total_earnings_today || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 status-online rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Manage your workshop operations efficiently
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to="/admin/workers">
                      <Button className="w-full gradient-primary text-white hover-lift h-auto py-4">
                        <div className="text-center">
                          <UserPlus className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">Manage Workers</div>
                          <div className="text-xs opacity-90">Add, edit, or remove workers</div>
                        </div>
                      </Button>
                    </Link>

                    <Link to="/admin/attendance">
                      <Button className="w-full gradient-secondary text-white hover-lift h-auto py-4">
                        <div className="text-center">
                          <Clock className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">View Attendance</div>
                          <div className="text-xs opacity-90">Monitor daily attendance</div>
                        </div>
                      </Button>
                    </Link>

                    <Link to="/admin/payments">
                      <Button className="w-full gradient-accent text-white hover-lift h-auto py-4">
                        <div className="text-center">
                          <DollarSign className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">Manage Payments</div>
                          <div className="text-xs opacity-90">Handle wages and bonuses</div>
                        </div>
                      </Button>
                    </Link>

                    <Link to="/admin/reports">
                      <Button className="w-full status-online text-white hover-lift h-auto py-4">
                        <div className="text-center">
                          <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">View Reports</div>
                          <div className="text-xs opacity-90">Analytics and insights</div>
                        </div>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest attendance and payment activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData?.recent_activities?.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.recent_activities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 glass rounded-lg">
                          <div className="w-2 h-2 gradient-primary rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.description}</p>
                            <p className="text-sm text-muted-foreground">{activity.time}</p>
                          </div>
                          <Badge variant="outline" className="glass">
                            {activity.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activities</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          } />
          
          <Route path="/workers" element={<WorkerManagement />} />
          <Route path="/attendance" element={<AttendanceOverview />} />
          <Route path="/payments" element={<PaymentManagement />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  )
}

