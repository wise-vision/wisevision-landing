import Link from 'next/link';
import { ReactNode } from 'react';
import { SxProp } from 'theme-ui';

interface AppLinkProps extends SxProp {
  href: string;
  as?: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  target?: string;
  variant?: string;
}

export function AppLink({ href, as, children, sx, ...rest }: AppLinkProps) {
  // Cast sx to a record so that we can destructure it
  const sxObj = (sx || {}) as Record<string, any>;
  const { textDecoration, ...restSx } = sxObj;
  // Replace a null textDecoration with 'none'
  const finalTextDecoration =
    textDecoration === null || textDecoration === undefined ? 'none' : textDecoration;

  // Filter out any null values from the rest of sx
  const filteredRestSx = Object.fromEntries(
    Object.entries(restSx).filter(([, value]) => value !== null)
  );

  const combinedStyle = {
    textDecoration: finalTextDecoration,
    color: 'white',
    ...filteredRestSx,
  };

  const isInternalLink =
    href.startsWith('/') || href.startsWith('#') || href.startsWith('https://wisevision.tech');

  if (isInternalLink) {
    return (
      <Link href={href} as={as} {...rest} style={combinedStyle}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={combinedStyle} {...rest}>
      {children}
    </a>
  );
}
