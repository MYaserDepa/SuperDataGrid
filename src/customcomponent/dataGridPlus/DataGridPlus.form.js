import { Formio } from "@formio/js";

const baseEditForm = Formio.Components.baseEditForm;
import DataGridPlusEditCustom from "./editForm/DataGridPlus.edit.custom";

export default function (...extend) {
	return baseEditForm(
		[
			{
				key: "dataGridPlusEditCustom",
				label: "Data Grid Plus Settings",
				weight: 10,
				components: DataGridPlusEditCustom,
			},
		],
		...extend
	);
}
