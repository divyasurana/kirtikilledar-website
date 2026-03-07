import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Kirti Killedar`;
    } else {
      document.title = 'Kirti Killedar';
    }
  }, [title]);
};

export default useDocumentTitle;
