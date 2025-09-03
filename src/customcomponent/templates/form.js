// You can use  ctx.pageLimit / ctx.totalPagesNum from render()
// and/or ctx.component.label from schema
export function dataPagerTemplate(ctx) {
	return `<div ref="dataPager" class="datapager-${ctx.component.key}">
            <div class="pager">
                <div class="pager-right">
                    <div class="nav-controls">
                        <span class="items-on-page">${getFirstItemNum(ctx.currentPageNum, ctx.component.pageLimit, ctx.totalItemsNum)} to ${getLastItemNum(ctx.currentPageNum, ctx.component.pageLimit, ctx.totalItemsNum)} of ${ctx.totalItemsNum}</span>
                        <button class="nav-btn" ref="firstBtn" title="First page">⇤</button>
                        <button class="nav-btn" ref="prevBtn" title="Previous page">‹</button>
                        <span class="page-info" ref="pageInfo">Page <span ref="currentPage">${ctx.currentPageNum}</span> of <span ref="totalPages">${ctx.totalPagesNum}</span></span>
                        <button class="nav-btn" ref="nextBtn" title="Next page">›</button>
                        <button class="nav-btn" ref="lastBtn" title="Last page">⇥</button>
                    </div>
                </div>
            </div>
        </div>`;
}

function getFirstItemNum(currentPage, pageLimit, totalItemsNum) {
	if (totalItemsNum === 0) return 0;
	return (currentPage - 1) * pageLimit + 1;
}

function getLastItemNum(currentPage, pageLimit, totalItemsNum) {
	return Math.min(currentPage * pageLimit, totalItemsNum);
}
