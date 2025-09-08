export default [
	{
		type: "number",
		key: "pageLimit",
		label: "Maximum Page Size",
		input: true,
		defaultValue: 5,
		decimalLimit: 0, // no decimals
		validate: {
			min: 1,
		},
		tooltip: "The maximum number of items per page.",
	},
	{
		type: "textfield",
		key: "gridToAttach",
		label: "Grid to Attach",
		input: true,
		tooltip: "Enter the key of the Data Grid this pager should control.",
	},
];
