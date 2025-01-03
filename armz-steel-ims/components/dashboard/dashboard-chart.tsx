"use client";
import axios from "axios";
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { format, subDays } from 'date-fns';

interface OrderItem {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface TransactionData {
  date: string;
  sales: number;
  purchases: number;
}

export function DashboardChart() {
  const [data, setData] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get orders for the last 30 days
        const response = await axios.get('/api/orders?period=last30days');
        console.log('API Response:', response.data);
        
        // Create a map to store daily totals
        const dailyTotals = new Map<string, { sales: number; purchases: number }>();
        
        // Initialize last 30 days with zero values
        for (let i = 29; i >= 0; i--) {
          const date = format(subDays(new Date(), i), 'MMM dd');
          dailyTotals.set(date, { sales: 0, purchases: 0 });
        }

        // Process orders
        if (response.data && response.data.orders) {
          response.data.orders.forEach((order: Order) => {
            const orderDate = format(new Date(order.createdAt), 'MMM dd');
            let dailyTotal = dailyTotals.get(orderDate) || { sales: 0, purchases: 0 };

            // Calculate total from order items
            const orderTotal = order.items.reduce((sum, item) => {
              // Check if totalPrice exists, if not calculate from quantity and unitPrice
              const itemTotal = item.totalPrice || (item.quantity * item.unitPrice);
              return sum + (isNaN(itemTotal) ? 0 : itemTotal);
            }, 0);

            // Add to appropriate total based on order type and status
            if (order.status !== 'CANCELLED') {
              const orderType = order.type.toUpperCase();
              if (orderType === 'SALE' || orderType === 'SALES') {
                dailyTotal.sales += orderTotal;
                console.log(`Added ${orderTotal} to sales for ${orderDate}. New total: ${dailyTotal.sales}`);
              } else if (orderType === 'PURCHASE' || orderType === 'PURCHASES') {
                dailyTotal.purchases += orderTotal;
                console.log(`Added ${orderTotal} to purchases for ${orderDate}. New total: ${dailyTotal.purchases}`);
              }
              dailyTotals.set(orderDate, dailyTotal);
            }
          });
        }

        // Convert map to array and sort by date
        const chartData = Array.from(dailyTotals.entries())
          .map(([date, totals]) => ({
            date,
            sales: Math.round(totals.sales),
            purchases: Math.round(totals.purchases)
          }))
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
          });

        console.log('Final Chart Data:', chartData);
        setData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-medium">Transaction Overview</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            Loading...
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium">Transaction Overview</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `Rs. ${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, '']}
                contentStyle={{ background: 'white', border: '1px solid #ccc' }}
                labelStyle={{ color: '#666' }}
              />
              <Legend />
              <Line
                type="monotone"
                name="Sales"
                dataKey="sales"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                name="Purchases"
                dataKey="purchases"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}