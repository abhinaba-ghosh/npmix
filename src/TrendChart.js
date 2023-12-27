import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TrendChart({ packageName, expanded, setExpanded }) {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const registryResponse = await axios.get(`https://registry.npmjs.org/${packageName}`);
        const versions = registryResponse.data.time;
        const initialVersion = Object.keys(versions)[1]; 
        const initialPublishDate = versions[initialVersion].split('T')[0];

        const endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        const downloadUrl = `https://api.npmjs.org/downloads/range/${initialPublishDate}:${endDate}/${packageName}`;
        const downloadResponse = await axios.get(downloadUrl);

        const dates = downloadResponse.data.downloads.map(d => moment(d.day).format('YYYY-MM'));
        const downloadCounts = downloadResponse.data.downloads.map(d => d.downloads);
        const groupedData = dates.reduce((acc, date, index) => {
          acc[date] = (acc[date] || 0) + downloadCounts[index];
          return acc;
        }, {});

        setChartData({
          labels: Object.keys(groupedData),
          datasets: [
            {
              label: 'Monthly Downloads',
              data: Object.values(groupedData),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [packageName]);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <h3>Download Trends for {packageName}</h3>
      {loading ? (
        <div>Loading trends...</div>
      ) : (
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
      )}
    </div>
  );
}

export default TrendChart;
