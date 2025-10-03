// You can use  ctx.pageLimit / ctx.totalPagesNum from render()
// and/or ctx.component.label from schema
export function dataGridPlusTemplate(ctx) {
  const compKey = ctx.component?.key || "dataGridPlus";

  return ` 
  <div ref="container" class="dataGridPlus-container"> 
    <div ref="targetComponentTitle"></div> 

    <div ref="dataGridPlus" class="dataGridPlus-grid dataGridPlus-${compKey}"> 
      <div class="dataGridPlus-controls"> 
        <div class="filter-section"> 
          <label>Filter</label> 
          <input type="text" placeholder="Search in any column..." ref="searchInput" /> 
        </div> 

        <div class="sort-section"> 
          <label>Sort</label> 
          <div> 
            <select ref="sortColumn"> 
              <option value="">-- Select column to sort --</option> 
            </select> 
            <button type="button" ref="sortOrderBtn">Asc</button> 
          </div> 
        </div> 
      </div> 
    </div> 

    <div ref="dataGridPlus" class="dataGridPlus-grid-right dataGridPlus-${compKey}"> 
      <div class="pager"> 
        <div class="nav-controls"> 
          <span class="items-on-page"> 
            <span ref="firstItemNum">1</span> to <span ref="lastItemNum">1</span> of <span ref="totalItemsNum">1</span> 
          </span> 

          <button class="nav-btn" ref="firstBtn" data-page="first" title="First page" aria-label="First page" disabled>⇤</button> 
          <button class="nav-btn" ref="prevBtn" data-page="prev" title="Previous page" aria-label="Previous page" disabled>‹</button> 

          <span class="page-info">Page <span ref="currentPageNum">1</span> of <span ref="totalPagesNum">1</span></span> 

          <button class="nav-btn" ref="nextBtn" data-page="next" title="Next page" aria-label="Next page" disabled>›</button> 
          <button class="nav-btn" ref="lastBtn" data-page="last" title="Last page" aria-label="Last page" disabled>⇥</button> 
        </div> 
      </div> 
    </div> 
  </div>`;
}
