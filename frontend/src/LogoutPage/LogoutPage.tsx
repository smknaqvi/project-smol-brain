import { useEffect } from 'react';
import { useAppState } from '../state';

function LogoutPage() {
  const { signOut } = useAppState();
  useEffect(() => {
    signOut();
  }, [signOut]);

  return null;
}

export default LogoutPage;
