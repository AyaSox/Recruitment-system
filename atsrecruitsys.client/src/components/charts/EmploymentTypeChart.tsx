import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { EmploymentTypeStats } from '../../types/dashboard';

interface EmploymentTypeChartProps {
  data: EmploymentTypeStats[];
}

const COLORS = ['#2e7d32', '#388e3c', '#66bb6a', '#81c784', '#a5d6a7'];

const EmploymentTypeChart: React.FC<EmploymentTypeChartProps> = ({ data }) => {
  const theme = useTheme();

  const chartData = data.map(item => ({
    name: item.employmentType,
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
        Jobs by Employment Type
      </Typography>
      
      {data.length === 0 ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight={300}
        >
          <Typography variant="body1" color="text.secondary">
            No employment type data available
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

export default EmploymentTypeChart;
