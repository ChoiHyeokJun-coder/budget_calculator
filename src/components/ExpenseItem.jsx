import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ExpenseItem = ({ expense, deleteExpense, setEditExpenseData }) => {
  return (
    <li style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem', 
      background: 'rgba(255,255,255,0.03)', 
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <span style={{ fontWeight: '500', fontSize: '1.05rem' }}>{expense.name}</span>
        <span style={{ 
          fontSize: '0.75rem', 
          background: 'var(--primary-color)', 
          color: 'white', 
          padding: '0.1rem 0.5rem', 
          borderRadius: 'var(--radius-full)',
          width: 'fit-content'
        }}>
          {expense.category}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>
          ₩{expense.amount.toLocaleString()}
        </span>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn-icon" 
            onClick={() => setEditExpenseData(expense)}
            title="수정"
          >
            <FaEdit />
          </button>
          
          <button 
            className="btn-icon" 
            style={{ color: 'var(--danger)' }}
            onClick={() => deleteExpense(expense.id)}
            title="삭제"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </li>
  );
};

export default ExpenseItem;
