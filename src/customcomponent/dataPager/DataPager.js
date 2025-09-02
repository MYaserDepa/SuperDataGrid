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
		this.currentPage = 1;
		this.itemsPerPage = this.component.pageSize || 5;
		this.items = this.getSampleData();
		this.totalItemsNum = this.items.length;
	}

	detach() {
		return super.detach();
	}

	destroy() {
		return super.destroy();
	}

	render() {
		return super.render(
			this.renderTemplate("dataPager", {
				pageSize: this.itemsPerPage,
				pageSizeOptions: this.component.pageSizeOptions || [5, 10, 25, 50, 100],
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
