import { createFileRoute } from '@tanstack/react-router'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/')({ component: App })

const chartData = [
  { month: 'January', students: 32, classes: 14 },
  { month: 'February', students: 41, classes: 16 },
  { month: 'March', students: 38, classes: 15 },
  { month: 'April', students: 46, classes: 18 },
  { month: 'May', students: 44, classes: 19 },
  { month: 'June', students: 52, classes: 21 },
]

const chartConfig = {
  students: {
    label: 'Students',
    color: 'var(--chart-1)',
  },
  classes: {
    label: 'Classes',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

function App() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Overview</CardTitle>
          <CardDescription>Students and classes by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-80 w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="students" fill="var(--color-students)" radius={4} />
              <Bar dataKey="classes" fill="var(--color-classes)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
