import * as React from 'react';
import {
    PageSection,
    Title,
    Text,
    Card,
    CardBody,
    Tabs,
    Tab,
    TabTitleText,
    TabContent,
    TabContentBody,
    Toolbar,
    ToolbarContent,
    ToolbarItem,
    ToolbarGroup,
    InputGroup,
    TextInput,
    Button,
    MenuToggle,
    Select,
    SelectOption,
    SelectList,
    Checkbox,
    ToggleGroup,
    ToggleGroupItem,
    Label,
    Spinner,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody,
    Dropdown,
    DropdownList,
    DropdownItem
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
    FilterIcon,
    EllipsisVIcon
} from '@patternfly/react-icons';

// Mock data for demonstration
const mockRepositories = [
    {
        id: 1,
        name: 'rhel9-base',
        architecture: 'x86_64',
        osVersion: 'RHEL 9',
        packages: 2847,
        lastIntrospection: '2 hours ago',
        status: 'Valid'
    },
    {
        id: 2,
        name: 'rhel8-minimal',
        architecture: 'Any',
        osVersion: 'RHEL 8',
        packages: 1523,
        lastIntrospection: '1 day ago',
        status: 'Valid'
    },
    {
        id: 3,
        name: 'custom-repo-dev',
        architecture: 'x86_64',
        osVersion: 'Any',
        packages: 834,
        lastIntrospection: '3 days ago',
        status: 'Invalid'
    },
    {
        id: 4,
        name: 'app-dependencies',
        architecture: 'Any',
        osVersion: 'RHEL 9',
        packages: 456,
        lastIntrospection: '12 hours ago',
        status: 'Valid'
    },
    {
        id: 5,
        name: 'security-updates',
        architecture: 'x86_64',
        osVersion: 'RHEL 8',
        packages: 178,
        lastIntrospection: '6 hours ago',
        status: 'Valid'
    }
];

