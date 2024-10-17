import { useState, useRef, useEffect } from 'react';

export const useInView = (threshold = 0.1): [React.MutableRefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement | null>(null); // Initialize the ref with null instead of false
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current); // Start observing the ref
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current); // Clean up observer on unmount
      }
    };
  }, [threshold]);

  return [ref, isInView];
};
