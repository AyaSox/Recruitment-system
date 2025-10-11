import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { DepartmentStats } from '../../types/dashboard';

interface DepartmentApplicationsChartProps {
  data: DepartmentStats[];
}

const COLORS = ['#1976d2', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb', '#e3f2fd'];

const DepartmentApplicationsChart: React.FC<DepartmentApplicationsChartProps> = ({ data }) => {
  const theme = useTheme();

  const chartData = data.map(dept => ({
    name: dept.department,
    applications: dept.applicationCount,
    avgPerJob: Math.round(dept.averageApplicationsPerJob * 10) / 10,
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
        Applications by Department
      </Typography>
      
      {data.length === 0 ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight={300}
        >
          <Typography variant="body1" color="text.secondary">
            No application data available
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
              dataKey="applications" 
              name="Total Applications" 
              fill={theme.palette.info.main}
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default DepartmentApplicationsChart;
