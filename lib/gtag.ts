export const GA_TRACKING_ID = "G-XZEY5749RC"

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Custom events for EnvSetup.dev
export const trackTemplateView = (templateName: string) => {
  event({
    action: "view_template",
    category: "Templates",
    label: templateName,
  })
}

export const trackEnvironmentGeneration = (language: string, framework?: string) => {
  event({
    action: "generate_environment",
    category: "Generator",
    label: framework ? `${language}-${framework}` : language,
  })
}

export const trackDownload = (type: "zip" | "github" | "cli", template: string) => {
  event({
    action: "download_environment",
    category: "Downloads",
    label: `${type}-${template}`,
  })
}

export const trackPricingView = (plan?: string) => {
  event({
    action: "view_pricing",
    category: "Pricing",
    label: plan,
  })
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