const Repositories: React.FunctionComponent = () => {
    const [activeTabKey, setActiveTabKey] = React.useState<string>('popular');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);
    const [filterValue, setFilterValue] = React.useState('Name/URL');
    const [searchValue, setSearchValue] = React.useState('');
    const [selectedFilter, setSelectedFilter] = React.useState('Custom');
    const [selectedRepositories, setSelectedRepositories] = React.useState<Set<number>>(new Set());
    const [isActionsKebabOpen, setIsActionsKebabOpen] = React.useState(false);
    const [openRowKebabs, setOpenRowKebabs] = React.useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = React.useState(false);

    const handleTabClick = (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
        setActiveTabKey(tabIndex as string);
    };

    const onFilterDropdownToggle = () => {
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
    };

    const onFilterSelect = (event: React.MouseEvent | undefined, value: string | number | undefined) => {
        setFilterValue(value as string);
        setIsFilterDropdownOpen(false);
    };

    const onSearchInputChange = (event: React.FormEvent<HTMLInputElement>, value: string) => {
        setSearchValue(value);
    };

    const handleToggleGroupChange = (event: any, isSelected: boolean) => {
        const target = event.currentTarget as HTMLElement;
        const id = target.id;
        setSelectedFilter(id);
    };

    const handleSelectAll = (isSelected: boolean) => {
        if (isSelected) {
            setSelectedRepositories(new Set(mockRepositories.map(repo => repo.id)));
        } else {
            setSelectedRepositories(new Set());
        }
    };

    const handleRowSelect = (repoId: number, isSelected: boolean) => {
        const newSelected = new Set(selectedRepositories);
        if (isSelected) {
            newSelected.add(repoId);
        } else {
            newSelected.delete(repoId);
        }
        setSelectedRepositories(newSelected);
    };

    const getStatusLabel = (status: string) => {
        const color = status === 'Valid' ? 'green' : 'red';
        return <Label color={color}>{status}</Label>;
    };

    const isAllSelected = selectedRepositories.size === mockRepositories.length && mockRepositories.length > 0;
    const isPartiallySelected = selectedRepositories.size > 0 && selectedRepositories.size < mockRepositories.length;

    const toggleRowKebab = (repoId: number) => {
        const newOpenKebabs = new Set(openRowKebabs);
        if (newOpenKebabs.has(repoId)) {
            newOpenKebabs.delete(repoId);
        } else {
            newOpenKebabs.add(repoId);
        }
        setOpenRowKebabs(newOpenKebabs);
    };

    const filteredRepositories = mockRepositories.filter(repo =>
        repo.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const popularRepositoriesContent = (
        <Card>
            <CardBody>
                <Toolbar id="repositories-toolbar">
                    <ToolbarContent>
                        <ToolbarItem>
                            <Checkbox
                                label="Select all"
                                isChecked={isAllSelected ? true : isPartiallySelected ? null : false}
                                onChange={(event, checked) => handleSelectAll(checked)}
                                aria-label="Select all repositories"
                                id="select-all"
                                name="select-all"
                            />
                        </ToolbarItem>
                        <ToolbarGroup>
                            <ToolbarItem>
                                <Select
                                    isOpen={isFilterDropdownOpen}
                                    selected={filterValue}
                                    onSelect={onFilterSelect}
                                    onOpenChange={setIsFilterDropdownOpen}
                                    toggle={(toggleRef) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            onClick={onFilterDropdownToggle}
                                            isExpanded={isFilterDropdownOpen}
                                            icon={<FilterIcon />}
                                        >
                                            {filterValue}
                                        </MenuToggle>
                                    )}
                                >
                                    <SelectList>
                                        <SelectOption value="Name/URL">Name/URL</SelectOption>
                                        <SelectOption value="Architecture">Architecture</SelectOption>
                                        <SelectOption value="OS Version">OS Version</SelectOption>
                                        <SelectOption value="Status">Status</SelectOption>
                                    </SelectList>
                                </Select>
                            </ToolbarItem>
                            <ToolbarItem>
                                <InputGroup>
                                    <TextInput
                                        name="search-repositories"
                                        id="search-repositories"
                                        type="search"
                                        aria-label="Search repositories"
                                        placeholder="Search repositories..."
                                        value={searchValue}
                                        onChange={onSearchInputChange}
                                    />
                                    <Button variant="control" aria-label="Search button">
                                        <SearchIcon />
                                    </Button>
                                </InputGroup>
                            </ToolbarItem>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarItem>
                                <ToggleGroup aria-label="Repository type filter">
                                    <ToggleGroupItem
                                        text="Custom"
                                        buttonId="Custom"
                                        isSelected={selectedFilter === 'Custom'}
                                        onChange={handleToggleGroupChange}
                                    />
                                    <ToggleGroupItem
                                        text="Red Hat"
                                        buttonId="Red Hat"
                                        isSelected={selectedFilter === 'Red Hat'}
                                        onChange={handleToggleGroupChange}
                                    />
                                </ToggleGroup>
                            </ToolbarItem>
                            <ToolbarItem>
                                <Button variant="primary">Add repositories</Button>
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
                                        <DropdownItem key="refresh">Refresh all</DropdownItem>
                                        <DropdownItem key="export">Export data</DropdownItem>
                                        <DropdownItem key="settings">Settings</DropdownItem>
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
                ) : filteredRepositories.length === 0 ? (
                    <EmptyState>
                        <EmptyStateIcon icon={SearchIcon} />
                        <Title headingLevel="h4" size="lg">
                            No repositories found
                        </Title>
                        <EmptyStateBody>
                            No repositories match your search criteria. Try adjusting your filters or search terms.
                        </EmptyStateBody>
                    </EmptyState>
                ) : (
                    <Table variant="compact">
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Name</Th>
                                <Th>Architecture</Th>
                                <Th>OS version</Th>
                                <Th>Packages</Th>
                                <Th>Last introspection</Th>
                                <Th>Status</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredRepositories.map((repo) => (
                                <Tr key={repo.id}>
                                    <Td>
                                        <Checkbox
                                            isChecked={selectedRepositories.has(repo.id)}
                                            onChange={(event, checked) => handleRowSelect(repo.id, checked)}
                                            aria-label={`Select repository ${repo.name}`}
                                            id={`select-repo-${repo.id}`}
                                            name={`select-repo-${repo.id}`}
                                        />
                                    </Td>
                                    <Td dataLabel="Name">{repo.name}</Td>
                                    <Td dataLabel="Architecture">{repo.architecture}</Td>
                                    <Td dataLabel="OS version">{repo.osVersion}</Td>
                                    <Td dataLabel="Packages">{repo.packages.toLocaleString()}</Td>
                                    <Td dataLabel="Last introspection">{repo.lastIntrospection}</Td>
                                    <Td dataLabel="Status">{getStatusLabel(repo.status)}</Td>
                                    <Td>
                                        <Dropdown
                                            isOpen={openRowKebabs.has(repo.id)}
                                            onOpenChange={(isOpen) => {
                                                if (!isOpen) {
                                                    const newOpenKebabs = new Set(openRowKebabs);
                                                    newOpenKebabs.delete(repo.id);
                                                    setOpenRowKebabs(newOpenKebabs);
                                                }
                                            }}
                                            toggle={(toggleRef) => (
                                                <MenuToggle
                                                    ref={toggleRef}
                                                    variant="plain"
                                                    onClick={() => toggleRowKebab(repo.id)}
                                                    isExpanded={openRowKebabs.has(repo.id)}
                                                    aria-label={`Actions for ${repo.name}`}
                                                >
                                                    <EllipsisVIcon />
                                                </MenuToggle>
                                            )}
                                            popperProps={{ appendTo: () => document.body }}
                                        >
                                            <DropdownList>
                                                <DropdownItem key="edit">Edit</DropdownItem>
                                                <DropdownItem key="introspect">Introspect</DropdownItem>
                                                <DropdownItem key="delete" isDanger>Delete</DropdownItem>
                                            </DropdownList>
                                        </Dropdown>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </CardBody>
        </Card>
    );

    const yourRepositoriesContent = (
        <Card>
            <CardBody>
                <EmptyState>
                    <EmptyStateIcon icon={SearchIcon} />
                    <Title headingLevel="h4" size="lg">
                        No personal repositories
                    </Title>
                    <EmptyStateBody>
                        You haven't created any repositories yet. Start by adding your first repository.
                    </EmptyStateBody>
                    <Button variant="primary">Add repository</Button>
                </EmptyState>
            </CardBody>
        </Card>
    );

    return (
        <PageSection>
            <Title headingLevel="h1" size="lg">Repositories</Title>
            <Text component="p" style={{ marginBottom: 'var(--pf-global--spacer--lg)' }}>
                View all repositories within your organization.
            </Text>

            <Tabs
                activeKey={activeTabKey}
                onSelect={handleTabClick}
                aria-label="Repository tabs"
                role="region"
            >
                <Tab
                    eventKey="your"
                    title={<TabTitleText>Your repositories</TabTitleText>}
                    aria-label="Your repositories tab"
                >
                    <TabContent eventKey="your" id="your-repositories-content">
                        <TabContentBody>
                            {yourRepositoriesContent}
                        </TabContentBody>
                    </TabContent>
                </Tab>
                <Tab
                    eventKey="popular"
                    title={<TabTitleText>Popular repositories</TabTitleText>}
                    aria-label="Popular repositories tab"
                >
                    <TabContent eventKey="popular" id="popular-repositories-content">
                        <TabContentBody>
                            {popularRepositoriesContent}
                        </TabContentBody>
                    </TabContent>
                </Tab>
            </Tabs>
        </PageSection>
    );
};

export { Repositories }; 