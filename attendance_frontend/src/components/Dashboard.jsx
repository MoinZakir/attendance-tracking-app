import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Clock, LogIn, LogOut, DollarSign, Calendar, User, History, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Dashboard = ({ user, onLogout }) => {
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchTodayAttendance()
  }, [])

  const fetchTodayAttendance = async () => {
    try {
      const response = await fetch('https://w5hni7copj5e.manus.space/api/attendance/today', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setTodayAttendance(data)
      }
    } catch (error) {
      console.error('Failed to fetch today attendance:', error)
    }
  }

  const markEntry = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('https://w5hni7copj5e.manus.space/api/attendance/mark-entry', {
        method: 'POST',
        credentials: 'include'
      })
      const data = await response.json()
      
      if (response.ok) {
        setTodayAttendance(data.record)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const markExit = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('https://w5hni7copj5e.manus.space/api/attendance/mark-exit', {
        method: 'POST',
        credentials: 'include'
      })
      const data = await response.json()
      
      if (response.ok) {
        setTodayAttendance(data.record)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'Not marked'
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDuration = (minutes) => {
    if (!minutes) return '0h 0m'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getWorkStatus = () => {
    if (!todayAttendance?.entry_time) return 'Not started'
    if (!todayAttendance?.exit_time) return 'Working'
    return 'Completed'
  }

  const getStatusColor = () => {
    const status = getWorkStatus()
    switch (status) {
      case 'Working': return 'bg-green-500'
      case 'Completed': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Welcome back!</h1>
              <p className="text-sm text-muted-foreground">
                {user?.email || user?.phone}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/history')}
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/profile')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Date and Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{getCurrentDate()}</span>
                </CardTitle>
                <CardDescription>Today's attendance status</CardDescription>
              </div>
              <Badge className={`${getStatusColor()} text-white`}>
                {getWorkStatus()}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <LogIn className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Mark Entry</h3>
                  <p className="text-sm text-muted-foreground">
                    Record your arrival time
                  </p>
                </div>
                <Button
                  onClick={markEntry}
                  disabled={loading || todayAttendance?.entry_time}
                  className="w-full"
                  size="lg"
                >
                  {todayAttendance?.entry_time ? 'Entry Marked' : 'Mark Entry'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <LogOut className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Mark Exit</h3>
                  <p className="text-sm text-muted-foreground">
                    Record your departure time
                  </p>
                </div>
                <Button
                  onClick={markExit}
                  disabled={loading || !todayAttendance?.entry_time || todayAttendance?.exit_time}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  {todayAttendance?.exit_time ? 'Exit Marked' : 'Mark Exit'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Today's Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(todayAttendance?.entry_time)}
                </div>
                <div className="text-sm text-muted-foreground">Entry Time</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {formatTime(todayAttendance?.exit_time)}
                </div>
                <div className="text-sm text-muted-foreground">Exit Time</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatDuration(todayAttendance?.total_minutes)}
                </div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                  {todayAttendance?.salary_earned?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-muted-foreground">Earned Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Calculation Info */}
        <Card>
          <CardHeader>
            <CardTitle>Salary Calculation</CardTitle>
            <CardDescription>
              Your hourly rate: ${user?.hourly_rate}/hour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Salary is calculated in 30-minute blocks</p>
              <p>• Incomplete blocks (less than 30 minutes) are not counted</p>
              <p>• Each complete 30-minute block earns ${(user?.hourly_rate / 2)?.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

