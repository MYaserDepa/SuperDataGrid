import { Formio } from "@formio/js";
import editForm from "./DataGridPager.form.js";

const Component = Formio.Components.components.component;

export default class DataGridPager extends Component {
	static editForm = editForm;

	static schema(...extend) {
		return Component.schema(
			{
				type: "dataGridPager",
				label: "Data Pager",
				key: "dataGridPager",
				pageLimit: 5,
				gridToAttach: "",
			},
			...extend
		);
	}

	static get builderInfo() {
		return {
			title: "Data Grid Pager",
			icon: "list",
			group: "basic",
			weight: -100,
			schema: DataGridPager.schema(),
		};
	}

	constructor(component, options, data) {
		super(component, options, data);

		this.pageLimit =
			Number(this.component.pageLimit) > 0
				? Number(this.component.pageLimit)
				: 5;
		this.currentPageNum = 1;
		this.totalPagesNum = 1;
		this.totalRowsNum = 1;
		this.allGridRows = [];
		this.targetComponent = null;
	}

	render() {
		return super.render(this.renderTemplate("dataGridPager"));
	}

	/**
	 * Called after render; wires refs, finds target component, and initializes UI.
	 */
	attach(element) {
		// Let base class attach first
		super.attach(element);

		// Load refs from template
		this.loadRefs(element, {
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
		});

		// Locate the grid/etc to attach to
		this.targetComponent = this.findTargetComponent();

		// If not found, show zero state and disable buttons
		if (!this.targetComponent) {
			this.allGridRows = [];
			this.computeTotals();
			this.updateUI();
			this.setButtonsDisabled(true);
			return;
		}

		// Verify it's actually a data grid component
		if (this.targetComponent.component.type !== "datagrid") {
			console.warn(
				`DataGridPager: Component "${this.component.gridToAttach}" is not a data grid`
			);
			this.refs.dataGridPager.innerHTML = `<div>Error: Attached component is not a data grid</div>`;
			this.allGridRows = [];
			this.computeTotals();
			this.updateUI();
			this.setButtonsDisabled(true);
			return;
		}

		// Compute totals and clamp current page
		this.computeTotals();

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

		// Listen for changes inside the target component so edits persist across pages.
		// Not all component implementations expose on/off; guard those calls.
		this._targetChangeHandler = () => {
			// read the current visible page rows from the target and merge them back
			const currentPageData = Array.isArray(this.targetComponent.dataValue)
				? JSON.parse(JSON.stringify(this.targetComponent.dataValue))
				: [];

			const offset = (this.currentPageNum - 1) * this.pageLimit;
			// Remove the old slice and replace with new
			this.allGridRows.splice(offset, this.pageLimit, ...currentPageData);

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
			// read the current visible page rows from the target and merge them back
			const currentPageData = Array.isArray(this.targetComponent.dataValue)
				? JSON.parse(JSON.stringify(this.targetComponent.dataValue))
				: [];

			if (currentPageData.length === 0 && this.currentPageNum > 1) {
				// If we deleted the last item on this page, move back a page
				this.currentPageNum--;
				this.allGridRows.pop();
			} else {
				const offset = (this.currentPageNum - 1) * this.pageLimit;
				// Remove the old slice and replace with new
				this.allGridRows.splice(offset, this.pageLimit, ...currentPageData);
			}

			// Recompute totals in case rows were added/removed
			this.computeTotals();

			this.goToPage(this.currentPageNum);
		};

		if (typeof this.targetComponent.on === "function") {
			this.targetComponent.on("change", this._targetChangeHandler);
			this.targetComponent.on("dataGridDeleteRow", this._targetDeleteHandler);
		} else if (typeof this.targetComponent.addEventListener === "function") {
			// fallback (rare)
			this.targetComponent.addEventListener(
				"change",
				this._targetChangeHandler
			);
			this.targetComponent.addEventListener(
				"dataGridDeleteRow",
				this._targetDeleteHandler
			);
		}

		// Show initial page
		this.goToPage(this.currentPageNum);
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
	 * Recalculate totals and clamp current page
	 */
	computeTotals() {
		this.totalRowsNum = Array.isArray(this.allGridRows)
			? this.allGridRows.length
			: 1;
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

		// ensure pageNum is always between 1 and totalPagesNum
		const currentPageNum = Math.max(
			1,
			Math.min(pageNum || 1, this.totalPagesNum)
		);
		this.currentPageNum = currentPageNum;

		const start = (currentPageNum - 1) * this.pageLimit;
		const end = start + this.pageLimit;
		const pageSlice = this.allGridRows.slice(start, end);

		// Set the visible rows in the target component.
		// setValue should exist on formio components; call defensively.
		if (typeof this.targetComponent.setValue === "function") {
			this.targetComponent.setValue(pageSlice);
		} else {
			// fallback: set dataValue directly (less ideal)
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
	 * enable/disable all buttons quickly
	 */
	setButtonsDisabled(disabled = true) {
		if (this.refs.firstBtn) this.refs.firstBtn.disabled = disabled;
		if (this.refs.prevBtn) this.refs.prevBtn.disabled = disabled;
		if (this.refs.nextBtn) this.refs.nextBtn.disabled = disabled;
		if (this.refs.lastBtn) this.refs.lastBtn.disabled = disabled;
	}

	/**
	 * Returns the full dataset (all pages) and the target component key
	 * for external use (e.g. on form submit)
	 */
	getAllGridRows() {
		return [this.allGridRows, this.targetComponent.key];
	}

	/**
	 * Cleanup listeners when component is removed
	 */
	detach() {
		// remove button listeners
		if (this.refs.firstBtn && this._firstHandler)
			this.refs.firstBtn.removeEventListener("click", this._firstHandler);
		if (this.refs.prevBtn && this._prevHandler)
			this.refs.prevBtn.removeEventListener("click", this._prevHandler);
		if (this.refs.nextBtn && this._nextHandler)
			this.refs.nextBtn.removeEventListener("click", this._nextHandler);
		if (this.refs.lastBtn && this._lastHandler)
			this.refs.lastBtn.removeEventListener("click", this._lastHandler);

		// remove target change listener
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
