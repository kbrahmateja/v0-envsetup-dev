import { AIAssistantChat } from "@/components/ai-assistant-chat"

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Environment Assistant</h1>
          <p className="text-xl text-muted-foreground">
            Chat with our AI to discover the perfect software stack for your project
          </p>
        </div>

        <AIAssistantChat />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Smart Recommendations</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized tool and version suggestions based on your requirements
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Auto-Configuration</h3>
            <p className="text-sm text-muted-foreground">
              Automatically generate Docker Compose, deployment scripts, and configs
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">One-Click Deploy</h3>
            <p className="text-sm text-muted-foreground">
              Deploy directly to cloud providers or your own dedicated servers
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
