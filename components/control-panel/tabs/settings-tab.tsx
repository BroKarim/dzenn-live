import { Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SettingsTab() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings className="h-4 w-4" />
          Settings
        </CardTitle>
        <CardDescription>Configure your preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">Settings feature coming soon...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
