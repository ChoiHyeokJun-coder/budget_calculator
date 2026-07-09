import React, { useState } from 'react';
import { FaCheck, FaEdit } from 'react-icons/fa';

const BudgetDisplay = ({ budget, setBudget, totalExpenses }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget);

  const handleSave = () => {
    setBudget(Number(tempBudget));
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  const currentBudget = isEditing ? Number(tempBudget) : budget;
  const remaining = currentBudget - totalExpenses;
  const isOverBudget = remaining < 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
      {/* 총 예산 영역 */}
      <div className="alert" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>총 예산</h3>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input 
                type="number" 
                className="form-input" 
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ width: '150px' }}
                autoFocus 
              />
              <button className="btn btn-primary" onClick={handleSave}>
                <FaCheck />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>₩{budget.toLocaleString()}</h2>
              <button className="btn-icon" onClick={() => setIsEditing(true)}>
                <FaEdit />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* 하단 요약 영역 (총 지출 & 잔여 예산) */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* 총 지출 영역 (붉은색) */}
        <div className="alert alert-danger" style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.2rem' }}>총 지출</h3>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₩{totalExpenses.toLocaleString()}</h2>
          </div>
        </div>

        {/* 잔여 예산 영역 */}
        <div className={`alert ${isOverBudget ? 'alert-danger' : 'alert-success'}`} style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.2rem' }}>잔여 예산</h3>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₩{remaining.toLocaleString()}</h2>
          </div>
          {isOverBudget && (
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>⚠️ 예산 초과!</div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default BudgetDisplay;
