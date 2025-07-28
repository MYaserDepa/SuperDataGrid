// You can use  ctx.pageSize / ctx.pageSizeOptions from render()
// and ctx.component.label from schema
export default function (ctx) {
  return `<div ref="dataPager" class="datapager-${ctx.component.key}">
        <div class="container">
            <div class="table-container">
                <table class="data-table" ref="dataTable">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Department</th>
                            <th>Line Manager</th>
                            <th>Business Phone #</th>
                            <th>Business Fax #</th>
                            <th>Email Distribution Group</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody ref="tableBody"></tbody>
                </table>
            </div>
            <div class="pager">
                <div class="pager-left">
                    <div class="items-per-page">
                        Items per page:
                        <select ref="itemsPerPage">
                            ${ctx.pageSizeOptions
                              .map(
                                (opt) =>
                                  `<option value="${opt}" ${
                                    opt === ctx.pageSize ? "selected" : ""
                                  }>${opt}</option>`
                              )
                              .join("")}
                        </select>
                    </div>
                </div>
                <div class="pager-right">
                    <div class="page-info" ref="pageInfo"></div>
                    <div class="nav-controls">
                        <button class="nav-btn" ref="firstBtn" title="First page">⇤</button>
                        <button class="nav-btn" ref="prevBtn" title="Previous page">‹</button>
                        <button class="nav-btn" ref="nextBtn" title="Next page">›</button>
                        <button class="nav-btn" ref="lastBtn" title="Last page">⇥</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}
