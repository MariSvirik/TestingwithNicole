import * as React from 'react';
import {
    Backdrop,
    Button,
    MenuToggle,
    Modal,
    ModalVariant,
    Page,
    PageSection,
    PageSectionVariants,
    Pagination,
    PaginationVariant,
    SearchInput,
    Select,
    SelectList,
    SelectOption,
    Text,
    TextInput,
    Title,
    ToggleGroup,
    ToggleGroupItem,
    Toolbar,
    ToolbarContent,
    ToolbarItem,
    Tooltip,
} from '@patternfly/react-core';
import {
    CheckIcon,
    PencilAltIcon,
    SortAlphaDownIcon,
    SortAlphaUpIcon,
    TimesIcon,
    UndoIcon,
} from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

type ParameterType = 'boolean' | 'string' | 'integer';

type HostParameter = {
    id: string;
    name: string;
    type: ParameterType;
    value: string;
    hostCount: number;
};

type FilterView = 'all' | 'edited';

const SELECTED_HOST_COUNT = 5;

const INITIAL_PARAMETERS: HostParameter[] = [
    { id: 'ansible_roles_check_mode', name: 'ansible_roles_check_mode', type: 'boolean', value: 'false', hostCount: 5 },
    { id: 'demo', name: 'Demo', type: 'boolean', value: 'true', hostCount: 3 },
    { id: 'disable-firewall', name: 'disable-firewall', type: 'boolean', value: 'true', hostCount: 2 },
    { id: 'host_registration', name: 'host_registration', type: 'string', value: 'foreman.example.com', hostCount: 4 },
    { id: 'package_profile', name: 'package_profile', type: 'string', value: 'minimal', hostCount: 1 },
    { id: 'puppet_environment', name: 'puppet_environment', type: 'string', value: 'production', hostCount: 5 },
    { id: 'remote_execution', name: 'remote_execution', type: 'boolean', value: 'true', hostCount: 3 },
    { id: 'subscription_status', name: 'subscription_status', type: 'string', value: 'active', hostCount: 2 },
    { id: 'time_zone', name: 'time_zone', type: 'string', value: 'UTC', hostCount: 4 },
    { id: 'virt_who_enabled', name: 'virt_who_enabled', type: 'boolean', value: 'false', hostCount: 1 },
];

type SortDirection = 'asc' | 'desc';

