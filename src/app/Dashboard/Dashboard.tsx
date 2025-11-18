import * as React from 'react';
import {
  PageSection,
  Title,
  Grid,
  GridItem,
  Card,
  CardTitle,
  CardBody,
  Stack,
  Button,
  ActionGroup,
  Spinner,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Label,
  Progress,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  List,
  ListItem,
  Text,
  Divider
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import {
  SearchIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExternalLinkAltIcon,
  UsersIcon,
  DollarSignIcon,
  ChartLineIcon,
  PercentageIcon,
  ServerIcon,
  DatabaseIcon,
  ExclamationTriangleIcon
} from '@patternfly/react-icons';

// Mock data for demonstration
const mockMetrics = {
  totalUsers: 1247,
  activeUsers: 892,
  revenue: 24580,
  conversion: 3.2
};

const mockRecentActivity = [
  { id: 1, user: 'John Smith', action: 'Logged in', time: '2 minutes ago', status: 'success' },
  { id: 2, user: 'Jane Doe', action: 'Updated profile', time: '1 hour ago', status: 'info' },
  { id: 3, user: 'Bob Johnson', action: 'Failed login attempt', time: '2 hours ago', status: 'danger' },
  { id: 4, user: 'Alice Brown', action: 'Created new project', time: '3 hours ago', status: 'success' },
  { id: 5, user: 'Charlie Wilson', action: 'Uploaded document', time: '5 hours ago', status: 'info' }
];

const mockTableData = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', status: 'Active', lastLogin: '2 hours ago', role: 'Admin' },
  { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', status: 'Active', lastLogin: '1 day ago', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', status: 'Inactive', lastLogin: '1 week ago', role: 'User' },
  { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', status: 'Pending', lastLogin: 'Never', role: 'User' }
];

const Dashboard: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const getStatusLabel = (status: string) => {
    let color: 'green' | 'red' | 'orange' | 'blue' = 'blue';
    if (status === 'Active' || status === 'success') color = 'green';
    else if (status === 'Inactive' || status === 'danger') color = 'red';
    else if (status === 'Pending' || status === 'info') color = 'blue';

    return <Label color={color}>{status}</Label>;
  };

  const getTrendIcon = (isPositive: boolean) => {
    return isPositive
      ? <ArrowUpIcon style={{ color: 'var(--pf-global--success-color--100)' }} />
      : <ArrowDownIcon style={{ color: 'var(--pf-global--danger-color--100)' }} />;
  };

  if (isLoading) {
    return (
      <PageSection>
        <Spinner size="xl" />
      </PageSection>
    );
  }

  return (
    <PageSection>
      <Stack hasGutter>
        {/* Header Section */}
        <div>
          <Title headingLevel="h1" size="lg">PatternFly v5 Dashboard</Title>
          <Text>
            Welcome to your PatternFly v5 dashboard! This demonstrates various PatternFly v5 components and patterns.
          </Text>
        </div>

        {/* Metrics Cards Grid */}
        <Grid hasGutter>
          <GridItem span={12} md={6} lg={3}>
            <Card isFullHeight>
              <CardTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--sm)' }}>
                  <UsersIcon />
                  <span>Total Users</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <Title headingLevel="h2" size="2xl">{mockMetrics.totalUsers.toLocaleString()}</Title>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--xs)' }}>
                    {getTrendIcon(true)}
                    <Text component="small">+12% from last month</Text>
                  </div>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12} md={6} lg={3}>
            <Card isFullHeight>
              <CardTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--sm)' }}>
                  <ChartLineIcon />
                  <span>Active Users</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <Title headingLevel="h2" size="2xl">{mockMetrics.activeUsers.toLocaleString()}</Title>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--xs)' }}>
                    {getTrendIcon(true)}
                    <Text component="small">+8% from last month</Text>
                  </div>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12} md={6} lg={3}>
            <Card isFullHeight>
              <CardTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--sm)' }}>
                  <DollarSignIcon />
                  <span>Revenue</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <Title headingLevel="h2" size="2xl">${mockMetrics.revenue.toLocaleString()}</Title>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--xs)' }}>
                    {getTrendIcon(false)}
                    <Text component="small">-3% from last month</Text>
                  </div>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12} md={6} lg={3}>
            <Card isFullHeight>
              <CardTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--sm)' }}>
                  <PercentageIcon />
                  <span>Conversion Rate</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <Title headingLevel="h2" size="2xl">{mockMetrics.conversion}%</Title>
                  <Progress value={mockMetrics.conversion * 10} min={0} max={100} measureLocation="outside" />
                  <Text component="small">Target: 5.0%</Text>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Users Table */}
        <Card>
          <CardTitle>User Management</CardTitle>
          <CardBody>
            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>Last Login</Th>
                  <Th>Role</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockTableData.map((user) => (
                  <Tr key={user.id}>
                    <Td dataLabel="Name">{user.name}</Td>
                    <Td dataLabel="Email">{user.email}</Td>
                    <Td dataLabel="Status">{getStatusLabel(user.status)}</Td>
                    <Td dataLabel="Last Login">{user.lastLogin}</Td>
                    <Td dataLabel="Role">{user.role}</Td>
                    <Td dataLabel="Actions">
                      <ActionGroup>
                        <Button variant="link" size="sm">
                          Edit
                        </Button>
                        <Button variant="link" size="sm" isDanger>
                          Delete
                        </Button>
                      </ActionGroup>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        {/* Content Section */}
        <Grid hasGutter>
          <GridItem span={12} lg={8}>
            <Card isFullHeight>
              <CardTitle>Recent Activity</CardTitle>
              <CardBody>
                <List>
                  {mockRecentActivity.map((activity) => (
                    <ListItem key={activity.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>
                          <Text component="p">
                            <strong>{activity.user}</strong> {activity.action}
                          </Text>
                          <Text component="small" style={{ color: 'var(--pf-global--Color--200)' }}>
                            {activity.time}
                          </Text>
                        </div>
                        {getStatusLabel(activity.status)}
                      </div>
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12} lg={4}>
            <Stack hasGutter>
              <Card isFullHeight>
                <CardTitle>System Information</CardTitle>
                <CardBody>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Version</DescriptionListTerm>
                      <DescriptionListDescription>PatternFly 5.4.14</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Environment</DescriptionListTerm>
                      <DescriptionListDescription>Development</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Uptime</DescriptionListTerm>
                      <DescriptionListDescription>15 days, 3 hours</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Last Backup</DescriptionListTerm>
                      <DescriptionListDescription>2 hours ago</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              </Card>

              <Card>
                <CardTitle>Quick Actions</CardTitle>
                <CardBody>
                  <Stack hasGutter>
                    <ActionGroup>
                      <Button variant="primary">
                        Generate Report
                      </Button>
                      <Button variant="secondary">
                        Export Data
                      </Button>
                    </ActionGroup>
                    <ActionGroup>
                      <Button
                        variant="link"
                        component="a"
                        href="https://patternfly.org/v5"
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="right"
                      >
                        PatternFly v5 Documentation
                      </Button>
                      <Button variant="link" isDanger>
                        Reset Dashboard
                      </Button>
                    </ActionGroup>
                  </Stack>
                </CardBody>
              </Card>
            </Stack>
          </GridItem>
        </Grid>

        {/* Status Cards */}
        <Grid hasGutter>
          <GridItem span={12} md={4}>
            <Card>
              <CardTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--sm)' }}>
                  <ServerIcon />
                  <span>Server Status</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>API Server</Text>
                    <Label color="green">Online</Label>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Database</Text>
                    <Label color="green">Online</Label>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Cache Server</Text>
                    <Label color="orange">Warning</Label>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>File Storage</Text>
                    <Label color="green">Online</Label>
                  </div>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12} md={4}>
            <Card>
              <CardTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--sm)' }}>
                  <DatabaseIcon />
                  <span>Performance Metrics</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <div>
                    <Text component="p">CPU Usage</Text>
                    <Progress value={45} measureLocation="outside" />
                  </div>
                  <div>
                    <Text component="p">Memory Usage</Text>
                    <Progress value={67} measureLocation="outside" />
                  </div>
                  <div>
                    <Text component="p">Disk Usage</Text>
                    <Progress value={32} measureLocation="outside" />
                  </div>
                  <div>
                    <Text component="p">Network I/O</Text>
                    <Progress value={23} measureLocation="outside" />
                  </div>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12} md={4}>
            <Card>
              <CardTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--sm)' }}>
                  <ExclamationTriangleIcon />
                  <span>Alerts & Notifications</span>
                </div>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--sm)' }}>
                    <Label color="red">Critical</Label>
                    <Text component="small">High memory usage detected</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--sm)' }}>
                    <Label color="orange">Warning</Label>
                    <Text component="small">SSL certificate expires in 30 days</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--sm)' }}>
                    <Label color="blue">Info</Label>
                    <Text component="small">System maintenance scheduled</Text>
                  </div>
                  <Button variant="link" size="sm">
                    View all alerts
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <Divider />

        {/* PatternFly Features Showcase */}
        <Card>
          <CardTitle>PatternFly v5 Features Demonstrated</CardTitle>
          <CardBody>
            <Grid hasGutter>
              <GridItem span={12} md={6}>
                <Stack hasGutter>
                  <Title headingLevel="h3" size="md">Layout Components</Title>
                  <List>
                    <ListItem>
                      <Text>
                        <strong>Grid System:</strong> Responsive 12-column grid with gutters
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>Stack:</strong> Vertical layout with consistent spacing
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>Cards:</strong> Flexible content containers with titles and bodies
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>PageSection:</strong> Proper page structure with semantic layout
                      </Text>
                    </ListItem>
                  </List>
                </Stack>
              </GridItem>
              <GridItem span={12} md={6}>
                <Stack hasGutter>
                  <Title headingLevel="h3" size="md">Data & Interactive Components</Title>
                  <List>
                    <ListItem>
                      <Text>
                        <strong>Tables:</strong> Responsive tables with proper column headers and actions
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>Buttons:</strong> Primary, secondary, and link variants with icons
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>Labels:</strong> Color-coded status indicators with semantic meaning
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>Progress:</strong> Visual progress indicators with measurements
                      </Text>
                    </ListItem>
                    <ListItem>
                      <Text>
                        <strong>Text & Typography:</strong> Semantic text components with proper hierarchy
                      </Text>
                    </ListItem>
                  </List>
                </Stack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* Empty State Example (conditionally shown) */}
        {mockRecentActivity.length === 0 && (
          <Card>
            <CardBody>
              <EmptyState>
                <EmptyStateIcon icon={SearchIcon} />
                <Title headingLevel="h4" size="lg">
                  No recent activity
                </Title>
                <EmptyStateBody>
                  No recent activity to display. Try adjusting your time range or check back later.
                </EmptyStateBody>
                <Button variant="primary">Refresh Data</Button>
              </EmptyState>
            </CardBody>
          </Card>
        )}
      </Stack>
    </PageSection>
  );
};

export { Dashboard };
