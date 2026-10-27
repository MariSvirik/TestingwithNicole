import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { Repositories } from '@app/Repositories/Repositories';
import { PowerPuffGirl } from '@app/PowerPuffGirl/PowerPuffGirl';
import { AddToContainerfile } from '@app/AddToContainerfile/AddToContainerfile';
import { RecurringLogic } from '@app/RecurringLogic/RecurringLogic';
import { ActivationKeys } from '@app/ActivationKeys/ActivationKeys';
import { MirrorRepository } from '@app/MirrorRepository/MirrorRepository';
import { HttpProxyCreate } from '@app/HttpProxy/HttpProxyCreate';
import { ExperimentsLocations } from '@app/Experiments/ExperimentsLocations';
import { EditParameters } from '@app/Experiments/EditParameters';
import { EditParametersV2 } from '@app/Experiments/EditParametersV2';
import { PQC, PQCV2 } from '@app/Experiments/PQC';
import { ProductDetail } from '@app/ProductDetail/ProductDetail';
import { CreateHost } from '@app/CreateHost/CreateHost';
import { TaskDetail } from '@app/TaskDetail/TaskDetail';
import { TemplateIndex } from '@app/TemplateIndex/TemplateIndex';
import { TemplateDetail } from '@app/TemplateDetail/TemplateDetail';
import { RepoDiscovery } from '@app/RepoDiscovery/RepoDiscovery';
import { RepoDiscoveryV2 } from '@app/RepoDiscovery/RepoDiscoveryV2';
import { RepoDiscoveryV3 } from '@app/RepoDiscovery/RepoDiscoveryV3';
import { RepoDiscoveryV4 } from '@app/RepoDiscovery/RepoDiscoveryV4';
import { NotFound } from '@app/NotFound/NotFound';
import { withExperimentsAuth } from '@app/Experiments/experimentsAuth';

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

// Products route has been removed - do not add it back
const routes: AppRouteConfig[] = [
  {
    element: <RepoDiscoveryV4 />,
    exact: true,
    label: 'Repository discovery 4',
    path: '/repositories/discover-v4',
    title: 'PatternFly Seed | Repository discovery 4',
  },
  {
    element: <ExperimentsLocations />,
    exact: true,
    label: 'Locations',
    path: '/experiments/locations',
    title: 'PatternFly Seed | Locations',
  },
  {
    element: <TemplateIndex />,
    exact: true,
    label: 'Template',
    path: '/template',
    title: 'PatternFly Seed | Template',
  },
  {
    element: <TemplateDetail />,
    exact: true,
    path: '/template/:templateId',
    title: 'PatternFly Seed | Template detail',
  },
  {
    element: withExperimentsAuth(<ProductDetail />),
    exact: true,
    path: '/products/:productName',
    title: 'PatternFly Seed | Product Detail',
  },
  {
    element: withExperimentsAuth(<TaskDetail />),
    exact: true,
    path: '/tasks/:taskId',
    title: 'PatternFly Seed | Task Detail',
  },
  {
    element: withExperimentsAuth(<AddToContainerfile />),
    exact: true,
    path: '/powerpuffgirl/add-to-containerfile',
    title: 'PatternFly Seed | Add transient packages to Containerfile',
  },
  {
    label: 'Experiments',
    routes: [
      {
        element: withExperimentsAuth(<Dashboard />),
        exact: true,
        label: 'Dashboard',
        path: '/',
        title: 'PatternFly Seed | Main Dashboard',
      },
      {
        element: withExperimentsAuth(<Repositories />),
        exact: true,
        label: 'Products',
        path: '/repositories',
        title: 'PatternFly Seed | Products',
      },
      {
        element: withExperimentsAuth(<RepoDiscovery />),
        exact: true,
        label: 'Repository discovery',
        path: '/repositories/discover',
        title: 'PatternFly Seed | Repository discovery',
      },
      {
        element: withExperimentsAuth(<RepoDiscoveryV2 />),
        exact: true,
        label: 'Repository discovery v2',
        path: '/repositories/discover-v2',
        title: 'PatternFly Seed | Repository discovery v2',
      },
      {
        element: withExperimentsAuth(<RepoDiscoveryV3 />),
        exact: true,
        label: 'Repository discovery v3',
        path: '/repositories/discover-v3',
        title: 'PatternFly Seed | Repository discovery v3',
      },
      {
        element: withExperimentsAuth(<PQC />),
        exact: true,
        label: 'PQC1',
        path: '/experiments/pqc',
        title: 'PatternFly Seed | PQC1',
      },
      {
        element: withExperimentsAuth(<PQCV2 />),
        exact: true,
        label: 'PQC2',
        path: '/experiments/pqc-v2',
        title: 'PatternFly Seed | PQC2',
      },
      {
        element: withExperimentsAuth(<CreateHost />),
        exact: true,
        label: 'Create Host',
        path: '/hosts/create',
        title: 'PatternFly Seed | Create Host',
      },
      {
        element: withExperimentsAuth(<PowerPuffGirl />),
        exact: true,
        label: 'PowerPuffGirl3.0-Everythingnice.com',
        path: '/powerpuffgirl',
        title: 'PatternFly Seed | PowerPuffGirl3.0-Everythingnice.com',
      },
      {
        element: withExperimentsAuth(<RecurringLogic />),
        exact: true,
        label: 'Recurring Logic',
        path: '/recurring-logic',
        title: 'PatternFly Seed | Recurring Logic',
      },
      {
        element: withExperimentsAuth(<ActivationKeys />),
        exact: true,
        label: 'Activation Keys',
        path: '/activation-keys',
        title: 'PatternFly Seed | Activation Keys',
      },
      {
        element: withExperimentsAuth(<MirrorRepository />),
        exact: true,
        label: 'Mirror Repository',
        path: '/mirror-repository',
        title: 'PatternFly Seed | Mirror Repository',
      },
      {
        element: withExperimentsAuth(<HttpProxyCreate />),
        exact: true,
        label: 'HTTP Proxy',
        path: '/http-proxy/create',
        title: 'PatternFly Seed | Create HTTP Proxy',
      },
      {
        element: withExperimentsAuth(<EditParameters />),
        exact: true,
        label: 'Edit parameters',
        path: '/experiments/edit-parameters',
        title: 'PatternFly Seed | Experiments | Edit parameters',
      },
      {
        element: withExperimentsAuth(<EditParametersV2 />),
        exact: true,
        label: 'Edit parameters v2',
        path: '/experiments/edit-parameters-v2',
        title: 'PatternFly Seed | Experiments | Edit parameters v2',
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
