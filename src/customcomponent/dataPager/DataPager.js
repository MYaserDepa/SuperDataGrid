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
				pageSize: 5,
				pageSizeOptions: [5, 10, 25, 50, 100],
			},
			...extend
		);
	}

	static get builderInfo() {
		return {
			title: "Data Pager",
			icon: "list",
			group: "data",
			weight: 100,
			schema: DataPager.schema(),
		};
	}

	constructor(component, options, data) {
		super(component, options, data);
		this.currentPage = 1;
		this.itemsPerPage = this.component.pageSize || 5;
		this.items = this.getSampleData();
		this.totalItemsNum = this.items.length;
	}

	getSampleData() {
		return [
			{
				project: "Project Alpha",
				department: "Engineering",
				lineManager: "John Smith",
				businessPhone: "+1-555-0123",
				businessFax: "+1-555-0124",
				emailGroup: "alpha-team@company.com",
				remarks: "Active development",
			},
			{
				project: "Project Beta",
				department: "Marketing",
				lineManager: "Sarah Johnson",
				businessPhone: "+1-555-0125",
				businessFax: "+1-555-0126",
				emailGroup: "beta-team@company.com",
				remarks: "In planning phase",
			},
			{
				project: "Project Gamma",
				department: "Sales",
				lineManager: "Mike Wilson",
				businessPhone: "+1-555-0127",
				businessFax: "+1-555-0128",
				emailGroup: "gamma-team@company.com",
				remarks: "Ready for launch",
			},
			{
				project: "Project Delta",
				department: "Operations",
				lineManager: "Lisa Brown",
				businessPhone: "+1-555-0129",
				businessFax: "+1-555-0130",
				emailGroup: "delta-team@company.com",
				remarks: "Under review",
			},
			{
				project: "Project Epsilon",
				department: "HR",
				lineManager: "David Lee",
				businessPhone: "+1-555-0131",
				businessFax: "+1-555-0132",
				emailGroup: "epsilon-team@company.com",
				remarks: "Pending approval",
			},
			{
				project: "Project Zeta",
				department: "Finance",
				lineManager: "Emma Davis",
				businessPhone: "+1-555-0133",
				businessFax: "+1-555-0134",
				emailGroup: "zeta-team@company.com",
				remarks: "Budget allocation",
			},
			{
				project: "Project Eta",
				department: "Legal",
				lineManager: "Robert Taylor",
				businessPhone: "+1-555-0135",
				businessFax: "+1-555-0136",
				emailGroup: "eta-team@company.com",
				remarks: "Compliance check",
			},
			{
				project: "Project Theta",
				department: "IT",
				lineManager: "Jennifer White",
				businessPhone: "+1-555-0137",
				businessFax: "+1-555-0138",
				emailGroup: "theta-team@company.com",
				remarks: "Infrastructure setup",
			},
			{
				project: "Project Iota",
				department: "R&D",
				lineManager: "Chris Anderson",
				businessPhone: "+1-555-0139",
				businessFax: "+1-555-0140",
				emailGroup: "iota-team@company.com",
				remarks: "Research phase",
			},
			{
				project: "Project Kappa",
				department: "Quality Assurance",
				lineManager: "Amanda Miller",
				businessPhone: "+1-555-0141",
				businessFax: "+1-555-0142",
				emailGroup: "kappa-team@company.com",
				remarks: "Testing in progress",
			},
		];
	}

	detach() {
		return super.detach();
	}

	destroy() {
		return super.destroy();
	}

	render() {
		return super.render(
			this.getComponentStyles() +
				this.renderTemplate("dataPager", {
					pageSize: this.itemsPerPage,
					pageSizeOptions: this.component.pageSizeOptions || [
						5, 10, 25, 50, 100,
					],
				})
		);
	}

	attach(element) {
		this.loadRefs(element, {
			dataPager: "single",
			itemsPerPage: "single",
			pageInfo: "single",
			tableBody: "single",
			firstBtn: "single",
			prevBtn: "single",
			nextBtn: "single",
			lastBtn: "single",
		});
		this.attachPager();
		return super.attach(element);
	}

	getComponentStyles() {
		return `
            <style id='testing'>
                .datapager-${this.component.key} .container {
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .datapager-${this.component.key} .table-container {
                    overflow-x: auto;
                }
                .datapager-${this.component.key} .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    border: 1px solid #ddd;
                }
                .datapager-${this.component.key} .data-table th,
                .datapager-${this.component.key} .data-table td {
                    padding: 8px;
                    text-align: left;
                    border-right: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                }
                .datapager-${this.component.key} .data-table th {
                    font-weight: 600;
                    color: #333;
                }
                .datapager-${this.component.key} .data-table tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                .datapager-${this.component.key} .data-table tr:hover {
                    background-color: #e9ecef;
                }
                .datapager-${this.component.key} .pager {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-top: 1px solid #ddd;
                    background-color: #f8f9fa;
                }
                .datapager-${this.component.key} .pager-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .datapager-${this.component.key} .pager-right {
                    display: flex;
                    align-items: center;
                }
                .datapager-${this.component.key} .items-per-page {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #666;
                }
                .datapager-${this.component.key} .items-per-page select {
                    padding: 4px 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                }
                .datapager-${this.component.key} .page-info {
                    font-size: 14px;
                    color: #666;
                    margin-right: 10px;
                }
                .datapager-${this.component.key} .nav-controls {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                }
                .datapager-${this.component.key} .nav-btn {
                    width: 32px;
                    height: 32px;
                    border: 1px solid #ddd;
                    background-color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    color: #666;
                    transition: all 0.2s;
                }
                .datapager-${this.component.key} .nav-btn:hover:not(:disabled) {
                    background-color: #f0f0f0;
                    border-color: #999;
                }
                .datapager-${this.component.key} .nav-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .datapager-${this.component.key} .nav-btn:first-child {
                    border-radius: 4px 0 0 4px;
                }
                .datapager-${this.component.key} .nav-btn:last-child {
                    border-radius: 0 4px 4px 0;
                }
            </style>
        `;
	}

	attachPager() {
		this.bindEvents();
		this.updateDisplay();
	}

	bindEvents() {
		this.addEventListener(this.refs.itemsPerPage, "change", () => {
			this.itemsPerPage = parseInt(this.refs.itemsPerPage.value);
			this.currentPage = 1;
			this.updateDisplay();
		});

		this.addEventListener(this.refs.firstBtn, "click", () => {
			this.currentPage = 1;
			this.updateDisplay();
		});

		this.addEventListener(this.refs.prevBtn, "click", () => {
			if (this.currentPage > 1) {
				this.currentPage--;
				this.updateDisplay();
			}
		});

		this.addEventListener(this.refs.nextBtn, "click", () => {
			if (this.currentPage < this.getTotalPages()) {
				this.currentPage++;
				this.updateDisplay();
			}
		});

		this.addEventListener(this.refs.lastBtn, "click", () => {
			this.currentPage = this.getTotalPages();
			this.updateDisplay();
		});
	}

	getTotalPages() {
		return Math.ceil(this.totalItemsNum / this.itemsPerPage);
	}

	getCurrentPageData() {
		const dataArray = Array.isArray(this.items)
			? this.items
			: this.getSampleData();
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = startIndex + this.itemsPerPage;
		return dataArray.slice(startIndex, endIndex);
	}

	updateTable() {
		const currentData = this.getCurrentPageData();
		this.refs.tableBody.innerHTML = "";
		if (currentData.length === 0) {
			const row = document.createElement("tr");
			row.innerHTML =
				'<td colspan="7" class="sample-data">No data available</td>';
			this.refs.tableBody.appendChild(row);
			return;
		}
		currentData.forEach((item) => {
			const row = document.createElement("tr");
			row.innerHTML = `
                <td>${item.project}</td>
                <td>${item.department}</td>
                <td>${item.lineManager}</td>
                <td>${item.businessPhone}</td>
                <td>${item.businessFax}</td>
                <td>${item.emailGroup}</td>
                <td>${item.remarks}</td>
            `;
			this.refs.tableBody.appendChild(row);
		});
	}

	updatePageInfo() {
		const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
		const endItem = Math.min(
			this.currentPage * this.itemsPerPage,
			this.totalItemsNum
		);
		this.refs.pageInfo.textContent = `${startItem}-${endItem} / ${this.totalItemsNum}`;
	}

	updateNavigationButtons() {
		const totalPages = this.getTotalPages();
		this.refs.firstBtn.disabled = this.currentPage === 1;
		this.refs.prevBtn.disabled = this.currentPage === 1;
		this.refs.nextBtn.disabled =
			this.currentPage === totalPages || totalPages === 0;
		this.refs.lastBtn.disabled =
			this.currentPage === totalPages || totalPages === 0;
	}

	updateDisplay() {
		this.updateTable();
		this.updatePageInfo();
		this.updateNavigationButtons();
	}

	// The get defaultSchema function returns the schema of your component.
	// It is used when merging all the json schemas upon component creation.
	// There is not much more to say about this function other than your
	// component will behave unexpectedly if this function is not included.
	get defaultSchema() {
		return DataPager.schema();
	}
}
