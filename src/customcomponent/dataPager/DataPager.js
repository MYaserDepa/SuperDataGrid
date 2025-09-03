import { Formio } from "@formio/js";
import editForm from "./DataPager.form.js";

const Component = Formio.Components.components.component;

export default class DataPager extends Component {
	static editForm = editForm;

	static schema(...extend) {
		return Component.schema(
			{
				type: "dataPager",
				label: "Data Pager",
				key: "dataPager",
				pageLimit: 5,
			},
			...extend
		);
	}

	static get builderInfo() {
		return {
			title: "Data Pager",
			icon: "list",
			group: "basic",
			weight: -100,
			schema: DataPager.schema(),
		};
	}

	constructor(component, options, data) {
		super(component, options, data);
		this.pageLimit =
			Number(this.component.pageLimit) > 0
				? Number(this.component.pageLimit)
				: 5;
		this.totalPagesNum = 1;
		this.currentPageNum = 1;
		this.totalItemsNum = 1;
		this.items = [];
	}

	render() {
		return super.render(
			this.renderTemplate("dataPager", {
				pageLimit: this.pageLimit,
				totalPagesNum: this.totalPagesNum,
				currentPageNum: this.currentPageNum,
				totalItemsNum: this.totalItemsNum,
			})
		);
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
	 * Called after render; wires refs, finds target component, and initializes UI.
	 */
	attach(element) {
		// Let base class attach first
		super.attach(element);

		// Load refs from template
		this.loadRefs(element, {
			dataPager: "single",
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
			this.items = [];
			this.computeTotals();
			this.updateUI();
			this.setButtonsDisabled(true);
			return;
		}

		// Initialize items from the target's dataValue (make a deep copy)
		const targetDataValue = this.targetComponent.dataValue;
		this.items = Array.isArray(targetDataValue)
			? JSON.parse(JSON.stringify(targetDataValue))
			: [];

		// Ensure pageLimit number is up-to-date from schema (incase builder changed it)
		this.pageLimit = Number(this.component.pageLimit || this.pageLimit);

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
			for (let i = 0; i < currentPageData.length; i++) {
				this.items[offset + i] = currentPageData[i];
			}

			// Recompute totals in case rows were added/removed
			this.computeTotals();
			this.updateUI();
		};

		if (typeof this.targetComponent.on === "function") {
			this.targetComponent.on("change", this._targetChangeHandler);
		} else if (typeof this.targetComponent.addEventListener === "function") {
			// fallback (rare)
			this.targetComponent.addEventListener(
				"change",
				this._targetChangeHandler
			);
		}

		// Show initial page
		this.goToPage(this.currentPageNum);
	}

	/**
	 * Recalculate totals and clamp current page
	 */
	computeTotals() {
		this.totalItemsNum = Array.isArray(this.items) ? this.items.length : 0;
		this.totalPagesNum = Math.max(
			1,
			Math.ceil(this.totalItemsNum / this.pageLimit)
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
		const pageSlice = this.items.slice(start, end);

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
		// First/last item numbers: show 0 when no items
		const firstNum =
			this.totalItemsNum === 0
				? 0
				: (this.currentPageNum - 1) * this.pageLimit + 1;
		const lastNum =
			this.totalItemsNum === 0
				? 0
				: Math.min(this.currentPageNum * this.pageLimit, this.totalItemsNum);

		if (this.refs.firstItemNum) this.refs.firstItemNum.innerText = firstNum;
		if (this.refs.lastItemNum) this.refs.lastItemNum.innerText = lastNum;
		if (this.refs.totalItemsNum)
			this.refs.totalItemsNum.innerText = this.totalItemsNum;
		if (this.refs.currentPageNum)
			this.refs.currentPageNum.innerText =
				this.totalItemsNum === 0 ? 0 : this.currentPageNum;
		if (this.refs.totalPagesNum)
			this.refs.totalPagesNum.innerText = this.totalPagesNum;

		// Button enable/disable
		const onFirst = this.totalItemsNum === 0 || this.currentPageNum === 1;
		const onLast =
			this.totalItemsNum === 0 || this.currentPageNum === this.totalPagesNum;

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
			if (
				typeof this.targetComponent.off === "function" &&
				this._targetChangeHandler
			) {
				this.targetComponent.off("change", this._targetChangeHandler);
			} else if (
				typeof this.targetComponent.removeEventListener === "function" &&
				this._targetChangeHandler
			) {
				this.targetComponent.removeEventListener(
					"change",
					this._targetChangeHandler
				);
			} else if (
				typeof this.targetComponent.on === "function" &&
				typeof this.targetComponent.off === "undefined" &&
				this._targetChangeHandler
			) {
				// some implementations use on() but not off(); best-effort: no-op
			}
		}

		return super.detach();
	}
}
