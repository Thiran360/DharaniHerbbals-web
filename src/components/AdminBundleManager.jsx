import { useState, useMemo, useEffect } from 'react';
import {
  Package, Plus, Edit2, Trash2, Copy, Check, ExternalLink, Calendar,
  Search, AlertCircle, Sparkles, Tag, Layers, Share2, ToggleLeft, ToggleRight,
  ChevronRight, ArrowRight, DollarSign, Percent, Eye, ShieldCheck, Info
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { showAppToast } from './GlobalToast';
import {
  getStoredBundles, saveBundlesToStorage, calculateBundlePricing,
  isBundleActive, generateCampaignUrl, validateBundleInput, parseProductPrice
} from '../services/bundleService';
import { formatCurrency, formatProductDisplayName } from '../utils/productFormatters';
import './AdminBundleManager.css';

export default function AdminBundleManager() {
  const { products } = useProducts();
  const [bundles, setBundles] = useState(() => getStoredBundles());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundleId, setEditingBundleId] = useState(null);
  const [modalTab, setModalTab] = useState('details'); // 'details' | 'products' | 'pricing' | 'campaign'

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    badge: 'BEST VALUE',
    startDate: '',
    endDate: '',
    isActive: true,
    items: [],
    offerPrice: '',
    campaign: {
      title: '',
      promoText: '',
      ctaLabel: 'Claim Combo Offer',
      utmSource: 'meta_ads',
      utmMedium: 'instagram_story',
      utmCampaign: '',
      utmContent: ''
    }
  });

  const [productSearch, setProductSearch] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [modalCopied, setModalCopied] = useState(false);

  const handleCopyModalUrl = (url) => {
    navigator.clipboard?.writeText(url);
    setModalCopied(true);
    showAppToast('Campaign landing link copied to clipboard!', 'success');
    setTimeout(() => setModalCopied(false), 2500);
  };

  // Sync bundles if updated
  useEffect(() => {
    const handleStorage = () => setBundles(getStoredBundles());
    window.addEventListener('dharani-bundles-updated', handleStorage);
    return () => window.removeEventListener('dharani-bundles-updated', handleStorage);
  }, []);

  // Compute live bundles with pricing
  const enrichedBundles = useMemo(() => {
    return bundles.map(b => {
      const pricing = calculateBundlePricing(b.items, products, b.offerPrice);
      const active = isBundleActive(b);
      const todayStr = new Date().toISOString().split('T')[0];
      let scheduleStatus = 'active';
      if (!b.isActive) scheduleStatus = 'inactive';
      else if (b.startDate && b.startDate > todayStr) scheduleStatus = 'scheduled';
      else if (b.endDate && b.endDate < todayStr) scheduleStatus = 'expired';

      return {
        ...b,
        active,
        scheduleStatus,
        regularTotal: pricing.regularTotal,
        offerPrice: pricing.offerPrice,
        savings: pricing.savings,
        discountPercent: pricing.discountPercent,
        enrichedItems: pricing.items
      };
    });
  }, [bundles, products]);

  // Filtered bundles
  const filteredBundles = useMemo(() => {
    return enrichedBundles.filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.tagline && b.tagline.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!matchesSearch) return false;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'active') return b.scheduleStatus === 'active';
      if (statusFilter === 'scheduled') return b.scheduleStatus === 'scheduled';
      if (statusFilter === 'expired') return b.scheduleStatus === 'expired';
      if (statusFilter === 'inactive') return b.scheduleStatus === 'inactive';
      return true;
    });
  }, [enrichedBundles, searchTerm, statusFilter]);

  // KPI Stats
  const stats = useMemo(() => {
    const total = enrichedBundles.length;
    const activeCount = enrichedBundles.filter(b => b.active).length;
    const avgDiscount = total > 0
      ? Math.round(enrichedBundles.reduce((acc, b) => acc + (b.discountPercent || 0), 0) / total)
      : 0;
    const campaignReady = enrichedBundles.filter(b => b.campaign && b.campaign.utmCampaign).length;

    return { total, activeCount, avgDiscount, campaignReady };
  }, [enrichedBundles]);

  // Pricing calculations for current modal form
  const modalPricing = useMemo(() => {
    return calculateBundlePricing(formState.items, products, formState.offerPrice);
  }, [formState.items, formState.offerPrice, products]);

  // Open Create Modal
  const handleOpenCreate = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const endStr = nextYear.toISOString().split('T')[0];

    setEditingBundleId(null);
    setFormState({
      name: '',
      slug: '',
      tagline: '',
      description: '',
      badge: 'BEST VALUE',
      startDate: today,
      endDate: endStr,
      isActive: true,
      items: [],
      offerPrice: '',
      campaign: {
        title: '',
        promoText: '',
        ctaLabel: 'Claim Combo Offer',
        utmSource: 'meta_ads',
        utmMedium: 'instagram_story',
        utmCampaign: '',
        utmContent: ''
      }
    });
    setValidationErrors([]);
    setModalTab('details');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (b) => {
    setEditingBundleId(b.id);
    setFormState({
      name: b.name || '',
      slug: b.slug || '',
      tagline: b.tagline || '',
      description: b.description || '',
      badge: b.badge || 'BEST VALUE',
      startDate: b.startDate || '',
      endDate: b.endDate || '',
      isActive: b.isActive !== false,
      items: (b.items || []).map(i => ({
        productId: Number(i.productId),
        quantity: Math.max(1, parseInt(i.quantity, 10) || 1),
        productName: i.productName || i.name || '',
        fallbackPrice: i.fallbackPrice || i.unitPrice || 0,
        fallbackImage: i.fallbackImage || i.image || ''
      })),
      offerPrice: b.offerPrice || '',
      campaign: {
        title: b.campaign?.title || '',
        promoText: b.campaign?.promoText || '',
        ctaLabel: b.campaign?.ctaLabel || 'Claim Combo Offer',
        utmSource: b.campaign?.utmSource || 'meta_ads',
        utmMedium: b.campaign?.utmMedium || 'instagram_story',
        utmCampaign: b.campaign?.utmCampaign || '',
        utmContent: b.campaign?.utmContent || ''
      }
    });
    setValidationErrors([]);
    setModalTab('details');
    setIsModalOpen(true);
  };

  // Toggle active status
  const handleToggleStatus = (id) => {
    const updated = bundles.map(b => {
      if (b.id === id) {
        const next = !b.isActive;
        showAppToast(next ? `Activated "${b.name}"` : `Deactivated "${b.name}"`);
        return { ...b, isActive: next, updatedAt: new Date().toISOString() };
      }
      return b;
    });
    setBundles(updated);
    saveBundlesToStorage(updated);
  };

  // Delete bundle
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the bundle "${name}"?`)) {
      const updated = bundles.filter(b => b.id !== id);
      setBundles(updated);
      saveBundlesToStorage(updated);
      showAppToast(`Bundle "${name}" deleted.`);
    }
  };

  // Copy campaign link
  const handleCopyLink = async (b) => {
    const url = generateCampaignUrl(b);
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedId(b.id);
      showAppToast(`Campaign URL for "${b.name}" copied to clipboard!`);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Add product to modal items
  const handleAddProductToBundle = (prod) => {
    const exists = formState.items.some(i => i.productId === prod.id);
    if (exists) {
      showAppToast('Product is already in this bundle. Adjust quantity instead.');
      return;
    }
    const unitPrice = parseProductPrice(prod, 0);
    const newItem = {
      productId: Number(prod.id),
      productName: prod.name,
      quantity: 1,
      fallbackPrice: unitPrice,
      fallbackImage: prod.image || ''
    };
    setFormState(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    setProductSearch('');
  };

  // Update item quantity
  const handleUpdateItemQuantity = (productId, delta) => {
    setFormState(prev => ({
      ...prev,
      items: prev.items.map(it => {
        if (it.productId === productId) {
          const newQty = Math.max(1, it.quantity + delta);
          return { ...it, quantity: newQty };
        }
        return it;
      })
    }));
  };

  // Remove item
  const handleRemoveItem = (productId) => {
    setFormState(prev => ({
      ...prev,
      items: prev.items.filter(it => it.productId !== productId)
    }));
  };

  // Save bundle handler
  const handleSaveBundle = (e) => {
    e.preventDefault();

    const validation = validateBundleInput(formState, products);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      showAppToast(validation.errors[0] || 'Please fix the errors below.');
      return;
    }

    const slug = formState.slug || formState.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cleanOffer = Math.round(parseFloat(formState.offerPrice) || 0);

    let updatedBundles = [...bundles];

    if (editingBundleId) {
      updatedBundles = updatedBundles.map(b => {
        if (b.id === editingBundleId) {
          return {
            ...b,
            ...formState,
            slug,
            offerPrice: cleanOffer,
            updatedAt: new Date().toISOString()
          };
        }
        return b;
      });
      showAppToast(`Updated bundle "${formState.name}"`);
    } else {
      const newBundle = {
        id: 'bundle-' + Date.now(),
        ...formState,
        slug,
        offerPrice: cleanOffer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedBundles = [newBundle, ...updatedBundles];
      showAppToast(`Created new bundle "${formState.name}"`);
    }

    setBundles(updatedBundles);
    saveBundlesToStorage(updatedBundles);
    setIsModalOpen(false);
  };

  // Search product suggestions from actual store products
  const productSearchResults = useMemo(() => {
    if (!productSearch.trim()) return [];
    const term = productSearch.toLowerCase();
    return (products || [])
      .filter(p => p && p.name && p.name.toLowerCase().includes(term))
      .slice(0, 8);
  }, [products, productSearch]);

  return (
    <div className="admin-bundle-manager">
      
      {/* Top Banner */}
      <div className="abm-header">
        <div>
          <h1 className="abm-title">Product Bundles & Combo Offers</h1>
          <p className="abm-subtitle">
            Combine existing products into high-converting promotional combos, set special offer prices, and generate ad-ready campaign links.
          </p>
        </div>
        <button type="button" className="abm-btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          <span>Create New Bundle</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="abm-stats-row">
        <div className="abm-stat-box">
          <div className="abm-stat-icon-wrap emerald">
            <Layers size={20} />
          </div>
          <div className="abm-stat-info">
            <span className="abm-stat-label">Total Bundles</span>
            <span className="abm-stat-val">{stats.total}</span>
          </div>
        </div>

        <div className="abm-stat-box">
          <div className="abm-stat-icon-wrap blue">
            <Sparkles size={20} />
          </div>
          <div className="abm-stat-info">
            <span className="abm-stat-label">Active Combos</span>
            <span className="abm-stat-val">{stats.activeCount}</span>
          </div>
        </div>

        <div className="abm-stat-box">
          <div className="abm-stat-icon-wrap purple">
            <Percent size={20} />
          </div>
          <div className="abm-stat-info">
            <span className="abm-stat-label">Average Savings</span>
            <span className="abm-stat-val">{stats.avgDiscount}% OFF</span>
          </div>
        </div>

        <div className="abm-stat-box">
          <div className="abm-stat-icon-wrap orange">
            <Share2 size={20} />
          </div>
          <div className="abm-stat-info">
            <span className="abm-stat-label">Ad Campaign Ready</span>
            <span className="abm-stat-val">{stats.campaignReady}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="abm-controls-bar">
        <div className="abm-search-wrap">
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search bundles by name or tagline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="abm-status-tabs">
          {['all', 'active', 'scheduled', 'expired', 'inactive'].map((st) => (
            <button
              key={st}
              type="button"
              className={`abm-tab-btn ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bundles List Grid */}
      {filteredBundles.length === 0 ? (
        <div className="abm-empty-state">
          <Package size={48} color="#94a3b8" />
          <h3>No Bundles Found</h3>
          <p>Get started by creating your first promotional combo pack using existing store products.</p>
          <button type="button" className="abm-btn-primary" onClick={handleOpenCreate}>
            <Plus size={18} />
            <span>Create First Bundle</span>
          </button>
        </div>
      ) : (
        <div className="abm-cards-grid">
          {filteredBundles.map((b) => (
            <div key={b.id} className="abm-bundle-card">
              
              {/* Card Header */}
              <div className="abm-card-header">
                <div className="abm-card-badge-row">
                  <span className="abm-tag-pill">{b.badge || 'COMBO'}</span>
                  <span className={`abm-status-badge status-${b.scheduleStatus}`}>
                    {b.scheduleStatus.toUpperCase()}
                  </span>
                </div>

                <div className="abm-card-actions">
                  <button
                    type="button"
                    className="abm-icon-btn"
                    title={b.isActive ? 'Deactivate Bundle' : 'Activate Bundle'}
                    onClick={() => handleToggleStatus(b.id)}
                  >
                    {b.isActive ? <ToggleRight size={22} color="#059669" /> : <ToggleLeft size={22} color="#94a3b8" />}
                  </button>
                  <button
                    type="button"
                    className="abm-icon-btn"
                    title="Edit Bundle"
                    onClick={() => handleOpenEdit(b)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    className="abm-icon-btn danger"
                    title="Delete Bundle"
                    onClick={() => handleDelete(b.id, b.name)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card Title & Description */}
              <div className="abm-card-body">
                <h3 className="abm-card-title">{b.name}</h3>
                {b.tagline && <p className="abm-card-tagline">{b.tagline}</p>}
                <p className="abm-card-desc">{b.description}</p>

                {/* Included Products List */}
                <div className="abm-included-section">
                  <span className="abm-section-label">
                    Included Products ({b.enrichedItems?.length || 0}):
                  </span>
                  <div className="abm-included-thumbs">
                    {b.enrichedItems?.map((item, idx) => (
                      <div key={idx} className="abm-thumb-item" title={`${item.quantity}x ${formatProductDisplayName(item.name)} (${formatCurrency(item.unitPrice)})`}>
                        <img
                          src={item.image || '/logo.png'}
                          alt={item.name}
                          onError={(e) => { e.target.src = '/logo.png'; }}
                        />
                        <span className="abm-qty-badge">{item.quantity}x</span>
                      </div>
                    ))}
                  </div>
                  <ul className="abm-items-text-list">
                    {b.enrichedItems?.map((it, i) => (
                      <li key={i}>
                        <strong>{it.quantity}x</strong> {formatProductDisplayName(it.name)} <span className="abm-muted-price">(@ {formatCurrency(it.unitPrice)})</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing & Savings */}
                <div className="abm-pricing-box">
                  <div className="abm-price-left">
                    <span className="abm-price-offer">{formatCurrency(b.offerPrice)}</span>
                    {b.regularTotal > b.offerPrice && (
                      <span className="abm-price-reg">{formatCurrency(b.regularTotal)}</span>
                    )}
                  </div>
                  {b.savings > 0 && (
                    <span className="abm-savings-tag">
                      Save {formatCurrency(b.savings)} ({b.discountPercent}% OFF)
                    </span>
                  )}
                </div>

                {/* Validity */}
                <div className="abm-validity-row">
                  <Calendar size={13} />
                  <span>
                    {b.startDate || 'Any'} &rarr; {b.endDate || 'Ongoing'}
                  </span>
                </div>

              </div>

              {/* Card Footer: Ad Campaign Tools */}
              <div className="abm-card-footer">
                <button
                  type="button"
                  className="abm-btn-copy-url"
                  onClick={() => handleCopyLink(b)}
                  title="Copy shareable campaign landing URL with UTM tracking parameters"
                >
                  {copiedId === b.id ? (
                    <>
                      <Check size={14} color="#059669" />
                      <span style={{ color: '#059669' }}>Campaign Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Campaign Link</span>
                    </>
                  )}
                </button>

                <a
                  href={`/combo/${b.id || b.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="abm-link-preview"
                  title="Preview Landing Page"
                >
                  <Eye size={15} />
                </a>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT BUNDLE MODAL */}
      {isModalOpen && (
        <div className="abm-modal-backdrop">
          <div className="abm-modal-container">
            
            {/* Modal Header */}
            <div className="abm-modal-header">
              <div>
                <h2>{editingBundleId ? 'Edit Product Bundle' : 'Create Product Bundle & Combo'}</h2>
                <p>Configure product contents, calculate bundle discounts, and set up ad campaign tracking.</p>
              </div>
              <button
                type="button"
                className="abm-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            {/* Validation Errors Alert */}
            {validationErrors.length > 0 && (
              <div className="abm-modal-errors">
                <AlertCircle size={18} />
                <div>
                  <strong>Please correct the following:</strong>
                  <ul>
                    {validationErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Modal Tabs */}
            <div className="abm-modal-tabs">
              <button
                type="button"
                className={modalTab === 'details' ? 'active' : ''}
                onClick={() => setModalTab('details')}
              >
                1. Bundle Details
              </button>
              <button
                type="button"
                className={modalTab === 'products' ? 'active' : ''}
                onClick={() => setModalTab('products')}
              >
                2. Products & Quantities ({formState.items.length})
              </button>
              <button
                type="button"
                className={modalTab === 'pricing' ? 'active' : ''}
                onClick={() => setModalTab('pricing')}
              >
                3. Pricing & Savings
              </button>
              <button
                type="button"
                className={modalTab === 'campaign' ? 'active' : ''}
                onClick={() => setModalTab('campaign')}
              >
                4. Ad Campaign & UTM
              </button>
            </div>

            <form onSubmit={handleSaveBundle} className="abm-modal-form">
              
              {/* TAB 1: DETAILS */}
              {modalTab === 'details' && (
                <div className="abm-tab-pane">
                  <div className="abm-form-group">
                    <label>Bundle Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Herbal Hair Care Combo"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                  </div>

                  <div className="abm-form-row">
                    <div className="abm-form-group">
                      <label>Promotional Badge</label>
                      <input
                        type="text"
                        placeholder="e.g. BEST VALUE, LIMITED OFFER, 15% OFF"
                        value={formState.badge}
                        onChange={(e) => setFormState({ ...formState, badge: e.target.value })}
                      />
                    </div>
                    <div className="abm-form-group">
                      <label>URL Slug (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. herbal-hair-care-combo"
                        value={formState.slug}
                        onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="abm-form-group">
                    <label>Catchy Tagline / Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Complete 3-Step Ayurvedic Hair Care Routine"
                      value={formState.tagline}
                      onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
                    />
                  </div>

                  <div className="abm-form-group">
                    <label>Description & Customer Benefits</label>
                    <textarea
                      rows="3"
                      placeholder="Explain what this combo solves and why customers should buy all items together..."
                      value={formState.description}
                      onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                    />
                  </div>

                  <div className="abm-form-row">
                    <div className="abm-form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={formState.startDate}
                        onChange={(e) => setFormState({ ...formState, startDate: e.target.value })}
                      />
                    </div>
                    <div className="abm-form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={formState.endDate}
                        onChange={(e) => setFormState({ ...formState, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="abm-checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formState.isActive}
                        onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
                      />
                      <span>Bundle is Active (visible on website within scheduled dates)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS SELECTION */}
              {modalTab === 'products' && (
                <div className="abm-tab-pane">
                  
                  {/* Product Picker */}
                  <div className="abm-picker-section">
                    <label className="abm-label-bold">Search and Add Products from Store Database ({products.length} available):</label>
                    <div className="abm-product-search-input">
                      <Search size={18} color="#94a3b8" />
                      <input
                        type="text"
                        placeholder="Type product name (e.g. shampoo, hair oil, powder)..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                    </div>

                    {/* Suggestions dropdown */}
                    {productSearchResults.length > 0 && (
                      <div className="abm-search-dropdown">
                        {productSearchResults.map((p) => {
                          const price = parseProductPrice(p);
                          const isAlreadyAdded = formState.items.some(it => it.productId === p.id);

                          return (
                            <div
                              key={p.id}
                              className={`abm-dropdown-item ${isAlreadyAdded ? 'disabled' : ''}`}
                              onClick={() => !isAlreadyAdded && handleAddProductToBundle(p)}
                            >
                              <img src={p.image || '/logo.png'} alt={p.name} />
                              <div className="abm-drop-info">
                                <strong>{p.name}</strong>
                                <span className="abm-drop-meta">ID: #{p.id} • ₹{price}</span>
                              </div>
                              <span className="abm-drop-action">
                                {isAlreadyAdded ? 'Added' : '+ Add to Bundle'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Selected Items List */}
                  <div className="abm-selected-products-list">
                    <label className="abm-label-bold">
                      Configured Bundle Products ({formState.items.length}) — Minimum 2 required:
                    </label>

                    {formState.items.length === 0 ? (
                      <div className="abm-no-items-warning">
                        <AlertCircle size={20} color="#f59e0b" />
                        <span>No products added yet. Use the search bar above to select products.</span>
                      </div>
                    ) : (
                      formState.items.map((item, idx) => {
                        const unitPrice = modalPricing.items[idx]?.unitPrice || item.fallbackPrice || 0;
                        const subTotal = unitPrice * item.quantity;

                        return (
                          <div key={item.productId} className="abm-selected-item-row">
                            <div className="abm-item-index">#{idx + 1}</div>
                            <img
                              src={modalPricing.items[idx]?.image || item.fallbackImage || '/logo.png'}
                              alt={item.productName}
                              className="abm-item-avatar"
                            />
                            <div className="abm-item-main-details">
                              <strong>{modalPricing.items[idx]?.name || item.productName}</strong>
                              <span className="abm-item-unit-price">Unit Price: ₹{unitPrice}</span>
                            </div>

                            {/* Quantity Controls */}
                            <div className="abm-qty-controller">
                              <span className="abm-qty-lbl">Qty:</span>
                              <button
                                type="button"
                                onClick={() => handleUpdateItemQuantity(item.productId, -1)}
                              >
                                -
                              </button>
                              <span className="abm-qty-val">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleUpdateItemQuantity(item.productId, 1)}
                              >
                                +
                              </button>
                            </div>

                            <div className="abm-item-subtotal">
                              <span>Subtotal:</span>
                              <strong>₹{subTotal}</strong>
                            </div>

                            <button
                              type="button"
                              className="abm-btn-remove-item"
                              onClick={() => handleRemoveItem(item.productId)}
                              title="Remove from bundle"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Combined Live Total Notice */}
                  {formState.items.length > 0 && (
                    <div className="abm-live-total-bar">
                      <span>Combined Regular Total from Selected Products:</span>
                      <strong>₹{modalPricing.regularTotal}</strong>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: PRICING & SAVINGS */}
              {modalTab === 'pricing' && (
                <div className="abm-tab-pane">
                  <div className="abm-pricing-summary-card">
                    <div className="abm-pricing-stat">
                      <span className="abm-stat-title">Regular Combined Total</span>
                      <span className="abm-stat-number reg">₹{modalPricing.regularTotal}</span>
                      <span className="abm-stat-sub">Sum of all product prices &times; quantities</span>
                    </div>

                    <div className="abm-pricing-stat">
                      <span className="abm-stat-title">Customer Savings</span>
                      <span className="abm-stat-number savings">₹{modalPricing.savings}</span>
                      <span className="abm-stat-sub">({modalPricing.discountPercent}% Discount)</span>
                    </div>
                  </div>

                  <div className="abm-form-group" style={{ marginTop: '24px' }}>
                    <label>Combo Offer Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={modalPricing.regularTotal > 1 ? modalPricing.regularTotal - 1 : undefined}
                      placeholder="e.g. 219"
                      value={formState.offerPrice}
                      onChange={(e) => setFormState({ ...formState, offerPrice: e.target.value })}
                    />
                    <small className="abm-input-hint">
                      Enter the discounted total price customers will pay for this entire bundle. Must be lower than the combined regular price (₹{modalPricing.regularTotal}).
                    </small>
                  </div>

                  {parseFloat(formState.offerPrice) >= modalPricing.regularTotal && modalPricing.regularTotal > 0 && (
                    <div className="abm-error-pill">
                      Offer price must be less than the regular price (₹{modalPricing.regularTotal}) to offer genuine savings!
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: AD CAMPAIGN & UTM LINKS */}
              {modalTab === 'campaign' && (
                <div className="abm-tab-pane">
                  <div className="abm-campaign-intro">
                    <Share2 size={24} color="#059669" />
                    <div>
                      <strong>Prepare Bundle for Advertising Campaigns</strong>
                      <p>Generate tracked landing links ready to plug into Meta Ads (Instagram/Facebook), Google Ads, and WhatsApp broadcasts.</p>
                    </div>
                  </div>

                  <div className="abm-form-group">
                    <label>Ad Campaign Headline / Offer Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Herbal Hair Care Festival — Flat 14% Off Combo"
                      value={formState.campaign.title}
                      onChange={(e) => setFormState({
                        ...formState,
                        campaign: { ...formState.campaign, title: e.target.value }
                      })}
                    />
                  </div>

                  <div className="abm-form-group">
                    <label>Promotional Ad Copy / Hook</label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Say goodbye to harsh chemical shampoos! Switch to pure Siddha hair rejuvenation with our 3-in-1 combo."
                      value={formState.campaign.promoText}
                      onChange={(e) => setFormState({
                        ...formState,
                        campaign: { ...formState.campaign, promoText: e.target.value }
                      })}
                    />
                  </div>

                  <div className="abm-form-row">
                    <div className="abm-form-group">
                      <label>Call-to-Action (CTA) Label</label>
                      <input
                        type="text"
                        placeholder="e.g. Claim Combo Offer"
                        value={formState.campaign.ctaLabel}
                        onChange={(e) => setFormState({
                          ...formState,
                          campaign: { ...formState.campaign, ctaLabel: e.target.value }
                        })}
                      />
                    </div>
                    <div className="abm-form-group">
                      <label>UTM Campaign Name</label>
                      <input
                        type="text"
                        placeholder="e.g. summer_haircare_revival_2026"
                        value={formState.campaign.utmCampaign}
                        onChange={(e) => setFormState({
                          ...formState,
                          campaign: { ...formState.campaign, utmCampaign: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="abm-form-row">
                    <div className="abm-form-group">
                      <label>UTM Source</label>
                      <select
                        value={formState.campaign.utmSource}
                        onChange={(e) => setFormState({
                          ...formState,
                          campaign: { ...formState.campaign, utmSource: e.target.value }
                        })}
                      >
                        <option value="meta_ads">Meta Ads (Facebook & Instagram)</option>
                        <option value="instagram_ads">Instagram Ads</option>
                        <option value="facebook_ads">Facebook Ads</option>
                        <option value="google_ads">Google Ads</option>
                        <option value="whatsapp">WhatsApp Broadcast</option>
                        <option value="email_newsletter">Email Newsletter</option>
                      </select>
                    </div>

                    <div className="abm-form-group">
                      <label>UTM Medium</label>
                      <select
                        value={formState.campaign.utmMedium}
                        onChange={(e) => setFormState({
                          ...formState,
                          campaign: { ...formState.campaign, utmMedium: e.target.value }
                        })}
                      >
                        <option value="instagram_story">Instagram Story</option>
                        <option value="feed_carousel">Feed Carousel</option>
                        <option value="reels_video">Reels Video</option>
                        <option value="paid_search">Paid Search</option>
                        <option value="chat_link">Chat Direct Link</option>
                      </select>
                    </div>
                  </div>

                  {/* Generated URL Box */}
                  {(() => {
                    const previewUrl = generateCampaignUrl(
                      { id: editingBundleId || 'new-bundle', slug: formState.slug || 'combo', campaign: formState.campaign }
                    );
                    return (
                      <div className="abm-generated-url-box">
                        <div className="abm-url-header">
                          <label>Generated Campaign Landing URL:</label>
                          <button
                            type="button"
                            className="abm-btn-mini-copy"
                            onClick={() => handleCopyModalUrl(previewUrl)}
                          >
                            {modalCopied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                            <span>{modalCopied ? 'Copied!' : 'Copy Link'}</span>
                          </button>
                        </div>
                        <div className="abm-url-preview-row">
                          <code>{previewUrl}</code>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Meta Ads Integration & Architecture Notice */}
                  <div className="abm-meta-ads-guide">
                    <div className="abm-guide-header">
                      <ShieldCheck size={20} color="#059669" />
                      <h4>Meta Marketing API & Advertising Architecture</h4>
                    </div>
                    <div className="abm-guide-body">
                      <p>
                        <strong>1. Separation of Concerns:</strong> Bundle creation is strictly decoupled from ad spend. Creating or editing a bundle will never trigger unauthorized ad spend or auto-publish live campaigns.
                      </p>
                      <p>
                        <strong>2. Immediate Promotional Readiness:</strong> The tracked URL above is immediately usable in <em>Meta Ads Manager (Instagram/Facebook)</em>, <em>Google Ads</em>, and <em>WhatsApp Broadcasts</em> with automatic UTM capture.
                      </p>
                      <div className="abm-backend-specs">
                        <strong>Prerequisites for Direct Server-Side Meta Ads Publishing:</strong>
                        <ul>
                          <li><strong>Authorized Backend Endpoint:</strong> <code>POST /herbal/marketing/meta/publish-ad/</code></li>
                          <li><strong>Meta App Product:</strong> Marketing API enabled under Meta Developer Console</li>
                          <li><strong>Required Permissions:</strong> <code>ads_management</code>, <code>ads_read</code>, <code>pages_read_engagement</code></li>
                          <li><strong>Credential Security:</strong> Meta System User Access Token and Ad Account ID (<code>act_XXXXX</code>) must reside strictly on the Django backend server and never leak to client JavaScript.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Modal Footer */}
              <div className="abm-modal-footer">
                <button
                  type="button"
                  className="abm-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="abm-btn-primary">
                  {editingBundleId ? 'Save Bundle Changes' : 'Create Bundle & Launch'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
