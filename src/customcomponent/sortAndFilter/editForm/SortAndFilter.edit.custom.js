export default [
	{
		type: "textfield",
		key: "gridToAttach",
		label: "Grid to Attach",
		input: true,
		tooltip:
			"Enter the key of the Data Grid this component should sort and filter.",
		validate: {
			required: true,
		},
	},
];
