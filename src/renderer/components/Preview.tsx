import { usePreviewListeners } from './hooks/usePreviewListeners';

type Props = {
  renderedHtml: string;
}

const Preview = (props: Props) => {
  usePreviewListeners(props.renderedHtml);

  return (
    <div
      style={{ height: '100vh' }}
      dangerouslySetInnerHTML={{ __html: props.renderedHtml }}
    ></div>
  );
}

export default Preview;
