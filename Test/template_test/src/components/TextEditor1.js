import React, { Component, Fragment } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from "../ckeditor_build/ckeditor"

class TextEditor extends Component{
  render(){
    const { value, onChange } = this.props 

    const custom_config = {					
        toolbar: {
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'outdent',
                'indent',
                '|',
                'imageUpload',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                'undo',
                'redo'
            ]
        },
        language: 'ko',
        image: {
            toolbar: [
                'imageTextAlternative',
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        },
        licenseKey: '',           
        ckfinder: {
            uploadUrl: 'http://localhost:8094/fileserver/fileUpload'
        }    
    }

    return(
          <CKEditor
            editor={Editor}
            config={custom_config}
            data={value}
            onChange={(event, editor) => {
            const data = editor.getData()
              onChange(data)
            }}
          />
    )
  }
}

export default TextEditor