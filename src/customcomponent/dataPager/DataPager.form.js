import componentEditForm from "formiojs/components/_classes/component/Component.form";
import DataPagerEditDisplay from "./editForm/dataPager.edit.display.js";

export default function (...extend) {
	return componentEditForm(
		[
			{
				key: "display",
				components: DataPagerEditDisplay,
			},
			{
				key: "data",
				ignore: true,
			},
			{
				key: "validation",
				ignore: true,
			},
			{
				key: "api",
				components: [
					{
						key: "persistent",
						ignore: true,
					},
					{
						key: "protected",
						ignore: true,
					},
					{
						key: "encrypted",
						ignore: true,
					},
					{
						key: "properties",
						ignore: false,
					},
					{
						key: "tags",
						ignore: false,
					},
				],
			},
			{
				key: "conditional",
				ignore: false,
			},
			{
				key: "logic",
				ignore: false,
			},
		],
		...extend
	);
}
