import React, { Component } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build/build/ckeditor';

class TextEditor extends Component {
    render() {
        const {value, onChange, readOnly} = this.props;
        const custom_config = {
            ...Editor.defaultConfig,
            htmlSupport: {                  // html tag들이 filtering되지 않도록 설정한다. 
                allow: [
                  {
                    name: /.*/,
                    attributes: true,
                    classes: true,
                    styles: true
                  }
                ]
            },
           extraPlugins: [ MyCustomUploadAdapterPlugin ],   // image 파일 upload를 위한 custom upload 등록
        };

        //console.log(custom_config);

        return (
            <CKEditor
                required
                editor={Editor}
                config={custom_config}
                data={value}
                onChange={(event, editor) => {
                    onChange(editor.getData());
                }}
                onReady={(editor) => {
                    if(readOnly) 
                        editor.enableReadOnlyMode( 'my-feature-id' );
                }}
            />
        )
    }
}

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader)
    }
}
  
class MyUploadAdapter {
      constructor(props) {
        this.loader = props;
        // URL where to send files.
        this.url = `http://localhost:8094/fileserver/fileUpload`;
      }
  
      // Starts the upload process.
      upload() {
          return new Promise((resolve, reject) => {
              this._initRequest();
              this._initListeners(resolve, reject);
              this._sendRequest();
          } );
      }
  
      // Aborts the upload process.
      abort() {
          if ( this.xhr ) {
              this.xhr.abort();
          }
      }
  
      // Example implementation using XMLHttpRequest.
      _initRequest() {
          const xhr = this.xhr = new XMLHttpRequest();
  
          xhr.open('POST', this.url, true);
          xhr.responseType = 'json';
          xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
          //xhr.setRequestHeader('Authorization', getToken())
      }
  
      // Initializes XMLHttpRequest listeners.
      _initListeners( resolve, reject ) {
          const xhr = this.xhr;
          const loader = this.loader;
          const genericErrorText = 'Couldn\'t upload file:' + ` ${ loader.file.name }.`;
  
          xhr.addEventListener( 'error', () => reject( genericErrorText ) );
          xhr.addEventListener( 'abort', () => reject() );
          xhr.addEventListener( 'load', () => {
              const response = xhr.response;
              if ( !response || response.error ) {
                  return reject( response && response.error ? response.error.message : genericErrorText );
              }
  
              // If the upload is successful, resolve the upload promise with an object containing
              // at least the "default" URL, pointing to the image on the server.
              resolve({
                  default: response.url
              });
          } );
  
          if ( xhr.upload ) {
              xhr.upload.addEventListener( 'progress', evt => {
                  if ( evt.lengthComputable ) {
                      loader.uploadTotal = evt.total;
                      loader.uploaded = evt.loaded;
                  }
              } );
          }
      }
  
      // Prepares the data and sends the request.
      _sendRequest() {
          const data = new FormData();        
  
          this.loader.file.then(result => {
            data.append('upload', result);
            this.xhr.send(data);
            }
          )
      }
  
  }

export default TextEditor;