// You can use  ctx.pageLimit / ctx.totalPagesNum from render()
// and/or ctx.component.label from schema
export function dataGridPagerTemplate(ctx) {
	const compKey = ctx.component?.key || "dataGridPager";
	const label = ctx.component?.label || "Data Grid Pager";

	return `
  <div ref="dataGridPager" class="dataGridPager-${compKey}" role="navigation" aria-label="${label}" style="border: 3px solid #ddd; padding: 10px; text-align: right;">
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
	return ``;
}
