import { Button } from './ui/Button';
import { Input } from './ui/Input';

const categories = ['Music', 'Sports', 'Comedy', 'Tech', 'Food', 'Art', 'Conference', 'Workshop', 'Other'];

export const FilterSidebar = ({ filters, onChange, onReset }) => (
  <aside className="glass rounded-2xl p-5 space-y-4 sticky top-24">
    <h3 className="font-bold text-lg">Filters</h3>

    <Input
      label="Search"
      placeholder="Event name..."
      value={filters.search || ''}
      onChange={(e) => onChange({ ...filters, search: e.target.value })}
    />

    <Input
      label="City"
      placeholder="Mumbai, Delhi..."
      value={filters.city || ''}
      onChange={(e) => onChange({ ...filters, city: e.target.value })}
    />

    <div>
      <label className="block text-sm font-medium text-text-muted mb-1.5">Category</label>
      <select
        value={filters.category || ''}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="w-full bg-surface2 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>

    <Input
      label="Date"
      type="date"
      value={filters.date || ''}
      onChange={(e) => onChange({ ...filters, date: e.target.value })}
    />

    <div className="grid grid-cols-2 gap-2">
      <Input
        label="Min ₹"
        type="number"
        placeholder="0"
        value={filters.minPrice || ''}
        onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
      />
      <Input
        label="Max ₹"
        type="number"
        placeholder="5000"
        value={filters.maxPrice || ''}
        onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
      />
    </div>

    <Button variant="secondary" className="w-full" onClick={onReset}>
      Clear Filters
    </Button>
  </aside>
);
