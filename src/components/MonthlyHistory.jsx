import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FaSave } from 'react-icons/fa';
import { buildMonthlyTrend, formatMonth, getMonthKey } from '../utils/monthlyBudget';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const colors = ['#f472b6', '#38bdf8', '#fbbf24', '#2dd4bf', '#a78bfa', '#fb923c', '#cbd5e1'];
const won = value => `₩${value.toLocaleString('ko-KR')}`;

const MonthlyHistory = ({ history, month, onSave, canSave, saveMessage }) => {
  const [view, setView] = useState('total');
  const { months, records, categories } = useMemo(() => buildMonthlyTrend(history), [history]);
  const recordMap = new Map(records.map(record => [record.month, record]));
  const values = getValue => months.map(key => recordMap.has(key) ? getValue(recordMap.get(key)) : null);
  const datasets = view === 'total' ? [
    { label: '총 지출', data: values(record => record.total), borderColor: '#818cf8' },
    { label: '설정 예산', data: values(record => record.budget), borderColor: '#94a3b8', borderDash: [6, 4] },
  ] : categories.map((category, index) => ({
    label: category,
    data: values(record => record.categories[category] || 0),
    borderColor: colors[index % colors.length],
  }));
  const chartData = {
    labels: months.map(formatMonth),
    datasets: datasets.map(dataset => ({
      ...dataset, backgroundColor: dataset.borderColor, pointRadius: 4, pointHoverRadius: 6,
      borderWidth: 2, spanGaps: false,
    })),
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'bottom', labels: { color: '#cbd5e1', usePointStyle: true } },
      tooltip: { callbacks: { label: context => `${context.dataset.label}: ${won(context.parsed.y)}` } },
    },
    scales: {
      x: { ticks: { color: '#94a3b8', maxRotation: 45 }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: {
        beginAtZero: true,
        ticks: { color: '#94a3b8', callback: value => won(value) },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
    },
  };

  return (
    <section className="monthly-history" aria-labelledby="monthly-history-title">
      <div className="monthly-heading">
        <div>
          <h2 id="monthly-history-title">월별 예산 기록</h2>
          <p className="monthly-muted">저장한 달의 지출을 모아 변화 추세를 확인하세요.</p>
        </div>
        <span className="monthly-badge">{records.length}개월 저장됨</span>
      </div>

      {records.length === 0 ? (
        <p className="monthly-empty">아직 저장한 월이 없습니다. 아래 버튼으로 첫 기록을 남겨보세요.</p>
      ) : (
        <>
          <div className="monthly-view-buttons" role="group" aria-label="추세 보기 방식">
            <button type="button" className={`btn ${view === 'total' ? 'btn-primary' : 'monthly-secondary'}`}
              aria-pressed={view === 'total'} onClick={() => setView('total')}>총액별 추세</button>
            <button type="button" className={`btn ${view === 'category' ? 'btn-primary' : 'monthly-secondary'}`}
              aria-pressed={view === 'category'} onClick={() => setView('category')}>카테고리별 추세</button>
          </div>
          <div className="monthly-chart">
            <Line data={chartData} options={options} role="img"
              aria-label={view === 'total' ? '월별 총 지출과 설정 예산 추세. 아래 표에서 수치를 확인할 수 있습니다.' : '월별 카테고리 지출 추세. 아래 저장 내역에서 수치를 확인할 수 있습니다.'} />
          </div>
          {view === 'category' && categories.length === 0 && <p className="monthly-muted">저장된 지출이 없어 카테고리별 추세를 표시할 수 없습니다.</p>}
          <p className="monthly-muted">
            {records.length === 1 ? '두 달 이상 저장하면 월별 변화 추세를 비교할 수 있습니다.' : '범례를 누르면 원하는 항목만 볼 수 있습니다. 저장하지 않은 달은 빈 구간으로 표시됩니다.'}
          </p>
          <div className="monthly-table-scroll" role="region" aria-label="월별 예산 요약" tabIndex={0}>
            <table className="monthly-table">
              <caption className="monthly-muted">저장된 월별 예산과 지출</caption>
              <thead><tr><th scope="col">월</th><th scope="col">예산</th><th scope="col">총 지출</th><th scope="col">잔여 예산</th></tr></thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.month}>
                    <th scope="row">{formatMonth(record.month)}</th>
                    <td>{won(record.budget)}</td><td>{won(record.total)}</td>
                    <td className={record.budget < record.total ? 'monthly-over-budget' : ''}>{won(record.budget - record.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="monthly-details">
            {[...records].reverse().map(record => (
              <details key={record.month}>
                <summary>{formatMonth(record.month)} 저장 내역 · {record.expenses.length}건</summary>
                <p className="monthly-muted">저장 시각: {new Date(record.savedAt).toLocaleString('ko-KR')}</p>
                <ul className="monthly-category-totals">
                  {Object.entries(record.categories).map(([category, total]) => (
                    <li key={category}><span>{category}</span><strong>{won(total)}</strong></li>
                  ))}
                </ul>
                {record.expenses.length === 0 ? <p className="monthly-muted">지출 없이 저장한 달입니다.</p> : (
                  <ul className="monthly-saved-expenses">
                    {record.expenses.map((expense, index) => (
                      <li key={expense.id || index}><span>{expense.name} <small>{expense.category}</small></span><span>{won(expense.amount)}</span></li>
                    ))}
                  </ul>
                )}
              </details>
            ))}
          </div>
        </>
      )}

      <div className="monthly-save-area">
        <p className="monthly-muted">{formatMonth(month)}의 예산과 지출 내역을 저장합니다. 같은 달을 다시 저장하면 기존 기록이 갱신됩니다.</p>
        <button type="button" className="btn btn-primary monthly-save-button" onClick={onSave} disabled={!canSave}>
          <FaSave aria-hidden="true" /> {month === getMonthKey() ? '이번달 저장하기' : '선택한 달 저장하기'}
        </button>
        <p className="monthly-muted">기록은 이 브라우저에 보관됩니다. 월을 바꾸어도 입력 중인 내역은 유지됩니다.</p>
        <p className={`monthly-save-message ${saveMessage?.error ? 'monthly-over-budget' : ''}`} role="status" aria-live="polite">
          {saveMessage?.text || ''}
        </p>
      </div>
    </section>
  );
};

export default MonthlyHistory;
