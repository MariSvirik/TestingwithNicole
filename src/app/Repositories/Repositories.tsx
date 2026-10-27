import * as React from 'react';
import {
    Button,
    Checkbox,
    Dropdown,
    DropdownItem,
    DropdownList,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    Flex,
    FlexItem,
    MenuToggle,
    MenuToggleCheckbox,
    Modal,
    ModalVariant,
    PageSection,
    Pagination,
    PaginationVariant,
    SearchInput,
    Select,
    SelectList,
    SelectOption,
    Spinner,
    Stack,
    StackItem,
    Text,
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
    AngleDownIcon,
    AngleRightIcon,
    ArrowRightIcon,
    CubesIcon,
    EllipsisVIcon,
    FilterIcon,
    SearchIcon,
    OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

// Mock data for Red Hat repositories (tree structure)
const mockRedHatRepositories = [
    {
        id: 'rhel9',
        name: 'Red Hat Enterprise Linux 9',
        type: 'product',
        children: [
            { id: 'rhel9-baseos', name: 'RHEL 9 BaseOS (RPMs)', type: 'repository', path: 'rhel-9-for-x86_64-baseos-rpms' },
            { id: 'rhel9-appstream', name: 'RHEL 9 AppStream (RPMs)', type: 'repository', path: 'rhel-9-for-x86_64-appstream-rpms' },
            { id: 'rhel9-supplementary', name: 'RHEL 9 Supplementary (RPMs)', type: 'repository', path: 'rhel-9-for-x86_64-supplementary-rpms' },
        ],
    },
    {
        id: 'rhel8',
        name: 'Red Hat Enterprise Linux 8',
        type: 'product',
        children: [
            { id: 'rhel8-baseos', name: 'RHEL 8 BaseOS (RPMs)', type: 'repository', path: 'rhel-8-for-x86_64-baseos-rpms' },
            { id: 'rhel8-appstream', name: 'RHEL 8 AppStream (RPMs)', type: 'repository', path: 'rhel-8-for-x86_64-appstream-rpms' },
            { id: 'rhel8-supplementary', name: 'RHEL 8 Supplementary (RPMs)', type: 'repository', path: 'rhel-8-for-x86_64-supplementary-rpms' },
        ],
    },
    {
        id: 'advanced-virt',
        name: 'Advanced Virtualization',
        type: 'product',
        children: [
            { id: 'advanced-virt-crb-s390x', name: 'Advanced Virtualization CodeReady Builder for RHEL 8 IBM z Systems (RPMs)', type: 'repository', path: 'advanced-virt-crb-for-rhel-8-s390x-rpms' },
            { id: 'advanced-virt-crb-ppc64le', name: 'Advanced Virtualization CodeReady Builder for RHEL 8 Power, little endian (RPMs)', type: 'repository', path: 'advanced-virt-crb-for-rhel-8-ppc64le-rpms' },
            { id: 'advanced-virt-crb-x86_64', name: 'Advanced Virtualization CodeReady Builder for RHEL 8 x86_64 (RPMs)', type: 'repository', path: 'advanced-virt-crb-for-rhel-8-x86_64-rpms' },
        ],
    },
];

// Flatten tree structure for table display
const flattenRepositories = (repos: typeof mockRedHatRepositories, expanded: Set<string>): Array<{ id: string; name: string; type: string; path?: string; level: number; parentId?: string; hasChildren: boolean }> => {
    const result: Array<{ id: string; name: string; type: string; path?: string; level: number; parentId?: string; hasChildren: boolean }> = [];
    repos.forEach((repo) => {
        result.push({
            id: repo.id,
            name: repo.name,
            type: repo.type,
            level: 0,
            hasChildren: true,
        });
        if (expanded.has(repo.id) && repo.children) {
            repo.children.forEach((child) => {
                result.push({
                    id: child.id,
                    name: child.name,
                    type: child.type,
                    path: child.path,
                    level: 1,
                    parentId: repo.id,
                    hasChildren: false,
                });
            });
        }
    });
    return result;
};

// Mock data for repositories matching the Products design
const mockRepositories = [
    { id: 1, name: 'rhel9-base', description: '', syncStatus: 'Last synced 1 year ago.', syncPlan: 'None', repositories: 1 },
    { id: 2, name: 'rhel8-minimal', description: '', syncStatus: 'Never synced', syncPlan: 'None', repositories: 0 },
    { id: 3, name: 'custom-repo-dev', description: '', syncStatus: 'Last synced 2 years ago.', syncPlan: 'None', repositories: 2 },
    { id: 4, name: 'app-dependencies', description: '', syncStatus: 'Last synced 4 years ago.', syncPlan: 'Regular sync (weekly)', repositories: 1 },
    { id: 5, name: 'security-updates', description: '', syncStatus: 'Last synced 4 years ago.', syncPlan: 'None', repositories: 1 },
    { id: 6, name: 'epel-9', description: '', syncStatus: 'Last synced 8 months ago.', syncPlan: 'None', repositories: 0 },
    { id: 7, name: 'epel-8', description: '', syncStatus: 'Last synced 2 years ago.', syncPlan: 'Regular sync (weekly)', repositories: 2 },
    { id: 8, name: 'fedora-39', description: '', syncStatus: 'Last synced 1 year ago.', syncPlan: 'None', repositories: 1 },
    { id: 9, name: 'fedora-40', description: '', syncStatus: 'Last synced 6 months ago.', syncPlan: 'None', repositories: 1 },
    { id: 10, name: 'oracle-linux-8', description: '', syncStatus: 'Last synced 3 months ago.', syncPlan: 'Regular sync (weekly)', repositories: 1 },
    { id: 11, name: 'oracle-linux-9', description: '', syncStatus: 'Never synced', syncPlan: 'None', repositories: 0 },
    { id: 12, name: 'centos-stream-9', description: '', syncStatus: 'Last synced 1 year ago.', syncPlan: 'None', repositories: 1 },
    { id: 13, name: 'centos-stream-10', description: '', syncStatus: 'Last synced 8 months ago.', syncPlan: 'Regular sync (weekly)', repositories: 2 },
    { id: 14, name: 'rhel-7-server', description: '', syncStatus: 'Last synced 2 years ago.', syncPlan: 'None', repositories: 1 },
    { id: 15, name: 'rhel-8-appstream', description: '', syncStatus: 'Last synced 1 year ago.', syncPlan: 'None', repositories: 1 },
    { id: 16, name: 'rhel-9-baseos', description: '', syncStatus: 'Last synced 6 months ago.', syncPlan: 'Regular sync (weekly)', repositories: 1 },
    { id: 17, name: 'rhel-9-appstream', description: '', syncStatus: 'Last synced 3 months ago.', syncPlan: 'None', repositories: 1 },
    { id: 18, name: 'custom-build-tools', description: '', syncStatus: 'Last synced 1 year ago.', syncPlan: 'None', repositories: 0 },
    { id: 19, name: 'development-stack', description: '', syncStatus: 'Last synced 4 years ago.', syncPlan: 'None', repositories: 2 },
    { id: 20, name: 'production-stack', description: '', syncStatus: 'Last synced 2 years ago.', syncPlan: 'Regular sync (weekly)', repositories: 1 },
    { id: 21, name: 'testing-repo', description: '', syncStatus: 'Never synced', syncPlan: 'None', repositories: 0 },
    { id: 22, name: 'staging-repo', description: '', syncStatus: 'Last synced 1 year ago.', syncPlan: 'None', repositories: 1 },
    { id: 23, name: 'backup-repo', description: '', syncStatus: 'Last synced 6 months ago.', syncPlan: 'None', repositories: 1 },
    { id: 24, name: 'archive-repo', description: '', syncStatus: 'Last synced 5 years ago.', syncPlan: 'None', repositories: 0 },
];

const Repositories: React.FunctionComponent = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        console.log('Repositories component mounted');
    }, []);

    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);
    const [filterValue, setFilterValue] = React.useState('Name');
    const [searchValue, setSearchValue] = React.useState('');
    const [selectedRepositories, setSelectedRepositories] = React.useState<Set<number>>(new Set());
    const [isActionsKebabOpen, setIsActionsKebabOpen] = React.useState(false);
    const [isBulkSelectOpen, setIsBulkSelectOpen] = React.useState(false);
    const [isLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(5);
    const [isRedHatModalOpen, setIsRedHatModalOpen] = React.useState(false);
    const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());
    const [selectedRedHatRepos, setSelectedRedHatRepos] = React.useState<Set<string>>(new Set());
    const [modalSearchValue, setModalSearchValue] = React.useState('');
    const [modalFilterValue, setModalFilterValue] = React.useState('Available');
    const [isModalFilterOpen, setIsModalFilterOpen] = React.useState(false);
    const [isModalBulkSelectOpen, setIsModalBulkSelectOpen] = React.useState(false);
    const [modalPage, setModalPage] = React.useState(1);
    const [modalPerPage, setModalPerPage] = React.useState(20);

    const onFilterDropdownToggle = () => {
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
    };

    const onFilterSelect = (event: React.MouseEvent | undefined, value: string | number | undefined) => {
        setFilterValue(value as string);
        setIsFilterDropdownOpen(false);
    };

    const onSearchInputChange = (event: React.FormEvent<HTMLInputElement>, value: string) => {
        setSearchValue(value);
        setPage(1); // Reset to first page on search
    };

    const filteredRepositories = mockRepositories.filter(repo =>
        repo.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSelectAll = (isSelected: boolean) => {
        if (isSelected) {
            setSelectedRepositories(new Set(filteredRepositories.map(repo => repo.id)));
        } else {
            setSelectedRepositories(new Set());
        }
    };

    const handleSelectPage = () => {
        setSelectedRepositories(new Set(paginatedRepositories.map(repo => repo.id)));
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

    const isAllSelected = selectedRepositories.size === filteredRepositories.length && filteredRepositories.length > 0;
    const isPartiallySelected = selectedRepositories.size > 0 && selectedRepositories.size < filteredRepositories.length;

    // Pagination calculations
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedRepositories = filteredRepositories.slice(startIndex, endIndex);

    // Modal tree table logic
    const filteredRedHatRepos = mockRedHatRepositories.filter(repo => {
        const matchesSearch = repo.name.toLowerCase().includes(modalSearchValue.toLowerCase()) ||
            repo.children?.some(child => child.name.toLowerCase().includes(modalSearchValue.toLowerCase()));
        return matchesSearch;
    });

    const flattenedRepos = flattenRepositories(filteredRedHatRepos, expandedRows);
    const modalStartIndex = (modalPage - 1) * modalPerPage;
    const modalEndIndex = modalStartIndex + modalPerPage;
    const paginatedFlattenedRepos = flattenedRepos.slice(modalStartIndex, modalEndIndex);

    const handleToggleRow = (repoId: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(repoId)) {
            newExpanded.delete(repoId);
        } else {
            newExpanded.add(repoId);
        }
        setExpandedRows(newExpanded);
    };

    const handleRedHatRepoSelect = (repoId: string, isSelected: boolean) => {
        const newSelected = new Set(selectedRedHatRepos);
        if (isSelected) {
            newSelected.add(repoId);
        } else {
            newSelected.delete(repoId);
        }
        setSelectedRedHatRepos(newSelected);
    };

    const handleModalSelectAll = (isSelected: boolean) => {
        if (isSelected) {
            const allRepoIds = flattenedRepos.filter(repo => repo.type === 'repository').map(repo => repo.id);
            setSelectedRedHatRepos(new Set(allRepoIds));
        } else {
            setSelectedRedHatRepos(new Set());
        }
    };

    const handleModalSelectPage = () => {
        const pageRepoIds = paginatedFlattenedRepos.filter(repo => repo.type === 'repository').map(repo => repo.id);
        const newSelected = new Set(selectedRedHatRepos);
        pageRepoIds.forEach(id => newSelected.add(id));
        setSelectedRedHatRepos(newSelected);
    };

    const modalIsAllSelected = selectedRedHatRepos.size === flattenedRepos.filter(r => r.type === 'repository').length && flattenedRepos.filter(r => r.type === 'repository').length > 0;
    const modalIsPartiallySelected = selectedRedHatRepos.size > 0 && selectedRedHatRepos.size < flattenedRepos.filter(r => r.type === 'repository').length;
    const modalMenuToggleCheckmark: boolean | null = modalIsAllSelected ? true : modalIsPartiallySelected ? null : false;

    const menuToggleCheckmark: boolean | null = isAllSelected ? true : isPartiallySelected ? null : false;

    return (
        <PageSection style={{ backgroundColor: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: 'var(--pf-global--spacer--md)' }}>
                <Title headingLevel="h1" size="lg">Products</Title>
                <Button variant="plain" aria-label="Help" style={{ padding: 0 }}>
                    <OutlinedQuestionCircleIcon />
                </Button>
            </div>

            <Toolbar id="repositories-toolbar">
                <ToolbarContent>
                    <ToolbarGroup>
                        <ToolbarItem>
                            <Dropdown
                                isOpen={isBulkSelectOpen}
                                onSelect={() => setIsBulkSelectOpen(false)}
                                onOpenChange={setIsBulkSelectOpen}
                                toggle={(toggleRef) => (
                                    <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => setIsBulkSelectOpen(!isBulkSelectOpen)}
                                        isExpanded={isBulkSelectOpen}
                                        splitButtonOptions={{
                                            items: [
                                                <MenuToggleCheckbox
                                                    id="bulk-select-checkbox"
                                                    key="bulk-select-checkbox"
                                                    aria-label="Select all"
                                                    isChecked={menuToggleCheckmark}
                                                    onChange={(checked) => handleSelectAll(checked)}
                                                />
                                            ]
                                        }}
                                        aria-label="Bulk select"
                                    />
                                )}
                                popperProps={{ appendTo: () => document.body }}
                            >
                                <DropdownList>
                                    <DropdownItem key="select-none" onClick={() => {
                                        handleSelectAll(false);
                                        setIsBulkSelectOpen(false);
                                    }}>
                                        Select none ({filteredRepositories.length} items)
                                    </DropdownItem>
                                    <DropdownItem key="select-page" onClick={() => {
                                        handleSelectPage();
                                        setIsBulkSelectOpen(false);
                                    }}>
                                        Select page ({paginatedRepositories.length} items)
                                    </DropdownItem>
                                    <DropdownItem key="select-all" onClick={() => {
                                        handleSelectAll(true);
                                        setIsBulkSelectOpen(false);
                                    }}>
                                        Select all ({filteredRepositories.length} items)
                                    </DropdownItem>
                                </DropdownList>
                            </Dropdown>
                        </ToolbarItem>
                        <ToolbarGroup variant="filter-group">
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
                                        <SelectOption value="Name">Name</SelectOption>
                                        <SelectOption value="Sync Status">Sync Status</SelectOption>
                                        <SelectOption value="Sync Plan">Sync Plan</SelectOption>
                                    </SelectList>
                                </Select>
                            </ToolbarItem>
                            <ToolbarItem>
                                <SearchInput
                                    placeholder="Filter..."
                                    value={searchValue}
                                    onChange={(event, value) => onSearchInputChange(event as React.FormEvent<HTMLInputElement>, value)}
                                    onClear={() => setSearchValue('')}
                                />
                            </ToolbarItem>
                        </ToolbarGroup>
                        <ToolbarItem>
                            <Button variant="primary">Create product</Button>
                        </ToolbarItem>
                        <ToolbarItem>
                            <Button variant="secondary" onClick={() => {
                                console.log('Enable button clicked');
                                setIsRedHatModalOpen(true);
                            }}>Enable RH repositories</Button>
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
                                        aria-label="Actions"
                                    >
                                        <EllipsisVIcon />
                                    </MenuToggle>
                                )}
                                popperProps={{ appendTo: () => document.body }}
                            >
                                <DropdownList>
                                    <DropdownItem
                                        key="discover-repo"
                                        onClick={() => {
                                            setIsActionsKebabOpen(false);
                                            navigate('/repositories/discover');
                                        }}
                                    >
                                        Discover repo
                                    </DropdownItem>
                                    <DropdownItem key="sync" isDisabled={selectedRepositories.size === 0}>
                                        Sync Selected
                                    </DropdownItem>
                                    <DropdownItem key="advanced-sync" isDisabled={selectedRepositories.size === 0}>
                                        Advanced Sync
                                    </DropdownItem>
                                    <DropdownItem key="verify" isDisabled={selectedRepositories.size === 0}>
                                        Verify Content Checksum
                                    </DropdownItem>
                                    <DropdownItem key="manage-sync" isDisabled={selectedRepositories.size === 0}>
                                        Manage Sync Plan
                                    </DropdownItem>
                                    <DropdownItem key="manage-proxy" isDisabled={selectedRepositories.size === 0}>
                                        Manage HTTP Proxy
                                    </DropdownItem>
                                    <DropdownItem key="remove" isDisabled={selectedRepositories.size === 0} isDanger>
                                        Remove
                                    </DropdownItem>
                                </DropdownList>
                            </Dropdown>
                        </ToolbarItem>
                    </ToolbarGroup>
                </ToolbarContent>
            </Toolbar>

            {/* Top Pagination */}
            <div style={{ marginBottom: 'var(--pf-global--spacer--md)' }}>
                <Pagination
                    itemCount={filteredRepositories.length}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_event, pageNumber) => setPage(pageNumber)}
                    onPerPageSelect={(_event, perPageOption) => {
                        setPerPage(perPageOption);
                        setPage(1);
                    }}
                    variant={PaginationVariant.top}
                    isCompact
                />
            </div>

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
                <>
                    <Table variant="compact">
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Name</Th>
                                <Th>Sync Status</Th>
                                <Th>Sync Plan</Th>
                                <Th>Repositories</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {paginatedRepositories.map((repo) => (
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
                                    <Td dataLabel="Name">
                                        <Button variant="link" isInline onClick={() => navigate(`/products/${repo.name}`)}>
                                            {repo.name}
                                        </Button>
                                    </Td>
                                    <Td dataLabel="Sync Status">{repo.syncStatus}</Td>
                                    <Td dataLabel="Sync Plan">{repo.syncPlan}</Td>
                                    <Td dataLabel="Repositories">
                                        <Button variant="link" isInline onClick={() => console.log(`View repositories for ${repo.name}`)}>
                                            {repo.repositories}
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>

                    {/* Bottom Pagination */}
                    <div style={{ marginTop: 'var(--pf-global--spacer--md)' }}>
                        <Pagination
                            itemCount={filteredRepositories.length}
                            perPage={perPage}
                            page={page}
                            onSetPage={(_event, pageNumber) => setPage(pageNumber)}
                            onPerPageSelect={(_event, perPageOption) => {
                                setPerPage(perPageOption);
                                setPage(1);
                            }}
                            variant={PaginationVariant.bottom}
                            isCompact
                        />
                    </div>
                </>
            )}

            {/* Red Hat Repositories Modal */}
            <Modal
                variant={ModalVariant.large}
                title="Enable Red Hat repositories"
                isOpen={isRedHatModalOpen}
                onClose={() => setIsRedHatModalOpen(false)}
                actions={[
                    <Button key="enable" variant="primary" onClick={() => setIsRedHatModalOpen(false)}>
                        Enable
                    </Button>,
                    <Button key="cancel" variant="link" onClick={() => setIsRedHatModalOpen(false)}>
                        Cancel
                    </Button>
                ]}
            >
                <Toolbar>
                    <ToolbarContent>
                        <ToolbarGroup>
                            <ToolbarItem>
                                <Dropdown
                                    isOpen={isModalBulkSelectOpen}
                                    onSelect={() => setIsModalBulkSelectOpen(false)}
                                    onOpenChange={setIsModalBulkSelectOpen}
                                    toggle={(toggleRef) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            onClick={() => setIsModalBulkSelectOpen(!isModalBulkSelectOpen)}
                                            isExpanded={isModalBulkSelectOpen}
                                            splitButtonOptions={{
                                                items: [
                                                    <MenuToggleCheckbox
                                                        id="modal-bulk-select-checkbox"
                                                        key="modal-bulk-select-checkbox"
                                                        aria-label="Select all"
                                                        isChecked={modalMenuToggleCheckmark}
                                                        onChange={(checked) => handleModalSelectAll(checked)}
                                                    />
                                                ]
                                            }}
                                            aria-label="Bulk select"
                                        />
                                    )}
                                    popperProps={{ appendTo: () => document.body }}
                                >
                                    <DropdownList>
                                        <DropdownItem key="select-none" onClick={() => {
                                            handleModalSelectAll(false);
                                            setIsModalBulkSelectOpen(false);
                                        }}>
                                            Select none ({flattenedRepos.filter(r => r.type === 'repository').length} items)
                                        </DropdownItem>
                                        <DropdownItem key="select-page" onClick={() => {
                                            handleModalSelectPage();
                                            setIsModalBulkSelectOpen(false);
                                        }}>
                                            Select page ({paginatedFlattenedRepos.filter(r => r.type === 'repository').length} items)
                                        </DropdownItem>
                                        <DropdownItem key="select-all" onClick={() => {
                                            handleModalSelectAll(true);
                                            setIsModalBulkSelectOpen(false);
                                        }}>
                                            Select all ({flattenedRepos.filter(r => r.type === 'repository').length} items)
                                        </DropdownItem>
                                    </DropdownList>
                                </Dropdown>
                            </ToolbarItem>
                            <ToolbarItem>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <SearchInput
                                        placeholder="Search..."
                                        value={modalSearchValue}
                                        onChange={(event, value) => {
                                            setModalSearchValue(value);
                                            setModalPage(1);
                                        }}
                                        onClear={() => setModalSearchValue('')}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        right: 'var(--pf-global--spacer--md)',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        pointerEvents: 'none',
                                        zIndex: 1
                                    }}>
                                        <ArrowRightIcon style={{ color: 'var(--pf-global--Color--100)', fontSize: 'var(--pf-global--FontSize--md)' }} />
                                    </div>
                                </div>
                            </ToolbarItem>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarItem>
                                <Select
                                    isOpen={isModalFilterOpen}
                                    selected={modalFilterValue}
                                    onSelect={(event, value) => {
                                        setModalFilterValue(value as string);
                                        setIsModalFilterOpen(false);
                                    }}
                                    onOpenChange={setIsModalFilterOpen}
                                    toggle={(toggleRef) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            onClick={() => setIsModalFilterOpen(!isModalFilterOpen)}
                                            isExpanded={isModalFilterOpen}
                                            icon={<FilterIcon />}
                                        >
                                            {modalFilterValue}
                                        </MenuToggle>
                                    )}
                                >
                                    <SelectList>
                                        <SelectOption value="Available">Available</SelectOption>
                                        <SelectOption value="Enabled">Enabled</SelectOption>
                                        <SelectOption value="Recommended repositories">Recommended repositories</SelectOption>
                                    </SelectList>
                                </Select>
                            </ToolbarItem>
                            <ToolbarItem>
                                <Select
                                    isOpen={false}
                                    selected="RPM"
                                    onSelect={() => { }}
                                    onOpenChange={() => { }}
                                    toggle={(toggleRef) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            onClick={() => { }}
                                            isExpanded={false}
                                        >
                                            RPM
                                        </MenuToggle>
                                    )}
                                >
                                    <SelectList>
                                        <SelectOption value="RPM">RPM</SelectOption>
                                        <SelectOption value="Docker">Docker</SelectOption>
                                    </SelectList>
                                </Select>
                            </ToolbarItem>
                        </ToolbarGroup>
                    </ToolbarContent>
                </Toolbar>
                <div style={{ marginBottom: 'var(--pf-global--spacer--md)' }}>
                    <Pagination
                        itemCount={flattenedRepos.length}
                        perPage={modalPerPage}
                        page={modalPage}
                        onSetPage={(_event, pageNumber) => setModalPage(pageNumber)}
                        onPerPageSelect={(_event, perPageOption) => {
                            setModalPerPage(perPageOption);
                            setModalPage(1);
                        }}
                        variant={PaginationVariant.top}
                        isCompact
                    />
                </div>
                <Table>
                    <Thead>
                        <Tr>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {paginatedFlattenedRepos.map((repo) => (
                            <Tr key={repo.id}>
                                <Td>
                                    <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                                        <FlexItem>
                                            {repo.hasChildren ? (
                                                <Button
                                                    variant="plain"
                                                    onClick={() => handleToggleRow(repo.id)}
                                                    aria-label={expandedRows.has(repo.id) ? 'Collapse' : 'Expand'}
                                                    style={{ padding: 0, marginRight: 'var(--pf-global--spacer--xs)' }}
                                                >
                                                    {expandedRows.has(repo.id) ? <AngleDownIcon /> : <AngleRightIcon />}
                                                </Button>
                                            ) : (
                                                <span style={{ display: 'inline-block', width: '24px' }} />
                                            )}
                                        </FlexItem>
                                        {repo.type === 'repository' && (
                                            <FlexItem>
                                                <Checkbox
                                                    isChecked={selectedRedHatRepos.has(repo.id)}
                                                    onChange={(event, checked) => handleRedHatRepoSelect(repo.id, checked)}
                                                    aria-label={`Select repository ${repo.name}`}
                                                    id={`select-redhat-repo-${repo.id}`}
                                                    name={`select-redhat-repo-${repo.id}`}
                                                />
                                            </FlexItem>
                                        )}
                                        {repo.type === 'product' && (
                                            <FlexItem style={{ width: '24px' }} />
                                        )}
                                        <FlexItem>
                                            <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                                                {repo.type === 'repository' && (
                                                    <FlexItem>
                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            backgroundColor: 'var(--pf-global--palette--blue-50)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0
                                                        }}>
                                                            <CubesIcon style={{ color: 'var(--pf-global--palette--blue-600)', fontSize: '20px' }} />
                                                        </div>
                                                    </FlexItem>
                                                )}
                                                <FlexItem style={{ flex: 1, paddingLeft: repo.level > 0 ? `${repo.level * 24}px` : '0' }}>
                                                    <Stack>
                                                        <StackItem>
                                                            <Text component="p" style={{
                                                                fontWeight: 'bold',
                                                                fontSize: 'var(--pf-global--FontSize--md)',
                                                                color: 'var(--pf-global--Color--100)',
                                                                margin: 0,
                                                                lineHeight: '1.4'
                                                            }}>
                                                                {repo.name}
                                                            </Text>
                                                        </StackItem>
                                                        {repo.path && (
                                                            <StackItem>
                                                                <Text component="p" style={{
                                                                    fontSize: 'var(--pf-global--FontSize--sm)',
                                                                    color: 'var(--pf-global--Color--200)',
                                                                    margin: 0,
                                                                    marginTop: 'var(--pf-global--spacer--xs)'
                                                                }}>
                                                                    {repo.path}
                                                                </Text>
                                                            </StackItem>
                                                        )}
                                                    </Stack>
                                                </FlexItem>
                                            </Flex>
                                        </FlexItem>
                                    </Flex>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
                <div style={{ marginTop: 'var(--pf-global--spacer--md)' }}>
                    <Pagination
                        itemCount={flattenedRepos.length}
                        perPage={modalPerPage}
                        page={modalPage}
                        onSetPage={(_event, pageNumber) => setModalPage(pageNumber)}
                        onPerPageSelect={(_event, perPageOption) => {
                            setModalPerPage(perPageOption);
                            setModalPage(1);
                        }}
                        variant={PaginationVariant.bottom}
                        isCompact
                    />
                </div>
            </Modal>
        </PageSection>
    );
};

export { Repositories };

