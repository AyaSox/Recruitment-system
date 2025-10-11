import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { DepartmentStats } from '../../types/dashboard';

interface DepartmentJobsChartProps {
  data: DepartmentStats[];
}

const COLORS = ['#2e7d32', '#388e3c', '#43a047', '#4caf50', '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9'];

const DepartmentJobsChart: React.FC<DepartmentJobsChartProps> = ({ data }) => {
  const theme = useTheme();

  const chartData = data.map(dept => ({
    name: dept.department,
    jobs: dept.jobCount,
    active: dept.activeJobs,
  }));

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
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Jobs by Department
      </Typography>
      
      {data.length === 0 ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight={300}
        >
          <Typography variant="body1" color="text.secondary">
            No department data available
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            />
            <YAxis tick={{ fill: theme.palette.text.secondary }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="jobs" 
              name="Total Jobs" 
              fill={theme.palette.primary.main}
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
            <Bar 
              dataKey="active" 
              name="Active Jobs" 
              fill={theme.palette.success.main}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default DepartmentJobsChart;
