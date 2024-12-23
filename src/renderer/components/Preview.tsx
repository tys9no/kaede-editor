import { useEffect } from 'react';

type Props = {
  markdownValue: string;
}

const { electronAPI } = window;

const Preview = ({ markdownValue }:Props) => {

  useEffect(() => {
    const handler = () => {
      electronAPI.exportAsHtml(markdownValue);
    };
    const removeListener = electronAPI.onExportAsHtml(handler);

    return () => {
      removeListener();
    };
  }, [markdownValue]);


  return (
    <div
      style={{ height: '100vh' }}
      dangerouslySetInnerHTML={{ __html: markdownValue }}
    ></div>
  );
}

export default Preview;