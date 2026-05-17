// Helper function to generate random numbers within a range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Helper function to generate dates between a range
function getDatesInRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dates.push(format(new Date(currentDate)))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

// Format date to YYYY-MM-DD
function format(date: Date): string {
  return date.toISOString().split("T")[0]
}

// Generate random data for visitor trends
function generateVisitorTrend(startDate: Date, endDate: Date): any {
  const dates = getDatesInRange(startDate, endDate)
  const visitors = dates.map(() => randomInt(500, 2000))
  const pageViews = dates.map(() => randomInt(800, 3000))

  return {
    labels: dates,
    datasets: [
      {
        label: "Total Visitors",
        data: visitors,
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        tension: 0.3,
      },
      {
        label: "Page Views",
        data: pageViews,
        borderColor: "rgba(236, 72, 153, 1)",
        backgroundColor: "rgba(236, 72, 153, 0.2)",
        tension: 0.3,
      },
    ],
  }
}

// Generate random data for template trends
function generateTemplateTrends(startDate: Date, endDate: Date): any {
  const dates = getDatesInRange(startDate, endDate)
  const mernData = dates.map(() => randomInt(50, 200))
  const nextjsData = dates.map(() => randomInt(80, 250))
  const t3Data = dates.map(() => randomInt(30, 150))

  return {
    labels: dates,
    datasets: [
      {
        label: "MERN Stack",
        data: mernData,
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        tension: 0.3,
      },
      {
        label: "Next.js + Tailwind",
        data: nextjsData,
        borderColor: "rgba(236, 72, 153, 1)",
        backgroundColor: "rgba(236, 72, 153, 0.2)",
        tension: 0.3,
      },
      {
        label: "T3 Stack",
        data: t3Data,
        borderColor: "rgba(251, 146, 60, 1)",
        backgroundColor: "rgba(251, 146, 60, 0.2)",
        tension: 0.3,
      },
    ],
  }
}

// Generate random data for session duration
function generateSessionDuration(startDate: Date, endDate: Date): any {
  const dates = getDatesInRange(startDate, endDate)
  const durations = dates.map(() => randomInt(120, 480))

  return {
    labels: dates,
    datasets: [
      {
        label: "Avg. Session Duration (seconds)",
        data: durations,
        borderColor: "rgba(168, 85, 247, 1)",
        backgroundColor: "rgba(168, 85, 247, 0.2)",
        tension: 0.3,
      },
    ],
  }
}

// Generate random data for bounce rate
function generateBounceRate(startDate: Date, endDate: Date): any {
  const dates = getDatesInRange(startDate, endDate)
  const rates = dates.map(() => randomInt(20, 60))

  return {
    labels: dates,
    datasets: [
      {
        label: "Bounce Rate (%)",
        data: rates,
        borderColor: "rgba(248, 113, 113, 1)",
        backgroundColor: "rgba(248, 113, 113, 0.2)",
        tension: 0.3,
      },
    ],
  }
}

// Mock data for analytics dashboard
export const mockAnalyticsData = {
  overview: {
    totalVisitors: 12543,
    pageViews: 45231,
    downloads: 3421,
    conversionRate: 27.3,
    visitorChange: 12.5,
    pageViewChange: 8.3,
    downloadChange: 15.7,
    conversionChange: 2.1,
  },

  visitorTrends: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    visitors: Math.floor(Math.random() * 500) + 200,
    pageViews: Math.floor(Math.random() * 1500) + 800,
  })),

  topTemplates: [
    { name: "React TypeScript Starter", language: "TypeScript", downloads: 1234, percentage: 36 },
    { name: "Next.js Full-Stack", language: "TypeScript", downloads: 987, percentage: 29 },
    { name: "Python FastAPI", language: "Python", downloads: 654, percentage: 19 },
    { name: "Vue 3 Composition API", language: "TypeScript", downloads: 432, percentage: 13 },
    { name: "Django REST API", language: "Python", downloads: 114, percentage: 3 },
  ],

  geographicDistribution: [
    { country: "United States", visitors: 4521, percentage: 36 },
    { country: "United Kingdom", visitors: 2134, percentage: 17 },
    { country: "Germany", visitors: 1876, percentage: 15 },
    { country: "Canada", visitors: 1432, percentage: 11 },
    { country: "France", visitors: 987, percentage: 8 },
    { country: "Others", visitors: 1593, percentage: 13 },
  ],

  deviceStats: [
    { device: "Desktop", visitors: 7526, percentage: 60, color: "#8884d8" },
    { device: "Mobile", visitors: 3761, percentage: 30, color: "#82ca9d" },
    { device: "Tablet", visitors: 1256, percentage: 10, color: "#ffc658" },
  ],

  referralSources: [
    { source: "Direct", visitors: 5017, percentage: 40 },
    { source: "Google", visitors: 3761, percentage: 30 },
    { source: "GitHub", visitors: 2508, percentage: 20 },
    { source: "Twitter", visitors: 879, percentage: 7 },
    { source: "Others", visitors: 378, percentage: 3 },
  ],

  userEngagement: [
    { page: "Home", avgTimeOnPage: 2.5, bounceRate: 45 },
    { page: "Generator", avgTimeOnPage: 4.2, bounceRate: 25 },
    { page: "Templates", avgTimeOnPage: 3.1, bounceRate: 35 },
    { page: "Pricing", avgTimeOnPage: 1.8, bounceRate: 55 },
    { page: "Dashboard", avgTimeOnPage: 5.7, bounceRate: 15 },
  ],
}

