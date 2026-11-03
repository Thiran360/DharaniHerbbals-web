import React, { useState, useMemo } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import './FilterDrawer.css';
import { useLanguage } from '../context/LanguageContext';
import { FILTER_CONFIG, matchesProductFilter } from '../utils/filterHelper';

export default function FilterDrawer({ isOpen, onClose, selectedFilters, setSelectedFilters, products = [] }) {
  const { language } = useLanguage();
  const [openAccordion, setOpenAccordion] = useState('productType');

  // Local state so we only apply when the user clicks "Apply"
  const [localFilters, setLocalFilters] = useState(selectedFilters || {});

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  // Compute product count per option from real product catalog
  const countsMap = useMemo(() => {
    const map = {};
    if (!products || products.length === 0) return map;

    FILTER_CONFIG.forEach(cat => {
      cat.options.forEach(opt => {
        const key = `${cat.id}__${opt}`;
        map[key] = products.filter(p => matchesProductFilter(p, cat.id, opt)).length;
      });
    });
    return map;
  }, [products]);

  const handleCheckboxChange = (categoryId, option) => {
    setLocalFilters(prev => {
      const currentCategorySelections = prev[categoryId] || [];
      if (currentCategorySelections.includes(option)) {
        const next = currentCategorySelections.filter(item => item !== option);
        const updated = { ...prev };
        if (next.length > 0) {
          updated[categoryId] = next;
        } else {
          delete updated[categoryId];
        }
        return updated;
      } else {
        return {
          ...prev,
          [categoryId]: [...currentCategorySelections, option]
        };
      }
    });
  };

  const handleClearAll = () => {
    setLocalFilters({});
    setSelectedFilters({});
    onClose();
  };

  const handleApply = () => {
    setSelectedFilters(localFilters);
    onClose();
  };

  // Sync local filters when drawer opens with parent filters
  React.useEffect(() => {
    if (isOpen) {
      setLocalFilters(selectedFilters || {});
    }
  }, [isOpen, selectedFilters]);

  const totalSelectedCount = useMemo(() => {
    return Object.values(localFilters).flat().length;
  }, [localFilters]);

  return (
    <>
      <div 
        className={`filter-drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />
      
      <div className={`filter-drawer ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="21" y2="21" />
              <line x1="4" x2="20" y1="14" y2="14" />
              <line x1="4" x2="20" y1="7" y2="7" />
              <circle cx="9" cy="7" r="1" />
              <circle cx="15" cy="14" r="1" />
              <circle cx="9" cy="21" r="1" />
            </svg>
            {language === 'ta' ? 'வடிகட்டிகள்' : 'Filter Products'}
            {totalSelectedCount > 0 && (
              <span className="filter-total-badge">{totalSelectedCount}</span>
            )}
          </h2>
          <button className="filter-close-btn" onClick={onClose} aria-label="Close filters">
            <X size={24} />
          </button>
        </div>

        <div className="filter-content">
          {FILTER_CONFIG.map((category) => {
            const isOpenAccordion = openAccordion === category.id;
            const selectedCount = (localFilters[category.id] || []).length;
            
            // Filter options to only show those supported by available product data
            const availableOptions = category.options.filter(option => {
              const count = countsMap[`${category.id}__${option}`] ?? 0;
              return count > 0 || (localFilters[category.id] || []).includes(option);
            });

            if (availableOptions.length === 0) return null;

            return (
              <div key={category.id} className="filter-accordion">
                <button 
                  className={`filter-accordion-header ${isOpenAccordion ? 'open' : ''}`}
                  onClick={() => toggleAccordion(category.id)}
                >
                  <span>
                    {category.label} 
                    {selectedCount > 0 && <span style={{ color: '#10b981', marginLeft: '6px', fontWeight: 700 }}>({selectedCount})</span>}
                  </span>
                  <ChevronDown size={20} className="filter-chevron" />
                </button>
                
                <div className={`filter-accordion-content ${isOpenAccordion ? 'open' : ''}`}>
                  <div className="filter-checkbox-list">
                    {availableOptions.map((option) => {
                      const count = countsMap[`${category.id}__${option}`] ?? 0;
                      const isChecked = (localFilters[category.id] || []).includes(option);

                      return (
                        <label key={option} className={`filter-checkbox-label ${isChecked ? 'selected' : ''}`}>
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(category.id, option)}
                          />
                          <span className="filter-opt-text">{option}</span>
                          {count > 0 && (
                            <span className="filter-opt-count">({count})</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="filter-footer">
          <button className="btn-filter-clear" onClick={handleClearAll} disabled={totalSelectedCount === 0}>
            {language === 'ta' ? 'அழிக்க' : 'Reset All'}
          </button>
          <button className="btn-filter-apply" onClick={handleApply}>
            {language === 'ta' ? 'பயன்படுத்து' : `Apply Filters ${totalSelectedCount > 0 ? `(${totalSelectedCount})` : ''}`}
          </button>
        </div>
      </div>
    </>
  );
}
