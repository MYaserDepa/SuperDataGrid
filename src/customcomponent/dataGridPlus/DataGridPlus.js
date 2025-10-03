import { Formio } from "@formio/js";
import editForm from "./DataGridPlus.form.js";

const Component = Formio.Components.components.component;

export default class DataGridPlus extends Component {
	static editForm = editForm;

	static schema(...extend) {
		return Component.schema(
			{
				type: "dataGridPlus",
				label: "Data Grid Plus",
				key: "dataGridPlus",
				pageLimit: 3,
				gridToAttach: "",
			},
			...extend
		);
	}

	static get builderInfo() {
		return {
			title: "Data Grid Plus",
			icon: "list",
			group: "basic",
			weight: -100,
			schema: DataGridPlus.schema(),
		};
	}

	constructor(component, options, data) {
		super(component, options, data);
		// Pager stuff
		this.pageLimit =
			Number(this.component.pageLimit) > 0
				? Number(this.component.pageLimit)
				: 3;
		this.currentPageNum = 1;
		this.totalPagesNum = 1;
		this.totalRowsNum = 1;
		// Sort and filter stuff
		this.filteredGridRows = [];
		this.searchDebounceTimer = null;
		this.isFiltering = false;
		this.currentSearchTerm = "";
		this.selectedSortColumnKey = "";
		this.sortOrderAsc = true; // true = ascending, false = descending
		// Common stuff
		this.allGridRows = [];
		this.targetComponent = null;
	}

	render() {
		return super.render(this.renderTemplate("dataGridPlus"));
	}

