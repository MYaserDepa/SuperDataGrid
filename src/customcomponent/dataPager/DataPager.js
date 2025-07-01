import { Formio } from "@formio/js";
import editForm from './DataPager.form.js'

const Component = Formio.Components.components.component;

export default class DataPager extends Component {
    static editForm = editForm

    static schema(...extend) {
        return Component.schema({
            type: 'dataPager',
            label: 'Data Pager',
            key: 'dataPager',
            pageSize: 5,
            pageSizeOptions: [5, 10, 25, 50, 100],
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: 'Data Pager',
            icon: 'list',
            group: 'data',
            weight: 100,
            schema: DataPager.schema()
        };
    }

    constructor(component, options, data) {
        super(component, options, data);
        this.currentPage = 1;
        this.itemsPerPage = this.component.pageSize || 5;
        this.data = this.getSampleData();
        this.totalItems = this.data.length;
    }

    getSampleData() {
        return [
            { project: "Project Alpha", department: "Engineering", lineManager: "John Smith", businessPhone: "+1-555-0123", businessFax: "+1-555-0124", emailGroup: "alpha-team@company.com", remarks: "Active development" },
            { project: "Project Beta", department: "Marketing", lineManager: "Sarah Johnson", businessPhone: "+1-555-0125", businessFax: "+1-555-0126", emailGroup: "beta-team@company.com", remarks: "In planning phase" },
            { project: "Project Gamma", department: "Sales", lineManager: "Mike Wilson", businessPhone: "+1-555-0127", businessFax: "+1-555-0128", emailGroup: "gamma-team@company.com", remarks: "Ready for launch" },
            { project: "Project Delta", department: "Operations", lineManager: "Lisa Brown", businessPhone: "+1-555-0129", businessFax: "+1-555-0130", emailGroup: "delta-team@company.com", remarks: "Under review" },
            { project: "Project Epsilon", department: "HR", lineManager: "David Lee", businessPhone: "+1-555-0131", businessFax: "+1-555-0132", emailGroup: "epsilon-team@company.com", remarks: "Pending approval" },
            { project: "Project Zeta", department: "Finance", lineManager: "Emma Davis", businessPhone: "+1-555-0133", businessFax: "+1-555-0134", emailGroup: "zeta-team@company.com", remarks: "Budget allocation" },
            { project: "Project Eta", department: "Legal", lineManager: "Robert Taylor", businessPhone: "+1-555-0135", businessFax: "+1-555-0136", emailGroup: "eta-team@company.com", remarks: "Compliance check" },
            { project: "Project Theta", department: "IT", lineManager: "Jennifer White", businessPhone: "+1-555-0137", businessFax: "+1-555-0138", emailGroup: "theta-team@company.com", remarks: "Infrastructure setup" },
            { project: "Project Iota", department: "R&D", lineManager: "Chris Anderson", businessPhone: "+1-555-0139", businessFax: "+1-555-0140", emailGroup: "iota-team@company.com", remarks: "Research phase" },
            { project: "Project Kappa", department: "Quality Assurance", lineManager: "Amanda Miller", businessPhone: "+1-555-0141", businessFax: "+1-555-0142", emailGroup: "kappa-team@company.com", remarks: "Testing in progress" }
        ];
    }

    render() {
        return super.render(this.renderTemplate('dataPager', {
            pageSize: this.itemsPerPage,
            pageSizeOptions: this.component.pageSizeOptions || [5, 10, 25, 50, 100],
        }));
    }

    attach(element) {
        this.loadRefs(element, { dataPager: 'single' });
        this.container = this.refs.dataPager;
        this.injectStyles();
        this.renderPager();
        return super.attach(element);
    }

    injectStyles() {
        const styleId = 'datapager-component-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .container {
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .table-container {
                    overflow-x: auto;
                }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    border: 1px solid #ddd;
                }
                .data-table th,
                .data-table td {
                    padding: 8px;
                    text-align: left;
                    border-right: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                }
                .data-table th {
                    font-weight: 600;
                    color: #333;
                }
                .data-table tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                .data-table tr:hover {
                    background-color: #e9ecef;
                }
                .pager {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-top: 1px solid #ddd;
                    background-color: #f8f9fa;
                }
                .pager-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .pager-right {
                    display: flex;
                    align-items: center;
                }
                .items-per-page {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #666;
                }
                .items-per-page select {
                    padding: 4px 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                }
                .page-info {
                    font-size: 14px;
                    color: #666;
                    margin-right: 10px;
                }
                .nav-controls {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                }
                .nav-btn {
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
                .nav-btn:hover:not(:disabled) {
                    background-color: #f0f0f0;
                    border-color: #999;
                }
                .nav-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .nav-btn:first-child {
                    border-radius: 4px 0 0 4px;
                }
                .nav-btn:last-child {
                    border-radius: 0 4px 4px 0;
                }
            `;
            document.head.appendChild(style);
        }
    }

    renderPager() {
        if (!this.container) return;
        this.container.innerHTML = `
        <div class="container">
            <div class="table-container">
                <table class="data-table" id="dataTable">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Department</th>
                            <th>Line Manager</th>
                            <th>Business Phone #</th>
                            <th>Business Fax #</th>
                            <th>Email Distribution Group</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody"></tbody>
                </table>
            </div>
            <div class="pager">
                <div class="pager-left">
                    <div class="items-per-page">
                        Items per page:
                        <select id="itemsPerPage">
                            ${this.component.pageSizeOptions.map(opt => `<option value="${opt}" ${opt === this.itemsPerPage ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="pager-right">
                    <div class="page-info" id="pageInfo"></div>
                    <div class="nav-controls">
                        <button class="nav-btn" id="firstBtn" title="First page">⇤</button>
                        <button class="nav-btn" id="prevBtn" title="Previous page">‹</button>
                        <button class="nav-btn" id="nextBtn" title="Next page">›</button>
                        <button class="nav-btn" id="lastBtn" title="Last page">⇥</button>
                    </div>
                </div>
            </div>
        </div>`;
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        this.itemsPerPageSelect = this.container.querySelector('#itemsPerPage');
        this.pageInfo = this.container.querySelector('#pageInfo');
        this.tableBody = this.container.querySelector('#tableBody');
        this.firstBtn = this.container.querySelector('#firstBtn');
        this.prevBtn = this.container.querySelector('#prevBtn');
        this.nextBtn = this.container.querySelector('#nextBtn');
        this.lastBtn = this.container.querySelector('#lastBtn');
    }

    bindEvents() {
        this.itemsPerPageSelect.addEventListener('change', () => {
            this.itemsPerPage = parseInt(this.itemsPerPageSelect.value);
            this.currentPage = 1;
            this.updateDisplay();
        });
        this.firstBtn.addEventListener('click', () => {
            this.currentPage = 1;
            this.updateDisplay();
        });
        this.prevBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateDisplay();
            }
        });
        this.nextBtn.addEventListener('click', () => {
            if (this.currentPage < this.getTotalPages()) {
                this.currentPage++;
                this.updateDisplay();
            }
        });
        this.lastBtn.addEventListener('click', () => {
            this.currentPage = this.getTotalPages();
            this.updateDisplay();
        });
    }

    getTotalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    getCurrentPageData() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.data.slice(startIndex, endIndex);
    }

    updateTable() {
        const currentData = this.getCurrentPageData();
        this.tableBody.innerHTML = '';
        if (currentData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="7" class="sample-data">No data available</td>';
            this.tableBody.appendChild(row);
            return;
        }
        currentData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.project}</td>
                <td>${item.department}</td>
                <td>${item.lineManager}</td>
                <td>${item.businessPhone}</td>
                <td>${item.businessFax}</td>
                <td>${item.emailGroup}</td>
                <td>${item.remarks}</td>
            `;
            this.tableBody.appendChild(row);
        });
    }

    updatePageInfo() {
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
        this.pageInfo.textContent = `${startItem}-${endItem} / ${this.totalItems}`;
    }

    updateNavigationButtons() {
        const totalPages = this.getTotalPages();
        this.firstBtn.disabled = this.currentPage === 1;
        this.prevBtn.disabled = this.currentPage === 1;
        this.nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
        this.lastBtn.disabled = this.currentPage === totalPages || totalPages === 0;
    }

    updateDisplay() {
        this.updateTable();
        this.updatePageInfo();
        this.updateNavigationButtons();
    }

    setValue(value) {
        // Optionally allow external value setting
        super.setValue(value);
        this.updateDisplay();
    }

    get defaultSchema() {
        return DataPager.schema();
    }
}