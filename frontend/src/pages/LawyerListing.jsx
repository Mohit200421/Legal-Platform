import CategorySelect from "@/components/filters/CategorySelect";

<div className="filters">
  <StateSelect
    value={filters.state}
    onChange={(state) =>
      setFilters({ state, city: "", category: filters.category })
    }
  />

  <CitySelect
    state={filters.state}
    value={filters.city}
    onChange={(city) =>
      setFilters({ ...filters, city })
    }
  />

  <CategorySelect
    value={filters.category}
    onChange={(category) =>
      setFilters({ ...filters, category })
    }
  />
</div>
