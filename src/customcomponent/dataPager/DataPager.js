import Component from "formiojs/components/_classes/component/Component";
import editForm from "./dataPager.form.js";
import _ from "lodash";

export default class DataPager extends Component {
	static schema(...extend) {
		return Component.schema(
			{
				type: "datapager",
				label: "Data Pager",
				key: "dataPager",
				input: false,
				persistent: false,
				targetComponent: "",
				pageSize: 5,
				showFirstLast: true,
				showPrevNext: true,
				showPageNumbers: true,
				maxPageNumbers: 5,
				showPageInfo: true,
				showPageSizeSelector: true,
				pageSizes: [5, 10, 25, 50, 100],
				pagerPosition: "bottom", // top, bottom, both
				hideWhenSinglePage: false,
				customClasses: "",
			},
			...extend
		);
	}

	static get builderInfo() {
		return {
			title: "Data Pager",
			group: "advanced",
			icon: "list-ol",
			weight: 100,
			documentation: "#",
			schema: DataPager.schema(),
		};
	}

	static editForm = editForm;

	constructor(component, options, data) {
		super(component, options, data);
		this.currentPage = 1;
		this.totalPages = 1;
		this.totalItems = 0;
		this.targetComponentInstance = null;
		this.originalData = [];
		this.paginatedData = [];
		this.pageSize = this.component.pageSize || 5;
	}

	get defaultSchema() {
		return DataPager.schema();
	}

	init() {
		super.init();
		this.pageSize = this.component.pageSize || 5;

		// Wait for the form to be ready before finding target component
		if (this.root && this.root.on) {
			this.root.on("change", this.handleFormChange.bind(this));
			this.root.on("initialized", this.findTargetComponent.bind(this));
		}

		// Try to find target component immediately if form is already initialized
		setTimeout(() => this.findTargetComponent(), 100);
	}

	findTargetComponent() {
		if (!this.component.targetComponent || !this.root) {
			return;
		}

		// Search for the target component in the form
		this.root.everyComponent((component) => {
			if (component.component.key === this.component.targetComponent) {
				this.targetComponentInstance = component;
				this.attachToTargetComponent();
				return false; // Stop searching
			}
		});
	}

	attachToTargetComponent() {
		if (!this.targetComponentInstance) {
			return;
		}

		const componentType = this.targetComponentInstance.component.type;

		// Store original methods
		if (!this.targetComponentInstance._originalAddRow) {
			this.targetComponentInstance._originalAddRow =
				this.targetComponentInstance.addRow;
		}
		if (!this.targetComponentInstance._originalRemoveRow) {
			this.targetComponentInstance._originalRemoveRow =
				this.targetComponentInstance.removeRow;
		}
		if (!this.targetComponentInstance._originalSetValue) {
			this.targetComponentInstance._originalSetValue =
				this.targetComponentInstance.setValue;
		}

		// Override methods based on component type
		switch (componentType) {
			case "datagrid":
			case "editgrid":
				this.attachToGrid();
				break;
			case "datamap":
				this.attachToDataMap();
				break;
			case "tree":
				this.attachToTree();
				break;
		}

		// Initial pagination
		this.updatePagination();
	}

	attachToGrid() {
		const self = this;

		// Override addRow
		this.targetComponentInstance.addRow = function () {
			const result = this._originalAddRow
				? this._originalAddRow.apply(this, arguments)
				: null;
			self.handleDataChange();
			return result;
		};

		// Override removeRow
		this.targetComponentInstance.removeRow = function (index) {
			// Adjust index for pagination
			const actualIndex = (self.currentPage - 1) * self.pageSize + index;
			const result = this._originalRemoveRow
				? this._originalRemoveRow.call(this, actualIndex)
				: null;
			self.handleDataChange();
			return result;
		};

		// Override setValue to capture data changes
		this.targetComponentInstance.setValue = function (value, flags) {
			const result = this._originalSetValue
				? this._originalSetValue.call(this, value, flags)
				: null;
			self.handleDataChange();
			return result;
		};

		// Watch for value changes
		this.targetComponentInstance.on("change", () => {
			self.handleDataChange();
		});
	}

	attachToDataMap() {
		const self = this;

		this.targetComponentInstance.setValue = function (value, flags) {
			const result = this._originalSetValue
				? this._originalSetValue.call(this, value, flags)
				: null;
			self.handleDataChange();
			return result;
		};

		this.targetComponentInstance.on("change", () => {
			self.handleDataChange();
		});
	}

