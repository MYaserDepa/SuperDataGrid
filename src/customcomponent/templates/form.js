// You can use  ctx.pageLimit / ctx.totalPagesNum from render()
// and/or ctx.component.label from schema
export function dataGridPagerTemplate(ctx) {
	const compKey = ctx.component?.key || "dataGridPager";

	return `
  <div ref="dataGridPager" class="dataGridPager-${compKey}" style="border: 3px solid #ddd; padding: 10px; text-align: right;">
    <div class="pager">
        <div class="nav-controls">
          <span class="items-on-page">
            <span ref="firstItemNum">1</span>
            to
            <span ref="lastItemNum">1</span>
            of
            <span ref="totalItemsNum">1</span>
          </span>

          <button class="nav-btn" ref="firstBtn" data-page="first" title="First page" aria-label="First page" disabled>⇤</button>
          <button class="nav-btn" ref="prevBtn" data-page="prev" title="Previous page" aria-label="Previous page" disabled>‹</button>

          <span class="page-info">Page
            <span ref="currentPageNum">1</span>
            of
            <span ref="totalPagesNum">1</span>
          </span>

          <button class="nav-btn" ref="nextBtn" data-page="next" title="Next page" aria-label="Next page" disabled>›</button>
          <button class="nav-btn" ref="lastBtn" data-page="last" title="Last page" aria-label="Last page" disabled>⇥</button>
        </div>
    </div>
  </div>`;
}

export function sortAndFilterTemplate(ctx) {
	const compKey = ctx.component?.key || "sortAndFilter";

	return `
  <div ref="sortAndFilter" class="sortAndFilter-${compKey}" style="border: 3px solid #ddd; padding: 10px; overflow-x: auto;">
    <div class="sortAndFilter-controls" style="display: flex; flex-wrap: nowrap; gap: 20px; align-items: flex-start; min-width: 520px;">
      
      <div class="filter-section" style="flex: 1;">
        <label style="display:block; font-weight: 600; margin-bottom: 5px;">Filter</label>
        <input type="text" placeholder="Search in any column..." ref="searchInput" style="padding: 5px; width: 100%; border: 1px solid #ced4da; border-radius: .25rem;" />
      </div>
      
      <div class="sort-section" style="flex: 1;">
        <label style="display:block; font-weight: 600; margin-bottom: 5px;">Sort</label>
        <div style="display: flex; align-items: center;">
          <select ref="sortColumn" style="padding: 5px; flex: 1; border: 1px solid #ced4da; border-radius: .25rem;">
            <option value="">-- Select column to sort --</option>
          </select>
          <button type="button" ref="sortOrderBtn" style="padding: 5px 10px; margin-left: 5px; border: 1px solid #ced4da; border-radius: .25rem; cursor: pointer;">
            Asc
          </button>
        </div>
      </div>
    </div>
  </div>`;
}
