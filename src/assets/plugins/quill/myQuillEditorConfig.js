//富文本编辑toolbar工具栏默认的配置
export const quillToolbarConfig = {
    quillToolbarOptions : [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'direction': 'rtl'}],                         // text direction
        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],
        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],
        ['link', 'image'],
        ['clean']
    ],
    quillHistoryOptions : {
        delay: 1000,
        maxStack: 50,
        userOnly: false
    },
    quillImageResizeOptions : {
        displayStyles: {
            backgroundColor: 'black',
            border: 'none',
            color: 'white'
        },
        modules: ['Resize', 'DisplaySize', 'Toolbar' ]
    }
}