	attachToTree() {
		const self = this;

		this.targetComponentInstance.setValue = function (value, flags) {
			const result = this._originalSetValue
				? this._originalSetValue.call(this, value, flags)
				: null;
			self.handleDataChange();
			return result;
		};

		this.targetComponentInstance.on("change", () => {
			self.handleDataChange();
		});
	}

	handleFormChange(flags) {
		if (!this.targetComponentInstance && this.component.targetComponent) {
			this.findTargetComponent();
		}
	}

	handleDataChange() {
		if (!this.targetComponentInstance) {
			return;
		}

		// Get all data from target component
		const allData = this.getAllData();
		this.originalData = Array.isArray(allData) ? [...allData] : [];
		this.totalItems = this.originalData.length;
		this.totalPages = Math.ceil(this.totalItems / this.pageSize);

		// Ensure current page is valid
		if (this.currentPage > this.totalPages && this.totalPages > 0) {
			this.currentPage = this.totalPages;
		}
		if (this.currentPage < 1 && this.totalPages > 0) {
			this.currentPage = 1;
		}

		this.updatePagination();
		this.redraw();
	}

	getAllData() {
		if (!this.targetComponentInstance) {
			return [];
		}

		const componentType = this.targetComponentInstance.component.type;

		switch (componentType) {
			case "datagrid":
			case "editgrid":
				return this.targetComponentInstance.dataValue || [];
			case "datamap":
				// For datamap, convert object to array of key-value pairs
				const mapData = this.targetComponentInstance.dataValue || {};
				return Object.entries(mapData).map(([key, value]) => ({ key, value }));
			case "tree":
				// For tree, flatten the tree structure for pagination
				return this.flattenTree(this.targetComponentInstance.dataValue || {});
			default:
				return [];
		}
	}

	flattenTree(tree, result = []) {
		if (Array.isArray(tree)) {
			tree.forEach((node) => {
				result.push(node);
				if (node.children && node.children.length > 0) {
					this.flattenTree(node.children, result);
				}
			});
		} else if (typeof tree === "object" && tree !== null) {
			result.push(tree);
			if (tree.children && tree.children.length > 0) {
				this.flattenTree(tree.children, result);
			}
		}
		return result;
	}

	updatePagination() {
		if (!this.targetComponentInstance || this.originalData.length === 0) {
			return;
		}

		const startIndex = (this.currentPage - 1) * this.pageSize;
		const endIndex = Math.min(startIndex + this.pageSize, this.totalItems);
		this.paginatedData = this.originalData.slice(startIndex, endIndex);

		// Update the visible rows in the target component
		this.updateTargetComponentDisplay();
	}

	updateTargetComponentDisplay() {
		if (!this.targetComponentInstance) {
			return;
		}

		const componentType = this.targetComponentInstance.component.type;

		switch (componentType) {
			case "datagrid":
			case "editgrid":
				this.updateGridDisplay();
				break;
			case "datamap":
				this.updateDataMapDisplay();
				break;
			case "tree":
				this.updateTreeDisplay();
				break;
		}
	}

	updateGridDisplay() {
		// Temporarily disable our override
		const setValue = this.targetComponentInstance.setValue;
		this.targetComponentInstance.setValue =
			this.targetComponentInstance._originalSetValue;

		// Update the grid with paginated data
		this.targetComponentInstance.setValue(this.paginatedData);

		// Re-enable our override
		this.targetComponentInstance.setValue = setValue;
	}

	updateDataMapDisplay() {
		// Convert paginated array back to object for datamap
		const paginatedMap = {};
		this.paginatedData.forEach((item) => {
			if (item.key !== undefined) {
				paginatedMap[item.key] = item.value;
			}
		});

		const setValue = this.targetComponentInstance.setValue;
		this.targetComponentInstance.setValue =
			this.targetComponentInstance._originalSetValue;
		this.targetComponentInstance.setValue(paginatedMap);
		this.targetComponentInstance.setValue = setValue;
	}

	updateTreeDisplay() {
		// For tree, we'll show a subset of the flattened tree
		// This is a simplified approach - in production, you might want to maintain tree structure
		const setValue = this.targetComponentInstance.setValue;
		this.targetComponentInstance.setValue =
			this.targetComponentInstance._originalSetValue;
		this.targetComponentInstance.setValue(this.paginatedData);
		this.targetComponentInstance.setValue = setValue;
	}