	/**
	 * Called after render; wires refs, finds target component, and initializes UI.
	 */
	attach(element) {
		// Let base class attach first
		super.attach(element);

		// Load refs from template
		this.loadRefs(element, {
			targetComponentTitle: "single",
			dataGridPager: "single",
			firstItemNum: "single",
			lastItemNum: "single",
			totalItemsNum: "single",
			currentPageNum: "single",
			totalPagesNum: "single",
			firstBtn: "single",
			prevBtn: "single",
			nextBtn: "single",
			lastBtn: "single",
			searchInput: "single",
			sortColumn: "single",
			sortOrderBtn: "single",
		});

		// Locate the data grid to attach to
		this.targetComponent = this.findTargetComponent();

		if (!this.targetComponent) {
			// Disable the search input if no grid is found
			if (this.refs.searchInput) {
				this.refs.searchInput.disabled = true;
				this.refs.searchInput.placeholder =
					"No grid attached - configure in component settings";
				this.refs.sortColumn.disabled = true;
				this.refs.sortOrderBtn.disabled = true;
			}
			this.allGridRows = [];
			this.computeTotals();
			this.updateUI();
			this.setButtonsDisabled(true);
			return;
		}

		// Verify it's actually a data grid component
		if (this.targetComponent.component.type !== "datagrid") {
			console.warn(
				`DataGridPlus: Component "${this.component.gridToAttach}" is not a data grid`
			);

			if (this.refs.searchInput) {
				this.refs.searchInput.disabled = true;
				this.refs.searchInput.placeholder =
					"Error: Attached component is not a data grid";
			}
			if (this.refs.dataGridPager) {
				this.refs.dataGridPager.innerHTML = `<div>Error: Attached component is not a data grid</div>`;
			}
			this.allGridRows = [];
			this.computeTotals();
			this.updateUI();
			this.setButtonsDisabled(true);
			return;
		}

		// Hide target component's title and show it above DataGridPlus instead + remove the spacing between DataGridPlus and DataGrid attached to it
		if (this.refs.targetComponentTitle) {
			this.targetComponent.component.hideLabel = true;
			this.refs.targetComponentTitle.innerHTML = `<b>${this.targetComponent.component.title ?? this.targetComponent.component.label}</b`;
			let elements = document.querySelectorAll(`.formio-component-${this.component.key}`);
			elements.forEach(el => {
				el.style.marginBottom = '0';
			});
		}

		// Initialize data storage
		this.initializeDataStorage();

		// Set up search input listener
		if (this.refs.searchInput) {
			this.refs.searchInput.addEventListener(
				"input",
				this.handleSearchInput.bind(this)
			);
		}

		// Populate sort column dropdown
		this.populateSortColumns();

		// Add listeners for sorting
		if (this.refs.sortColumn) {
			this.refs.sortColumn.addEventListener("change", (e) => {
				this.selectedSortColumnKey = e.target.value;
				this.applySort();
			});
		}
		if (this.refs.sortOrderBtn) {
			this.refs.sortOrderBtn.addEventListener("click", () => {
				this.sortOrderAsc = !this.sortOrderAsc;
				if (this.refs.sortOrderBtn) {
					this.refs.sortOrderBtn.textContent = this.sortOrderAsc
						? "Asc"
						: "Desc";
				}
				this.applySort();
			});
		}

		// Wire button click handlers (store references for cleanup)
		this._firstHandler = () => this.goToPage(1);
		this._prevHandler = () => this.goToPage(this.currentPageNum - 1);
		this._nextHandler = () => this.goToPage(this.currentPageNum + 1);
		this._lastHandler = () => this.goToPage(this.totalPagesNum);

		if (this.refs.firstBtn)
			this.refs.firstBtn.addEventListener("click", this._firstHandler);
		if (this.refs.prevBtn)
			this.refs.prevBtn.addEventListener("click", this._prevHandler);
		if (this.refs.nextBtn)
			this.refs.nextBtn.addEventListener("click", this._nextHandler);
		if (this.refs.lastBtn)
			this.refs.lastBtn.addEventListener("click", this._lastHandler);

		// Listen for changes inside the target component
		this._targetChangeHandler = () => {
			// Read the current visible page rows from the target and merge them back
			const currentPageData = Array.isArray(this.targetComponent.dataValue)
				? JSON.parse(JSON.stringify(this.targetComponent.dataValue))
				: [];

			const offset = (this.currentPageNum - 1) * this.pageLimit;

			// Determine which array to update based on filter state
			if (this.currentSearchTerm) {
				// Update filteredGridRows
				this.filteredGridRows.splice(
					offset,
					this.pageLimit,
					...currentPageData
				);
			} else {
				// Update allGridRows
				this.allGridRows.splice(offset, this.pageLimit, ...currentPageData);
			}

			// Recompute totals in case rows were added/removed
			this.computeTotals();

			// If this page exceeds the limit, move to next page
			if (currentPageData.length > this.pageLimit) {
				this.goToPage(this.currentPageNum + 1);
			} else {
				// Otherwise just refresh this page
				this.goToPage(this.currentPageNum);
			}
		};

		this._targetDeleteHandler = () => {
			// Read the current visible page rows from the target and merge them back
			const currentPageData = Array.isArray(this.targetComponent.dataValue)
				? JSON.parse(JSON.stringify(this.targetComponent.dataValue))
				: [];

			if (currentPageData.length === 0 && this.currentPageNum > 1) {
				// If we deleted the last item on this page, move back a page
				this.currentPageNum--;
				if (this.currentSearchTerm) {
					this.filteredGridRows.pop();
				} else {
					this.allGridRows.pop();
				}
			} else {
				const offset = (this.currentPageNum - 1) * this.pageLimit;
				// Determine which array to update based on filter state
				if (this.currentSearchTerm) {
					this.filteredGridRows.splice(
						offset,
						this.pageLimit,
						...currentPageData
					);
				} else {
					this.allGridRows.splice(offset, this.pageLimit, ...currentPageData);
				}
			}

			// Recompute totals in case rows were added/removed
			this.computeTotals();

			this.goToPage(this.currentPageNum);
		};

		if (typeof this.targetComponent.on === "function") {
			this.targetComponent.on("change", this._targetChangeHandler);
			this.targetComponent.on("dataGridDeleteRow", this._targetDeleteHandler);
		} else if (typeof this.targetComponent.addEventListener === "function") {
			this.targetComponent.addEventListener(
				"change",
				this._targetChangeHandler
			);
			this.targetComponent.addEventListener(
				"dataGridDeleteRow",
				this._targetDeleteHandler
			);
		}

		// Compute totals and show initial page
		this.computeTotals();
		this.goToPage(this.currentPageNum);
	}

