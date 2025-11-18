import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { Support } from '@app/Support/Support';
import { Repositories } from '@app/Repositories/Repositories';
import { PowerPuffGirl } from '@app/PowerPuffGirl/PowerPuffGirl';
import { AddToContainerfile } from '@app/AddToContainerfile/AddToContainerfile';
import { RecurringLogic } from '@app/RecurringLogic/RecurringLogic';
import { ActivationKeys } from '@app/ActivationKeys/ActivationKeys';
import { MirrorRepository } from '@app/MirrorRepository/MirrorRepository';
import { GeneralSettings } from '@app/Settings/General/GeneralSettings';
import { ProfileSettings } from '@app/Settings/Profile/ProfileSettings';
import { NotFound } from '@app/NotFound/NotFound';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  element: React.ReactElement;
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    element: <Dashboard />,
    exact: true,
    label: 'Dashboard',
    path: '/',
    title: 'PatternFly Seed | Main Dashboard',
  },
  {
    element: <Repositories />,
    exact: true,
    label: 'Repositories',
    path: '/repositories',
    title: 'PatternFly Seed | Repositories',
  },
  {
    element: <PowerPuffGirl />,
    exact: true,
    label: 'PowerPuffGirl3.0-Everythingnice.com',
    path: '/powerpuffgirl',
    title: 'PatternFly Seed | PowerPuffGirl3.0-Everythingnice.com',
  },
  {
    element: <AddToContainerfile />,
    exact: true,
    path: '/powerpuffgirl/add-to-containerfile',
    title: 'PatternFly Seed | Add transient packages to Containerfile',
  },
  {
    element: <RecurringLogic />,
    exact: true,
    label: 'Recurring Logic',
    path: '/recurring-logic',
    title: 'PatternFly Seed | Recurring Logic',
  },
  {
    element: <ActivationKeys />,
    exact: true,
    label: 'Activation Keys',
    path: '/activation-keys',
    title: 'PatternFly Seed | Activation Keys',
  },
  {
    element: <MirrorRepository />,
    exact: true,
    label: 'Mirror Repository',
    path: '/mirror-repository',
    title: 'PatternFly Seed | Mirror Repository',
  },
  {
    element: <Support />,
    exact: true,
    label: 'Support',
    path: '/support',
    title: 'PatternFly Seed | Support Page',
  },
  {
    label: 'Settings',
    routes: [
      {
        element: <GeneralSettings />,
        exact: true,
        label: 'General',
        path: '/settings/general',
        title: 'PatternFly Seed | General Settings',
      },
      {
        element: <ProfileSettings />,
        exact: true,
        label: 'Profile',
        path: '/settings/profile',
        title: 'PatternFly Seed | Profile Settings',
      },
    ],
  },
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };
