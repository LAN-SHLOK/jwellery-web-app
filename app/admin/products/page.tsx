'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Edit3,
  Package,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

import AdminLayout from '@/components/admin/AdminLayout';
import { BRAND_CONFIG } from '@/config/brand';

type CategoryValue = 'ring' | 'chain' | 'earring' | 'bangle' | 'pendant' | 'necklace';

type ProductRecord = {
  category: CategoryValue;
  description?: string;
  gold_weight_grams: number;
  hallmark_number?: string;
  id: string;
  images?: string[];
  jeweller_margin: number;
  making_charge_type: 'fixed' | 'percentage';
  making_charge_value: number;
  name: string;
  pricing?: {
    finalPrice?: number;
  };
  slug: string;
  stock_quantity: number;
};

type ProductFormState = {
  category: CategoryValue;
  description: string;
  gold_weight_grams: string;
  hallmark_number: string;
  imageBase64: string;
  jeweller_margin: string;
  making_charge_type: 'fixed' | 'percentage';
  making_charge_value: string;
  name: string;
  slug: string;
  stock_quantity: string;
};

const CATEGORIES: Array<{ label: string; value: CategoryValue }> = [
  { value: 'ring', label: 'Rings' },
  { value: 'chain', label: 'Chains' },
  { value: 'earring', label: 'Earrings' },
  { value: 'bangle', label: 'Bangles' },
  { value: 'pendant', label: 'Pendants' },
  { value: 'necklace', label: 'Necklaces' },
];

const EMPTY_FORM: ProductFormState = {
  category: 'ring',
  description: '',
  gold_weight_grams: '',
  hallmark_number: '',
  imageBase64: '',
  jeweller_margin: '',
  making_charge_type: 'percentage',
  making_charge_value: '',
  name: '',
  slug: '',
  stock_quantity: '1',
};

function formatCurrency(value?: number) {
  if (!value) {
    return `${BRAND_CONFIG.currency.symbol}0`;
  }

  return `${BRAND_CONFIG.currency.symbol}${value.toLocaleString(BRAND_CONFIG.currency.locale)}`;
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function getStockTone(stock: number) {
  if (stock <= 0) {
    return 'bg-rose-100 text-rose-700';
  }

  if (stock <= 5) {
    return 'bg-amber-100 text-amber-700';
  }

  return 'bg-emerald-100 text-emerald-700';
}

function ProductPanel({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <section
      className={`luxury-panel admin-surface animate-fade-in-up rounded-[30px] p-6 md:p-8 ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </section>
  );
}

function StatCard({
  label,
  note,
  tone,
  value,
}: {
  label: string;
  note: string;
  tone: string;
  value: string;
}) {
  return (
    <div className="luxury-panel admin-hover-card admin-surface rounded-[28px] p-5 md:p-6">
      <div className={`h-2 w-16 rounded-full ${tone}`} />
      <p className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-brand-primary">{value}</p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-text/40">{label}</p>
      <p className="mt-3 text-sm leading-6 text-brand-text/62">{note}</p>
    </div>
  );
}

function Field({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/40">{label}</span>
      {children}
    </label>
  );
}

const baseInputClassName =
  'w-full rounded-[22px] border border-brand-text/8 bg-white/80 px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-accent/40';

export default function ProductManagement() {
  const [allProducts, setAllProducts] = useState<ProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | CategoryValue>('All');
  const [drawerMode, setDrawerMode] = useState<'add' | ProductRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState<ProductFormState>({ ...EMPTY_FORM });

  useEffect(() => {
    void fetchAllProducts();
  }, []);

  async function fetchAllProducts() {
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/products/list', { cache: 'no-store' });
      const data = await response.json();
      setAllProducts(data.products || []);
    } catch (error) {
      console.error('[Admin/Products] Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const search = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.slug.toLowerCase().includes(search) ||
        product.hallmark_number?.toLowerCase().includes(search);
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchQuery, selectedCategory]);

  const categorySummary = useMemo(() => {
    return CATEGORIES.map((category) => {
      const products = allProducts.filter((product) => product.category === category.value);
      return {
        ...category,
        count: products.length,
      };
    }).filter((category) => category.count > 0);
  }, [allProducts]);

  const lowStockCount = useMemo(() => {
    return allProducts.filter((product) => product.stock_quantity > 0 && product.stock_quantity <= 5).length;
  }, [allProducts]);

  const outOfStockCount = useMemo(() => {
    return allProducts.filter((product) => product.stock_quantity <= 0).length;
  }, [allProducts]);

  const averageTicket = useMemo(() => {
    const pricedProducts = allProducts.filter((product) => Number(product.pricing?.finalPrice || 0) > 0);

    if (!pricedProducts.length) {
      return 0;
    }

    const total = pricedProducts.reduce((sum, product) => sum + Number(product.pricing?.finalPrice || 0), 0);
    return Math.round(total / pricedProducts.length);
  }, [allProducts]);

  const priceRange = useMemo(() => {
    const values = allProducts
      .map((product) => Number(product.pricing?.finalPrice || 0))
      .filter((value) => value > 0)
      .sort((left, right) => left - right);

    if (!values.length) {
      return null;
    }

    return {
      max: values[values.length - 1],
      min: values[0],
    };
  }, [allProducts]);

  const isEditing = drawerMode !== null && drawerMode !== 'add';
  const activeProduct = isEditing ? drawerMode : null;

  function openAdd() {
    setFormData({ ...EMPTY_FORM });
    setFormError('');
    setDrawerMode('add');
  }

  function openEdit(product: ProductRecord) {
    setFormData({
      category: product.category,
      description: product.description || '',
      gold_weight_grams: String(product.gold_weight_grams || ''),
      hallmark_number: product.hallmark_number || '',
      imageBase64: '',
      jeweller_margin: String(product.jeweller_margin || ''),
      making_charge_type: product.making_charge_type || 'percentage',
      making_charge_value: String(product.making_charge_value || ''),
      name: product.name || '',
      slug: product.slug || '',
      stock_quantity: String(product.stock_quantity || 0),
    });
    setFormError('');
    setDrawerMode(product);
  }

  function closeDrawer() {
    if (!isSubmitting) {
      setDrawerMode(null);
    }
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((current) => ({ ...current, imageBase64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    const method = isEditing ? 'PATCH' : 'POST';
    const payload = isEditing && activeProduct ? { id: activeProduct.id, ...formData } : formData;

    try {
      const response = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save product.');
      }

      setDrawerMode(null);
      await fetchAllProducts();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      await fetchAllProducts();
    } catch (error) {
      console.error('[Admin/Products] Delete failed:', error);
      alert('Failed to delete product.');
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-8">
        <ProductPanel delay={0.04}>
          <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <div>
              <p className="section-kicker">Product Studio</p>
              <h2 className="mt-4 max-w-3xl text-3xl text-brand-primary md:text-[3rem] md:leading-[1.02]">
                Catalogue management that feels easier to scan, easier to trust, and easier to keep in shape.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-brand-text/62">
                Review the range, watch stock health, and edit pieces from a layout that treats the catalogue
                like a collection, not a spreadsheet.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={openAdd} className="button-primary rounded-full px-7 py-4">
                  <Plus size={16} />
                  Add new product
                </button>
                <span className="admin-chip inline-flex items-center gap-2 rounded-full border border-brand-text/10 bg-white/65 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/44">
                  <Sparkles size={14} className="text-brand-accent" />
                  {allProducts.length} products in catalogue
                </span>
              </div>
            </div>

            <div className="rounded-[28px] border border-brand-text/8 bg-[linear-gradient(135deg,rgba(56,41,28,0.96)_0%,rgba(92,69,41,0.94)_100%)] p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-accent">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/45">Collection health</p>
                  <h3 className="mt-2 text-2xl">What deserves attention</h3>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  {
                    title: 'Low stock watch',
                    text: lowStockCount > 0 ? `${lowStockCount} products are running low and should be reviewed.` : 'No products are close to running out right now.',
                  },
                  {
                    title: 'Out of stock',
                    text: outOfStockCount > 0 ? `${outOfStockCount} products are currently unavailable in the sample catalogue.` : 'Everything listed still has stock available.',
                  },
                  {
                    title: 'Pricing spread',
                    text: priceRange
                      ? `Pieces currently range from ${formatCurrency(priceRange.min)} to ${formatCurrency(priceRange.max)}.`
                      : 'Add or price products to unlock the range overview.',
                  },
                ].map((item) => (
                  <div key={item.title} className="admin-hover-card rounded-[22px] border border-white/10 bg-white/6 px-4 py-4">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/72">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ProductPanel>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Catalogue Size"
            note="Products currently available to the storefront and demo flow."
            tone="bg-brand-accent"
            value={isLoading ? '...' : String(allProducts.length)}
          />
          <StatCard
            label="Low Stock"
            note="Pieces with five or fewer units left in inventory."
            tone="bg-amber-500"
            value={isLoading ? '...' : String(lowStockCount)}
          />
          <StatCard
            label="Out of Stock"
            note="Pieces that need replenishment before they can sell again."
            tone="bg-rose-500"
            value={isLoading ? '...' : String(outOfStockCount)}
          />
          <StatCard
            label="Average Ticket"
            note="The average visible final price across priced catalogue pieces."
            tone="bg-emerald-500"
            value={isLoading ? '...' : formatCurrency(averageTicket)}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
          <ProductPanel delay={0.1}>
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="section-kicker">Category mix</p>
                <h3 className="mt-2 text-2xl text-brand-primary">Where the collection is concentrated</h3>
              </div>
              <span className="admin-chip rounded-full border border-brand-text/8 bg-white/75 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-text/44">
                {categorySummary.length} active categories
              </span>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="shimmer h-20 rounded-[24px]" />
                ))
              ) : categorySummary.length === 0 ? (
                <div className="rounded-[26px] border border-dashed border-brand-text/10 bg-white/40 px-6 py-16 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-text/38">
                    Add products to unlock category insights
                  </p>
                </div>
              ) : (
                categorySummary.map((category) => {
                  const width = allProducts.length ? (category.count / allProducts.length) * 100 : 0;

                  return (
                    <div key={category.value} className="admin-hover-card rounded-[24px] border border-brand-text/8 bg-white/72 px-5 py-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-brand-primary">{category.label}</p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-brand-text/40">
                            {category.count} pieces listed
                          </p>
                        </div>
                        <span className="text-lg font-semibold text-brand-primary">{category.count}</span>
                      </div>
                      <div className="mt-4 h-2 rounded-full bg-brand-muted/70">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-accent via-[#d9c389] to-brand-primary"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ProductPanel>

          <ProductPanel delay={0.14}>
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name, slug, or hallmark..."
                  className="h-14 w-full rounded-full border border-brand-text/8 bg-white/80 pl-11 pr-4 text-sm outline-none transition focus:border-brand-accent/40"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value as 'All' | CategoryValue)}
                  className="h-14 appearance-none rounded-full border border-brand-text/8 bg-white/80 px-5 pr-11 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-text outline-none transition focus:border-brand-accent/40"
                >
                  <option value="All">All categories</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-text/40" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="admin-chip rounded-full border border-brand-text/8 bg-white/75 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-text/44">
                Showing {filteredProducts.length} piece{filteredProducts.length === 1 ? '' : 's'}
              </span>
              <span className="admin-chip rounded-full border border-brand-text/8 bg-white/75 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-text/44">
                Avg. price {formatCurrency(averageTicket)}
              </span>
            </div>
          </ProductPanel>
        </div>

        <ProductPanel delay={0.18} className="overflow-hidden p-0">
          <div className="border-b border-brand-text/8 px-6 py-5 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="section-kicker">Catalogue view</p>
                <h3 className="mt-2 text-2xl text-brand-primary">Clean cards for everyday editing</h3>
              </div>
              <button onClick={openAdd} className="button-secondary rounded-full px-5 py-3">
                <Plus size={14} />
                Add piece
              </button>
            </div>
          </div>

          <div className="px-6 py-6 md:px-8">
            {isLoading ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="shimmer h-[22rem] rounded-[28px]" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-brand-text/10 bg-white/40 px-6 py-20 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-text/38">
                  No products match this view
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <article
                    key={product.id}
                    className="admin-hover-card animate-fade-in-up overflow-hidden rounded-[28px] border border-brand-text/8 bg-white/78 shadow-[0_18px_38px_rgba(31,24,17,0.06)]"
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    <div className="relative aspect-[4/4.3] overflow-hidden bg-brand-muted/40">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package size={28} className="text-brand-text/20" />
                        </div>
                      )}

                      <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
                        <span className="admin-chip rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-text/60">
                          {product.category}
                        </span>
                        <span className={`admin-chip rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${getStockTone(product.stock_quantity)}`}>
                          {product.stock_quantity} in stock
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 px-5 py-5">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-text/34">
                          {product.slug}
                        </p>
                        <h4 className="mt-2 text-xl font-semibold text-brand-primary">{product.name}</h4>
                        <p className="mt-2 text-sm leading-6 text-brand-text/60">
                          {product.description || 'A ready-to-sell product entry with live gold pricing support.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-[20px] border border-brand-text/8 bg-brand-background/80 px-4 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-text/34">Weight</p>
                          <p className="mt-2 font-semibold text-brand-primary">{product.gold_weight_grams}g</p>
                        </div>
                        <div className="rounded-[20px] border border-brand-text/8 bg-brand-background/80 px-4 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-text/34">Final price</p>
                          <p className="mt-2 font-semibold text-brand-primary">
                            {formatCurrency(Number(product.pricing?.finalPrice || 0))}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 rounded-[22px] border border-brand-text/8 bg-white/70 px-4 py-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-text/34">Hallmark</p>
                          <p className="mt-2 text-sm text-brand-text/62">{product.hallmark_number || 'Pending assignment'}</p>
                        </div>
                        <span className="admin-chip rounded-full border border-brand-text/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-text/46">
                          {product.making_charge_type === 'percentage' ? 'Percent making' : 'Fixed making'}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => openEdit(product)}
                          className="button-secondary admin-chip flex-1 rounded-full px-5 py-3"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="admin-chip inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-700 transition hover:bg-rose-100"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </ProductPanel>

        {drawerMode !== null && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[220] bg-black/45 backdrop-blur-[3px]"
              onClick={closeDrawer}
              aria-label="Close editor overlay"
            />

            <aside className="fixed inset-y-0 right-0 z-[240] flex w-full max-w-[44rem] animate-fade-in overflow-hidden border-l border-brand-text/8 bg-[linear-gradient(180deg,#fbf8f3_0%,#f6f0e7_100%)] shadow-[0_28px_80px_rgba(16,12,8,0.24)]">
              <div className="flex h-full w-full flex-col">
                <div className="border-b border-brand-text/8 px-6 py-5 md:px-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="section-kicker">{isEditing ? 'Edit piece' : 'Add piece'}</p>
                      <h3 className="mt-2 text-2xl text-brand-primary">
                        {isEditing ? activeProduct?.name : 'Create a new product entry'}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-brand-text/58">
                        Keep the form practical: imagery, pricing inputs, hallmark data, and stock in one place.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="rounded-full border border-brand-text/10 p-2 text-brand-text/55 transition hover:border-brand-text/18 hover:text-brand-primary"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
                  {formError && (
                    <div className="mb-5 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
                      {formError}
                    </div>
                  )}

                  <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 xl:grid-cols-[0.78fr_1fr]">
                      <div className="space-y-6">
                        <section className="rounded-[28px] border border-brand-text/8 bg-white/78 p-5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/40">Visual preview</p>
                          <div className="mt-4 aspect-[4/5] overflow-hidden rounded-[24px] border border-brand-text/8 bg-brand-muted/45">
                            {formData.imageBase64 ? (
                              <img src={formData.imageBase64} alt="Selected preview" className="h-full w-full object-cover" />
                            ) : activeProduct?.images?.[0] ? (
                              <img src={activeProduct.images[0]} alt={activeProduct.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package size={28} className="text-brand-text/20" />
                              </div>
                            )}
                          </div>

                          <label className="admin-chip mt-4 flex cursor-pointer items-center justify-center gap-3 rounded-full border border-brand-text/10 bg-white/80 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-text/50 transition hover:border-brand-accent/30 hover:text-brand-accent">
                            <Upload size={14} />
                            {formData.imageBase64 ? 'Replace image' : isEditing ? 'Update image' : 'Upload image'}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" required={!isEditing} />
                          </label>
                        </section>

                        <section className="rounded-[28px] border border-brand-text/8 bg-white/78 p-5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/40">Quick details</p>
                          <div className="mt-4 space-y-4">
                            <div className="rounded-[22px] border border-brand-text/8 bg-brand-background/80 px-4 py-4">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-text/34">Purity</p>
                              <p className="mt-2 font-semibold text-brand-primary">22K fixed</p>
                            </div>
                            <div className="rounded-[22px] border border-brand-text/8 bg-brand-background/80 px-4 py-4">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-text/34">Pricing model</p>
                              <p className="mt-2 text-sm text-brand-text/62">
                                Final price is calculated automatically from gold rate, making charge, margin, and GST.
                              </p>
                            </div>
                          </div>
                        </section>
                      </div>

                      <div className="space-y-6">
                        <section className="rounded-[28px] border border-brand-text/8 bg-white/78 p-5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/40">Identity</p>
                          <div className="mt-4 grid gap-4">
                            <Field label="Product name">
                              <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(event) => {
                                  const nextName = event.target.value;
                                  setFormData((current) => ({
                                    ...current,
                                    name: nextName,
                                    slug: createSlug(nextName),
                                  }));
                                }}
                                className={baseInputClassName}
                                placeholder="Royal Kundan Set"
                              />
                            </Field>

                            <Field label="URL slug">
                              <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(event) =>
                                  setFormData((current) => ({ ...current, slug: createSlug(event.target.value) }))
                                }
                                className={baseInputClassName}
                                placeholder="royal-kundan-set"
                              />
                            </Field>

                            <div className="grid gap-4 md:grid-cols-2">
                              <Field label="Category">
                                <select
                                  value={formData.category}
                                  onChange={(event) =>
                                    setFormData((current) => ({ ...current, category: event.target.value as CategoryValue }))
                                  }
                                  className={baseInputClassName}
                                >
                                  {CATEGORIES.map((category) => (
                                    <option key={category.value} value={category.value}>
                                      {category.label}
                                    </option>
                                  ))}
                                </select>
                              </Field>

                              <Field label="Stock quantity">
                                <input
                                  type="number"
                                  min="0"
                                  required
                                  value={formData.stock_quantity}
                                  onChange={(event) =>
                                    setFormData((current) => ({ ...current, stock_quantity: event.target.value }))
                                  }
                                  className={baseInputClassName}
                                />
                              </Field>
                            </div>
                          </div>
                        </section>

                        <section className="rounded-[28px] border border-brand-text/8 bg-white/78 p-5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/40">Pricing inputs</p>
                          <div className="mt-4 grid gap-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <Field label="Gold weight (g)">
                                <input
                                  type="number"
                                  step="0.001"
                                  required
                                  value={formData.gold_weight_grams}
                                  onChange={(event) =>
                                    setFormData((current) => ({ ...current, gold_weight_grams: event.target.value }))
                                  }
                                  className={baseInputClassName}
                                  placeholder="15.5"
                                />
                              </Field>

                              <Field label="Making charge type">
                                <select
                                  value={formData.making_charge_type}
                                  onChange={(event) =>
                                    setFormData((current) => ({
                                      ...current,
                                      making_charge_type: event.target.value as 'fixed' | 'percentage',
                                    }))
                                  }
                                  className={baseInputClassName}
                                >
                                  <option value="percentage">Percentage</option>
                                  <option value="fixed">Fixed amount</option>
                                </select>
                              </Field>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <Field label={formData.making_charge_type === 'percentage' ? 'Making charge (%)' : `Making charge (${BRAND_CONFIG.currency.symbol})`}>
                                <input
                                  type="number"
                                  step="0.01"
                                  required
                                  value={formData.making_charge_value}
                                  onChange={(event) =>
                                    setFormData((current) => ({ ...current, making_charge_value: event.target.value }))
                                  }
                                  className={baseInputClassName}
                                />
                              </Field>

                              <Field label={`Jeweller margin (${BRAND_CONFIG.currency.symbol})`}>
                                <input
                                  type="number"
                                  step="0.01"
                                  required
                                  value={formData.jeweller_margin}
                                  onChange={(event) =>
                                    setFormData((current) => ({ ...current, jeweller_margin: event.target.value }))
                                  }
                                  className={baseInputClassName}
                                />
                              </Field>
                            </div>
                          </div>
                        </section>

                        <section className="rounded-[28px] border border-brand-text/8 bg-white/78 p-5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-text/40">Story and hallmark</p>
                          <div className="mt-4 grid gap-4">
                            <Field label="BIS hallmark number">
                              <input
                                type="text"
                                value={formData.hallmark_number}
                                onChange={(event) =>
                                  setFormData((current) => ({ ...current, hallmark_number: event.target.value }))
                                }
                                className={baseInputClassName}
                                placeholder="BIS-HM-2026-001"
                              />
                            </Field>

                            <Field label="Description">
                              <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(event) =>
                                  setFormData((current) => ({ ...current, description: event.target.value }))
                                }
                                className={`${baseInputClassName} resize-none`}
                                placeholder="Describe the craftsmanship, setting, or styling story..."
                              />
                            </Field>
                          </div>
                        </section>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="border-t border-brand-text/8 bg-white/72 px-6 py-5 md:px-8">
                  <button
                    type="submit"
                    form="product-form"
                    disabled={isSubmitting}
                    className="button-primary admin-chip w-full justify-center rounded-full py-4 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Saving product
                      </>
                    ) : isEditing ? (
                      <>
                        <Save size={16} />
                        Save changes
                      </>
                    ) : (
                      <>
                        <ArrowRight size={16} />
                        Add to catalogue
                      </>
                    )}
                  </button>
                </div>
              </div>
            </aside>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
