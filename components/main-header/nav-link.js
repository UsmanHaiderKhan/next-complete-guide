'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import classes from './nav-link.module.css';

export default function NavLink({ href, children }) {
  const path = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch by ensuring server and client render the same initial content
  const isActive = isMounted && path.startsWith(href);

  return (
    <Link
      href={href}
      className={
        isActive ? `${classes.link} ${classes.active}` : `${classes.link}`
      }
    >
      {children}
    </Link>
  );
}
