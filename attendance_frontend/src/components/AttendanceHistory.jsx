import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, DollarSign, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AttendanceHistory = ({ user, onLogout }) => {
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAttendanceHistory()
  }, [])

  const fetchAttendanceHistory = async () => {
    try {
      const response = await fetch('https://w5hni7copj5e.manus.space/api/attendance/history', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setAttendanceHistory(data)
      }
    } catch (error) {
      console.error('Failed to fetch attendance history:', error)
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDuration = (minutes) => {
    if (!minutes) return '0h 0m'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getStatusBadge = (record) => {
    if (!record.entry_time) return <Badge variant="secondary">Not started</Badge>
    if (!record.exit_time) return <Badge className="bg-green-500 text-white">In progress</Badge>
    return <Badge className="bg-blue-500 text-white">Completed</Badge>
  }

  const getTotalEarnings = () => {
    return attendanceHistory.reduce((total, record) => total + (record.salary_earned || 0), 0)
  }

  const getTotalHours = () => {
    const totalMinutes = attendanceHistory.reduce((total, record) => total + (record.total_minutes || 0), 0)
    return Math.floor(totalMinutes / 60)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading attendance history...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Attendance History</h1>
              <p className="text-sm text-muted-foreground">
                View your past attendance records
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{attendanceHistory.length}</div>
              <div className="text-sm text-muted-foreground">Total Days</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{getTotalHours()}h</div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 flex items-center justify-center">
                <DollarSign className="w-8 h-8" />
                {getTotalEarnings().toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Earnings</div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Attendance Records</span>
            </CardTitle>
            <CardDescription>
              Your complete attendance history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceHistory.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No attendance records found</p>
                <p className="text-sm text-muted-foreground">Start marking your attendance to see records here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attendanceHistory.map((record) => (
                  <div
                    key={record.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {formatDate(record.date)}
                          </div>
                          {getStatusBadge(record)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-blue-600">
                            {formatTime(record.entry_time)}
                          </div>
                          <div className="text-muted-foreground">Entry</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="font-medium text-red-600">
                            {formatTime(record.exit_time)}
                          </div>
                          <div className="text-muted-foreground">Exit</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="font-medium text-green-600 flex items-center justify-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDuration(record.total_minutes)}
                          </div>
                          <div className="text-muted-foreground">Duration</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="font-medium text-yellow-600 flex items-center justify-center">
                            <DollarSign className="w-4 h-4" />
                            {record.salary_earned?.toFixed(2) || '0.00'}
                          </div>
                          <div className="text-muted-foreground">Earned</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AttendanceHistory

