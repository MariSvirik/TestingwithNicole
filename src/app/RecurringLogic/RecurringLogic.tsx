import * as React from 'react';
import {
    PageSection,
    PageSectionVariants,
    Title,
    Card,
    CardBody,
    Toolbar,
    ToolbarContent,
    ToolbarItem,
    SearchInput,
    Button,
    Pagination,
    PaginationVariant,
    Label,
    Flex,
    FlexItem,
    Stack,
    StackItem,
    Tooltip,
    Popover,
    Text,
    TextContent,
    TextVariants,
    Badge,
    Dropdown,
    DropdownItem,
    DropdownList,
    MenuToggle,
    MenuToggleElement,
    Checkbox,
} from '@patternfly/react-core';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    ActionsColumn,
    IAction,
} from '@patternfly/react-table';
import {
    SearchIcon,
    InfoCircleIcon,
    ExternalLinkAltIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    BanIcon,
    PauseCircleIcon,
    EllipsisVIcon,
    CaretDownIcon,
} from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

// Types for our data
interface RecurringTask {
    id: number;
    action: string;
    recurrence: string;
    tasks: {
        count: number;
        limit: string;
    };
    nextRun: string;
    lastRun: string;
    overallIteration: number;
    state: 'Scheduled' | 'Finished' | 'Disabled' | 'Cancelled';
    purpose: string;
    resources: string;
    hasIssue?: boolean;
}

// Mock data based on the image
const mockData: RecurringTask[] = [
    {
        id: 36,
        action: 'Generate all reports',
        recurrence: 'Every Tuesday (at 3:00)',
        tasks: { count: 4, limit: 'Unlimited' },
        nextRun: '22/07/2025',
        lastRun: '15/07/2025',
        overallIteration: 25,
        state: 'Scheduled',
        purpose: '-',
        resources: 'Internal',
    },
    {
        id: 26,
        action: 'Generate all reports',
        recurrence: 'Daily (at 17:30)',
        tasks: { count: 21, limit: 'Unlimited' },
        nextRun: '22/07/2022',
        lastRun: '21/07/2023',
        overallIteration: 5,
        state: 'Scheduled',
        purpose: '-',
        resources: 'Internal',
        hasIssue: true,
    },
    {
        id: 15,
        action: 'Wait and generate all reports',
        recurrence: '1st and 15th monthly (at 00:00)',
        tasks: { count: 2, limit: 'Time limited' },
        nextRun: '01/08/2025',
        lastRun: '21/07/2025',
        overallIteration: 3,
        state: 'Scheduled',
        purpose: 'Test',
        resources: 'Sync plan',
    },
    {
        id: 14,
        action: 'Wait and Lightspeed scheduled sync',
        recurrence: 'Every Sunday (at 00:00)',
        tasks: { count: 3, limit: 'Unlimited' },
        nextRun: '-',
        lastRun: '20/07/2025',
        overallIteration: 27,
        state: 'Cancelled',
        purpose: '-',
        resources: 'Internal',
    },
    {
        id: 13,
        action: 'Wait and Lightspeed scheduled sync',
        recurrence: 'Every Sunday (at 00:00)',
        tasks: { count: 3, limit: '3' },
        nextRun: '-',
        lastRun: '20/07/2025',
        overallIteration: 3,
        state: 'Finished',
        purpose: 'Test',
        resources: 'Job invocation',
    },
    {
        id: 9,
        action: 'Run host job',
        recurrence: 'Daily (at 17:30)',
        tasks: { count: 21, limit: 'Unlimited' },
        nextRun: '-',
        lastRun: '21/07/2025',
        overallIteration: 356,
        state: 'Disabled',
        purpose: '-',
        resources: 'Internal',
    },
];

