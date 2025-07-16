import { NextRequest, NextResponse } from "next/server";
import { track } from "@vercel/analytics/server";

interface TelemetryEvent {
  event:
    | "install_start"
    | "install_success"
    | "install_error"
    | "init_start"
    | "init_success";
  component?: string;
  framework?: "nextjs" | "vite";
  version: string;
  timestamp: number;
  error?: string;
  metadata?: {
    hasTypeScript?: boolean;
    hasTailwind?: boolean;
    packageManager?: string;
    duration?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const event: TelemetryEvent = await request.json();

    // Log received telemetry for testing
    console.log("📊 Telemetry received:", {
      event: event.event,
      component: event.component,
      framework: event.framework,
      version: event.version,
      timestamp: new Date(event.timestamp).toISOString(),
    });

    // Basic validation
    if (!event.event || !event.version || !event.timestamp) {
      return NextResponse.json(
        { error: "Invalid event data" },
        { status: 400 }
      );
    }

    // Track with Vercel Analytics
    const properties: Record<string, string | number | boolean> = {
      version: event.version,
    };

    // Only include defined values
    if (event.component) properties.component = event.component;
    if (event.framework) properties.framework = event.framework;
    if (event.error) properties.error = event.error;
    if (event.metadata?.hasTypeScript !== undefined)
      properties.hasTypeScript = event.metadata.hasTypeScript;
    if (event.metadata?.hasTailwind !== undefined)
      properties.hasTailwind = event.metadata.hasTailwind;
    if (event.metadata?.packageManager)
      properties.packageManager = event.metadata.packageManager;
    if (event.metadata?.duration !== undefined)
      properties.duration = event.metadata.duration;

    await track(`cli_${event.event}`, properties);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Telemetry error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Telemetry endpoint active" });
}
