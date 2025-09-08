export default [
	{
		type: "number",
		key: "pageLimit",
		label: "Maximum Page Size",
		input: true,
		defaultValue: 4,
		decimalLimit: 0, // no decimals
		validateOn: "change", // validate immediately
		validate: {
			required: true,
			min: 1,
			step: 1,
			custom:
				"valid = (input !== undefined && Number(input) >= 1) ? true : 'Must be ≥ 1';",
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