	goToPage(page) {
		if (page < 1 || page > this.totalPages) {
			return;
		}

		this.currentPage = page;
		this.updatePagination();
		this.redraw();
		this.emit("pageChange", {
			page: this.currentPage,
			pageSize: this.pageSize,
		});
	}

	changePageSize(newSize) {
		this.pageSize = parseInt(newSize, 10);
		this.totalPages = Math.ceil(this.totalItems / this.pageSize);

		// Adjust current page if necessary
		if (this.currentPage > this.totalPages && this.totalPages > 0) {
			this.currentPage = this.totalPages;
		}

		this.updatePagination();
		this.redraw();
		this.emit("pageSizeChange", {
			page: this.currentPage,
			pageSize: this.pageSize,
		});
	}

	renderContent() {
		// Import the template function
		const { dataPagerTemplate } = require("../templates/form.js");

		const context = {
			id: this.id,
			currentPage: this.currentPage,
			totalPages: this.totalPages,
			totalItems: this.totalItems,
			pageSize: this.pageSize,
			startItem:
				this.totalItems > 0 ? (this.currentPage - 1) * this.pageSize + 1 : 0,
			endItem: Math.min(this.currentPage * this.pageSize, this.totalItems),
			showFirstLast: this.component.showFirstLast,
			showPrevNext: this.component.showPrevNext,
			showPageNumbers: this.component.showPageNumbers,
			showPageInfo: this.component.showPageInfo,
			showPageSizeSelector: this.component.showPageSizeSelector,
			pageSizes: this.component.pageSizes || [5, 10, 25, 50, 100],
			hideWhenSinglePage: this.component.hideWhenSinglePage,
			isFirstPage: this.currentPage === 1,
			isLastPage: this.currentPage === this.totalPages,
			pageNumbers: this.getPageNumbers(),
			customClasses: this.component.customClasses || "",
		};

		return dataPagerTemplate(context);
	}

	render() {
		return super.render(this.renderContent());
	}

	getPageNumbers() {
		const pages = [];
		const maxPages = this.component.maxPageNumbers || 5;
		const halfMax = Math.floor(maxPages / 2);

		let startPage = Math.max(1, this.currentPage - halfMax);
		let endPage = Math.min(this.totalPages, startPage + maxPages - 1);

		if (endPage - startPage + 1 < maxPages) {
			startPage = Math.max(1, endPage - maxPages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		return pages;
	}

	attach(element) {
		this.loadRefs(element, {
			firstButton: "single",
			prevButton: "single",
			nextButton: "single",
			lastButton: "single",
			pageButtons: "multiple",
			pageSizeSelect: "single",
		});

		const superAttach = super.attach(element);

		// Attach event listeners
		if (this.refs.firstButton) {
			this.addEventListener(this.refs.firstButton, "click", () =>
				this.goToPage(1)
			);
		}

		if (this.refs.prevButton) {
			this.addEventListener(this.refs.prevButton, "click", () =>
				this.goToPage(this.currentPage - 1)
			);
		}

		if (this.refs.nextButton) {
			this.addEventListener(this.refs.nextButton, "click", () =>
				this.goToPage(this.currentPage + 1)
			);
		}

		if (this.refs.lastButton) {
			this.addEventListener(this.refs.lastButton, "click", () =>
				this.goToPage(this.totalPages)
			);
		}

		if (this.refs.pageButtons) {
			this.refs.pageButtons.forEach((button) => {
				this.addEventListener(button, "click", (e) => {
					const page = parseInt(e.target.dataset.page, 10);
					this.goToPage(page);
				});
			});
		}

		if (this.refs.pageSizeSelect) {
			this.addEventListener(this.refs.pageSizeSelect, "change", (e) => {
				this.changePageSize(e.target.value);
			});
		}

		return superAttach;
	}

	detach() {
		// Restore original methods if they exist
		if (this.targetComponentInstance) {
			if (this.targetComponentInstance._originalAddRow) {
				this.targetComponentInstance.addRow =
					this.targetComponentInstance._originalAddRow;
			}
			if (this.targetComponentInstance._originalRemoveRow) {
				this.targetComponentInstance.removeRow =
					this.targetComponentInstance._originalRemoveRow;
			}
			if (this.targetComponentInstance._originalSetValue) {
				this.targetComponentInstance.setValue =
					this.targetComponentInstance._originalSetValue;
			}
		}

		return super.detach();
	}
}

// Register the component
DataPager.editForm = editForm;
