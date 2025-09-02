export default [
	{
		key: "labelPosition",
		ignore: true,
	},
	{
		key: "placeholder",
		ignore: true,
	},
	{
		key: "description",
		ignore: true,
	},
	{
		key: "tooltip",
		ignore: true,
	},
	{
		key: "autofocus",
		ignore: true,
	},
	{
		key: "tabindex",
		ignore: true,
	},
	{
		key: "disabled",
		ignore: true,
	},
	{
		key: "tableView",
		ignore: true,
	},
	{
		type: "select",
		input: true,
		key: "targetComponent",
		label: "Target Component",
		placeholder: "Select a component to paginate",
		dataSrc: "custom",
		valueProperty: "value",
		data: {
			custom(context) {
				const values = [];
				if (context.instance && context.instance.root) {
					context.instance.root.everyComponent((component) => {
						const type = component.component.type;
						if (["datagrid", "editgrid", "datamap", "tree"].includes(type)) {
							values.push({
								label: `${
									component.component.label || component.component.key
								} (${type})`,
								value: component.component.key,
							});
						}
					});
				}
				return values;
			},
		},
		validate: {
			required: true,
		},
		weight: 10,
	},
	{
		type: "number",
		input: true,
		key: "pageSize",
		label: "Page Size",
		placeholder: "Enter default page size",
		defaultValue: 5,
		validate: {
			required: true,
			min: 1,
			max: 1000,
		},
		weight: 20,
	},
	{
		type: "select",
		input: true,
		key: "pagerPosition",
		label: "Pager Position",
		defaultValue: "bottom",
		dataSrc: "values",
		data: {
			values: [
				{ label: "Top", value: "top" },
				{ label: "Bottom", value: "bottom" },
				{ label: "Both", value: "both" },
			],
		},
		weight: 30,
	},
	{
		type: "panel",
		title: "Pager Controls",
		collapsible: true,
		collapsed: false,
		key: "pagerControls",
		components: [
			{
				type: "checkbox",
				input: true,
				key: "showFirstLast",
				label: "Show First/Last Buttons",
				defaultValue: true,
				weight: 40,
			},
			{
				type: "checkbox",
				input: true,
				key: "showPrevNext",
				label: "Show Previous/Next Buttons",
				defaultValue: true,
				weight: 50,
			},
			{
				type: "checkbox",
				input: true,
				key: "showPageNumbers",
				label: "Show Page Numbers",
				defaultValue: true,
				weight: 60,
			},
			{
				type: "number",
				input: true,
				key: "maxPageNumbers",
				label: "Maximum Page Numbers to Display",
				placeholder: "Enter max page numbers",
				defaultValue: 5,
				conditional: {
					json: { "===": [{ var: "data.showPageNumbers" }, true] },
				},
				validate: {
					required: true,
					min: 1,
					max: 20,
				},
				weight: 70,
			},
			{
				type: "checkbox",
				input: true,
				key: "showPageInfo",
				label: "Show Page Information",
				tooltip: 'Shows "X to Y of Z items"',
				defaultValue: true,
				weight: 80,
			},
			{
				type: "checkbox",
				input: true,
				key: "showPageSizeSelector",
				label: "Show Page Size Selector",
				defaultValue: true,
				weight: 90,
			},
			{
				type: "datagrid",
				input: true,
				label: "Page Size Options",
				key: "pageSizes",
				tooltip: "Available page size options for the selector",
				defaultValue: [
					{ size: 5 },
					{ size: 10 },
					{ size: 25 },
					{ size: 50 },
					{ size: 100 },
				],
				components: [
					{
						label: "Size",
						key: "size",
						type: "number",
						input: true,
						validate: {
							required: true,
							min: 1,
						},
					},
				],
				conditional: {
					json: { "===": [{ var: "data.showPageSizeSelector" }, true] },
				},
				weight: 100,
			},
		],
	},
	{
		type: "panel",
		title: "Display Options",
		collapsible: true,
		collapsed: true,
		key: "displayOptions",
		components: [
			{
				type: "checkbox",
				input: true,
				key: "hideWhenSinglePage",
				label: "Hide When Single Page",
				tooltip: "Hide the pager when there is only one page",
				defaultValue: false,
				weight: 110,
			},
			{
				type: "textfield",
				input: true,
				key: "customClasses",
				label: "Custom CSS Classes",
				placeholder: "Enter custom CSS classes",
				tooltip: "Add custom CSS classes to the pager container",
				weight: 120,
			},
		],
	},
	{
		type: "panel",
		title: "Advanced Settings",
		collapsible: true,
		collapsed: true,
		key: "advancedSettings",
		components: [
			{
				type: "checkbox",
				input: true,
				key: "saveState",
				label: "Save Pagination State",
				tooltip: "Remember current page and page size when form is reloaded",
				defaultValue: false,
				weight: 130,
			},
			{
				type: "checkbox",
				input: true,
				key: "ajaxPagination",
				label: "AJAX Pagination",
				tooltip:
					"Load data from server on page change instead of client-side pagination",
				defaultValue: false,
				weight: 140,
			},
			{
				type: "textfield",
				input: true,
				key: "ajaxUrl",
				label: "AJAX URL",
				placeholder: "Enter API endpoint URL",
				tooltip: "API endpoint for fetching paginated data",
				conditional: {
					json: { "===": [{ var: "data.ajaxPagination" }, true] },
				},
				validate: {
					required: true,
				},
				weight: 150,
			},
			{
				type: "select",
				input: true,
				key: "ajaxMethod",
				label: "AJAX Method",
				defaultValue: "GET",
				dataSrc: "values",
				data: {
					values: [
						{ label: "GET", value: "GET" },
						{ label: "POST", value: "POST" },
					],
				},
				conditional: {
					json: { "===": [{ var: "data.ajaxPagination" }, true] },
				},
				weight: 160,
			},
		],
	},
];
