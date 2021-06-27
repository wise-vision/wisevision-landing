import { pxToRem } from 'theme';
import { Box } from 'theme-ui';
import { WithChildren } from 'types';
import { Footer } from './Footer';
import { Menu } from './Menu';

export const Layout = ({ children }: WithChildren) => (
  <>
    <Menu />
    <Box as="main" sx={{ flex: 1, pt: [pxToRem(59), pxToRem(70)] }}>
      <Box sx={{ overflowX: 'hidden' }}>{children}</Box>
    </Box>
    <Footer />
  </>
);
