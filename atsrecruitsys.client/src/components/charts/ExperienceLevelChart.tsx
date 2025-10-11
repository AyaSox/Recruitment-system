import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ExperienceLevelStats } from '../../types/dashboard';

interface ExperienceLevelChartProps {
  data: ExperienceLevelStats[];
}

const COLORS = ['#1976d2', '#2196f3', '#64b5f6', '#90caf9', '#bbdefb'];

const ExperienceLevelChart: React.FC<ExperienceLevelChartProps> = ({ data }) => {
  const theme = useTheme();

  const chartData = data.map(item => ({
    name: item.experienceLevel,
    value: item.count,
  }));

  const renderCustomLabel = (entry: any) => {
    return `${entry.name}: ${entry.value}`;
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Jobs by Experience Level
      </Typography>
      
      {data.length === 0 ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight={300}
        >
          <Typography variant="body1" color="text.secondary">
            No experience level data available
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={renderCustomLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default ExperienceLevelChart;