export const RecurringLogic: React.FunctionComponent = () => {
    useDocumentTitle('PatternFly Seed | Recurring Logic');

    // State management
    const [searchValue, setSearchValue] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);
    const [filteredData, setFilteredData] = React.useState(mockData);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [isBulkSelectOpen, setIsBulkSelectOpen] = React.useState(false);
    const [selectedItems, setSelectedItems] = React.useState(new Set<number>());

    // Search functionality
    React.useEffect(() => {
        if (searchValue === '') {
            setFilteredData(mockData);
        } else {
            const filtered = mockData.filter(
                (item) =>
                    item.action.toLowerCase().includes(searchValue.toLowerCase()) ||
                    item.recurrence.toLowerCase().includes(searchValue.toLowerCase()) ||
                    item.state.toLowerCase().includes(searchValue.toLowerCase()) ||
                    item.purpose.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredData(filtered);
        }
        setPage(1); // Reset to first page when searching
    }, [searchValue]);

    // Pagination
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Selection functions
    const isAllSelected = selectedItems.size === paginatedData.length && paginatedData.length > 0;
    const isPartiallySelected = selectedItems.size > 0 && selectedItems.size < paginatedData.length;

    const handleSelectAll = (isSelected: boolean) => {
        if (isSelected) {
            setSelectedItems(new Set(paginatedData.map(item => item.id)));
        } else {
            setSelectedItems(new Set());
        }
    };

    const handleSelectItem = (itemId: number, isSelected: boolean) => {
        const newSelection = new Set(selectedItems);
        if (isSelected) {
            newSelection.add(itemId);
        } else {
            newSelection.delete(itemId);
        }
        setSelectedItems(newSelection);
    };

    // State icons and variants
    const getStateDisplay = (state: RecurringTask['state'], iteration: number, hasIssue?: boolean) => {
        if (hasIssue) {
            return (
                <Tooltip content="Issue detected">
                    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsNone' }}>
                        <FlexItem>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                                <FlexItem>
                                    <ExclamationTriangleIcon style={{ color: 'var(--pf-v5-global--warning-color--100)' }} />
                                </FlexItem>
                                <FlexItem>
                                    <Text>{state}</Text>
                                </FlexItem>
                            </Flex>
                        </FlexItem>
                        <FlexItem>
                            <Text component={TextVariants.small}>({iteration} runs)</Text>
                        </FlexItem>
                    </Flex>
                </Tooltip>
            );
        }

        let icon: React.ReactNode;

        switch (state) {
            case 'Scheduled':
                icon = <ClockIcon style={{ color: 'var(--pf-v5-global--info-color--100)' }} />;
                break;
            case 'Finished':
                icon = <CheckCircleIcon style={{ color: 'var(--pf-v5-global--success-color--100)' }} />;
                break;
            case 'Disabled':
                icon = <PauseCircleIcon style={{ color: 'var(--pf-v5-global--Color--200)' }} />;
                break;
            case 'Cancelled':
                icon = <BanIcon style={{ color: 'var(--pf-v5-global--danger-color--100)' }} />;
                break;
            default:
                icon = null;
        }

        return (
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsNone' }}>
                <FlexItem>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                        <FlexItem>
                            {icon}
                        </FlexItem>
                        <FlexItem>
                            <Text>{state}</Text>
                        </FlexItem>
                    </Flex>
                </FlexItem>
                <FlexItem>
                    <Text component={TextVariants.small}>({iteration} runs)</Text>
                </FlexItem>
            </Flex>
        );
    };

    // Actions for each row
    const getRowActions = (task: RecurringTask): IAction[] => {
        const actions: IAction[] = [
            {
                title: task.state === 'Disabled' ? 'Enable' : 'Disable',
                onClick: () => console.log(task.state === 'Disabled' ? 'Enable' : 'Disable', 'task', task.id),
            },
        ];

        // Add special actions for Internal resources
        if (task.resources === 'Internal') {
            actions.push(
                {
                    title: 'Enable',
                    onClick: () => console.log('Enable task', task.id),
                }
            );
        }

        // Add special actions for Sync plan resources
        if (task.resources === 'Sync plan') {
            actions.push(
                {
                    title: 'Change sync plan',
                    onClick: () => console.log('Change sync plan for task', task.id),
                }
            );
        }

        // Add Cancel action with description for both Internal and Sync plan resources
        if (task.resources === 'Internal' || task.resources === 'Sync plan') {
            actions.push(
                { isSeparator: true },
                {
                    title: 'Cancel - Stop indefinitely',
                    onClick: () => console.log('Cancel task', task.id),
                }
            );
        }

        return actions;
    };

    // Bulk actions dropdown
    const dropdownItems = (
        <DropdownList>
            <DropdownItem key="enable">Enable</DropdownItem>
            <DropdownItem key="cancel-stop">Cancel - Stop indefinitely</DropdownItem>
            <DropdownItem key="remove-cancelled">Remove cancelled</DropdownItem>
        </DropdownList>
    );

    return (
        <PageSection variant={PageSectionVariants.light}>
            <Stack hasGutter>
                <StackItem>
                    <Flex alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem>
                            <Title headingLevel="h1" size="2xl">
                                Recurring logic
                            </Title>
                        </FlexItem>
                        <FlexItem>
                            <Popover
                                headerContent="Recurring logic help"
                                bodyContent={
                                    <TextContent>
                                        <Text component={TextVariants.p}>
                                            Recurring logic allows you to schedule and manage automated tasks that run on a
                                            regular basis. You can configure the frequency, monitor execution status, and
                                            track performance metrics.
                                        </Text>
                                        <Text component={TextVariants.p}>
                                            Use the controls below to search, filter, and manage your recurring tasks.
                                        </Text>
                                    </TextContent>
                                }
                            >
                                <Button variant="plain" aria-label="Help for recurring logic">
                                    <InfoCircleIcon />
                                </Button>
                            </Popover>
                        </FlexItem>
                    </Flex>
                </StackItem>

                <StackItem>
                    <Card>
                        <CardBody>
                            <Stack hasGutter>
                                <StackItem>
                                    <Toolbar>
                                        <ToolbarContent>
                                            <ToolbarItem>
                                                <div style={{
                                                    border: '1px solid var(--pf-v5-global--BorderColor--100)',
                                                    borderRadius: 'var(--pf-v5-global--BorderRadius--sm)',
                                                    padding: 'var(--pf-v5-global--spacer--xs) var(--pf-v5-global--spacer--sm)'
                                                }}>
                                                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                                                        <FlexItem>
                                                            <Checkbox
                                                                id="bulk-select"
                                                                isChecked={isAllSelected ? true : isPartiallySelected ? null : false}
                                                                onChange={(_event, checked) => handleSelectAll(checked)}
                                                                aria-label="Select all items"
                                                            />
                                                        </FlexItem>
                                                        <FlexItem>
                                                            <Text component={TextVariants.small}>
                                                                {selectedItems.size > 0 ? `${selectedItems.size} selected` : 'Select items'}
                                                            </Text>
                                                        </FlexItem>
                                                        <FlexItem>
                                                            <Dropdown
                                                                isOpen={isBulkSelectOpen}
                                                                onSelect={() => setIsBulkSelectOpen(false)}
                                                                onOpenChange={setIsBulkSelectOpen}
                                                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                                                    <MenuToggle
                                                                        ref={toggleRef}
                                                                        onClick={() => setIsBulkSelectOpen(!isBulkSelectOpen)}
                                                                        variant="plain"
                                                                        aria-label="Bulk select options"
                                                                    >
                                                                        <CaretDownIcon />
                                                                    </MenuToggle>
                                                                )}
                                                            >
                                                                <DropdownList>
                                                                    <DropdownItem key="select-all">Select all</DropdownItem>
                                                                    <DropdownItem key="select-none">Select none</DropdownItem>
                                                                    <DropdownItem key="select-page">Select page</DropdownItem>
                                                                </DropdownList>
                                                            </Dropdown>
                                                        </FlexItem>
                                                    </Flex>
                                                </div>
                                            </ToolbarItem>
                                            <ToolbarItem>
                                                <SearchInput
                                                    placeholder="Search recurring tasks..."
                                                    value={searchValue}
                                                    onChange={(_event, value) => setSearchValue(value)}
                                                    onClear={() => setSearchValue('')}
                                                    style={{ minWidth: '300px' }}
                                                />
                                            </ToolbarItem>

                                            <ToolbarItem>
                                                <Button variant="secondary" isDisabled={selectedItems.size === 0}>
                                                    Disable
                                                </Button>
                                            </ToolbarItem>
                                            <ToolbarItem>
                                                <Dropdown
                                                    isOpen={isDropdownOpen}
                                                    onSelect={() => setIsDropdownOpen(false)}
                                                    onOpenChange={setIsDropdownOpen}
                                                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                                        <MenuToggle
                                                            ref={toggleRef}
                                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                            variant="plain"
                                                            isDisabled={selectedItems.size === 0}
                                                        >
                                                            <EllipsisVIcon />
                                                        </MenuToggle>
                                                    )}
                                                >
                                                    {dropdownItems}
                                                </Dropdown>
                                            </ToolbarItem>
                                        </ToolbarContent>
                                    </Toolbar>
                                </StackItem>

                                <StackItem>
                                    <Table variant="compact">
                                        <Thead>
                                            <Tr>
                                                <Th width={10}></Th>
                                                <Th width={30}>Action</Th>
                                                <Th width={15}>Recurrence</Th>
                                                <Th width={10}>Tasks</Th>
                                                <Th width={10}>Next run</Th>
                                                <Th width={10}>Last run</Th>
                                                <Th width={20}>State</Th>
                                                <Th width={10}>Purpose</Th>
                                                <Th width={10}>Resources</Th>
                                                <Th width={10}></Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {paginatedData.map((task) => (
                                                <Tr key={task.id}>
                                                    <Td dataLabel="Select">
                                                        <Checkbox
                                                            id={`select-${task.id}`}
                                                            isChecked={selectedItems.has(task.id)}
                                                            onChange={(_event, checked) => handleSelectItem(task.id, checked)}
                                                            aria-label={`Select task ${task.id}`}
                                                        />
                                                    </Td>
                                                    <Td dataLabel="Action" modifier="truncate">
                                                        <Text>
                                                            ID {task.id} {task.action}
                                                        </Text>
                                                    </Td>
                                                    <Td dataLabel="Recurrence" modifier="breakWord">
                                                        <Text>
                                                            {task.recurrence}
                                                        </Text>
                                                    </Td>
                                                    <Td dataLabel="Tasks">
                                                        <Button
                                                            variant="link"
                                                            isInline
                                                            component="a"
                                                            href="#"
                                                        >
                                                            <Text>
                                                                {task.tasks.count}/{task.tasks.limit}
                                                            </Text>
                                                        </Button>
                                                    </Td>
                                                    <Td dataLabel="Next run">
                                                        <Text>
                                                            {task.nextRun}
                                                        </Text>
                                                    </Td>
                                                    <Td dataLabel="Last run">
                                                        <Text>
                                                            {task.lastRun}
                                                        </Text>
                                                    </Td>
                                                    <Td dataLabel="State">{getStateDisplay(task.state, task.overallIteration, task.hasIssue)}</Td>
                                                    <Td dataLabel="Purpose">
                                                        <Text>
                                                            {task.purpose}
                                                        </Text>
                                                    </Td>
                                                    <Td dataLabel="Resources">
                                                        {task.resources === 'Job invocation' || task.resources === 'Sync plan' ? (
                                                            <Button
                                                                variant="link"
                                                                isInline
                                                                component="a"
                                                                href="#"
                                                            >
                                                                <Text>
                                                                    {task.resources}
                                                                </Text>
                                                            </Button>
                                                        ) : (
                                                            <Text>
                                                                {task.resources}
                                                            </Text>
                                                        )}
                                                    </Td>
                                                    <Td isActionCell>
                                                        <ActionsColumn items={getRowActions(task)} />
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </StackItem>

                                <StackItem>
                                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                                        <FlexItem>
                                            <TextContent>
                                                <Text component={TextVariants.small}>
                                                    Showing {startIndex + 1} - {Math.min(endIndex, filteredData.length)} of {filteredData.length}
                                                </Text>
                                            </TextContent>
                                        </FlexItem>
                                        <FlexItem>
                                            <Pagination
                                                itemCount={filteredData.length}
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
                                        </FlexItem>
                                    </Flex>
                                </StackItem>
                            </Stack>
                        </CardBody>
                    </Card>
                </StackItem>
            </Stack>
        </PageSection>
    );
}; 