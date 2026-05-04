import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();

  const router = useMemo(
    () => ({
      back: () => navigate(-1),
      forward: () => navigate(1),
      refresh: () => navigate(0),
      push: (href, options) => {
        if (href.startsWith('/')) {
          navigate(href, options); // absolute
        } else {
          navigate(`../${href}`, { relative: 'path', ...options }); // relative
        }
      },
      replace: (href) => navigate(href, { replace: true }),
    }),
    [navigate]
  );

  return router;
}
