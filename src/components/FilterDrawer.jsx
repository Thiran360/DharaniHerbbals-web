import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import './FilterDrawer.css';
import { useLanguage } from '../context/LanguageContext';

const FILTER_CATEGORIES = [
  {
    id: 'productType',
    label: 'Product Type',
    options: ['Powder', 'Soap', 'Oil', 'Gel', 'Shampoo', 'Food', 'Others']
  },
  {
    id: 'concern',
    label: 'Concern',
    options: ['Acne & Pimples', 'Hairfall', 'Dry Skin', 'Dandruff', 'Immunity', 'Digestion']
  },
  {
    id: 'ingredient',
    label: 'Ingredient',
    options: ['Aloe Vera', 'Turmeric', 'Neem', 'Hibiscus', 'Amla', 'Sandalwood', 'Rose']
  }
];

export default function FilterDrawer({ isOpen, onClose, selectedFilters, setSelectedFilters }) {
  const { language } = useLanguage();
  const [openAccordion, setOpenAccordion] = useState('productType');

  // Local state so we only apply when the user clicks "Apply"
  const [localFilters, setLocalFilters] = useState(selectedFilters || {});

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleCheckboxChange = (categoryId, option) => {
    setLocalFilters(prev => {
      const currentCategorySelections = prev[categoryId] || [];
      if (currentCategorySelections.includes(option)) {
        return {
          ...prev,
          [categoryId]: currentCategorySelections.filter(item => item !== option)
        };
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
            {language === 'ta' ? 'வடிகட்டிகள்' : 'Filter Options'}
          </h2>
          <button className="filter-close-btn" onClick={onClose} aria-label="Close filters">
            <X size={24} />
          </button>
        </div>

        <div className="filter-content">
          {FILTER_CATEGORIES.map((category) => {
            const isOpenAccordion = openAccordion === category.id;
            const selectedCount = (localFilters[category.id] || []).length;
            
            return (
              <div key={category.id} className="filter-accordion">
                <button 
                  className={`filter-accordion-header ${isOpenAccordion ? 'open' : ''}`}
                  onClick={() => toggleAccordion(category.id)}
                >
                  <span>
                    {category.label} 
                    {selectedCount > 0 && <span style={{color: '#22c55e', marginLeft: '6px'}}>({selectedCount})</span>}
                  </span>
                  <ChevronDown size={20} />
                </button>
                
                <div className={`filter-accordion-content ${isOpenAccordion ? 'open' : ''}`}>
                  <div className="filter-checkbox-list">
                    {category.options.map((option) => (
                      <label key={option} className="filter-checkbox-label">
                        <input 
                          type="checkbox"
                          checked={(localFilters[category.id] || []).includes(option)}
                          onChange={() => handleCheckboxChange(category.id, option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="filter-footer">
          <button className="btn-filter-clear" onClick={handleClearAll}>
            {language === 'ta' ? 'அழிக்க' : 'Clear All'}
          </button>
          <button className="btn-filter-apply" onClick={handleApply}>
            {language === 'ta' ? 'பயன்படுத்து' : 'Apply Filters'}
          </button>
        </div>
      </div>
    </>
  );
}
