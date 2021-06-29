import { disable } from 'darkreader';
import { useEffect } from 'react';

export default function DarkReaderDisable() {
  useEffect(() => {
    disable();
  }, []);

  return null;
}
