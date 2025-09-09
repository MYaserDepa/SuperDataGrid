import { Formio } from "@formio/js";
import editForm from "./SortAndFilter.form.js";

const Component = Formio.Components.components.component;

export default class SortAndFilter extends Component {
	static editForm = editForm;

	static schema(...extend) {
		return Component.schema(
			{
				type: "sortAndFilter",
				label: "Sort And Filter",
				key: "sortAndFilter",
				gridToAttach: "",
			},
			...extend
		);
	}

	static get builderInfo() {
		return {
			title: "Sort And Filter",
			icon: "sort",
			group: "basic",
			weight: -99,
			schema: SortAndFilter.schema(),
		};
	}

	constructor(component, options, data) {
		super(component, options, data);
		this.targetComponent = null;
		this.allGridRows = [];
		this.searchDebounceTimer = null;
		this.isFiltering = false;
	}

	render() {
		return super.render(this.renderTemplate("sortAndFilter"));
	}

	/**
	 * Called after render; wires refs, finds target component, and initializes UI.
	 */
	attach(element) {
		// Let base class attach first
		super.attach(element);

		// Load refs from template
		this.loadRefs(element, {
			searchInput: "single",
		});

		// Locate the data grid to attach to
		this.targetComponent = this.findTargetComponent();

		if (!this.targetComponent) {
			// Disable the search input if no grid is found
			if (this.refs.searchInput) {
				this.refs.searchInput.disabled = true;
				this.refs.searchInput.placeholder =
					"No grid attached - configure in component settings";
			}
			return;
		}

		// Verify it's actually a data grid component
		if (this.targetComponent.component.type !== "datagrid") {
			console.warn(
				`SortAndFilter: Component "${this.component.gridToAttach}" is not a data grid`
			);

			if (this.refs.searchInput) {
				this.refs.searchInput.disabled = true;
				this.refs.searchInput.placeholder =
					"Error: Attached component is not a data grid";
			}
			return;
		}

		// Set up grid listeners and store initial data
		this.setupGridListeners();

		// Set up search input listener
		if (this.refs.searchInput) {
			this.refs.searchInput.addEventListener(
				"input",
				this.handleSearchInput.bind(this)
			);
			this.refs.searchInput.addEventListener(
				"keyup",
				this.handleSearchInput.bind(this)
			);

			// Also handle paste events
			this.refs.searchInput.addEventListener("paste", () => {
				setTimeout(() => {
					this.handleSearchInput({ target: this.refs.searchInput });
				}, 10);
			});
		}

		// If the grid already has data, store it
		if (
			this.targetComponent.dataValue &&
			this.targetComponent.dataValue.length > 0
		) {
			this.storeAllGridRows();
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
	 * Store the original grid data for restoration
	 */
	storeAllGridRows() {
		if (!this.targetComponent) return;

		// Deep clone the data to avoid reference issues
		this.allGridRows = JSON.parse(
			JSON.stringify(this.targetComponent.dataValue || [])
		);
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
			// If search term is empty, restore original data
			if (!searchTerm || searchTerm.trim() === "") {
				console.log("SEARCH EMPTY");
				console.log(this.allGridRows);
				this.targetComponent.setValue(this.allGridRows);
				this.isFiltering = false;
				return;
			}

			const searchLower = searchTerm.toLowerCase().trim();

			// Filter the original data
			const filteredData = this.allGridRows.filter((row) => {
				// Check if any field in the row contains the search term
				return this.searchInRow(row, searchLower);
			});

			console.log(`FILTERED APPLIED: ${searchTerm}`, filteredData);
			console.log(this.allGridRows);
			// Update the grid with filtered data
			this.targetComponent.setValue(filteredData);
		} catch (error) {
			console.error("Error applying filter:", error);
		} finally {
			this.isFiltering = false;
		}
	}

	/**
	 * Search for a term within a row's data
	 */
	searchInRow(row, searchTerm) {
		if (!row || typeof row !== "object") return false;

		// Get the grid's components to know which fields to search
		const gridComponents = this.targetComponent.component.components || [];

		for (const component of gridComponents) {
			const fieldKey = component.key;
			const fieldValue = row[fieldKey];

			// Convert value to string and check if it contains the search term
			if (fieldValue !== null && fieldValue !== undefined) {
				const valueStr = String(fieldValue).toLowerCase();
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
	 * Set up event listeners for the grid
	 */
	setupGridListeners() {
		if (!this.targetComponent) return;

		// Listen for grid data changes (but not our own changes)
		this.targetComponent.on("change", (event) => {
			// Only update original data if we're not currently filtering
			if (!this.isFiltering && event && event.changed) {
				// Delay to ensure the grid has updated
				setTimeout(() => {
					this.storeAllGridRows();
				}, 100);
			}
		});

		// Listen for grid redraw events
		this.targetComponent.on("redraw", () => {
			if (!this.isFiltering) {
				this.storeAllGridRows();
			}
		});

		// Store initial data
		this.storeAllGridRows();
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
			this.refs.searchInput.removeEventListener(
				"keyup",
				this.handleSearchInput.bind(this)
			);
			this.refs.searchInput.removeEventListener(
				"paste",
				this.handleSearchInput.bind(this)
			);
		}

		// Remove grid listeners
		if (this.targetComponent) {
			this.targetComponent.off("change");
			this.targetComponent.off("redraw");
		}

		// Clear references
		this.targetComponent = null;
		this.allGridRows = [];
		this.isFiltering = false;

		return super.detach();
	}
}
