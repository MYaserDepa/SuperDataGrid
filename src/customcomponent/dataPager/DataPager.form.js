import { Formio } from "@formio/js";

const baseEditForm = Formio.Components.baseEditForm
import DataPagerEditDisplay from "./editForm/DataPager.edit.display.js";
export default function (...extend) {
    return baseEditForm([
        {
            key: 'logic',
            components: DataPagerEditDisplay
        },
        {
            key: 'layout',
            ignore: true
        }
    ], ...extend)
}