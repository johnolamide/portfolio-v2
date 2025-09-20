import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Treemap, RadialBarChart, RadialBar, Legend
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Grid3X3, Target, TrendingUp } from 'lucide-react';
import type { SkillsChartProps } from '../types';

const SkillsChart: React.FC<SkillsChartProps> = ({ languages }) => {
  const [activeChart, setActiveChart] = useState<'pie' | 'bar' | 'treemap' | 'radial'>('pie');

  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
    '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98',
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/95 backdrop-blur-xl border border-gray-600/50 rounded-xl p-4 shadow-2xl"
        >
          <p className="text-white font-semibold text-lg">{data.name || label}</p>
          <p className="text-purple-300 font-medium">
            {data.percentage ? `${data.percentage}%` : `${(data.value / 1024).toFixed(1)} KB`}
          </p>
          {data.value && (
            <p className="text-gray-400 text-sm">
              {data.value.toLocaleString()} bytes
            </p>
          )}
        </motion.div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name }: any) => {
    if (percentage < 3) return null; // Don't show labels for small slices

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold drop-shadow-lg"
      >
        {name.length > 10 ? `${name.substring(0, 8)}...` : name}
      </text>
    );
  };

  const TreemapTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/95 backdrop-blur-xl border border-gray-600/50 rounded-xl p-4 shadow-2xl"
        >
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-purple-300">{data.percentage}% of codebase</p>
          <p className="text-gray-400 text-sm">{(data.value / 1024).toFixed(1)} KB</p>
        </motion.div>
      );
    }
    return null;
  };

  const TreemapContent = (props: any) => {
    const { depth, x, y, width, height, index, colors, name } = props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: depth < 2 ? colors[Math.floor(index % colors.length)] : 'none',
            stroke: '#fff',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {depth === 1 && width > 60 && height > 30 ? (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-white text-sm font-semibold"
            style={{ fontSize: Math.min(width / 8, height / 4, 14) }}
          >
            {name.length > 8 ? `${name.substring(0, 6)}...` : name}
          </text>
        ) : null}
      </g>
    );
  };

  const chartTabs = [
    { id: 'pie', label: 'Pie Chart', icon: PieIcon },
    { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { id: 'treemap', label: 'Treemap', icon: Grid3X3 },
    { id: 'radial', label: 'Radial', icon: Target },
  ];

  if (!languages || languages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 rounded-2xl blur-2xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="relative z-10">
          <motion.div
            className="flex items-center justify-center mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white text-center mb-4">Skills & Technologies</h3>
          <p className="text-gray-400 text-center">No language data available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mb-8"
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 rounded-2xl blur-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      />

      <motion.div
        className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 overflow-hidden"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10">
          <motion.h3
            className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Skills & Technologies
          </motion.h3>

          {/* Chart Type Tabs */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {chartTabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveChart(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    activeChart === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Chart Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChart}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="h-96 mb-8"
            >
              <ResponsiveContainer width="100%" height="100%">
                <div>
                  {activeChart === 'pie' && (
                    <PieChart>
                      <Pie
                        data={languages}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1500}
                      >
                        {languages.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  )}

                  {activeChart === 'bar' && (
                    <BarChart data={languages} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis
                        dataKey="name"
                        stroke="#ffffff80"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#ffffff80" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="percentage"
                        fill="url(#barGradient)"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  )}

                  {activeChart === 'treemap' && (
                    <Treemap
                      data={languages}
                      dataKey="value"
                      aspectRatio={1.5}
                      stroke="#fff"
                      fill="#8884d8"
                      content={<TreemapContent />}
                      animationDuration={1500}
                    >
                      <Tooltip content={<TreemapTooltip />} />
                    </Treemap>
                  )}

                  {activeChart === 'radial' && (
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="10%"
                      outerRadius="90%"
                      data={languages}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar
                        label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                        background
                        dataKey="percentage"
                        fill="url(#radialGradient)"
                        animationDuration={1500}
                      />
                      <Legend
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        wrapperStyle={{ top: '50%', right: 0, transform: 'translateY(-50%)' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <defs>
                        <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#8884d8" />
                          <stop offset="100%" stopColor="#82ca9d" />
                        </radialGradient>
                      </defs>
                    </RadialBarChart>
                  )}
                </div>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>

          {/* Language Legend */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {languages.slice(0, 10).map((language, index) => (
              <motion.div
                key={language.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="flex items-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div
                  className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-white font-medium text-sm truncate">
                    {language.name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {language.percentage}%
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {languages.length > 10 && (
            <motion.p
              className="text-center text-gray-400 text-sm mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              And {languages.length - 10} more languages...
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SkillsChart;