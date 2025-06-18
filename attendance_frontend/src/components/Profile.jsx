import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, Mail, Phone, DollarSign, Calendar, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Profile = ({ user, onLogout }) => {
  const navigate = useNavigate()

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
              <h1 className="text-xl font-semibold">Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account information
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
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription>
              Your account details and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture and Basic Info */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {user?.email || user?.phone || 'User'}
                </h3>
                <Badge variant="secondary">Active User</Badge>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Contact Information
                </h4>
                
                {user?.email && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                )}
                
                {user?.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-sm font-medium">Phone</div>
                      <div className="text-sm text-muted-foreground">{user.phone}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Work Information
                </h4>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="text-sm font-medium">Hourly Rate</div>
                    <div className="text-sm text-muted-foreground">${user?.hourly_rate}/hour</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium">Member Since</div>
                    <div className="text-sm text-muted-foreground">{formatDate(user?.created_at)}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Salary Calculation</span>
            </CardTitle>
            <CardDescription>
              How your earnings are calculated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">${user?.hourly_rate}</div>
                  <div className="text-sm text-muted-foreground">Per Hour</div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">${(user?.hourly_rate / 2)?.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Per 30-minute Block</div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900">Calculation Rules:</h5>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Salary is calculated in 30-minute blocks</li>
                  <li>Incomplete blocks (less than 30 minutes) are not counted</li>
                  <li>Each complete 30-minute block earns ${(user?.hourly_rate / 2)?.toFixed(2)}</li>
                  <li>Example: Working 1 hour 25 minutes = 2 complete blocks = ${user?.hourly_rate}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="destructive"
                onClick={onLogout}
                className="w-full md:w-auto"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              
              <div className="text-sm text-muted-foreground">
                <p>Need to update your information? Contact your administrator.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile

