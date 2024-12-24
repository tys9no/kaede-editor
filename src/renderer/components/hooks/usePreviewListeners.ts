import { useEffect } from "react";

const { electronAPI } = window;

export const usePreviewListeners = (renderedHtml:string) => {
  useEffect(() => {
    const unsubscribeExportAsHtml = electronAPI.onExportAsHtml(() => {
      electronAPI.exportAsHtml(renderedHtml);
    });
    return () => {
      unsubscribeExportAsHtml();
    };
  }, [renderedHtml]);
};
