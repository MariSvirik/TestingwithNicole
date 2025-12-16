import * as React from 'react';
import {
    Alert,
    AlertActionCloseButton,
    Button,
    Card,
    CardBody,
    Checkbox,
    Dropdown,
    DropdownItem,
    DropdownList,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    MenuToggle,
    PageSection,
    Select,
    SelectList,
    SelectOption,
    Spinner,
    Split,
    SplitItem,
    Stack,
    Tab,
    TabContent,
    TabContentBody,
    TabTitleText,
    Tabs,
    Text,
    TextInput,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem,
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
    ArrowUpIcon,
    CaretDownIcon,
    CheckCircleIcon,
    CheckIcon,
    EllipsisVIcon,
    SearchIcon,
} from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

// Mock data for packages
const mockPackages = [
    {
        id: 1,
        name: 'httpd',
        persistence: 'Persistent',
        status: 'Upgradable',
        installedVersion: '2.4.53-1.el9',
        upgradableTo: '2.4.55-2.el9'
    },
    {
        id: 2,
        name: 'nginx',
        persistence: 'Transient',
        status: 'Up-to-date',
        installedVersion: '1.20.1-13.el9',
        upgradableTo: '-'
    },
    {
        id: 3,
        name: 'kernel',
        persistence: 'Persistent',
        status: 'Upgradable',
        installedVersion: '5.14.0-162.6.1.el9',
        upgradableTo: '5.14.0-284.25.1.el9'
    },
    {
        id: 4,
        name: 'systemd',
        persistence: 'Persistent',
        status: 'Up-to-date',
        installedVersion: '250-12.el9',
        upgradableTo: '-'
    },
    {
        id: 5,
        name: 'openssh',
        persistence: 'Transient',
        status: 'Upgradable',
        installedVersion: '8.7p1-24.el9',
        upgradableTo: '8.7p1-29.el9'
    }
];

