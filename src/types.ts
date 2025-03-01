import { ReactNode } from 'react';
import { Theme, ThemeUIStyleObject } from 'theme-ui';

export type WithChildren = {
  children: ReactNode;
};

export interface MySxProp {
  sx?: ThemeUIStyleObject<Theme>;
}
