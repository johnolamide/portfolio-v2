import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LanguageData {
  name: string;
  value: number;
  percentage: number;
}

interface ChartDataItem extends LanguageData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ProgrammingLanguagesChartProps {
  languages: LanguageData[];
  chartType?: 'bar' | 'pie';
}

const COLORS = [
  '#8b5cf6', // purple-500
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
  '#ec4899', // pink-500
  '#6b7280', // gray-500
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: LanguageData;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
        <p className="text-purple-600 dark:text-purple-400">
          {data.value} repositories ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: LanguageData;
  }>;
}

const CustomPieTooltip = ({ active, payload }: PieTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
        <p className="text-purple-600 dark:text-purple-400">
          {data.value} repositories ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export const ProgrammingLanguagesChart: React.FC<ProgrammingLanguagesChartProps> = ({
  languages,
  chartType = 'bar'
}) => {
  if (!languages || languages.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Programming Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No language data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
          Programming Languages
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Distribution of programming languages across your repositories
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={languages} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={languages as ChartDataItem[]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {languages.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  className="text-gray-600 dark:text-gray-400"
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Language List */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {languages.slice(0, 10).map((lang, index) => (
            <div
              key={lang.name}
              className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {lang.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {lang.value} repos
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};