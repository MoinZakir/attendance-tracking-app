import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, Download, Calendar, DollarSign, Clock, User } from 'lucide-react'
import { toast } from 'sonner'

const API_BASE_URL = 'https://j6h5i7c1l0kj.manus.space/api'

export default function Reports() {
  const [reportData, setReportData] = useState(null)
  const [workers, setWorkers] = useState([])
  const [selectedWorker, setSelectedWorker] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('this_month')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkers()
    fetchReportData()
  }, [selectedWorker, selectedPeriod])

  const fetchWorkers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/workers`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setWorkers(data)
      }
    } catch (error) {
      console.error('Failed to fetch workers')
    }
  }

  const fetchReportData = async () => {
    try {
      const params = new URLSearchParams({
        worker_id: selectedWorker,
        period: selectedPeriod
      })

      const response = await fetch(`${API_BASE_URL}/admin/reports?${params}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      } else {
        toast.error('Failed to fetch report data')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async () => {
    try {
      const params = new URLSearchParams({
        worker_id: selectedWorker,
        period: selectedPeriod,
        format: 'csv'
      })

      const response = await fetch(`${API_BASE_URL}/admin/reports/export?${params}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `attendance_report_${selectedPeriod}_${Date.now()}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Report exported successfully!')
      } else {
        toast.error('Failed to export report')
      }
    } catch (error) {
      toast.error('Export failed')
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">Generate and export attendance reports</p>
        </div>
        
        <Button onClick={exportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>
            Select worker and time period for the report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Worker</label>
              <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workers</SelectItem>
                  {workers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id.toString()}>
                      {worker.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.summary.total_workers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.summary.total_days}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.summary.total_hours.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{reportData.summary.total_earnings.toFixed(0)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Report */}
      {reportData && reportData.details && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Report</CardTitle>
            <CardDescription>
              Breakdown by worker and date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.details.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No data found</h3>
                  <p className="text-muted-foreground">No attendance records for the selected criteria</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Worker</th>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Entry</th>
                        <th className="text-left p-2">Exit</th>
                        <th className="text-left p-2">Hours</th>
                        <th className="text-left p-2">Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.details.map((record, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{record.worker_name}</td>
                          <td className="p-2">{new Date(record.date).toLocaleDateString('en-IN')}</td>
                          <td className="p-2">
                            {record.entry_time ? new Date(record.entry_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-'}
                          </td>
                          <td className="p-2">
                            {record.exit_time ? new Date(record.exit_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-'}
                          </td>
                          <td className="p-2">{record.total_hours?.toFixed(2) || '0.00'}</td>
                          <td className="p-2">₹{record.daily_earning?.toFixed(0) || '0'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

