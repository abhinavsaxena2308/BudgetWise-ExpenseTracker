'use client';

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Category } from '@/lib/types';

type CategoryChartProps = {
  className?: string;
  data: { name: string; value: number; fill: string }[];
  categories: Category[];
};

export function CategoryChart({
  className,
  data,
  categories,
}: CategoryChartProps) {
  const chartConfig = React.useMemo(() => {
    const config: any = {};
    if (categories) {
      categories.forEach((cat) => {
        config[cat.name] = {
          label: cat.name,
          color: cat.color,
        };
      });
    }
    return config;
  }, [categories]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>
          Here's how your spending is distributed across categories.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <ResponsiveContainer>
            <PieChart>
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                outerRadius={80}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.fill}
                    className="focus:outline-none"
                  />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