export const EditParameters: React.FunctionComponent = () => {
    useDocumentTitle('PatternFly Seed | Experiments | Edit parameters');
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = React.useState(true);
    const [parameters, setParameters] = React.useState<HostParameter[]>(INITIAL_PARAMETERS);
    const [searchValue, setSearchValue] = React.useState('');
    const [filterView, setFilterView] = React.useState<FilterView>('all');
    const [sortDirection, setSortDirection] = React.useState<SortDirection>('asc');
    const [editingParameterId, setEditingParameterId] = React.useState<string | null>(null);
    const [draftValue, setDraftValue] = React.useState('');
    const [editBaseline, setEditBaseline] = React.useState('');
    const [pendingEdits, setPendingEdits] = React.useState<Record<string, string>>({});
    const [isBooleanValueOpen, setIsBooleanValueOpen] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(5);

    const hasPendingEdits = Object.keys(pendingEdits).length > 0;

    const setPendingValue = (parameterId: string, originalValue: string, nextValue: string) => {
        setPendingEdits((current) => {
            const next = { ...current };
            if (nextValue === originalValue) {
                delete next[parameterId];
            } else {
                next[parameterId] = nextValue;
            }
            return next;
        });
    };

    const updateDraftValue = (parameter: HostParameter, nextValue: string) => {
        setDraftValue(nextValue);
        setPendingValue(parameter.id, parameter.value, nextValue);
    };

    const filteredParameters = React.useMemo(() => {
        const query = searchValue.trim().toLowerCase();
        let filtered = parameters;

        if (filterView === 'edited') {
            filtered = filtered.filter((parameter) => parameter.id in pendingEdits);
        }

        if (query) {
            filtered = filtered.filter(
                (parameter) =>
                    parameter.name.toLowerCase().includes(query) ||
                    parameter.type.toLowerCase().includes(query) ||
                    parameter.value.toLowerCase().includes(query) ||
                    (pendingEdits[parameter.id] ?? '').toLowerCase().includes(query)
            );
        }

        return [...filtered].sort((left, right) => {
            const comparison = left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [parameters, searchValue, sortDirection, filterView, pendingEdits]);

    const itemCount = filteredParameters.length;
    const safePage = Math.min(page, Math.max(1, Math.ceil(itemCount / perPage) || 1));
    const paginatedParameters = filteredParameters.slice((safePage - 1) * perPage, safePage * perPage);

    React.useEffect(() => {
        setPage(1);
    }, [searchValue, sortDirection, filterView]);

    const handleClose = () => {
        setIsModalOpen(false);
        navigate(-1);
    };

    const startEditing = (parameter: HostParameter) => {
        const baseline = pendingEdits[parameter.id] ?? parameter.value;
        setEditingParameterId(parameter.id);
        setEditBaseline(baseline);
        setDraftValue(baseline || parameter.value);
        setIsBooleanValueOpen(false);
    };

    const confirmEditing = (parameter: HostParameter) => {
        setPendingValue(parameter.id, parameter.value, draftValue);
        setEditingParameterId(null);
        setIsBooleanValueOpen(false);
    };

    const cancelEditing = (parameter: HostParameter) => {
        setPendingValue(parameter.id, parameter.value, editBaseline);
        setEditingParameterId(null);
        setIsBooleanValueOpen(false);
    };

    const handleReset = (parameter: HostParameter) => {
        setPendingValue(parameter.id, parameter.value, parameter.value);
        if (editingParameterId === parameter.id) {
            setDraftValue(parameter.value);
            setEditBaseline(parameter.value);
        }
    };

    const handleSave = () => {
        if (!hasPendingEdits) {
            return;
        }

        setParameters((current) =>
            current.map((parameter) =>
                parameter.id in pendingEdits ? { ...parameter, value: pendingEdits[parameter.id] } : parameter
            )
        );
        handleClose();
    };

    const renderInlineValueEditor = (parameter: HostParameter) => {
        if (parameter.type === 'boolean') {
            return (
                <Select
                    selected={draftValue}
                    onSelect={(_event, value) => {
                        updateDraftValue(parameter, String(value));
                        setIsBooleanValueOpen(false);
                    }}
                    isOpen={isBooleanValueOpen}
                    onOpenChange={setIsBooleanValueOpen}
                    toggle={(toggleRef) => (
                        <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsBooleanValueOpen(!isBooleanValueOpen)}
                            isExpanded={isBooleanValueOpen}
                            style={{ width: '100%' }}
                        >
                            {draftValue}
                        </MenuToggle>
                    )}
                >
                    <SelectList>
                        <SelectOption value="true">true</SelectOption>
                        <SelectOption value="false">false</SelectOption>
                    </SelectList>
                </Select>
            );
        }

        return (
            <TextInput
                id={`parameter-value-${parameter.id}`}
                value={draftValue}
                type={parameter.type === 'integer' ? 'number' : 'text'}
                onChange={(_event, value) => {
                    updateDraftValue(parameter, value);
                }}
                aria-label={`Value for ${parameter.name}`}
                autoFocus
            />
        );
    };

    const renderRowActions = (parameter: HostParameter, isEditing: boolean, rowIsChanged: boolean) => {
        const hasSessionChanges = isEditing && draftValue !== editBaseline;

        if (isEditing) {
            return (
                <div
                    className="pf-v5-c-inline-edit__group pf-m-icon-group pf-m-action-group"
                    style={{ flexWrap: 'nowrap', whiteSpace: 'nowrap' }}
                >
                    <div
                        className={`pf-v5-c-inline-edit__action${hasSessionChanges ? ' pf-m-valid' : ''}`}
                    >
                        <Tooltip content="Confirm">
                            <Button
                                variant="plain"
                                aria-label={`Confirm edits for ${parameter.name}`}
                                onClick={() => confirmEditing(parameter)}
                            >
                                <CheckIcon />
                            </Button>
                        </Tooltip>
                    </div>
                    <div className="pf-v5-c-inline-edit__action">
                        <Tooltip content="Cancel">
                            <Button
                                variant="plain"
                                aria-label={`Cancel edits for ${parameter.name}`}
                                onClick={() => cancelEditing(parameter)}
                            >
                                <TimesIcon />
                            </Button>
                        </Tooltip>
                    </div>
                    {rowIsChanged && (
                        <div className="pf-v5-c-inline-edit__action">
                            <Tooltip content="Reset">
                                <Button
                                    variant="plain"
                                    aria-label={`Reset ${parameter.name} to original value`}
                                    onClick={() => handleReset(parameter)}
                                >
                                    <UndoIcon />
                                </Button>
                            </Tooltip>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div
                className="pf-v5-c-inline-edit__group pf-m-icon-group"
                style={{ flexWrap: 'nowrap', whiteSpace: 'nowrap' }}
            >
                <div className="pf-v5-c-inline-edit__action pf-m-enable-editable">
                    <Tooltip content="Edit">
                        <Button
                            variant="plain"
                            aria-label={`Edit ${parameter.name}`}
                            onClick={() => startEditing(parameter)}
                        >
                            <PencilAltIcon />
                        </Button>
                    </Tooltip>
                </div>
                {rowIsChanged && (
                    <div className="pf-v5-c-inline-edit__action pf-m-enable-editable">
                        <Tooltip content="Reset">
                            <Button
                                variant="plain"
                                aria-label={`Reset ${parameter.name} to original value`}
                                onClick={() => handleReset(parameter)}
                            >
                                <UndoIcon />
                            </Button>
                        </Tooltip>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Page>
            <PageSection variant={PageSectionVariants.light}>
                <Title headingLevel="h1" size="2xl">
                    Edit parameters
                </Title>
                <Text component="p">
                    Open the modal to edit host parameters for selected hosts.
                </Text>
            </PageSection>

            <Backdrop open={isModalOpen} />

            <Modal
                variant={ModalVariant.medium}
                title="Edit parameters"
                isOpen={isModalOpen}
                onClose={handleClose}
                actions={[
                    <Button key="save" variant="primary" onClick={handleSave} isDisabled={!hasPendingEdits}>
                        Save
                    </Button>,
                    <Button key="cancel" variant="link" onClick={handleClose}>
                        Cancel
                    </Button>,
                ]}
            >
                <Text component="p">
                    Edit parameters for{' '}
                    <strong>{SELECTED_HOST_COUNT} selected hosts</strong>. All parameters assigned to
                    these hosts are listed below. Changes will apply only to hosts that currently have that parameter
                    assigned.
                </Text>

                <Toolbar style={{ marginTop: 'var(--pf-v5-global--spacer--md, 16px)' }}>
                    <ToolbarContent>
                        <ToolbarItem>
                            <SearchInput
                                placeholder="Search parameters"
                                value={searchValue}
                                onChange={(_event, value) => setSearchValue(value)}
                                onClear={() => setSearchValue('')}
                                aria-label="Search parameters"
                            />
                        </ToolbarItem>
                        <ToolbarItem>
                            <ToggleGroup aria-label="Filter parameters by edit status">
                                <ToggleGroupItem
                                    text="All"
                                    buttonId="parameters-filter-all"
                                    isSelected={filterView === 'all'}
                                    onChange={() => setFilterView('all')}
                                />
                                <ToggleGroupItem
                                    text="Edited"
                                    buttonId="parameters-filter-edited"
                                    isSelected={filterView === 'edited'}
                                    onChange={() => setFilterView('edited')}
                                />
                            </ToggleGroup>
                        </ToolbarItem>
                        <ToolbarItem align={{ default: 'alignRight' }}>
                            <Pagination
                                itemCount={itemCount}
                                perPage={perPage}
                                page={safePage}
                                onSetPage={(_event, nextPage) => setPage(nextPage)}
                                onPerPageSelect={(_event, nextPerPage) => {
                                    setPerPage(nextPerPage);
                                    setPage(1);
                                }}
                                variant={PaginationVariant.top}
                                isCompact
                                perPageOptions={[
                                    { title: '5', value: 5 },
                                    { title: '10', value: 10 },
                                ]}
                                ouiaId="edit-parameters-pagination-top"
                            />
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>

                <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
                    <Table
                        aria-label="Host parameters"
                        variant="compact"
                        style={{ tableLayout: 'fixed', width: '100%' }}
                    >
                        <Thead>
                            <Tr>
                                <Th style={{ width: '30%' }}>
                                    <Button
                                        variant="link"
                                        isInline
                                        icon={sortDirection === 'asc' ? <SortAlphaDownIcon /> : <SortAlphaUpIcon />}
                                        onClick={() =>
                                            setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
                                        }
                                    >
                                        Name
                                    </Button>
                                </Th>
                                <Th style={{ width: '12%' }}>Type</Th>
                                <Th style={{ width: '30%' }}>Value</Th>
                                <Th style={{ width: '10%' }}>Hosts</Th>
                                <Th screenReaderText="Actions" style={{ width: '18%' }} />
                            </Tr>
                        </Thead>
                        <Tbody>
                            {paginatedParameters.map((parameter) => {
                                const isEditing = editingParameterId === parameter.id;
                                const pendingValue = pendingEdits[parameter.id];
                                const rowIsChanged =
                                    pendingValue !== undefined ||
                                    (isEditing && draftValue !== parameter.value);

                                return (
                                    <Tr
                                        key={parameter.id}
                                        className={
                                            isEditing
                                                ? 'pf-v5-c-inline-edit pf-m-inline-editable'
                                                : 'pf-v5-c-inline-edit'
                                        }
                                    >
                                        <Td dataLabel="Name" modifier="truncate">
                                            <span title={parameter.name}>{parameter.name}</span>
                                        </Td>
                                        <Td dataLabel="Type" modifier="truncate">
                                            <span title={parameter.type}>{parameter.type}</span>
                                        </Td>
                                        <Td dataLabel="Value">
                                            {isEditing ? (
                                                <div style={{ display: 'block', width: '100%' }}>
                                                    {renderInlineValueEditor(parameter)}
                                                </div>
                                            ) : rowIsChanged && pendingValue !== undefined ? (
                                                <span
                                                    className="pf-v5-c-inline-edit__value"
                                                    title={pendingValue}
                                                >
                                                    {pendingValue}
                                                </span>
                                            ) : (
                                                <span className="pf-v5-c-inline-edit__value" title="No change">
                                                    No change
                                                </span>
                                            )}
                                        </Td>
                                        <Td dataLabel="Hosts">{parameter.hostCount}</Td>
                                        <Td isActionCell className="pf-v5-c-table__inline-edit-action">
                                            {renderRowActions(parameter, isEditing, rowIsChanged)}
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </div>

                <Pagination
                    itemCount={itemCount}
                    perPage={perPage}
                    page={safePage}
                    onSetPage={(_event, nextPage) => setPage(nextPage)}
                    onPerPageSelect={(_event, nextPerPage) => {
                        setPerPage(nextPerPage);
                        setPage(1);
                    }}
                    variant={PaginationVariant.bottom}
                    isCompact
                    perPageOptions={[
                        { title: '5', value: 5 },
                        { title: '10', value: 10 },
                    ]}
                    ouiaId="edit-parameters-pagination-bottom"
                />
            </Modal>
        </Page>
    );
};
