import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const UseCaseEditor = ({ initialData, onArchive, showToast }) => {
  const [useCase, setUseCase] = useState(initialData || {
    title: '',
    actor: '',
    description: '',
    preconditions: '',
    steps: [''],
    postconditions: '',
    constraints: ['']
  });

  const [activeStep, setActiveStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const steps = [
    { label: "01. Contexte", icon: "📝" },
    { label: "02. Scénario", icon: "🎬" },
    { label: "03. Validation", icon: "✅" }
  ];

  useEffect(() => {
    if (initialData) {
      setUseCase(initialData);
    }
  }, [initialData]);

  const updateField = (field, value) => {
    setUseCase({ ...useCase, [field]: value });
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...useCase.steps];
    newSteps[index] = value;
    setUseCase({ ...useCase, steps: newSteps });
  };

  const addStep = () => {
    setUseCase({ ...useCase, steps: [...useCase.steps, ''] });
  };

  const removeStep = (index) => {
    const newSteps = useCase.steps.filter((_, i) => i !== index);
    setUseCase({ ...useCase, steps: newSteps });
  };

  const handleConstraintChange = (index, value) => {
    const newConstraints = [...useCase.constraints];
    newConstraints[index] = value;
    setUseCase({ ...useCase, constraints: newConstraints });
  };

  const addConstraint = () => {
    setUseCase({ ...useCase, constraints: [...useCase.constraints, ''] });
  };

  const removeConstraint = (index) => {
    const newConstraints = useCase.constraints.filter((_, i) => i !== index);
    setUseCase({ ...useCase, constraints: newConstraints });
  };

  const generateMarkdown = () => {
    return `# Use Case: ${useCase.title || 'Sans Titre'}
**Acteur Principal:** ${useCase.actor || 'Non spécifié'}

## Contexte
${useCase.description || 'Pas de description fournie.'}

**Pré-conditions:**
${useCase.preconditions || 'Aucune.'}

## Scénario Nominal
${useCase.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Contraintes & Sorties
**Post-conditions:**
${useCase.postconditions || 'Aucune.'}

**Contraintes:**
${useCase.constraints.map(c => `- ${c}`).join('\n')}
`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMarkdown());
    showToast('Contenu Markdown copié !', 'success');
  };

  // --- Step Navigation Helpers ---
  const goNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };
  
  const goBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div className="editor-container relative" style={{ paddingBottom: '80px' }}>
      
      {/* HEADER: Always Visible */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1>{useCase.title || 'Nouveau Use Case'}</h1>
          <div style={{ color: 'var(--text-secondary)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <span>{steps[activeStep].label}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
           <button className="btn btn-secondary" onClick={() => setShowPreview(true)}>
            👁️ Aperçu
          </button>
           <button className="btn btn-secondary" onClick={copyToClipboard}>
            📋 Copier
          </button>
          <button className="btn btn-primary" onClick={() => onArchive(useCase)}>
            💾 Archiver
          </button>
        </div>
      </header>

      {/* STEPPER UI */}
      <div className="stepper">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`stepper-step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
            onClick={() => setActiveStep(index)}
            style={{ cursor: 'pointer' }}
          >
            <div className="step-circle">
              {index < activeStep ? '✓' : index + 1}
            </div>
            <div className="step-label">{step.label}</div>
            <div className="progress-line"></div>
          </div>
        ))}
      </div>

      {/* STEP 1: Definition */}
      {activeStep === 0 && (
        <div className="slide-content">
          <section className="panel">
            <h2>Méta Informations</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label>Titre du Use Case</label>
                <input 
                  type="text" 
                  placeholder="ex: Authentification Utilisateur" 
                  value={useCase.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Acteur Principal</label>
                <input 
                  type="text" 
                  placeholder="ex: Administrateur" 
                  value={useCase.actor}
                  onChange={(e) => updateField('actor', e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Contexte</h2>
            <div className="form-group">
              <label>Description / But</label>
              <textarea 
                placeholder="Quel est l'objectif de cette fonctionnalité ? Pour qui ? Pourquoi ?"
                value={useCase.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Pré-conditions</label>
              <textarea 
                style={{ minHeight: '80px' }}
                placeholder="Ce qui doit être vrai avant de commencer..."
                value={useCase.preconditions}
                onChange={(e) => updateField('preconditions', e.target.value)}
              />
            </div>
          </section>
        </div>
      )}

      {/* STEP 2: Scenario */}
      {activeStep === 1 && (
        <section className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h2>Scénario Nominal</h2>
            <span className="tag tag-blue">{useCase.steps.length} Étapes</span>
          </div>
          
          <div className="steps-container">
            {useCase.steps.map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-number">{index + 1}</div>
                <textarea 
                  style={{ minHeight: '60px' }}
                  value={step}
                  placeholder={`Action de l'étape ${index + 1}...`}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  autoFocus={index === useCase.steps.length - 1} // Autofocus on new step
                />
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.5rem', color: 'var(--danger)', borderColor: 'var(--border-subtle)' }}
                  onClick={() => removeStep(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-md)' }} onClick={addStep}>
            + Ajouter une étape
          </button>
        </section>
      )}

      {/* STEP 3: Constraints & Validation */}
      {activeStep === 2 && (
        <section className="panel">
          <h2>Contraintes & Sorties</h2>
          
          <div className="form-group">
            <label>Post-conditions (Résultat attendu)</label>
            <textarea 
              style={{ minHeight: '80px' }}
              placeholder="L'état du système après succès..."
              value={useCase.postconditions}
              onChange={(e) => updateField('postconditions', e.target.value)}
            />
          </div>

          <label style={{ marginTop: 'var(--space-lg)' }}>Règles de Gestion / Contraintes</label>
          <div className="steps-container">
            {useCase.constraints.map((constraint, index) => (
              <div key={index} className="step-item" style={{ alignItems: 'center' }}>
                <div className="step-number" style={{ background: 'transparent', border: 'none', color: 'var(--warning)' }}>⚠️</div>
                <input 
                  type="text"
                  value={constraint}
                  placeholder="Ex: Le mot de passe doit faire 8 caractères..."
                  onChange={(e) => handleConstraintChange(index, e.target.value)}
                />
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.5rem', color: 'var(--danger)' }}
                  onClick={() => removeConstraint(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-md)' }} onClick={addConstraint}>
            + Ajouter une contrainte
          </button>
        </section>
      )}

      {/* FOOTER NAVIGATION */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: '280px', // width of sidebar
        right: 0, 
        background: 'var(--bg-panel)', 
        padding: 'var(--space-md) var(--space-xl)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 100
      }}>
        <button 
          className="btn btn-secondary" 
          onClick={goBack} 
          disabled={activeStep === 0}
          style={{ opacity: activeStep === 0 ? 0.5 : 1 }}
        >
          ← Précédent
        </button>
        
        {activeStep < steps.length - 1 ? (
          <button className="btn btn-primary" onClick={goNext}>
            Suivant →
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => onArchive(useCase)}>
            💾 Terminer & Archiver
          </button>
        )}
      </div>

      {/* MODAL */}
      {showPreview && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowPreview(false)}>
          <div style={{
            background: 'var(--bg-panel)',
            padding: 'var(--space-xl)',
            borderRadius: 'var(--radius-lg)',
            width: '80%',
            maxWidth: '800px',
            maxHeight: '85vh',
            overflowY: 'auto',
            border: '1px solid var(--border-subtle)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
              <h2>Aperçu Use Case (Markdown)</h2>
              <button className="btn btn-secondary" onClick={() => setShowPreview(false)}>Fermer</button>
            </div>
            
            <div className="markdown-preview" style={{
              background: 'var(--bg-app)', // Darker background for preview content
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-md)',
              overflowY: 'auto',
              maxHeight: '60vh',
              border: '1px solid var(--border-subtle)'
            }}>
              <ReactMarkdown>{generateMarkdown()}</ReactMarkdown>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
              <button className="btn btn-primary" onClick={copyToClipboard}>
                📋 Copier le contenu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UseCaseEditor;
