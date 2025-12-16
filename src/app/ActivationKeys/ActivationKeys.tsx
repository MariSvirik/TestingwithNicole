import * as React from 'react';
import {
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    CardBody,
    CardTitle,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Flex,
    FlexItem,
    Grid,
    GridItem,
    Label,
    PageSection,
    Pagination,
    Stack,
    Tab,
    TabContent,
    TabContentBody,
    TabTitleText,
    Tabs,
    Text,
    TextContent,
    Title,
} from '@patternfly/react-core';
import {
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@patternfly/react-table';
import {
    AngleDownIcon,
    AngleRightIcon,
    EllipsisVIcon
} from '@patternfly/react-icons';

// Mock data for the activation key
const activationKeyData = {
    name: 'ActivKeyRHEL8',
    usage: '59/Unlimited',
    systemPurpose: {
        role: 'Red Hat Enterprise Linux Server',
        sla: 'Premium',
        usageType: 'Production',
        releaseVersion: 'RHEL 6.9'
    },
    contentView: {
        name: 'BrightFuture22',
        versionInUse: 'Version 7'
    },
    hosts: {
        hostCollections: 3,
        hostGroups: 2,
        associatedHosts: 15
    },
    repositorySets: 4
};

// Mock table data for hosts
const mockHostsData = [
    { id: 1, hostGroup: '8.6 test', numberOfHosts: 6 },
    { id: 2, hostGroup: 'smith/8.7 test', numberOfHosts: 5 },
    { id: 3, hostGroup: '8.8 test', numberOfHosts: 7 }
];

// Mock data for repository sets
const mockRepositoryData = [
    { id: 1, name: 'Red Hat Enterprise Linux 8 for x86_64 - BaseOS (RPMs)', type: 'yum', url: 'https://cdn.redhat.com/content/dist/rhel8/8/x86_64/baseos/os' },
    { id: 2, name: 'Red Hat Enterprise Linux 8 for x86_64 - AppStream (RPMs)', type: 'yum', url: 'https://cdn.redhat.com/content/dist/rhel8/8/x86_64/appstream/os' },
    { id: 3, name: 'Red Hat Enterprise Linux 8 for x86_64 - Supplementary (RPMs)', type: 'yum', url: 'https://cdn.redhat.com/content/dist/rhel8/8/x86_64/supplementary/os' },
    { id: 4, name: 'Red Hat Satellite Tools 6.11 for RHEL 8 x86_64 (RPMs)', type: 'yum', url: 'https://cdn.redhat.com/content/dist/rhel8/8/x86_64/sat-tools/6.11/os' }
];

const ActivationKeys: React.FunctionComponent = () => {
    const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
    const [systemPurposeExpanded, setSystemPurposeExpanded] = React.useState(true);
    const [contentViewExpanded, setContentViewExpanded] = React.useState(true);
    const [hostsExpanded, setHostsExpanded] = React.useState(true);
    const [repositorySetsExpanded, setRepositorySetsExpanded] = React.useState(false);

    const handleTabClick = (
        event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
        tabIndex: string | number
    ) => {
        setActiveTabKey(tabIndex);
    };

    return (
        <>
            <PageSection variant="light">
                <Stack hasGutter>
                    {/* Breadcrumbs */}
                    <Breadcrumb>
                        <BreadcrumbItem to="/activation-keys">Activation keys</BreadcrumbItem>
                        <BreadcrumbItem isActive>{activationKeyData.name}</BreadcrumbItem>
                    </Breadcrumb>

                    {/* Page Header */}
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                    <Title headingLevel="h1" size="2xl">{activationKeyData.name}</Title>
                                </FlexItem>
                                <FlexItem>
                                    <Label color="blue">{activationKeyData.usage}</Label>
                                </FlexItem>
                            </Flex>
                        </FlexItem>
                        <FlexItem>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                    <Button variant="secondary">
                                        Edit
                                    </Button>
                                </FlexItem>
                                <FlexItem>
                                    <Button variant="plain" aria-label="Actions">
                                        <EllipsisVIcon />
                                    </Button>
                                </FlexItem>
                            </Flex>
                        </FlexItem>
                    </Flex>
                </Stack>
            </PageSection>

            <PageSection>
                <Stack hasGutter>

                    {/* System Purpose and Content View - Side by Side */}
                    <Grid hasGutter>
                        <GridItem span={6}>
                            <Card>
                                <CardTitle>
                                    <Button
                                        variant="plain"
                                        onClick={() => setSystemPurposeExpanded(!systemPurposeExpanded)}
                                        style={{ padding: 0, fontSize: 'var(--pf-global--FontSize--md)', fontWeight: 'var(--pf-global--FontWeight--normal)' }}
                                    >
                                        {systemPurposeExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
                                        {' '}System purpose
                                    </Button>
                                    <Button variant="link" style={{ float: 'right' }}>Edit</Button>
                                </CardTitle>
                                {systemPurposeExpanded && (
                                    <CardBody>
                                        <DescriptionList>
                                            <DescriptionListGroup>
                                                <DescriptionListTerm>Role:</DescriptionListTerm>
                                                <DescriptionListDescription>{activationKeyData.systemPurpose.role}</DescriptionListDescription>
                                            </DescriptionListGroup>
                                            <DescriptionListGroup>
                                                <DescriptionListTerm>SLA:</DescriptionListTerm>
                                                <DescriptionListDescription>
                                                    <Label color="blue">{activationKeyData.systemPurpose.sla}</Label>
                                                </DescriptionListDescription>
                                            </DescriptionListGroup>
                                            <DescriptionListGroup>
                                                <DescriptionListTerm>Usage type:</DescriptionListTerm>
                                                <DescriptionListDescription>
                                                    <Label color="blue">{activationKeyData.systemPurpose.usageType}</Label>
                                                </DescriptionListDescription>
                                            </DescriptionListGroup>
                                            <DescriptionListGroup>
                                                <DescriptionListTerm>Release version:</DescriptionListTerm>
                                                <DescriptionListDescription>{activationKeyData.systemPurpose.releaseVersion}</DescriptionListDescription>
                                            </DescriptionListGroup>
                                        </DescriptionList>
                                    </CardBody>
                                )}
                            </Card>
                        </GridItem>

                        <GridItem span={6}>
                            <Card>
                                <CardTitle>
                                    <Button
                                        variant="plain"
                                        onClick={() => setContentViewExpanded(!contentViewExpanded)}
                                        style={{ padding: 0, fontSize: 'var(--pf-global--FontSize--md)', fontWeight: 'var(--pf-global--FontWeight--normal)' }}
                                    >
                                        {contentViewExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
                                        {' '}Content view
                                    </Button>
                                    <Button variant="link" style={{ float: 'right' }}>Edit</Button>
                                </CardTitle>
                                {contentViewExpanded && (
                                    <CardBody>
                                        <DescriptionList>
                                            <DescriptionListGroup>
                                                <DescriptionListTerm>Content view:</DescriptionListTerm>
                                                <DescriptionListDescription>
                                                    <Button variant="link" isInline>
                                                        {activationKeyData.contentView.name}
                                                    </Button>
                                                    {' '}
                                                    <Label color="blue">Library</Label>
                                                </DescriptionListDescription>
                                            </DescriptionListGroup>
                                            <DescriptionListGroup>
                                                <DescriptionListTerm>Version in use:</DescriptionListTerm>
                                                <DescriptionListDescription>
                                                    <Button variant="link" isInline>
                                                        {activationKeyData.contentView.versionInUse}
                                                    </Button>
                                                </DescriptionListDescription>
                                            </DescriptionListGroup>
                                        </DescriptionList>
                                    </CardBody>
                                )}
                            </Card>
                        </GridItem>
                    </Grid>

                    {/* Hosts Section */}
                    <Card>
                        <CardTitle>
                            <Button
                                variant="plain"
                                onClick={() => setHostsExpanded(!hostsExpanded)}
                                style={{ padding: 0, fontSize: 'var(--pf-global--FontSize--md)', fontWeight: 'var(--pf-global--FontWeight--normal)' }}
                            >
                                {hostsExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
                                {' '}Hosts
                            </Button>
                        </CardTitle>
                        {hostsExpanded && (
                            <CardBody>
                                <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
                                    <Tab eventKey={0} title={<TabTitleText>Host collections <Badge isRead>{activationKeyData.hosts.hostCollections}</Badge></TabTitleText>}>
                                        <TabContent eventKey={0} id="host-collections-content">
                                            <TabContentBody>
                                                <Text>No host collections configured.</Text>
                                            </TabContentBody>
                                        </TabContent>
                                    </Tab>
                                    <Tab eventKey={1} title={<TabTitleText>Host groups <Badge isRead>{activationKeyData.hosts.hostGroups}</Badge></TabTitleText>}>
                                        <TabContent eventKey={1} id="host-groups-content">
                                            <TabContentBody>
                                                <Flex justifyContent={{ default: 'justifyContentFlexEnd' }} style={{ marginBottom: 'var(--pf-global--spacer--md)' }}>
                                                    <FlexItem>
                                                        <Pagination
                                                            itemCount={10}
                                                            perPage={10}
                                                            page={1}
                                                            variant="top"
                                                            isCompact
                                                        />
                                                    </FlexItem>
                                                </Flex>
                                                <Table variant="compact">
                                                    <Thead>
                                                        <Tr>
                                                            <Th>Host groups</Th>
                                                            <Th>Number of hosts</Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        {mockHostsData.map((host) => (
                                                            <Tr key={host.id}>
                                                                <Td dataLabel="Host groups">
                                                                    <Button variant="link" isInline>
                                                                        {host.hostGroup}
                                                                    </Button>
                                                                </Td>
                                                                <Td dataLabel="Number of hosts">{host.numberOfHosts}</Td>
                                                            </Tr>
                                                        ))}
                                                    </Tbody>
                                                </Table>
                                                <Text component="small" style={{ marginTop: 'var(--pf-global--spacer--md)' }}>1 - 10 of 10</Text>
                                            </TabContentBody>
                                        </TabContent>
                                    </Tab>
                                    <Tab eventKey={2} title={<TabTitleText>Associated hosts <Badge isRead>{activationKeyData.hosts.associatedHosts}</Badge></TabTitleText>}>
                                        <TabContent eventKey={2} id="associated-hosts-content">
                                            <TabContentBody>
                                                <Text>15 hosts are associated with this activation key.</Text>
                                            </TabContentBody>
                                        </TabContent>
                                    </Tab>
                                </Tabs>
                            </CardBody>
                        )}
                    </Card>

                    {/* Repository Sets Section */}
                    <Card>
                        <CardTitle>
                            <Button
                                variant="plain"
                                onClick={() => setRepositorySetsExpanded(!repositorySetsExpanded)}
                                style={{ padding: 0, fontSize: 'var(--pf-global--FontSize--md)', fontWeight: 'var(--pf-global--FontWeight--normal)' }}
                            >
                                {repositorySetsExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
                                {' '}Repository sets <Badge isRead>{activationKeyData.repositorySets}</Badge>
                            </Button>
                        </CardTitle>
                        {repositorySetsExpanded && (
                            <CardBody>
                                <Flex justifyContent={{ default: 'justifyContentFlexEnd' }} style={{ marginBottom: 'var(--pf-global--spacer--md)' }}>
                                    <FlexItem>
                                        <Pagination
                                            itemCount={4}
                                            perPage={4}
                                            page={1}
                                            variant="top"
                                            isCompact
                                        />
                                    </FlexItem>
                                </Flex>
                                <Table variant="compact">
                                    <Thead>
                                        <Tr>
                                            <Th>Repository Name</Th>
                                            <Th>Type</Th>
                                            <Th>URL</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {mockRepositoryData.map((repo) => (
                                            <Tr key={repo.id}>
                                                <Td dataLabel="Repository Name">
                                                    <Button variant="link" isInline>
                                                        {repo.name}
                                                    </Button>
                                                </Td>
                                                <Td dataLabel="Type">{repo.type}</Td>
                                                <Td dataLabel="URL">
                                                    <TextContent>
                                                        <Text component="small">{repo.url}</Text>
                                                    </TextContent>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                                <Text component="small" style={{ marginTop: 'var(--pf-global--spacer--md)' }}>1 - 4 of 4</Text>
                            </CardBody>
                        )}
                    </Card>
                </Stack>
            </PageSection>
        </>
    );
};

export { ActivationKeys };