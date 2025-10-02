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
			weight: -99,
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
			return;
		}
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
		return super.detach();
	}
}
