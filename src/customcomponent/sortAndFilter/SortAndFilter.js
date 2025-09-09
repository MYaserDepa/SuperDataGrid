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
		this.filteredGridRows = [];
		this.searchDebounceTimer = null;
		this.isFiltering = false;
		this.currentSearchTerm = "";
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
		}

		// Initialize data storage
		this.initializeDataStorage();
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

		// Update filtered rows if no filter is active
		if (!this.currentSearchTerm) {
			this.filteredGridRows = [...this.allGridRows];
		}
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

				// Direct update to grid
				this.targetComponent.setValue(this.filteredGridRows);

				this.isFiltering = false;
				return;
			}

			const searchLower = searchTerm.toLowerCase().trim();

			// Filter the original data
			this.filteredGridRows = this.allGridRows.filter((row) => {
				return this.searchInRow(row, searchLower);
			});

			// Direct update to grid
			this.targetComponent.setValue(this.filteredGridRows);
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
	 * Set up event listeners for the grid
	 */
	setupGridListeners() {
		if (!this.targetComponent) return;

		// Listen for grid data changes (but not our own changes)
		this.targetComponent.on("change", (event) => {
			// Only update original data if we're not currently filtering
			// and there's no active search term
			if (
				!this.isFiltering &&
				!this.currentSearchTerm &&
				event &&
				event.changed
			) {
				// Delay to ensure the grid has updated
				setTimeout(() => {
					this.storeAllGridRows();
				}, 100);
			}
		});

		// Listen for row additions (if grid supports it)
		this.targetComponent.on("dataGridAddRow", () => {
			if (!this.isFiltering) {
				setTimeout(() => {
					// Get updated data
					this.storeAllGridRows();
					// Reapply filter if active
					if (this.currentSearchTerm) {
						this.applyFilter(this.currentSearchTerm);
					}
				}, 100);
			}
		});

		// Listen for row deletions
		this.targetComponent.on("dataGridDeleteRow", () => {
			if (!this.isFiltering) {
				setTimeout(() => {
					// Get updated data
					this.storeAllGridRows();
					// Reapply filter if active
					if (this.currentSearchTerm) {
						this.applyFilter(this.currentSearchTerm);
					}
				}, 100);
			}
		});

		// Store initial data
		this.storeAllGridRows();
	}

	/**
	 * Get all rows (used by other components if needed)
	 */
	getAllRows() {
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

		// Remove grid listeners
		if (this.targetComponent) {
			this.targetComponent.off("change");
			this.targetComponent.off("redraw");
			this.targetComponent.off("dataGridAddRow");
			this.targetComponent.off("dataGridDeleteRow");
		}

		return super.detach();
	}
}
