export default [
	{
		type: "number",
		key: "pageSize",
		label: "Maximum Page Size",
		input: true,
		tooltip: "The maximum number of items per page.",
	},
	{
		type: "number",
		key: "totalPages",
		label: "Total Number of Pages",
		input: true,
		tooltip: "The number of pages to display.",
		hidden: true,
	},
	{
		type: "number",
		key: "currentPage",
		label: "Current Page",
		input: true,
		tooltip: "The current page to display.",
		hidden: true,
	},
];
