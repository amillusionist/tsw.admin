import React, { useState, useEffect } from 'react'
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Textarea } from "@/components/shadcn/ui/textarea"
import { Switch } from "@/components/shadcn/ui/switch"
import { Badge } from "@/components/shadcn/ui/badge"
import { Separator } from "@/components/shadcn/ui/separator"
import { 
  Settings, 
  CreditCard, 
  Bell, 
  Shield, 
  Globe, 
  Database,
  Mail,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  Server,
  Users,
  FileText,
  Palette
} from "lucide-react"
import { getAuthHeaders, getApiUrl } from "@/config/headers"

// Payment Settings Component
function PaymentSettings({ settings, onUpdate }: { settings: any, onUpdate: (data: any) => void }) {
  const [paymentData, setPaymentData] = useState({
    stripePublicKey: settings.payment?.stripePublicKey || '',
    stripeSecretKey: settings.payment?.stripeSecretKey || '',
    razorpayKeyId: settings.payment?.razorpayKeyId || '',
    razorpayKeySecret: settings.payment?.razorpayKeySecret || '',
    paypalClientId: settings.payment?.paypalClientId || '',
    paypalSecret: settings.payment?.paypalSecret || '',
    currency: settings.payment?.currency || 'INR',
    paymentMethods: settings.payment?.paymentMethods || ['card', 'upi', 'netbanking']
  })
  const [showSecrets, setShowSecrets] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_URL}/settings/payment`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(paymentData)
      })

      const data = await response.json()
      if (data.success) {
        onUpdate({ payment: paymentData })
        alert('Payment settings updated successfully!')
      } else {
        throw new Error(data.message || 'Failed to update payment settings')
      }
    } catch (error) {
      console.error('Error updating payment settings:', error)
      alert('Failed to update payment settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Settings
        </CardTitle>
        <CardDescription>
          Configure payment gateway settings and API credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label>Show Secret Keys</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSecrets(!showSecrets)}
          >
            {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
            <Input
              id="stripePublicKey"
              value={paymentData.stripePublicKey}
              onChange={(e) => setPaymentData(prev => ({ ...prev, stripePublicKey: e.target.value }))}
              placeholder="pk_test_..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
            <Input
              id="stripeSecretKey"
              type={showSecrets ? "text" : "password"}
              value={paymentData.stripeSecretKey}
              onChange={(e) => setPaymentData(prev => ({ ...prev, stripeSecretKey: e.target.value }))}
              placeholder="sk_test_..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
            <Input
              id="razorpayKeyId"
              value={paymentData.razorpayKeyId}
              onChange={(e) => setPaymentData(prev => ({ ...prev, razorpayKeyId: e.target.value }))}
              placeholder="rzp_test_..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="razorpayKeySecret">Razorpay Key Secret</Label>
            <Input
              id="razorpayKeySecret"
              type={showSecrets ? "text" : "password"}
              value={paymentData.razorpayKeySecret}
              onChange={(e) => setPaymentData(prev => ({ ...prev, razorpayKeySecret: e.target.value }))}
              placeholder="Enter secret key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paypalClientId">PayPal Client ID</Label>
            <Input
              id="paypalClientId"
              value={paymentData.paypalClientId}
              onChange={(e) => setPaymentData(prev => ({ ...prev, paypalClientId: e.target.value }))}
              placeholder="Enter PayPal client ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paypalSecret">PayPal Secret</Label>
            <Input
              id="paypalSecret"
              type={showSecrets ? "text" : "password"}
              value={paymentData.paypalSecret}
              onChange={(e) => setPaymentData(prev => ({ ...prev, paypalSecret: e.target.value }))}
              placeholder="Enter PayPal secret"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Default Currency</Label>
          <select
            id="currency"
            value={paymentData.currency}
            onChange={(e) => setPaymentData(prev => ({ ...prev, currency: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="INR">Indian Rupee (INR)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
          </select>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Payment Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// General Settings Component
function GeneralSettings({ settings, onUpdate }: { settings: any, onUpdate: (data: any) => void }) {
  const [generalData, setGeneralData] = useState({
    siteName: settings.general?.siteName || '',
    siteDescription: settings.general?.siteDescription || '',
    contactEmail: settings.general?.contactEmail || '',
    contactPhone: settings.general?.contactPhone || '',
    address: settings.general?.address || '',
    timezone: settings.general?.timezone || 'Asia/Kolkata',
    dateFormat: settings.general?.dateFormat || 'DD/MM/YYYY',
    timeFormat: settings.general?.timeFormat || '12h'
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_URL}/settings/general`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(generalData)
      })

      const data = await response.json()
      if (data.success) {
        onUpdate({ general: generalData })
        alert('General settings updated successfully!')
      } else {
        throw new Error(data.message || 'Failed to update general settings')
      }
    } catch (error) {
      console.error('Error updating general settings:', error)
      alert('Failed to update general settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          General Settings
        </CardTitle>
        <CardDescription>
          Configure basic site information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={generalData.siteName}
              onChange={(e) => setGeneralData(prev => ({ ...prev, siteName: e.target.value }))}
              placeholder="Your Site Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={generalData.contactEmail}
              onChange={(e) => setGeneralData(prev => ({ ...prev, contactEmail: e.target.value }))}
              placeholder="contact@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              value={generalData.contactPhone}
              onChange={(e) => setGeneralData(prev => ({ ...prev, contactPhone: e.target.value }))}
              placeholder="+91 1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              value={generalData.timezone}
              onChange={(e) => setGeneralData(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteDescription">Site Description</Label>
          <Textarea
            id="siteDescription"
            value={generalData.siteDescription}
            onChange={(e) => setGeneralData(prev => ({ ...prev, siteDescription: e.target.value }))}
            placeholder="Brief description of your service"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Business Address</Label>
          <Textarea
            id="address"
            value={generalData.address}
            onChange={(e) => setGeneralData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Complete business address"
            rows={2}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save General Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Notification Settings Component
function NotificationSettings({ settings, onUpdate }: { settings: any, onUpdate: (data: any) => void }) {
  const [notificationData, setNotificationData] = useState({
    emailNotifications: settings.notifications?.emailNotifications || true,
    bookingConfirmations: settings.notifications?.bookingConfirmations || true,
    bookingReminders: settings.notifications?.bookingReminders || true,
    paymentConfirmations: settings.notifications?.paymentConfirmations || true,
    marketingEmails: settings.notifications?.marketingEmails || false,
    emailProvider: settings.notifications?.emailProvider || 'sendgrid',
    reminderTime: settings.notifications?.reminderTime || 24, // hours before service
    autoConfirmBookings: settings.notifications?.autoConfirmBookings || false
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_URL}/settings/notifications`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(notificationData)
      })

      const data = await response.json()
      if (data.success) {
        onUpdate({ notifications: notificationData })
        alert('Notification settings updated successfully!')
      } else {
        throw new Error(data.message || 'Failed to update notification settings')
      }
    } catch (error) {
      console.error('Error updating notification settings:', error)
      alert('Failed to update notification settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure notification preferences and providers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
                 <div className="space-y-4">
           <div className="flex items-center justify-between">
             <div>
               <Label>Email Notifications</Label>
               <p className="text-sm text-gray-600">Send notifications via email</p>
             </div>
             <Switch
               checked={notificationData.emailNotifications}
               onCheckedChange={(checked) => setNotificationData(prev => ({ ...prev, emailNotifications: checked }))}
             />
           </div>

           <div className="flex items-center justify-between">
             <div>
               <Label>Auto-Confirm Bookings</Label>
               <p className="text-sm text-gray-600">Automatically confirm bookings without manual approval</p>
             </div>
             <Switch
               checked={notificationData.autoConfirmBookings}
               onCheckedChange={(checked) => setNotificationData(prev => ({ ...prev, autoConfirmBookings: checked }))}
             />
           </div>
         </div>

        <Separator />

                 <div className="space-y-4">
           <h4 className="font-medium">Notification Types</h4>
           
           <div className="flex items-center justify-between">
             <div>
               <Label>Booking Confirmations</Label>
               <p className="text-sm text-gray-600">Send confirmation when booking is made</p>
             </div>
             <Switch
               checked={notificationData.bookingConfirmations}
               onCheckedChange={(checked) => setNotificationData(prev => ({ ...prev, bookingConfirmations: checked }))}
             />
           </div>

           <div className="flex items-center justify-between">
             <div>
               <Label>Booking Reminders</Label>
               <p className="text-sm text-gray-600">Send reminders before scheduled service</p>
             </div>
             <Switch
               checked={notificationData.bookingReminders}
               onCheckedChange={(checked) => setNotificationData(prev => ({ ...prev, bookingReminders: checked }))}
             />
           </div>

           <div className="flex items-center justify-between">
             <div>
               <Label>Payment Confirmations</Label>
               <p className="text-sm text-gray-600">Send confirmation when payment is received</p>
             </div>
             <Switch
               checked={notificationData.paymentConfirmations}
               onCheckedChange={(checked) => setNotificationData(prev => ({ ...prev, paymentConfirmations: checked }))}
             />
           </div>

           <div className="flex items-center justify-between">
             <div>
               <Label>Marketing Emails</Label>
               <p className="text-sm text-gray-600">Send promotional and marketing emails</p>
             </div>
             <Switch
               checked={notificationData.marketingEmails}
               onCheckedChange={(checked) => setNotificationData(prev => ({ ...prev, marketingEmails: checked }))}
             />
           </div>
         </div>

         <div className="space-y-2">
           <Label htmlFor="reminderTime">Reminder Time (hours before service)</Label>
           <Input
             id="reminderTime"
             type="number"
             value={notificationData.reminderTime}
             onChange={(e) => setNotificationData(prev => ({ ...prev, reminderTime: parseInt(e.target.value) }))}
             min="1"
             max="72"
             placeholder="24"
           />
         </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Notification Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Business Settings Component
function BusinessSettings({ settings, onUpdate }: { settings: any, onUpdate: (data: any) => void }) {
  const [businessData, setBusinessData] = useState({
    businessHours: settings.business?.businessHours || {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true }
    },
    maxBookingsPerDay: settings.business?.maxBookingsPerDay || 50,
    advanceBookingDays: settings.business?.advanceBookingDays || 30,
    cancellationPolicy: settings.business?.cancellationPolicy || '24 hours notice required',
    serviceAreas: settings.business?.serviceAreas || ['Delhi', 'Mumbai', 'Bangalore'],
    taxRate: settings.business?.taxRate || 18,
    serviceCharge: settings.business?.serviceCharge || 5
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_URL}/settings/business`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(businessData)
      })

      const data = await response.json()
      if (data.success) {
        onUpdate({ business: businessData })
        alert('Business settings updated successfully!')
      } else {
        throw new Error(data.message || 'Failed to update business settings')
      }
    } catch (error) {
      console.error('Error updating business settings:', error)
      alert('Failed to update business settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Business Settings
        </CardTitle>
        <CardDescription>
          Configure business hours, booking limits, and service areas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maxBookingsPerDay">Max Bookings Per Day</Label>
            <Input
              id="maxBookingsPerDay"
              type="number"
              value={businessData.maxBookingsPerDay}
              onChange={(e) => setBusinessData(prev => ({ ...prev, maxBookingsPerDay: parseInt(e.target.value) }))}
              min="1"
              max="1000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="advanceBookingDays">Advance Booking Days</Label>
            <Input
              id="advanceBookingDays"
              type="number"
              value={businessData.advanceBookingDays}
              onChange={(e) => setBusinessData(prev => ({ ...prev, advanceBookingDays: parseInt(e.target.value) }))}
              min="1"
              max="365"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              value={businessData.taxRate}
              onChange={(e) => setBusinessData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
              min="0"
              max="50"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceCharge">Service Charge (%)</Label>
            <Input
              id="serviceCharge"
              type="number"
              value={businessData.serviceCharge}
              onChange={(e) => setBusinessData(prev => ({ ...prev, serviceCharge: parseFloat(e.target.value) }))}
              min="0"
              max="20"
              step="0.1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
          <Textarea
            id="cancellationPolicy"
            value={businessData.cancellationPolicy}
            onChange={(e) => setBusinessData(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
            placeholder="Enter your cancellation policy"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceAreas">Service Areas (comma separated)</Label>
          <Input
            id="serviceAreas"
            value={businessData.serviceAreas.join(', ')}
            onChange={(e) => setBusinessData(prev => ({ 
              ...prev, 
              serviceAreas: e.target.value.split(',').map(area => area.trim()).filter(area => area)
            }))}
            placeholder="Delhi, Mumbai, Bangalore"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Business Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Email Settings Component
function EmailSettings({ settings, onUpdate }: { settings: any, onUpdate: (data: any) => void }) {
  const [emailData, setEmailData] = useState({
    smtpHost: settings.email?.smtpHost || '',
    smtpPort: settings.email?.smtpPort || 587,
    smtpUser: settings.email?.smtpUser || '',
    smtpPassword: settings.email?.smtpPassword || '',
    fromEmail: settings.email?.fromEmail || '',
    fromName: settings.email?.fromName || '',
    replyToEmail: settings.email?.replyToEmail || '',
    emailTemplates: settings.email?.emailTemplates || {
      bookingConfirmation: 'Thank you for your booking!',
      bookingReminder: 'Reminder: Your service is scheduled tomorrow.',
      paymentConfirmation: 'Payment received successfully!'
    }
  })
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_URL}/settings/email`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(emailData)
      })

      const data = await response.json()
      if (data.success) {
        onUpdate({ email: emailData })
        alert('Email settings updated successfully!')
      } else {
        throw new Error(data.message || 'Failed to update email settings')
      }
    } catch (error) {
      console.error('Error updating email settings:', error)
      alert('Failed to update email settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Settings
        </CardTitle>
        <CardDescription>
          Configure SMTP settings and email templates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label>Show SMTP Password</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input
              id="smtpHost"
              value={emailData.smtpHost}
              onChange={(e) => setEmailData(prev => ({ ...prev, smtpHost: e.target.value }))}
              placeholder="smtp.gmail.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input
              id="smtpPort"
              type="number"
              value={emailData.smtpPort}
              onChange={(e) => setEmailData(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
              placeholder="587"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtpUser">SMTP Username</Label>
            <Input
              id="smtpUser"
              value={emailData.smtpUser}
              onChange={(e) => setEmailData(prev => ({ ...prev, smtpUser: e.target.value }))}
              placeholder="your-email@gmail.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtpPassword">SMTP Password</Label>
            <Input
              id="smtpPassword"
              type={showPassword ? "text" : "password"}
              value={emailData.smtpPassword}
              onChange={(e) => setEmailData(prev => ({ ...prev, smtpPassword: e.target.value }))}
              placeholder="Enter SMTP password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromEmail">From Email</Label>
            <Input
              id="fromEmail"
              type="email"
              value={emailData.fromEmail}
              onChange={(e) => setEmailData(prev => ({ ...prev, fromEmail: e.target.value }))}
              placeholder="noreply@yourcompany.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromName">From Name</Label>
            <Input
              id="fromName"
              value={emailData.fromName}
              onChange={(e) => setEmailData(prev => ({ ...prev, fromName: e.target.value }))}
              placeholder="Your Company Name"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Email Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Settings Page
export default function SettingsPage() {
  const [settings, setSettings] = useState({
    payment: {},
    general: {},
    notifications: {},
    business: {},
    email: {}
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const API_URL = getApiUrl()
      const headers = getAuthHeaders()
      const response = await fetch(`${API_URL}/settings`, { headers })
      const data = await response.json()
      
      if (data.success) {
        setSettings(data.data.settings || {})
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingsUpdate = (sectionData: any) => {
    setSettings(prev => ({ ...prev, ...sectionData }))
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'business', label: 'Business', icon: Users },
    { id: 'email', label: 'Email', icon: Mail }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading settings...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and configurations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <GeneralSettings settings={settings} onUpdate={handleSettingsUpdate} />
        )}
        
        {activeTab === 'payment' && (
          <PaymentSettings settings={settings} onUpdate={handleSettingsUpdate} />
        )}
        
        {activeTab === 'notifications' && (
          <NotificationSettings settings={settings} onUpdate={handleSettingsUpdate} />
        )}
        
        {activeTab === 'business' && (
          <BusinessSettings settings={settings} onUpdate={handleSettingsUpdate} />
        )}
        
        {activeTab === 'email' && (
          <EmailSettings settings={settings} onUpdate={handleSettingsUpdate} />
        )}
      </div>
    </div>
  )
}