	/**
	 * Initialize data storage - get data from grid
	 */
	initializeDataStorage() {
		if (
			this.targetComponent.dataValue &&
			this.targetComponent.dataValue.length > 0
		) {
			this.storeAllGridRows();
		}

		// Initialize filtered rows with all rows
		this.filteredGridRows = [...this.allGridRows];
	}

	/**
	 * Store the original grid data
	 */
	storeAllGridRows() {
		if (!this.targetComponent) return;

		// Deep clone the data to avoid reference issues
		this.allGridRows = JSON.parse(
			JSON.stringify(this.targetComponent.dataValue || [])
		);

		// Update filtered rows if no filter is active
		if (!this.currentSearchTerm) {
			this.filteredGridRows = [...this.allGridRows];
		}
	}

	/**
	 * Populate sort column dropdown
	 */
	populateSortColumns() {
		if (!this.targetComponent || !this.refs.sortColumn) return;

		const allowedTypes = [
			"textfield",
			"textarea",
			"number",
			"checkbox",
			"selectboxes",
			"select",
			"radio",
			"email",
			"url",
			"phoneNumber",
			"tags",
			"address",
			"datetime",
			"day",
			"time",
			"currency",
		];

		const gridComponents = this.targetComponent.component.components || [];
		const select = this.refs.sortColumn;

		// Clear existing options except placeholder
		select.innerHTML = '<option value="">-- Select column to sort --</option>';

		gridComponents.forEach((col) => {
			if (allowedTypes.includes(col.type)) {
				const opt = document.createElement("option");
				opt.value = col.key;
				opt.textContent = col.label || col.key;
				select.appendChild(opt);
			}
		});
	}

	/**
	 * Apply sorting to the current dataset (filtered or all)
	 */
	applySort() {
		if (!this.targetComponent || !this.selectedSortColumnKey) return;

		// Choose array to sort: filtered if search active, else all
		const dataToSort = this.currentSearchTerm
			? [...this.filteredGridRows]
			: [...this.allGridRows];

		// Sort function
		dataToSort.sort((a, b) => {
			const valA = a[this.selectedSortColumnKey];
			const valB = b[this.selectedSortColumnKey];

			// Handle equality
			if (valA === valB) return 0;

			// Handle null/undefined
			if (valA === null || valA === undefined) return 1;
			if (valB === null || valB === undefined) return -1;

			// Convert to numbers if possible
			const numA = Number(valA);
			const numB = Number(valB);

			if (!isNaN(numA) && !isNaN(numB)) {
				// Numeric comparison
				return this.sortOrderAsc ? numA - numB : numB - numA;
			} else {
				// Fallback: plain string comparison
				return this.sortOrderAsc
					? String(valA) < String(valB)
						? -1
						: 1
					: String(valB) < String(valA)
						? -1
						: 1;
			}
		});

		// Update the appropriate array
		if (this.currentSearchTerm) {
			this.filteredGridRows = dataToSort;
		} else {
			this.allGridRows = dataToSort;
		}

		// Recompute totals and go to first page after sorting
		this.computeTotals();
		this.goToPage(1);
	}

	/**
	 * Apply filter to the grid based on search input
	 */
	applyFilter(searchTerm) {
		if (!this.targetComponent || !this.targetComponent.component) return;

		// Prevent recursive filtering
		if (this.isFiltering) return;
		this.isFiltering = true;

		try {
			this.currentSearchTerm = searchTerm;

			// If search term is empty, restore original data
			if (!searchTerm || searchTerm.trim() === "") {
				this.filteredGridRows = [...this.allGridRows];

				// Recompute totals and go to first page
				this.computeTotals();
				this.goToPage(1);

				this.isFiltering = false;
				return;
			}

			const searchLower = searchTerm.toLowerCase().trim();

			// Filter the original data
			this.filteredGridRows = this.allGridRows.filter((row) => {
				return this.searchInRow(row, searchLower);
			});

			// Apply sort after filtering if a column is selected
			if (this.selectedSortColumnKey) {
				this.applySortToFiltered();
			}

			// Recompute totals and go to first page
			this.computeTotals();
			this.goToPage(1);
		} catch (error) {
			console.error("Error applying filter:", error);
		} finally {
			this.isFiltering = false;
		}
	}

