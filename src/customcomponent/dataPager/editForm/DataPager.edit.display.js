export default [
    {
        type: 'number',
        key: 'numberOfIcons',
        label: 'Number of Icons',
        input: 'true',
        tooltip: "The number of icons displayed in the form"
    },
    {
        type: 'textfield',
        key: 'icon',
        label: 'Icon',
        input: 'true',
        tooltip: 'The bootstrap icon class that will go in the <i> tag'
    },
    {
        type: 'textfield',
        key: 'color',
        label: 'Color',
        input: 'true',
        tooltip: 'The color of the icons'
    },
    {
        type: 'textfield',
        key: 'iconSize',
        label: 'Icon Size',
        tooltip: 'The size of the icon'
    },
    {
        key: 'placeholder',
        ignore: true
    },
    {
        type: 'number',
        key: 'pageSize',
        label: 'Default Page Size',
        input: true,
        tooltip: 'The default number of items per page.'
    },
    {
        type: 'tags',
        key: 'pageSizeOptions',
        label: 'Page Size Options',
        input: true,
        tooltip: 'Available options for items per page.'
    }
]