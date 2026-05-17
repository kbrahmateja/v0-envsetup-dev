"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, Server, Loader2, CheckCircle2 } from "lucide-react"
import type { EnvironmentConfig } from "@/lib/deployment-config"
import { Progress } from "@/components/ui/progress"

interface DeploymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: EnvironmentConfig
}

export function DeploymentDialog({ open, onOpenChange, config }: DeploymentDialogProps) {
  const [serverType, setServerType] = useState(config.serverType)
  const [deploying, setDeploying] = useState(false)
  const [deploymentProgress, setDeploymentProgress] = useState(0)
  const [deploymentComplete, setDeploymentComplete] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState("")

  const [cloudConfig, setCloudConfig] = useState({
    provider: "aws",
    region: "us-east-1",
    instanceType: "t3.micro",
  })

  const [dedicatedConfig, setDedicatedConfig] = useState({
    host: "",
    username: "",
    sshKey: "",
  })

  const handleDeploy = async () => {
    setDeploying(true)
    setDeploymentProgress(0)

    const credentials = serverType === "cloud" ? cloudConfig : dedicatedConfig

    try {
      const response = await fetch("/api/deploy-to-server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: { ...config, serverType }, credentials }),
      })

      const result = await response.json()

      // Simulate deployment progress
      for (let i = 0; i <= 100; i += 10) {
        setDeploymentProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      setDeploymentUrl(result.endpoint)
      setDeploymentComplete(true)
    } catch (error) {
      console.error("Deployment failed:", error)
    } finally {
      setDeploying(false)
    }
  }

  const resetDialog = () => {
    setDeploymentProgress(0)
    setDeploymentComplete(false)
    setDeploymentUrl("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) resetDialog()
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Deploy to Server</DialogTitle>
          <DialogDescription>Configure your deployment settings and deploy automatically</DialogDescription>
        </DialogHeader>

        {deploymentComplete ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">Deployment Successful!</h3>
            <p className="text-muted-foreground">Your environment is now live and ready to use</p>
            {deploymentUrl && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Access your application at:</p>
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {deploymentUrl}
                </a>
              </div>
            )}
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        ) : deploying ? (
          <div className="py-8 space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <h3 className="text-center font-semibold">Deploying your environment...</h3>
            <Progress value={deploymentProgress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">{deploymentProgress}% complete</p>
          </div>
        ) : (
          <Tabs value={serverType} onValueChange={(v) => setServerType(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cloud">
                <Cloud className="h-4 w-4 mr-2" />
                Cloud
              </TabsTrigger>
              <TabsTrigger value="dedicated">
                <Server className="h-4 w-4 mr-2" />
                Dedicated Server
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cloud" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Cloud Provider</Label>
                  <Select
                    value={cloudConfig.provider}
                    onValueChange={(v) => setCloudConfig({ ...cloudConfig, provider: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aws">AWS (Amazon Web Services)</SelectItem>
                      <SelectItem value="gcp">GCP (Google Cloud Platform)</SelectItem>
                      <SelectItem value="azure">Azure (Microsoft)</SelectItem>
                      <SelectItem value="digitalocean">DigitalOcean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select
                    value={cloudConfig.region}
                    onValueChange={(v) => setCloudConfig({ ...cloudConfig, region: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                      <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Instance Type</Label>
                  <Select
                    value={cloudConfig.instanceType}
                    onValueChange={(v) => setCloudConfig({ ...cloudConfig, instanceType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="t3.micro">t3.micro (1 vCPU, 1GB RAM)</SelectItem>
                      <SelectItem value="t3.small">t3.small (2 vCPU, 2GB RAM)</SelectItem>
                      <SelectItem value="t3.medium">t3.medium (2 vCPU, 4GB RAM)</SelectItem>
                      <SelectItem value="t3.large">t3.large (2 vCPU, 8GB RAM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleDeploy} className="w-full" size="lg">
                Deploy to Cloud
              </Button>
            </TabsContent>

            <TabsContent value="dedicated" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Server Host / IP</Label>
                  <Input
                    placeholder="192.168.1.100 or server.example.com"
                    value={dedicatedConfig.host}
                    onChange={(e) => setDedicatedConfig({ ...dedicatedConfig, host: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>SSH Username</Label>
                  <Input
                    placeholder="root or ubuntu"
                    value={dedicatedConfig.username}
                    onChange={(e) => setDedicatedConfig({ ...dedicatedConfig, username: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>SSH Private Key (Optional)</Label>
                  <Input
                    type="password"
                    placeholder="Paste your SSH private key"
                    value={dedicatedConfig.sshKey}
                    onChange={(e) => setDedicatedConfig({ ...dedicatedConfig, sshKey: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Or use password authentication when connecting</p>
                </div>
              </div>

              <Button
                onClick={handleDeploy}
                className="w-full"
                size="lg"
                disabled={!dedicatedConfig.host || !dedicatedConfig.username}
              >
                Deploy to Server
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
