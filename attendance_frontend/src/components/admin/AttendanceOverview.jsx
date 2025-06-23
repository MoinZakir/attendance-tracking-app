import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User } from 'lucide-react'
import { toast } from 'sonner'

const API_BASE_URL = 'https://j6h5i7c1l0kj.manus.space/api'

export default function AttendanceOverview() {
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttendanceData()
  }, [])

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/attendance`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setAttendanceData(data)
      } else {
        toast.error('Failed to fetch attendance data')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Attendance Overview</h2>
        <p className="text-muted-foreground">Monitor all worker attendance records</p>
      </div>

      <div className="grid gap-4">
        {attendanceData.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No attendance records found</h3>
                <p className="text-muted-foreground">Attendance records will appear here</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          attendanceData.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">{record.worker_name}</h3>
                      <p className="text-sm text-muted-foreground">{formatDate(record.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">Entry</p>
                      <p className="text-sm text-muted-foreground">{formatTime(record.entry_time)}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium">Exit</p>
                      <p className="text-sm text-muted-foreground">{formatTime(record.exit_time)}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium">Hours</p>
                      <p className="text-sm text-muted-foreground">{record.total_hours?.toFixed(2) || '0.00'}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium">Earnings</p>
                      <p className="text-sm text-muted-foreground">₹{record.daily_earning?.toFixed(0) || '0'}</p>
                    </div>

                    <Badge variant={record.exit_time ? "default" : "secondary"}>
                      {record.exit_time ? "Complete" : "In Progress"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

