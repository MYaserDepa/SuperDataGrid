import { Formio } from "@formio/js";

const baseEditForm = Formio.Components.baseEditForm;
import DataGridPagerEditDisplay from "./editForm/DataGridPager.edit.custom.js";

export default function (...extend) {
	return baseEditForm(
		[
			{
				key: "pager",
				label: "Pager Settings",
				weight: 10,
				components: DataGridPagerEditDisplay,
			},
		],
		...extend
	);
}
