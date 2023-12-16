/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { groupByDate } from '../../helper/groupBy';
import { randomColorsArray } from '../../helper/color';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const BarChart = ({
    by = 'hours',
    items = [],
    role = 'admin',
    groupBy = groupByDate,
    title = 'Thống kê bán hàng',
    sliceEnd = 6,
}) => {
    const [data, setData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
         const init = () => {
        const newData = groupBy(items, by, role, sliceEnd);
        setData({
            labels: newData.reduce((labels, currentData) => [...labels, currentData[0]], []),
            datasets: [
                {
                    data: newData.reduce((datas, currentData) => [...datas, currentData[1]], []),
                    label: title,
                    backgroundColor: randomColorsArray(
                        Object.values(newData).length,
                    ),
                },
            ],
        });
    };
        init();
    }, [items, by, role, sliceEnd]);

    return (
        <Bar
            data={data}
            options={{
                legend: { display: false },
                title: {
                    display: true,
                    text: title,
                },
            }}
        />
    );
};

export default BarChart;