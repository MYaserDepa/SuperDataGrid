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
		this.allGridRows = [];
		this.targetComponent = null;
	}

	render() {
		return super.render(this.renderTemplate("sortAndFilter", {}));
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
			searchInput: "single",
		});

		// Locate the data grid to attach to
		this.targetComponent = this.findTargetComponent();

		if (!this.targetComponent) {
			return;
		}
	}

	/**
	 * Cleanup listeners when component is removed
	 */
	detach() {
		return super.detach();
	}
}