export function generateAnalyticsData(startDate: Date, endDate: Date) {
  // Calculate total visitors
  const totalVisitors = randomInt(10000, 50000)
  const totalVisitorsChange = randomInt(-15, 25)

  // Calculate page views
  const pageViews = Math.floor(totalVisitors * randomInt(2, 5))
  const pageViewsChange = randomInt(-10, 30)

  // Calculate click rate
  const clickRate = randomInt(15, 45)
  const clickRateChange = randomInt(-20, 20)

  // Calculate average session time
  const avgMinutes = randomInt(2, 8)
  const avgSeconds = randomInt(0, 59)
  const avgSessionTime = `${avgMinutes}m ${avgSeconds}s`
  const avgSessionTimeChange = randomInt(-15, 15)

  // Calculate bounce rate
  const bounceRate = randomInt(20, 60)
  const bounceRateChange = randomInt(-10, 10)

  return {
    overview: {
      totalVisitors,
      totalVisitorsChange,
      pageViews,
      pageViewsChange,
      clickRate,
      clickRateChange,
      avgSessionTime,
      avgSessionTimeChange,
      bounceRate,
      bounceRateChange,
    },
    visitorTrend: generateVisitorTrend(startDate, endDate),
    templateTrends: generateTemplateTrends(startDate, endDate),
    sessionDuration: generateSessionDuration(startDate, endDate),
    bounceRateData: generateBounceRate(startDate, endDate),
    topTemplates: [
      {
        name: "Next.js + Tailwind",
        count: randomInt(2000, 5000),
        change: randomInt(5, 25),
        category: "Frontend",
      },
      {
        name: "MERN Stack",
        count: randomInt(1500, 4000),
        change: randomInt(-5, 15),
        category: "Full Stack",
      },
      {
        name: "T3 Stack",
        count: randomInt(1000, 3000),
        change: randomInt(10, 30),
        category: "Full Stack",
      },
      {
        name: "Django + PostgreSQL",
        count: randomInt(800, 2500),
        change: randomInt(-10, 10),
        category: "Backend",
      },
      {
        name: "Spring Boot + React",
        count: randomInt(500, 2000),
        change: randomInt(-15, 5),
        category: "Full Stack",
      },
    ],
    geographicData: [
      {
        country: "United States",
        visitors: randomInt(5000, 15000),
        percentage: randomInt(30, 40),
      },
      {
        country: "India",
        visitors: randomInt(3000, 8000),
        percentage: randomInt(15, 25),
      },
      {
        country: "United Kingdom",
        visitors: randomInt(2000, 5000),
        percentage: randomInt(10, 15),
      },
      {
        country: "Germany",
        visitors: randomInt(1000, 3000),
        percentage: randomInt(5, 10),
      },
      {
        country: "Canada",
        visitors: randomInt(800, 2500),
        percentage: randomInt(3, 8),
      },
      {
        country: "Others",
        visitors: randomInt(2000, 6000),
        percentage: randomInt(10, 20),
      },
    ],
    deviceStats: [
      {
        device: "Desktop",
        count: randomInt(6000, 20000),
        percentage: randomInt(50, 65),
      },
      {
        device: "Mobile",
        count: randomInt(3000, 15000),
        percentage: randomInt(25, 40),
      },
      {
        device: "Tablet",
        count: randomInt(500, 3000),
        percentage: randomInt(5, 15),
      },
    ],
    referralSources: [
      {
        source: "Google",
        count: randomInt(5000, 15000),
        percentage: randomInt(30, 45),
      },
      {
        source: "Direct",
        count: randomInt(3000, 10000),
        percentage: randomInt(20, 30),
      },
      {
        source: "GitHub",
        count: randomInt(2000, 8000),
        percentage: randomInt(15, 25),
      },
      {
        source: "Twitter",
        count: randomInt(1000, 5000),
        percentage: randomInt(5, 15),
      },
      {
        source: "LinkedIn",
        count: randomInt(800, 3000),
        percentage: randomInt(3, 10),
      },
      {
        source: "Other",
        count: randomInt(500, 2000),
        percentage: randomInt(2, 8),
      },
    ],
    userEngagement: {
      metrics: [
        {
          name: "Conversion Rate",
          value: `${randomInt(2, 8)}%`,
          target: "10%",
          progress: randomInt(20, 80),
        },
        {
          name: "Templates Generated",
          value: randomInt(5000, 20000),
          target: 25000,
          progress: randomInt(20, 80),
        },
        {
          name: "Returning Users",
          value: `${randomInt(20, 40)}%`,
          target: "50%",
          progress: randomInt(40, 80),
        },
      ],
      pageEngagement: [
        {
          page: "Homepage",
          views: randomInt(5000, 15000),
          avgTimeOnPage: `${randomInt(1, 3)}m ${randomInt(0, 59)}s`,
          bounceRate: randomInt(30, 60),
        },
        {
          page: "Templates",
          views: randomInt(3000, 10000),
          avgTimeOnPage: `${randomInt(2, 5)}m ${randomInt(0, 59)}s`,
          bounceRate: randomInt(20, 50),
        },
        {
          page: "Generator",
          views: randomInt(2000, 8000),
          avgTimeOnPage: `${randomInt(3, 8)}m ${randomInt(0, 59)}s`,
          bounceRate: randomInt(15, 40),
        },
        {
          page: "Pricing",
          views: randomInt(1000, 5000),
          avgTimeOnPage: `${randomInt(1, 4)}m ${randomInt(0, 59)}s`,
          bounceRate: randomInt(25, 55),
        },
        {
          page: "Documentation",
          views: randomInt(800, 3000),
          avgTimeOnPage: `${randomInt(4, 10)}m ${randomInt(0, 59)}s`,
          bounceRate: randomInt(10, 30),
        },
      ],
    },
  }
}