	/**
	 * Apply sorting specifically to filtered data (internal helper)
	 */
	applySortToFiltered() {
		if (!this.selectedSortColumnKey) return;

		this.filteredGridRows.sort((a, b) => {
			const valA = a[this.selectedSortColumnKey];
			const valB = b[this.selectedSortColumnKey];

			if (valA === valB) return 0;
			if (valA === null || valA === undefined) return 1;
			if (valB === null || valB === undefined) return -1;

			const numA = Number(valA);
			const numB = Number(valB);

			if (!isNaN(numA) && !isNaN(numB)) {
				return this.sortOrderAsc ? numA - numB : numB - numA;
			} else {
				return this.sortOrderAsc
					? String(valA) < String(valB)
						? -1
						: 1
					: String(valB) < String(valA)
						? -1
						: 1;
			}
		});
	}

	/**
	 * Search for a term within a row's data
	 */
	searchInRow(row, searchTerm) {
		if (!row || typeof row !== "object") return false;

		// Get the grid's components to know which fields to search
		const gridComponents = this.targetComponent.component.components || [];

		for (const component of gridComponents) {
			const componentValue = row[component.key];

			// Convert value to string and check if it contains the search term
			if (componentValue !== null && componentValue !== undefined) {
				const valueStr = String(componentValue).toLowerCase();
				if (valueStr.includes(searchTerm)) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Handle search input changes with debouncing
	 */
	handleSearchInput(event) {
		const searchTerm = event.target.value;

		// Clear existing debounce timer
		if (this.searchDebounceTimer) {
			clearTimeout(this.searchDebounceTimer);
		}

		// Set new debounce timer (300ms delay)
		this.searchDebounceTimer = setTimeout(() => {
			this.applyFilter(searchTerm);
		}, 300);
	}

	/**
	 * Recalculate totals and clamp current page
	 */
	computeTotals() {
		// Use filtered rows if search is active, otherwise use all rows
		const dataSource = this.currentSearchTerm
			? this.filteredGridRows
			: this.allGridRows;

		this.totalRowsNum = Array.isArray(dataSource) ? dataSource.length : 1;
		this.totalPagesNum = Math.max(
			1,
			Math.ceil(this.totalRowsNum / this.pageLimit)
		);
		if (this.currentPageNum < 1) this.currentPageNum = 1;
		if (this.currentPageNum > this.totalPagesNum)
			this.currentPageNum = this.totalPagesNum;
	}

	/**
	 * Show a specific page: slice items, set target value, update UI
	 */
	goToPage(pageNum) {
		if (!this.targetComponent) return;

		// Ensure pageNum is always between 1 and totalPagesNum
		const currentPageNum = Math.max(
			1,
			Math.min(pageNum || 1, this.totalPagesNum)
		);
		this.currentPageNum = currentPageNum;

		// Use filtered rows if search is active, otherwise use all rows
		const dataSource = this.currentSearchTerm
			? this.filteredGridRows
			: this.allGridRows;

		const start = (currentPageNum - 1) * this.pageLimit;
		const end = start + this.pageLimit;
		const pageSlice = dataSource.slice(start, end);

		// Set the visible rows in the target component
		if (typeof this.targetComponent.setValue === "function") {
			this.targetComponent.setValue(pageSlice);
		} else {
			// Fallback: set dataValue directly (less ideal)
			this.targetComponent.dataValue = pageSlice;
		}

		// Update UI text and button states
		this.updateUI();
	}

	/**
	 * Update the DOM refs for numbers and button disabled states
	 */
	updateUI() {
		// First/last item numbers: show 1 when no items
		const firstNum =
			this.totalRowsNum === 1
				? 1
				: (this.currentPageNum - 1) * this.pageLimit + 1;
		const lastNum =
			this.totalRowsNum === 1
				? 1
				: Math.min(this.currentPageNum * this.pageLimit, this.totalRowsNum);

		if (this.refs.firstItemNum) this.refs.firstItemNum.innerText = firstNum;
		if (this.refs.lastItemNum)
			this.refs.lastItemNum.innerText = lastNum > 0 ? lastNum : 1;
		if (this.refs.totalItemsNum)
			this.refs.totalItemsNum.innerText =
				this.totalRowsNum > 0 ? this.totalRowsNum : 1;
		if (this.refs.currentPageNum)
			this.refs.currentPageNum.innerText =
				this.totalRowsNum === 1 ? 1 : this.currentPageNum;
		if (this.refs.totalPagesNum)
			this.refs.totalPagesNum.innerText = this.totalPagesNum;

		// Button enable/disable
		const onFirst = this.totalRowsNum === 1 || this.currentPageNum === 1;
		const onLast =
			this.totalRowsNum === 1 || this.currentPageNum === this.totalPagesNum;

		if (this.refs.firstBtn) this.refs.firstBtn.disabled = onFirst;
		if (this.refs.prevBtn) this.refs.prevBtn.disabled = onFirst;
		if (this.refs.nextBtn) this.refs.nextBtn.disabled = onLast;
		if (this.refs.lastBtn) this.refs.lastBtn.disabled = onLast;
	}

	/**
	 * Enable/disable all buttons quickly
	 */
	setButtonsDisabled(disabled = true) {
		if (this.refs.firstBtn) this.refs.firstBtn.disabled = disabled;
		if (this.refs.prevBtn) this.refs.prevBtn.disabled = disabled;
		if (this.refs.nextBtn) this.refs.nextBtn.disabled = disabled;
		if (this.refs.lastBtn) this.refs.lastBtn.disabled = disabled;
	}

	/**
	 * Find the target component by key (searches recursively from root)
	 */
	findTargetComponent() {
		if (!this.root || !this.component?.gridToAttach) return null;
		try {
			return this.root.getComponent(this.component.gridToAttach);
		} catch (e) {
			return null;
		}
	}

	/**
	 * Get all rows (used by other components if needed)
	 */
	getAllGridRows() {
		return [this.allGridRows, this.targetComponent.key];
	}

	/**
	 * Cleanup listeners when component is removed
	 */
	detach() {
		// Clear any pending debounce timers
		if (this.searchDebounceTimer) {
			clearTimeout(this.searchDebounceTimer);
		}

		// Remove event listeners from search input
		if (this.refs.searchInput) {
			this.refs.searchInput.removeEventListener(
				"input",
				this.handleSearchInput.bind(this)
			);
		}

		// Remove button listeners
		if (this.refs.firstBtn && this._firstHandler)
			this.refs.firstBtn.removeEventListener("click", this._firstHandler);
		if (this.refs.prevBtn && this._prevHandler)
			this.refs.prevBtn.removeEventListener("click", this._prevHandler);
		if (this.refs.nextBtn && this._nextHandler)
			this.refs.nextBtn.removeEventListener("click", this._nextHandler);
		if (this.refs.lastBtn && this._lastHandler)
			this.refs.lastBtn.removeEventListener("click", this._lastHandler);

		// Remove target change listener
		if (this.targetComponent) {
			if (typeof this.targetComponent.off === "function") {
				if (this._targetChangeHandler)
					this.targetComponent.off("change", this._targetChangeHandler);
				if (this._targetDeleteHandler)
					this.targetComponent.off(
						"dataGridDeleteRow",
						this._targetDeleteHandler
					);
			} else if (
				typeof this.targetComponent.removeEventListener === "function"
			) {
				if (this._targetChangeHandler)
					this.targetComponent.removeEventListener(
						"change",
						this._targetChangeHandler
					);

				if (this._targetDeleteHandler)
					this.targetComponent.removeEventListener(
						"dataGridDeleteRow",
						this._targetDeleteHandler
					);
			}
		}

		return super.detach();
	}
}
