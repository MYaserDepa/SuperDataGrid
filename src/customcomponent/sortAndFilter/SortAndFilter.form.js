import { Formio } from "@formio/js";

const baseEditForm = Formio.Components.baseEditForm;
import SortAndFilterEditCustom from "./editForm/SortAndFilter.edit.custom.js";

export default function (...extend) {
	return baseEditForm(
		[
			{
				key: "sortAndFilterSettings",
				label: "Sort And Filter Settings",
				weight: 10,
				components: SortAndFilterEditCustom,
			},
		],
		...extend
	);
}
