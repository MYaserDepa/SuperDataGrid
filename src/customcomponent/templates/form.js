// You can use  ctx.pageLimit / ctx.totalPagesNum from render()
// and/or ctx.component.label from schema
export function dataPagerTemplate(ctx) {
	const compKey = ctx.component?.key || "dataPager";
	const label = ctx.component?.label || "Data Pager";

	// Use ctx values only as safe defaults; attach() will update them.
	const totalItemsDefault = Number(ctx.totalItemsNum ?? 1);
	const currentPageDefault = Number(ctx.currentPageNum ?? 1);
	const totalPagesDefault = Number(ctx.totalPagesNum ?? 1);

	return `<div ref="dataPager" class="datapager-${compKey}" role="navigation" aria-label="${label}" style="border: 3px solid #ddd; padding: 10px;">
    <div class="pager">
        <div class="nav-controls">
          <span class="items-on-page">
            <span ref="firstItemNum">1</span>
            to
            <span ref="lastItemNum">1</span>
            of
            <span ref="totalItemsNum">${totalItemsDefault}</span>
          </span>

          <button class="nav-btn" ref="firstBtn" data-page="first" title="First page" aria-label="First page" disabled>⇤</button>
          <button class="nav-btn" ref="prevBtn" data-page="prev" title="Previous page" aria-label="Previous page" disabled>‹</button>

          <span class="page-info">Page
            <span ref="currentPageNum">${currentPageDefault}</span>
            of
            <span ref="totalPagesNum">${totalPagesDefault}</span>
          </span>

          <button class="nav-btn" ref="nextBtn" data-page="next" title="Next page" aria-label="Next page" disabled>›</button>
          <button class="nav-btn" ref="lastBtn" data-page="last" title="Last page" aria-label="Last page" disabled>⇥</button>
        </div>
    </div>
  </div>`;
}
