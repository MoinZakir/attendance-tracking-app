import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  User,
  Phone,
  Mail,
  DollarSign,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'

const API_BASE_URL = 'https://j6h5i7c1l0kj.manus.space/api'

export default function WorkerManagement() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWorker, setEditingWorker] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    daily_wage: '',
    standard_hours: 8,
    is_active: true
  })

  useEffect(() => {
    fetchWorkers()
  }, [])

  const fetchWorkers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/workers`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setWorkers(data)
      } else {
        toast.error('Failed to fetch workers')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingWorker 
        ? `${API_BASE_URL}/workers/${editingWorker.id}`
        : `${API_BASE_URL}/workers`
      
      const method = editingWorker ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          daily_wage: parseFloat(formData.daily_wage),
          standard_hours: parseFloat(formData.standard_hours)
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(editingWorker ? 'Worker updated successfully!' : 'Worker created successfully!')
        setDialogOpen(false)
        resetForm()
        fetchWorkers()
      } else {
        toast.error(data.error || 'Operation failed')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const handleEdit = (worker) => {
    setEditingWorker(worker)
    setFormData({
      username: worker.username,
      email: worker.email || '',
      phone: worker.phone || '',
      password: '',
      daily_wage: worker.daily_wage?.toString() || '',
      standard_hours: worker.standard_hours || 8,
      is_active: worker.is_active
    })
    setDialogOpen(true)
  }

  const handleDelete = async (workerId) => {
    if (!confirm('Are you sure you want to delete this worker?')) return

    try {
      const response = await fetch(`${API_BASE_URL}/workers/${workerId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Worker deleted successfully!')
        fetchWorkers()
      } else {
        toast.error('Failed to delete worker')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      phone: '',
      password: '',
      daily_wage: '',
      standard_hours: 8,
      is_active: true
    })
    setEditingWorker(null)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    resetForm()
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Worker Management</h2>
          <p className="text-muted-foreground">Manage your workers and their details</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Worker
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingWorker ? 'Edit Worker' : 'Add New Worker'}
              </DialogTitle>
              <DialogDescription>
                {editingWorker 
                  ? 'Update worker information and settings'
                  : 'Create a new worker account with their details'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password {editingWorker && '(leave blank to keep current)'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingWorker}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="daily_wage">Daily Wage (₹)</Label>
                  <Input
                    id="daily_wage"
                    type="number"
                    value={formData.daily_wage}
                    onChange={(e) => setFormData({ ...formData, daily_wage: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="standard_hours">Standard Hours</Label>
                  <Input
                    id="standard_hours"
                    type="number"
                    step="0.5"
                    value={formData.standard_hours}
                    onChange={(e) => setFormData({ ...formData, standard_hours: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingWorker ? 'Update' : 'Create'} Worker
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workers List */}
      <div className="grid gap-4">
        {workers.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No workers found</h3>
                <p className="text-muted-foreground">Add your first worker to get started</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          workers.map((worker) => (
            <Card key={worker.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">{worker.username}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {worker.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {worker.email}
                          </div>
                        )}
                        {worker.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {worker.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="h-3 w-3" />
                        ₹{worker.daily_wage}/day
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {worker.standard_hours} hrs
                      </div>
                    </div>

                    <Badge variant={worker.is_active ? "default" : "secondary"}>
                      {worker.is_active ? "Active" : "Inactive"}
                    </Badge>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(worker)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(worker.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

