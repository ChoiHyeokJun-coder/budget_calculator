import React, { useMemo } from 'react';
// Chart.js 라이브러리에서 원형 차트(Doughnut)를 만드는 도구들을 불러옵니다.
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// 차트를 쓰기 위해 필요한 요소들을 등록해줍니다.
ChartJS.register(ArcElement, Tooltip, Legend);

// ExpenseChart 컴포넌트는 내가 쓴 돈을 시각적으로 예쁘게 쪼개서 보여주는 차트입니다.
const ExpenseChart = ({ expenses }) => {
  
  // [데이터 가공 로직]
  // 리액트의 useMemo를 사용하면, expenses(지출 내역)가 바뀔 때만 이 복잡한 계산을 다시 합니다. (성능 최적화)
  const chartData = useMemo(() => {
    // 1. 카테고리별로 얼마를 썼는지 합산할 임시 공간(객체)을 만듭니다.
    const categoryTotals = {};
    
    // 2. 전체 지출을 하나씩 돌면서 카테고리별로 금액을 더해줍니다.
    expenses.forEach(e => {
      // 만약 아직 '식비'라는 공간이 없으면 0원으로 만들고 시작합니다.
      if (!categoryTotals[e.category]) categoryTotals[e.category] = 0;
      // 해당 카테고리에 금액을 얹습니다.
      categoryTotals[e.category] += e.amount;
    });

    // 3. 만들어진 데이터로 차트에 들어갈 형식(Labels와 Data)을 짭니다.
    const labels = Object.keys(categoryTotals); // 예: ['식비', '교통', '고정비']
    const data = Object.values(categoryTotals); // 예: [50000, 20000, 650000]

    // 차트 라이브러리에 넘겨줄 최종 데이터 설정입니다. (색상 등 디자인 포함)
    return {
      labels,
      datasets: [
        {
          data,
          // 카테고리별로 보여줄 색상(투명도 포함) 리스트입니다.
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)'
          ],
          // 테두리 색상 리스트입니다. (조금 더 진하게)
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)'
          ],
          borderWidth: 1, // 테두리 두께
        },
      ],
    };
  }, [expenses]); // expenses 배열이 바뀔 때마다 이 덩어리를 다시 계산합니다.

  // [차트 옵션 설정]
  // 텍스트 색상을 하얗게 만들고 크기를 조절하는 등 차트의 모양새를 결정합니다.
  const options = {
    responsive: true,
    maintainAspectRatio: false, // 크기를 부모 컨테이너에 맞게 유동적으로 바꿉니다.
    plugins: {
      legend: {
        position: 'right', // 범례(카테고리 이름과 색상 설명)를 오른쪽에 붙입니다.
        labels: {
          color: 'rgba(255, 255, 255, 0.8)', // 글자색을 하얗게 (다크모드용)
          font: { family: "'Inter', sans-serif" }
        }
      },
      tooltip: {
        callbacks: {
          // 마우스를 올렸을 때 말풍선(툴팁)에 "₩1,000" 형태로 금액을 예쁘게 찍어줍니다.
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += '₩' + context.parsed.toLocaleString();
            }
            return label;
          }
        }
      }
    }
  };

  // 만약 쓴 돈이 하나도 없으면 차트를 그리지 않고 끝냅니다. (에러 방지)
  if (expenses.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: '1.5rem', height: '250px' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>카테고리별 지출</h3>
      <div style={{ height: 'calc(100% - 2rem)', position: 'relative' }}>
        {/* 설정한 데이터(chartData)와 옵션(options)을 원형 차트(Doughnut)에 넣어 그립니다. */}
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ExpenseChart;
