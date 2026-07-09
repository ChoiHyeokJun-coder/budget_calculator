import React, { useState } from 'react';
import { FaSave, FaForward } from 'react-icons/fa';

const FixedCostSetup = ({ onComplete, addExpense, budget, setBudget }) => {
  const [initialBudget, setInitialBudget] = useState(budget || 2000000);
  const [rent, setRent] = useState('');
  const [phone, setPhone] = useState('');
  const [internet, setInternet] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    setBudget(Number(initialBudget) || 0);

    const rentAmount = Number(rent) || 0;
    const phoneAmount = Number(phone) || 0;
    const internetAmount = Number(internet) || 0;
    
    const totalFixedCost = rentAmount + phoneAmount + internetAmount;

    if (totalFixedCost > 0) {
      addExpense({
        name: '초기 고정비',
        amount: totalFixedCost,
        category: '고정비'
      });
    }

    onComplete();
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-main)' }}>초기 예산 및 고정비 설정</h2>
      
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        한 달 동안 사용할 총 예산과 매달 고정적으로 나가는 비용을 먼저 설정해주세요. 고정비는 하나로 합산되어 관리됩니다.
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        
        {/* 예산 입력 영역 */}
        <div className="form-group">
          <label className="form-label" style={{ color: 'var(--primary-color)' }}>한 달 총 예산 (원)</label>
          <input 
            type="number" 
            className="form-input" 
            placeholder="예: 2000000" 
            value={initialBudget}
            onChange={(e) => setInitialBudget(e.target.value)}
            min="0"
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }}/>
        
        {/* 고정비 입력 영역 */}
        <div className="form-group">
          <label className="form-label">월세 (원)</label>
          <input 
            type="number" 
            className="form-input" 
            placeholder="예: 500000" 
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">핸드폰 요금 (원)</label>
          <input 
            type="number" 
            className="form-input" 
            placeholder="예: 80000" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">인터넷 요금 (원)</label>
          <input 
            type="number" 
            className="form-input" 
            placeholder="예: 30000" 
            value={internet}
            onChange={(e) => setInternet(e.target.value)}
            min="0"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            type="button" 
            className="btn btn-danger" 
            style={{ flex: 1 }}
            onClick={onComplete}
          >
            <FaForward /> 건너뛰기
          </button>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            <FaSave /> 합산 및 시작하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default FixedCostSetup;
