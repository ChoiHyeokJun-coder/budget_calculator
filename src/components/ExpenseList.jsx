import React, { useState } from 'react';
import ExpenseItem from './ExpenseItem';
import { FaTrash } from 'react-icons/fa';

const ExpenseList = ({ expenses, deleteExpense, clearExpenses, setEditExpenseData }) => {
  const [filter, setFilter] = useState('전체');

  const filteredExpenses = expenses.filter(expense => 
    filter === '전체' ? true : expense.category === filter
  );

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>지출 내역</h3>
        
        <select 
          className="form-input" 
          style={{ width: 'auto', padding: '0.4rem 1rem' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="전체">전체 보기</option>
          <option value="식비">식비</option>
          <option value="교통">교통</option>
          <option value="주거">주거</option>
          <option value="쇼핑">쇼핑</option>
          <option value="여가">여가</option>
          <option value="고정비">고정비</option>
          <option value="기타">기타</option>
        </select>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', opacity: 0.5 }}>
            <p>아직 기록된 지출이 없습니다.</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {filteredExpenses.map(expense => (
              <ExpenseItem 
                key={expense.id} 
                expense={expense} 
                deleteExpense={deleteExpense} 
                setEditExpenseData={setEditExpenseData} 
              />
            ))}
          </ul>
        )}
      </div>

      {expenses.length > 0 && (
        <button 
          className="btn btn-danger" 
          style={{ width: '100%', marginTop: '1.5rem' }}
          onClick={clearExpenses}
        >
          <FaTrash /> 모든 내역 지우기
        </button>
      )}
    </div>
  );
};

export default ExpenseList;
