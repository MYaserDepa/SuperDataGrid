// You can use  ctx.pageSize / ctx.pageSizeOptions from render()
// and ctx.component.label from schema
export function dataPagerTemplate(ctx) {
	return `<div ref="dataPager" class="datapager-${ctx.component.key}">
            <div class="pager">
                <div class="pager-right">
                    <div class="nav-controls">
                        <button class="nav-btn" ref="firstBtn" title="First page">⇤</button>
                        <button class="nav-btn" ref="prevBtn" title="Previous page">‹</button>
                        <span class="page-info" ref="pageInfo">Page <span ref="currentPage">1</span> of <span ref="totalPages">1</span></span>
                        <button class="nav-btn" ref="nextBtn" title="Next page">›</button>
                        <button class="nav-btn" ref="lastBtn" title="Last page">⇥</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}