const PowerPuffGirl: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const [primaryActiveTabKey, setPrimaryActiveTabKey] = React.useState<string>('content');
    const [secondaryActiveTabKey, setSecondaryActiveTabKey] = React.useState<string>('packages');
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = React.useState(false);
    const [statusFilter, setStatusFilter] = React.useState('All status');
    const [searchValue, setSearchValue] = React.useState('');
    const [selectedPackages, setSelectedPackages] = React.useState<Set<number>>(new Set());
    const [isBulkSelectDropdownOpen, setIsBulkSelectDropdownOpen] = React.useState(false);
    const [isActionsKebabOpen, setIsActionsKebabOpen] = React.useState(false);
    const [openRowKebabs, setOpenRowKebabs] = React.useState<Set<number>>(new Set());
    const [isLoading] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState(true);

    const handlePrimaryTabClick = (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
        setPrimaryActiveTabKey(tabIndex as string);
    };

    const handleSecondaryTabClick = (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
        setSecondaryActiveTabKey(tabIndex as string);
    };

    const onStatusDropdownToggle = () => {
        setIsStatusDropdownOpen(!isStatusDropdownOpen);
    };

    const onStatusSelect = (event: React.MouseEvent | undefined, value: string | number | undefined) => {
        setStatusFilter(value as string);
        setIsStatusDropdownOpen(false);
    };

    const onSearchInputChange = (event: React.FormEvent<HTMLInputElement>, value: string) => {
        setSearchValue(value);
    };

    const handleSelectAll = (isSelected: boolean) => {
        if (isSelected) {
            setSelectedPackages(new Set(filteredPackages.map(pkg => pkg.id)));
        } else {
            setSelectedPackages(new Set());
        }
    };

    const handleRowSelect = (pkgId: number, isSelected: boolean) => {
        const newSelected = new Set(selectedPackages);
        if (isSelected) {
            newSelected.add(pkgId);
        } else {
            newSelected.delete(pkgId);
        }
        setSelectedPackages(newSelected);
    };

    const getStatusIcon = (status: string) => {
        if (status === 'Upgradable') {
            return <ArrowUpIcon style={{ color: 'var(--pf-global--primary-color--100)' }} />;
        } else {
            return <CheckIcon style={{ color: 'var(--pf-global--success-color--100)' }} />;
        }
    };

    const getPersistenceText = (persistence: string) => {
        return persistence;
    };

    const toggleRowKebab = (pkgId: number) => {
        const newOpenKebabs = new Set(openRowKebabs);
        if (newOpenKebabs.has(pkgId)) {
            newOpenKebabs.delete(pkgId);
        } else {
            newOpenKebabs.add(pkgId);
        }
        setOpenRowKebabs(newOpenKebabs);
    };

    const filteredPackages = mockPackages.filter(pkg => {
        const matchesSearch = pkg.name.toLowerCase().includes(searchValue.toLowerCase());
        const matchesStatus = statusFilter === 'All status' || pkg.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAddToContainerfile = (packageIds?: Set<number>) => {
        const idsToUse = packageIds || selectedPackages;
        // Filter to only transient packages
        const transientIds = Array.from(idsToUse).filter(id => {
            const pkg = mockPackages.find(p => p.id === id);
            return pkg?.persistence === 'Transient';
        });

        if (transientIds.length > 0) {
            navigate('/powerpuffgirl/add-to-containerfile', {
                state: { selectedPackages: new Set(transientIds) }
            });
        }
    };

    const isAllSelected = selectedPackages.size === filteredPackages.length && filteredPackages.length > 0;
    const isPartiallySelected = selectedPackages.size > 0 && selectedPackages.size < filteredPackages.length;

    // Check if any selected packages are upgradable
    const hasUpgradableSelected = Array.from(selectedPackages).some(id => {
        const pkg = mockPackages.find(p => p.id === id);
        return pkg?.status === 'Upgradable';
    });

    const packagesContent = (
        <div>
            {showAlert && (
                <Alert
                    variant="info"
                    title="Package changes not persistent"
                    isInline
                    actionClose={<AlertActionCloseButton onClose={() => setShowAlert(false)} />}
                    style={{ marginTop: '24px', marginBottom: '16px' }}
                >
                    To permanently install packages on this host, they must be added to the Containerfile. Otherwise, any changes will be lost on the next reboot.
                </Alert>
            )}
            <div style={{ marginTop: showAlert ? '0' : '24px' }}>
                <Toolbar id="packages-toolbar">
                    <ToolbarContent>
                        <ToolbarItem>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid var(--pf-global--BorderColor--100)',
                                borderRadius: 'var(--pf-global--BorderRadius--sm)',
                                padding: '4px 8px',
                                backgroundColor: 'var(--pf-global--BackgroundColor--100)'
                            }}>
                                <Checkbox
                                    isChecked={isAllSelected ? true : isPartiallySelected ? null : false}
                                    onChange={(event, checked) => handleSelectAll(checked)}
                                    aria-label="Select all packages"
                                    id="select-all-packages"
                                    name="select-all-packages"
                                />
                                {selectedPackages.size > 0 && (
                                    <span style={{ marginLeft: '8px', fontSize: 'var(--pf-global--FontSize--sm)', color: 'var(--pf-global--Color--200)' }}>
                                        {selectedPackages.size} selected
                                    </span>
                                )}
                                <Dropdown
                                    isOpen={isBulkSelectDropdownOpen}
                                    onOpenChange={setIsBulkSelectDropdownOpen}
                                    toggle={(toggleRef) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            onClick={() => setIsBulkSelectDropdownOpen(!isBulkSelectDropdownOpen)}
                                            isExpanded={isBulkSelectDropdownOpen}
                                            variant="plain"
                                            aria-label="Bulk selection options"
                                            style={{ marginLeft: '4px' }}
                                        >
                                            <CaretDownIcon />
                                        </MenuToggle>
                                    )}
                                    popperProps={{ appendTo: () => document.body }}
                                >
                                    <DropdownList>
                                        <DropdownItem key="select-all" onClick={() => {
                                            handleSelectAll(true);
                                            setIsBulkSelectDropdownOpen(false);
                                        }}>
                                            Select all
                                        </DropdownItem>
                                        <DropdownItem key="select-none" onClick={() => {
                                            handleSelectAll(false);
                                            setIsBulkSelectDropdownOpen(false);
                                        }}>
                                            Select none
                                        </DropdownItem>
                                        <DropdownItem
                                            key="select-upgradable"
                                            onClick={() => {
                                                const upgradableIds = mockPackages
                                                    .filter(pkg => pkg.status === 'Upgradable')
                                                    .map(pkg => pkg.id);
                                                setSelectedPackages(new Set(upgradableIds));
                                                setIsBulkSelectDropdownOpen(false);
                                            }}
                                        >
                                            Select upgradable
                                        </DropdownItem>
                                        <DropdownItem
                                            key="select-transient"
                                            onClick={() => {
                                                const transientIds = mockPackages
                                                    .filter(pkg => pkg.persistence === 'Transient')
                                                    .map(pkg => pkg.id);
                                                setSelectedPackages(new Set(transientIds));
                                                setIsBulkSelectDropdownOpen(false);
                                            }}
                                        >
                                            Select transient
                                        </DropdownItem>
                                    </DropdownList>
                                </Dropdown>
                            </div>
                        </ToolbarItem>
                        <ToolbarGroup>
                            <ToolbarItem>
                                <TextInput
                                    name="search-packages"
                                    id="search-packages"
                                    type="search"
                                    aria-label="Search packages"
                                    placeholder="Search packages..."
                                    value={searchValue}
                                    onChange={onSearchInputChange}
                                />
                            </ToolbarItem>
                            <ToolbarItem>
                                <Select
                                    isOpen={isStatusDropdownOpen}
                                    selected={statusFilter}
                                    onSelect={onStatusSelect}
                                    onOpenChange={setIsStatusDropdownOpen}
                                    toggle={(toggleRef) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            onClick={onStatusDropdownToggle}
                                            isExpanded={isStatusDropdownOpen}
                                        >
                                            {statusFilter}
                                        </MenuToggle>
                                    )}
                                >
                                    <SelectList>
                                        <SelectOption value="All status">All status</SelectOption>
                                        <SelectOption value="Upgradable">Upgradable</SelectOption>
                                        <SelectOption value="Up-to-date">Up-to-date</SelectOption>
                                    </SelectList>
                                </Select>
                            </ToolbarItem>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarItem>
                                <Button
                                    variant="primary"
                                    isDisabled={!hasUpgradableSelected}
                                    onClick={() => console.log('Upgrade selected packages')}
                                >
                                    Upgrade
                                </Button>
                            </ToolbarItem>
                            <ToolbarItem>
                                <Dropdown
                                    isOpen={isActionsKebabOpen}
                                    onOpenChange={setIsActionsKebabOpen}
                                    toggle={(toggleRef) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            variant="plain"
                                            onClick={() => setIsActionsKebabOpen(!isActionsKebabOpen)}
                                            isExpanded={isActionsKebabOpen}
                                            aria-label="Actions menu"
                                        >
                                            <EllipsisVIcon />
                                        </MenuToggle>
                                    )}
                                    popperProps={{ appendTo: () => document.body }}
                                >
                                    <DropdownList>
                                        <DropdownItem
                                            key="add-to-containerfile"
                                            isDisabled={!Array.from(selectedPackages).some(id => {
                                                const pkg = mockPackages.find(p => p.id === id);
                                                return pkg?.persistence === 'Transient';
                                            })}
                                            description="Transient packages only"
                                            onClick={() => handleAddToContainerfile()}
                                        >
                                            Add to Containerfile
                                        </DropdownItem>
                                        <DropdownItem key="refresh">Refresh packages</DropdownItem>
                                        <DropdownItem key="export">Export package list</DropdownItem>
                                        <DropdownItem key="settings">Package settings</DropdownItem>
                                    </DropdownList>
                                </Dropdown>
                            </ToolbarItem>
                        </ToolbarGroup>
                    </ToolbarContent>
                </Toolbar>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: 'var(--pf-global--spacer--xl)' }}>
                        <Spinner size="lg" />
                    </div>
                ) : filteredPackages.length === 0 ? (
                    <EmptyState>
                        <EmptyStateIcon icon={SearchIcon} />
                        <Title headingLevel="h4" size="lg">
                            No packages found
                        </Title>
                        <EmptyStateBody>
                            No packages match your search criteria. Try adjusting your filters or search terms.
                        </EmptyStateBody>
                    </EmptyState>
                ) : (
                    <Table variant="compact">
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Package name</Th>
                                <Th>Persistence</Th>
                                <Th>Status</Th>
                                <Th>Installed version</Th>
                                <Th>Upgradable to</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredPackages.map((pkg) => (
                                <Tr key={pkg.id}>
                                    <Td>
                                        <Checkbox
                                            isChecked={selectedPackages.has(pkg.id)}
                                            onChange={(event, checked) => handleRowSelect(pkg.id, checked)}
                                            aria-label={`Select package ${pkg.name}`}
                                            id={`select-pkg-${pkg.id}`}
                                            name={`select-pkg-${pkg.id}`}
                                        />
                                    </Td>
                                    <Td dataLabel="Package name">{pkg.name}</Td>
                                    <Td dataLabel="Persistence">{getPersistenceText(pkg.persistence)}</Td>
                                    <Td dataLabel="Status">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {getStatusIcon(pkg.status)}
                                            {pkg.status}
                                        </div>
                                    </Td>
                                    <Td dataLabel="Installed version">{pkg.installedVersion}</Td>
                                    <Td dataLabel="Upgradable to">{pkg.upgradableTo}</Td>
                                    <Td>
                                        <Dropdown
                                            isOpen={openRowKebabs.has(pkg.id)}
                                            onOpenChange={(isOpen) => {
                                                if (!isOpen) {
                                                    const newOpenKebabs = new Set(openRowKebabs);
                                                    newOpenKebabs.delete(pkg.id);
                                                    setOpenRowKebabs(newOpenKebabs);
                                                }
                                            }}
                                            toggle={(toggleRef) => (
                                                <MenuToggle
                                                    ref={toggleRef}
                                                    variant="plain"
                                                    onClick={() => toggleRowKebab(pkg.id)}
                                                    isExpanded={openRowKebabs.has(pkg.id)}
                                                    aria-label={`Actions for ${pkg.name}`}
                                                >
                                                    <EllipsisVIcon />
                                                </MenuToggle>
                                            )}
                                            popperProps={{ appendTo: () => document.body }}
                                        >
                                            <DropdownList>
                                                <DropdownItem
                                                    key="add-to-containerfile"
                                                    isDisabled={pkg.persistence !== 'Transient'}
                                                    description="Transient packages only"
                                                    onClick={() => handleAddToContainerfile(new Set([pkg.id]))}
                                                >
                                                    Add to Containerfile
                                                </DropdownItem>
                                                <DropdownItem key="remove" isDanger>
                                                    Remove
                                                </DropdownItem>
                                            </DropdownList>
                                        </Dropdown>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </div>
        </div>
    );

    const secondaryTabsContent = (
        <Tabs
            activeKey={secondaryActiveTabKey}
            onSelect={handleSecondaryTabClick}
            aria-label="Content secondary tabs"
            role="region"
            isSecondary
        >
            <Tab
                eventKey="packages"
                title={<TabTitleText>Packages</TabTitleText>}
                aria-label="Packages tab"
            >
                <TabContent eventKey="packages" id="packages-content">
                    <TabContentBody>
                        {packagesContent}
                    </TabContentBody>
                </TabContent>
            </Tab>
            <Tab
                eventKey="errata"
                title={<TabTitleText>Errata</TabTitleText>}
                aria-label="Errata tab"
            >
                <TabContent eventKey="errata" id="errata-content">
                    <TabContentBody>
                        <Card>
                            <CardBody>
                                <EmptyState>
                                    <EmptyStateIcon icon={SearchIcon} />
                                    <Title headingLevel="h4" size="lg">
                                        No errata available
                                    </Title>
                                    <EmptyStateBody>
                                        There are no security advisories or bug fixes available for this system.
                                    </EmptyStateBody>
                                </EmptyState>
                            </CardBody>
                        </Card>
                    </TabContentBody>
                </TabContent>
            </Tab>
            <Tab
                eventKey="modules"
                title={<TabTitleText>Module streams</TabTitleText>}
                aria-label="Module streams tab"
            >
                <TabContent eventKey="modules" id="modules-content">
                    <TabContentBody>
                        <Card>
                            <CardBody>
                                <EmptyState>
                                    <EmptyStateIcon icon={SearchIcon} />
                                    <Title headingLevel="h4" size="lg">
                                        No module streams
                                    </Title>
                                    <EmptyStateBody>
                                        No module streams are currently available for this system.
                                    </EmptyStateBody>
                                </EmptyState>
                            </CardBody>
                        </Card>
                    </TabContentBody>
                </TabContent>
            </Tab>
            <Tab
                eventKey="repositories"
                title={<TabTitleText>Repositories</TabTitleText>}
                aria-label="Repositories tab"
            >
                <TabContent eventKey="repositories" id="repositories-content">
                    <TabContentBody>
                        <Card>
                            <CardBody>
                                <EmptyState>
                                    <EmptyStateIcon icon={SearchIcon} />
                                    <Title headingLevel="h4" size="lg">
                                        No repositories configured
                                    </Title>
                                    <EmptyStateBody>
                                        No package repositories are configured for this system.
                                    </EmptyStateBody>
                                </EmptyState>
                            </CardBody>
                        </Card>
                    </TabContentBody>
                </TabContent>
            </Tab>
        </Tabs>
    );

    const contentTabContent = (
        <div>
            {secondaryTabsContent}
        </div>
    );

    return (
        <PageSection style={{ backgroundColor: 'white' }}>
            <Stack hasGutter>
                <div>
                    <Split hasGutter>
                        <SplitItem>
                            <Title headingLevel="h1" size="lg">PowerPuffGirl3.0-Everythingnice.com</Title>
                        </SplitItem>
                        <SplitItem>
                            <CheckCircleIcon style={{ color: 'var(--pf-global--success-color--100)' }} />
                        </SplitItem>
                    </Split>
                    <Text component="p" style={{ color: 'var(--pf-global--Color--200)' }}>
                        Created 3 months ago by Mr.MojoJ (updated 1 minute ago)
                    </Text>
                </div>

                <Tabs
                    activeKey={primaryActiveTabKey}
                    onSelect={handlePrimaryTabClick}
                    aria-label="Primary tabs"
                    role="region"
                >
                    <Tab
                        eventKey="overview"
                        title={<TabTitleText>Overview</TabTitleText>}
                        aria-label="Overview tab"
                    >
                        <TabContent eventKey="overview" id="overview-content">
                            <TabContentBody>
                                <Card>
                                    <CardBody>
                                        <Title headingLevel="h3" size="md">System Overview</Title>
                                        <Text>System overview information would be displayed here.</Text>
                                    </CardBody>
                                </Card>
                            </TabContentBody>
                        </TabContent>
                    </Tab>
                    <Tab
                        eventKey="details"
                        title={<TabTitleText>Details</TabTitleText>}
                        aria-label="Details tab"
                    >
                        <TabContent eventKey="details" id="details-content">
                            <TabContentBody>
                                <Card>
                                    <CardBody>
                                        <Title headingLevel="h3" size="md">System Details</Title>
                                        <Text>Detailed system information would be displayed here.</Text>
                                    </CardBody>
                                </Card>
                            </TabContentBody>
                        </TabContent>
                    </Tab>
                    <Tab
                        eventKey="content"
                        title={<TabTitleText>Content</TabTitleText>}
                        aria-label="Content tab"
                    >
                        <TabContent eventKey="content" id="content-content">
                            <TabContentBody>
                                {contentTabContent}
                            </TabContentBody>
                        </TabContent>
                    </Tab>
                    <Tab
                        eventKey="parameters"
                        title={<TabTitleText>Parameters</TabTitleText>}
                        aria-label="Parameters tab"
                    >
                        <TabContent eventKey="parameters" id="parameters-content">
                            <TabContentBody>
                                <Card>
                                    <CardBody>
                                        <Title headingLevel="h3" size="md">System Parameters</Title>
                                        <Text>System parameters and configuration would be displayed here.</Text>
                                    </CardBody>
                                </Card>
                            </TabContentBody>
                        </TabContent>
                    </Tab>
                    <Tab
                        eventKey="traces"
                        title={<TabTitleText>Traces</TabTitleText>}
                        aria-label="Traces tab"
                    >
                        <TabContent eventKey="traces" id="traces-content">
                            <TabContentBody>
                                <Card>
                                    <CardBody>
                                        <Title headingLevel="h3" size="md">System Traces</Title>
                                        <Text>System trace information would be displayed here.</Text>
                                    </CardBody>
                                </Card>
                            </TabContentBody>
                        </TabContent>
                    </Tab>
                    <Tab
                        eventKey="lightspeed"
                        title={<TabTitleText>Red Hat Lightspeed</TabTitleText>}
                        aria-label="Red Hat Lightspeed tab"
                    >
                        <TabContent eventKey="lightspeed" id="lightspeed-content">
                            <TabContentBody>
                                <Card>
                                    <CardBody>
                                        <Title headingLevel="h3" size="md">Red Hat Lightspeed</Title>
                                        <Text>Red Hat Lightspeed integration and features would be displayed here.</Text>
                                    </CardBody>
                                </Card>
                            </TabContentBody>
                        </TabContent>
                    </Tab>
                </Tabs>
            </Stack>
        </PageSection>
    );
};

export { PowerPuffGirl }; 