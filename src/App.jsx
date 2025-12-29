
// Réinitialisation simple pour supprimer les styles par défaut de Vite
import React, { useState, useEffect } from 'react';
import './index.css';
import UseCaseEditor from './components/UseCaseEditor';

function App() {
  const [savedUseCases, setSavedUseCases] = useState([]);
  const [activeUseCase, setActiveUseCase] = useState(null); // null = New Use Case
  const [view, setView] = useState('editor'); // 'editor'
  const [toasts, setToasts] = useState([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('useCases');
    if (saved) {
      setSavedUseCases(JSON.parse(saved));
    }
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleArchive = (useCaseData) => {
    const newUseCase = {
      ...useCaseData,
      id: useCaseData.id || Date.now(), // Generate ID if new
      lastModified: new Date().toISOString()
    };

    let newHistory;
    const existingIndex = savedUseCases.findIndex(u => u.id === newUseCase.id);
    
    if (existingIndex >= 0) {
      // Update existing
      newHistory = [...savedUseCases];
      newHistory[existingIndex] = newUseCase;
    } else {
      // Add new
      newHistory = [newUseCase, ...savedUseCases];
    }

    setSavedUseCases(newHistory);
    localStorage.setItem('useCases', JSON.stringify(newHistory));
    setActiveUseCase(newUseCase);
    showToast('Use Case archivé avec succès !', 'success');
  };

  const loadUseCase = (useCase) => {
    setActiveUseCase(useCase);
    setView('editor');
  };

  const createNew = () => {
    setActiveUseCase(null); // Reset to empty
    setView('editor');
  };

  const deleteUseCase = (e, id) => {
    e.stopPropagation();
    if (confirm('Supprimer ce use case ?')) {
      const newHistory = savedUseCases.filter(u => u.id !== id);
      setSavedUseCases(newHistory);
      localStorage.setItem('useCases', JSON.stringify(newHistory));
      if (activeUseCase && activeUseCase.id === id) {
        setActiveUseCase(null);
      }
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <span>⚡</span> UseCaseForge
        </div>
        <nav>
          <div 
            className={`nav-item ${!activeUseCase ? 'active' : ''}`}
            onClick={createNew}
          >
            + Nouveau Use Case
          </div>
          
          <div className="nav-header" style={{ marginTop: 'var(--space-lg)', paddingLeft: 'var(--space-md)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Mes Projets ({savedUseCases.length})
          </div>
          
          <div className="history-list" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            {savedUseCases.map(uc => (
              <div 
                key={uc.id} 
                className={`nav-item ${activeUseCase?.id === uc.id ? 'active' : ''}`}
                onClick={() => loadUseCase(uc)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}
              >
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {uc.title || 'Sans titre'}
                </div>
                <span 
                  onClick={(e) => deleteUseCase(e, uc.id)}
                  style={{ opacity: 0.5, fontSize: '0.8rem', padding: '2px 6px' }}
                  className="hover-danger"
                >
                  ✕
                </span>
              </div>
            ))}
            {savedUseCases.length === 0 && (
              <div style={{ padding: 'var(--space-md)', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                Aucun projet archivé.
              </div>
            )}
          </div>
        </nav>
      </aside>

      <main className="main-content">
        {view === 'editor' && (
          <UseCaseEditor 
            key={activeUseCase ? activeUseCase.id : 'new'} // Force remount on change
            initialData={activeUseCase}
            onArchive={handleArchive}
            showToast={showToast}
          />
        )}
      </main>

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✅' : 'ℹ️'}</span>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
