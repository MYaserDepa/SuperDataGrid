import { Formio } from "@formio/js";
import editForm from './DataPager.form.js'

const Component = Formio.Components.components.component;

export default class DataPager extends Component {
    static editForm = editForm

    static schema(...extend) {
        return Component.schema({
            type: 'dataPager',
            label: 'dataPager',
            key: 'dataPager',
            pageSize: 10,
            pageSizeOptions: [10, 20, 50, 100],
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
    }

    render() {
        return super.render(`
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
                <tbody id="tableBody">
                    <!-- Data will be populated by JavaScript -->
                </tbody>
            </table>
        </div>

        <div class="pager">
            <div class="pager-left">
                <div class="items-per-page">
                    Items per page:
                    <select id="itemsPerPage">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>

            <div class="pager-right">
                <div class="page-info" id="pageInfo">
                    1-4 / 4
                </div>

                <div class="nav-controls">
                    <button class="nav-btn" id="firstBtn" title="First page">⇤</button>
                    <button class="nav-btn" id="prevBtn" title="Previous page">‹</button>
                    <button class="nav-btn" id="nextBtn" title="Next page">›</button>
                    <button class="nav-btn" id="lastBtn" title="Last page">⇥</button>
                </div>
            </div>
        </div>
    </div>`
        )
    }

    attachIcon(icons, index) {
        const icon = icons.item(index);
        icon.addEventListener('click', () => {
            if (!this.component.disabled) {
                this.setValue(`${index + 1}/${this.component.numberOfIcons}`);
            }
        })
    }

    attachIcons() {
        const icons = this.refs.icon;
        for (let i = 0; i < icons.length; i++) {
            this.attachIcon(icons, i);
        }
    }

    attach(element) {
        this.loadRefs(element, {
            dataPager: 'single',
            icon: 'multiple'
        });
        this.attachIcons();
        return super.attach(element);
    }

    get defaultSchema() {
        return DataPager.schema();
    }

    setValue(value) {
        const changed = super.setValue(value);
        this.redraw();
        return changed;
    }
}