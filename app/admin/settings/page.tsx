import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your admin dashboard settings</p>
      </div>

      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>Email service is configured with Brevo API</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
          <CardDescription>Configure your email sender details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Sender Email</Label>
            <Input value="info@swiftstrikesolutions.com" disabled />
            <p className="text-xs text-muted-foreground">This is configured in your environment variables</p>
          </div>

          <div className="space-y-2">
            <Label>Sender Name</Label>
            <Input value="EnvSetup.dev" disabled />
          </div>

          <div className="space-y-2">
            <Label>Admin Email</Label>
            <Input value="kbrahmateja@gmail.com" disabled />
            <p className="text-xs text-muted-foreground">Receives notifications for new subscribers</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database</CardTitle>
          <CardDescription>Database connection status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm">Connected to Neon PostgreSQL</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Tracking and analytics configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm">Google Analytics: G-XZEY5749RC</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm">Visitor tracking enabled</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Brevo API Key</Label>
            <Input type="password" value="••••••••••••••••" disabled />
            <p className="text-xs text-muted-foreground">Configure in environment variables (BREVO_API_KEY)</p>
          </div>

          <div className="space-y-2">
            <Label>Database URL</Label>
            <Input type="password" value="••••••••••••••••" disabled />
            <p className="text-xs text-muted-foreground">Configure in environment variables (DATABASE_URL)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
