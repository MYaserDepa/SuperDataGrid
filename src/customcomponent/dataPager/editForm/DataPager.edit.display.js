export default [
	{
		type: "number",
		key: "pageLimit",
		defaultValue: 4,
		label: "Maximum Page Size",
		input: true,
		tooltip: "The maximum number of items per page.",
	},
	{
		type: "textfield",
		key: "gridToAttach",
		label: "Grid to Attach",
		input: true,
		tooltip:
			"Enter the key of the Data Grid, Edit Grid, Data Map, or Tree this pager should control.",
	},
];
