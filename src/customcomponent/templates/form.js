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
  <div ref="sortAndFilter" class="sortAndFilter-${compKey}" style="border: 3px solid #ddd; padding: 10px;">
    <div class="sortAndFilter-controls">
      <div class="filter-section"> 
        <input type="text" placeholder="Search in any column..." ref="searchInput" style="padding: 5px; width: 100%; border: 1px solid #ced4da; border-radius: .25rem;" />
      </div>
      
      <div class="sort-section">
      
      </div>
    </div>
  </div>`;
}
