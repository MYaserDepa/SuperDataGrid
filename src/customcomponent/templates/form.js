// You can use  ctx.pageSize / ctx.pageSizeOptions from render()
// and ctx.component.label from schema
// export function dataPagerTemplate(ctx) {
// 	return `<div ref="dataPager" class="datapager-${ctx.component.key}">
//         <div class="container">
//             <div class="table-container">
//                 <table class="data-table" ref="dataTable">
//                     <thead>
//                         <tr>
//                             <th>Project</th>
//                             <th>Department</th>
//                             <th>Line Manager</th>
//                             <th>Business Phone #</th>
//                             <th>Business Fax #</th>
//                             <th>Email Distribution Group</th>
//                             <th>Remarks</th>
//                         </tr>
//                     </thead>
//                     <tbody ref="tableBody"></tbody>
//                 </table>
//             </div>
//             <div class="pager">
//                 <div class="pager-left">
//                     <div class="items-per-page">
//                         Items per page:
//                         <select ref="itemsPerPage">
//                             ${ctx.pageSizeOptions
// 															.map(
// 																(opt) =>
// 																	`<option value="${opt}" ${
// 																		opt === ctx.pageSize ? "selected" : ""
// 																	}>${opt}</option>`
// 															)
// 															.join("")}
//                         </select>
//                     </div>
//                 </div>
//                 <div class="pager-right">
//                     <div class="page-info" ref="pageInfo"></div>
//                     <div class="nav-controls">
//                         <button class="nav-btn" ref="firstBtn" title="First page">⇤</button>
//                         <button class="nav-btn" ref="prevBtn" title="Previous page">‹</button>
//                         <button class="nav-btn" ref="nextBtn" title="Next page">›</button>
//                         <button class="nav-btn" ref="lastBtn" title="Last page">⇥</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>`;
// }

export function ratingTemplate(ctx) {
	return `
    <div ref="rating">
      ${(function () {
				let icons = "";
				for (let i = 0; i < ctx.numberOfIcons; i++) {
					icons += `<i style="color: ${ctx.component.color}; font-size: ${
						ctx.component.iconSize
					}" class="${ctx.component.icon}${
						i < ctx.filledIcons ? "-fill" : ""
					}" ref="icon"></i>`;
				}
				return icons;
			})()}
    </div>
  `;
}

// DataPager Template Function
export function dataPagerTemplate(ctx) {
	// Return empty div if should be hidden
	if (ctx.hideWhenSinglePage && ctx.totalPages <= 1) {
		return "<div></div>";
	}

	return `
    <div class="formio-datapager ${ctx.customClasses || ""}" id="${ctx.id}">
      <div class="datapager-container">
        <div class="datapager-controls">
          
          ${
						ctx.showPageInfo
							? `
            <div class="datapager-info">
              <span class="datapager-info-text">
                ${ctx.startItem} to ${ctx.endItem} of ${ctx.totalItems} items
              </span>
            </div>
          `
							: ""
					}
          
          <div class="datapager-navigation">
            ${
							ctx.showFirstLast
								? `
              <button 
                type="button" 
                ref="firstButton"
                class="btn btn-sm btn-default datapager-first"
                ${ctx.isFirstPage ? "disabled" : ""}
                aria-label="First page">
                <i class="fa fa-angle-double-left"></i>
              </button>
            `
								: ""
						}
            
            ${
							ctx.showPrevNext
								? `
              <button 
                type="button" 
                ref="prevButton"
                class="btn btn-sm btn-default datapager-prev"
                ${ctx.isFirstPage ? "disabled" : ""}
                aria-label="Previous page">
                <i class="fa fa-angle-left"></i>
              </button>
            `
								: ""
						}
            
            ${
							ctx.showPageNumbers
								? `
              <div class="datapager-pages">
                ${(function () {
									let buttons = "";
									ctx.pageNumbers.forEach(function (pageNum) {
										buttons += `
                      <button 
                        type="button"
                        ref="pageButtons"
                        class="btn btn-sm ${
													pageNum === ctx.currentPage
														? "btn-primary"
														: "btn-default"
												} datapager-page"
                        data-page="${pageNum}"
                        ${
													pageNum === ctx.currentPage
														? 'aria-current="page"'
														: ""
												}
                        aria-label="Page ${pageNum}">
                        ${pageNum}
                      </button>
                    `;
									});
									return buttons;
								})()}
              </div>
            `
								: ""
						}
            
            ${
							ctx.showPrevNext
								? `
              <button 
                type="button" 
                ref="nextButton"
                class="btn btn-sm btn-default datapager-next"
                ${ctx.isLastPage ? "disabled" : ""}
                aria-label="Next page">
                <i class="fa fa-angle-right"></i>
              </button>
            `
								: ""
						}
            
            ${
							ctx.showFirstLast
								? `
              <button 
                type="button" 
                ref="lastButton"
                class="btn btn-sm btn-default datapager-last"
                ${ctx.isLastPage ? "disabled" : ""}
                aria-label="Last page">
                <i class="fa fa-angle-double-right"></i>
              </button>
            `
								: ""
						}
          </div>
          
          ${
						ctx.showPageSizeSelector
							? `
            <div class="datapager-size-selector">
              <label for="${ctx.id}-pagesize" class="datapager-size-label">
                Items per page:
              </label>
              <select 
                ref="pageSizeSelect"
                id="${ctx.id}-pagesize"
                class="form-control datapager-size-select">
                ${(function () {
									let options = "";
									ctx.pageSizes.forEach(function (size) {
										const sizeValue =
											typeof size === "object" ? size.size : size;
										options += `
                      <option 
                        value="${sizeValue}"
                        ${sizeValue == ctx.pageSize ? "selected" : ""}>
                        ${sizeValue}
                      </option>
                    `;
									});
									return options;
								})()}
              </select>
            </div>
          `
							: ""
					}
          
        </div>
      </div>
    </div>
    
    <style>
      .formio-datapager {
        margin: 20px 0;
      }
      
      .datapager-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 15px;
        padding: 10px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
      }
      
      .datapager-controls {
        display: flex;
        align-items: center;
        gap: 15px;
        width: 100%;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      
      .datapager-navigation {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .datapager-pages {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
      }
      
      .datapager-info {
        font-size: 14px;
        color: #6c757d;
      }
      
      .datapager-size-selector {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .datapager-size-label {
        font-size: 14px;
        margin: 0;
        white-space: nowrap;
      }
      
      .datapager-size-select {
        width: auto;
        display: inline-block;
        min-width: 80px;
      }
      
      .datapager-first,
      .datapager-prev,
      .datapager-next,
      .datapager-last,
      .datapager-page {
        min-width: 36px;
        padding: 5px 10px;
      }
      
      .datapager-page.btn-primary {
        font-weight: bold;
      }
      
      @media (max-width: 768px) {
        .datapager-container {
          padding: 10px 5px;
        }
        
        .datapager-controls {
          justify-content: center;
        }
        
        .datapager-info {
          width: 100%;
          text-align: center;
          margin-bottom: 10px;
        }
        
        .datapager-navigation {
          order: 2;
        }
        
        .datapager-size-selector {
          order: 3;
          width: 100%;
          justify-content: center;
          margin-top: 10px;
        }
      }
    </style>
  `;
}
