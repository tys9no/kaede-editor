import { useEffect, useRef } from 'react';

type Props = {
  markdownValue: string;
}

const style = {
  height: "100vh"
}

const { electronAPI } = window;

const Preview = (props:Props) => {

  useEffect(() => {
    const removeListener = electronAPI.onSaveHtml(
      () => {
        console.log("saveHtmlContents");
        electronAPI.sendHtml(props.markdownValue);
      },
    );
    return () => {
      removeListener();
    }
  }, [props.markdownValue]);


  return <div style={style} dangerouslySetInnerHTML={{ __html: props.markdownValue }}></div>
}

export default Preview;