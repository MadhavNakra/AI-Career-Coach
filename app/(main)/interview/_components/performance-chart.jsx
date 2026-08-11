"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo } from "react";
import { format } from "date-fns";

function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-background border rounded-lg p-3 shadow-md">
      <p className="text-sm font-medium">
        Score: {data.score.toFixed(2)}%
      </p>

      <p className="text-xs text-muted-foreground">
        {data.fullDate}
      </p>
    </div>
  );
}

export default function PerformanceChart({ assessments }) {
  const chartData = useMemo(() => {
    if (!assessments || assessments.length === 0) {
      return [];
    }

    return [...assessments]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      )
      .map((assessment, index) => ({
        // IMPORTANT:
        // Every point gets a unique X-axis value
        index,

        // Actual score from database
        score: Number(assessment.quizScore),

        // Displayed on X-axis
        date: format(
          new Date(assessment.createdAt),
          "MMM dd"
        ),

        // Displayed inside tooltip
        fullDate: format(
          new Date(assessment.createdAt),
          "MMM dd, yyyy • hh:mm a"
        ),
      }));
  }, [assessments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl">
          Performance Trend
        </CardTitle>

        <CardDescription>
          Your quiz scores over time
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="index"
                tickFormatter={(value) =>
                  chartData[value]?.date ?? ""
                }
              />

              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />

              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}