import * as React from 'react';
import {
    Backdrop,
    Button,
    Divider,
    Flex,
    FlexItem,
    FormGroup,
    MenuToggle,
    MenuToggleElement,
    Modal,
    ModalVariant,
    Page,
    PageSection,
    PageSectionVariants,
    Select,
    SelectList,
    SelectOption,
    SelectOptionProps,
    Text,
    TextInput,
    TextInputGroup,
    TextInputGroupMain,
    TextInputGroupUtilities,
    Title,
    Tooltip,
} from '@patternfly/react-core';
import { SearchIcon, TimesIcon, TrashIcon, UndoIcon } from '@patternfly/react-icons';
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
    isNew?: boolean;
};

const SELECTED_HOST_COUNT = 5;
const NO_RESULTS = 'no-results';
const CREATE_GLOBAL_PARAMETER = 'create-global-parameter';
const NO_CHANGE = 'No change';
const DELETE_VALUE = 'DELETE';
const BOOLEAN_OPTIONS = ['true', 'false'];
const PARAMETER_TYPES: ParameterType[] = ['boolean', 'string', 'integer'];

const ALL_PARAMETERS: HostParameter[] = [
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

interface ParameterTypeaheadProps {
    availableParameters: HostParameter[];
    onSelect: (parameterId: string) => void;
    onCreateNew: () => void;
}

const ParameterTypeahead: React.FunctionComponent<ParameterTypeaheadProps> = ({
    availableParameters,
    onSelect,
    onCreateNew,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [focusedItemIndex, setFocusedItemIndex] = React.useState<number | null>(null);
    const [activeItemId, setActiveItemId] = React.useState<string | null>(null);
    const textInputRef = React.useRef<HTMLInputElement>(null);

    const createItemId = (value: string) => `parameter-typeahead-${value}`;

    const selectOptions = React.useMemo(() => {
        const createOption: SelectOptionProps = {
            value: CREATE_GLOBAL_PARAMETER,
            children: 'Create global parameter',
            className: 'pf-m-action',
        };

        let nextOptions: SelectOptionProps[] = availableParameters.map((parameter) => ({
            value: parameter.id,
            children: `${parameter.name} (${parameter.type})`,
        }));

        if (inputValue.trim()) {
            const query = inputValue.trim().toLowerCase();
            const matchesCreate = 'create global parameter'.includes(query);
            nextOptions = nextOptions.filter((option) =>
                String(option.children).toLowerCase().includes(query)
            );

            if (matchesCreate) {
                nextOptions = [...nextOptions, createOption];
            }

            if (nextOptions.length === 0) {
                nextOptions = [
                    {
                        isAriaDisabled: true,
                        children: `No results found for "${inputValue}"`,
                        value: NO_RESULTS,
                    },
                ];
            }
        } else {
            nextOptions = [...nextOptions, createOption];
        }

        return nextOptions;
    }, [availableParameters, inputValue]);

    React.useEffect(() => {
        if (inputValue.trim()) {
            setIsOpen(true);
        }
    }, [inputValue]);

    const resetActiveAndFocusedItem = () => {
        setFocusedItemIndex(null);
        setActiveItemId(null);
    };

    const closeMenu = () => {
        setIsOpen(false);
        resetActiveAndFocusedItem();
    };

    const setActiveAndFocusedItem = (itemIndex: number) => {
        setFocusedItemIndex(itemIndex);
        const focusedItem = selectOptions[itemIndex];
        if (focusedItem?.value) {
            setActiveItemId(createItemId(String(focusedItem.value)));
        }
    };

    const onInputClick = () => {
        if (!isOpen) {
            setIsOpen(true);
        } else if (!inputValue) {
            closeMenu();
        }
    };

    const selectParameter = (value: string | number) => {
        const id = String(value);
        if (id === NO_RESULTS) {
            return;
        }
        if (id === CREATE_GLOBAL_PARAMETER) {
            onCreateNew();
        } else {
            onSelect(id);
        }
        setInputValue('');
        closeMenu();
        textInputRef.current?.focus();
    };

    const onSelectOption = (
        _event: React.MouseEvent<Element, MouseEvent> | undefined,
        value: string | number | undefined
    ) => {
        if (value !== undefined) {
            selectParameter(value);
        }
    };

    const onTextInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setInputValue(value);
        resetActiveAndFocusedItem();
    };

    const handleMenuArrowKeys = (key: string) => {
        let indexToFocus = 0;
        if (selectOptions.every((option) => option.isAriaDisabled)) {
            return;
        }

        if (key === 'ArrowUp') {
            if (focusedItemIndex === null || focusedItemIndex === 0) {
                indexToFocus = selectOptions.length - 1;
            } else {
                indexToFocus = focusedItemIndex - 1;
            }
            while (selectOptions[indexToFocus]?.isAriaDisabled) {
                indexToFocus = indexToFocus === 0 ? selectOptions.length - 1 : indexToFocus - 1;
            }
        }

        if (key === 'ArrowDown') {
            if (focusedItemIndex === null || focusedItemIndex === selectOptions.length - 1) {
                indexToFocus = 0;
            } else {
                indexToFocus = focusedItemIndex + 1;
            }
            while (selectOptions[indexToFocus]?.isAriaDisabled) {
                indexToFocus = indexToFocus === selectOptions.length - 1 ? 0 : indexToFocus + 1;
            }
        }

        setActiveAndFocusedItem(indexToFocus);
    };

    const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const enabledCount = selectOptions.filter((option) => !option.isAriaDisabled).length;
        if (enabledCount === 0) {
            return;
        }

        if (event.key === 'Enter' && focusedItemIndex !== null) {
            const option = selectOptions[focusedItemIndex];
            if (option?.value && !option.isAriaDisabled) {
                selectParameter(String(option.value));
            }
            return;
        }

        if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key) && !isOpen) {
            setIsOpen(true);
        }

        if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
            event.preventDefault();
            handleMenuArrowKeys(event.key);
        }
    };

    const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
            ref={toggleRef}
            variant="typeahead"
            onClick={() => setIsOpen(!isOpen)}
            isExpanded={isOpen}
            isFullWidth
            aria-label="Parameters"
        >
            <TextInputGroup isPlain>
                <TextInputGroupMain
                    value={inputValue}
                    onClick={onInputClick}
                    onChange={onTextInputChange}
                    onKeyDown={onInputKeyDown}
                    id="parameter-typeahead-input"
                    autoComplete="off"
                    innerRef={textInputRef}
                    placeholder="Select a parameter to manage"
                    icon={<SearchIcon />}
                    {...(activeItemId && { 'aria-activedescendant': activeItemId })}
                    role="combobox"
                    isExpanded={isOpen}
                    aria-controls="parameter-typeahead-listbox"
                />
                <TextInputGroupUtilities
                    {...(!inputValue ? { style: { display: 'none' } } : {})}
                >
                    <Button
                        variant="plain"
                        onClick={() => {
                            setInputValue('');
                            resetActiveAndFocusedItem();
                            textInputRef.current?.focus();
                        }}
                        aria-label="Clear parameter search"
                    >
                        <TimesIcon aria-hidden />
                    </Button>
                </TextInputGroupUtilities>
            </TextInputGroup>
        </MenuToggle>
    );

    return (
        <Select
            id="parameter-typeahead"
            isOpen={isOpen}
            selected={undefined}
            onSelect={onSelectOption}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    closeMenu();
                }
            }}
            maxMenuHeight="200px"
            isScrollable
            popperProps={{ appendTo: () => document.body }}
            toggle={toggle}
        >
            <SelectList isAriaMultiselectable={false} id="parameter-typeahead-listbox">
                {selectOptions.map((option, index) => (
                    <React.Fragment key={option.value || option.children}>
                        {option.value === CREATE_GLOBAL_PARAMETER && <Divider component="li" />}
                        <SelectOption
                            isFocused={focusedItemIndex === index}
                            className={option.className}
                            id={createItemId(String(option.value))}
                            {...option}
                            ref={null}
                        />
                    </React.Fragment>
                ))}
            </SelectList>
        </Select>
    );
};

let nextNewParameterId = 0;

const createNewParameter = (): HostParameter => ({
    id: `new-parameter-${++nextNewParameterId}`,
    name: '',
    type: 'string',
    value: '',
    hostCount: 0,
    isNew: true,
});

export const EditParametersV2: React.FunctionComponent = () => {
    useDocumentTitle('PatternFly Seed | Experiments | Edit parameters v2');
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = React.useState(true);
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [newParameters, setNewParameters] = React.useState<HostParameter[]>([]);
    const [draftValues, setDraftValues] = React.useState<Record<string, string>>({});
    const [openBooleanId, setOpenBooleanId] = React.useState<string | null>(null);
    const [openTypeId, setOpenTypeId] = React.useState<string | null>(null);

    const parameterById = React.useMemo(
        () => Object.fromEntries(ALL_PARAMETERS.map((parameter) => [parameter.id, parameter])),
        []
    );

    const selectedParameters = [
        ...selectedIds.map((id) => parameterById[id]).filter(Boolean),
        ...newParameters,
    ] as HostParameter[];

    const availableParameters = ALL_PARAMETERS.filter(
        (parameter) => !selectedIds.includes(parameter.id)
    );

    const getDisplayValue = (parameter: HostParameter) => {
        if (parameter.isNew) {
            return draftValues[parameter.id] ?? parameter.value;
        }
        return draftValues[parameter.id] ?? NO_CHANGE;
    };

    const isChanged = (parameter: HostParameter) => {
        if (parameter.isNew) {
            const name = draftValues[`${parameter.id}__name`] ?? parameter.name;
            const type = (draftValues[`${parameter.id}__type`] ?? parameter.type) as ParameterType;
            const value = getDisplayValue(parameter);
            return name.trim().length > 0 && value.trim().length > 0 && PARAMETER_TYPES.includes(type);
        }
        return draftValues[parameter.id] !== undefined && draftValues[parameter.id] !== NO_CHANGE;
    };

    const hasPendingEdits = selectedParameters.some((parameter) => isChanged(parameter));

    const handleClose = () => {
        setIsModalOpen(false);
        navigate(-1);
    };

    const handleSelectParameter = (parameterId: string) => {
        if (!parameterById[parameterId] || selectedIds.includes(parameterId)) {
            return;
        }
        setSelectedIds((current) => [...current, parameterId]);
    };

    const handleCreateNewParameter = () => {
        setNewParameters((current) => [...current, createNewParameter()]);
    };

    const handleRemove = (parameter: HostParameter) => {
        if (parameter.isNew) {
            setNewParameters((current) => current.filter((entry) => entry.id !== parameter.id));
        } else {
            setSelectedIds((current) => current.filter((id) => id !== parameter.id));
        }
        setDraftValues((current) => {
            const next = { ...current };
            delete next[parameter.id];
            delete next[`${parameter.id}__name`];
            delete next[`${parameter.id}__type`];
            return next;
        });
        if (openBooleanId === parameter.id) {
            setOpenBooleanId(null);
        }
        if (openTypeId === parameter.id) {
            setOpenTypeId(null);
        }
    };

    const getParameterName = (parameter: HostParameter) =>
        draftValues[`${parameter.id}__name`] ?? parameter.name;

    const getParameterType = (parameter: HostParameter): ParameterType =>
        (draftValues[`${parameter.id}__type`] ?? parameter.type) as ParameterType;

    const handleNameChange = (parameter: HostParameter, nextName: string) => {
        setDraftValues((current) => ({
            ...current,
            [`${parameter.id}__name`]: nextName,
        }));
    };

    const handleTypeChange = (parameter: HostParameter, nextType: ParameterType) => {
        setDraftValues((current) => {
            const next = { ...current, [`${parameter.id}__type`]: nextType };
            const currentValue = current[parameter.id] ?? parameter.value;
            if (nextType === 'boolean' && !BOOLEAN_OPTIONS.includes(currentValue)) {
                next[parameter.id] = 'false';
            }
            return next;
        });
        setOpenTypeId(null);
    };

    const handleValueChange = (parameter: HostParameter, nextValue: string) => {
        setDraftValues((current) => {
            const next = { ...current };
            if (!nextValue || nextValue === NO_CHANGE) {
                delete next[parameter.id];
            } else {
                next[parameter.id] = nextValue;
            }
            return next;
        });
    };

    const handleReset = (parameter: HostParameter) => {
        setDraftValues((current) => {
            const next = { ...current };
            delete next[parameter.id];
            return next;
        });
    };

    const handleDeleteParameter = (parameter: HostParameter) => {
        setDraftValues((current) => ({ ...current, [parameter.id]: DELETE_VALUE }));
        if (openBooleanId === parameter.id) {
            setOpenBooleanId(null);
        }
    };

    const handleSave = () => {
        if (!hasPendingEdits) {
            return;
        }
        console.log(
            'Save parameter edits',
            selectedParameters
                .filter((parameter) => isChanged(parameter))
                .map((parameter) => ({
                    id: parameter.id,
                    isNew: parameter.isNew ?? false,
                    name: getParameterName(parameter),
                    type: getParameterType(parameter),
                    value: getDisplayValue(parameter),
                }))
        );
        handleClose();
    };

    const renderTypeField = (parameter: HostParameter) => {
        const parameterType = getParameterType(parameter);

        if (!parameter.isNew) {
            return (
                <span title={parameterType}>{parameterType}</span>
            );
        }

        return (
            <Select
                selected={parameterType}
                onSelect={(_event, value) => handleTypeChange(parameter, value as ParameterType)}
                isOpen={openTypeId === parameter.id}
                onOpenChange={(isOpen) => setOpenTypeId(isOpen ? parameter.id : null)}
                toggle={(toggleRef) => (
                    <MenuToggle
                        ref={toggleRef}
                        onClick={() =>
                            setOpenTypeId((current) => (current === parameter.id ? null : parameter.id))
                        }
                        isExpanded={openTypeId === parameter.id}
                        isFullWidth
                    >
                        {parameterType}
                    </MenuToggle>
                )}
            >
                <SelectList>
                    {PARAMETER_TYPES.map((type) => (
                        <SelectOption key={type} value={type}>
                            {type}
                        </SelectOption>
                    ))}
                </SelectList>
            </Select>
        );
    };

    const renderValueField = (parameter: HostParameter) => {
        const parameterType = getParameterType(parameter);
        const displayValue = getDisplayValue(parameter);
        const isMarkedForDelete = displayValue === DELETE_VALUE;

        if (parameterType === 'boolean' && !isMarkedForDelete) {
            return (
                <Select
                    selected={displayValue}
                    onSelect={(_event, value) => {
                        handleValueChange(parameter, String(value));
                        setOpenBooleanId(null);
                    }}
                    isOpen={openBooleanId === parameter.id}
                    onOpenChange={(isOpen) => setOpenBooleanId(isOpen ? parameter.id : null)}
                    toggle={(toggleRef) => (
                        <MenuToggle
                            ref={toggleRef}
                            onClick={() =>
                                setOpenBooleanId((current) =>
                                    current === parameter.id ? null : parameter.id
                                )
                            }
                            isExpanded={openBooleanId === parameter.id}
                            style={{ width: '100%' }}
                        >
                            {displayValue}
                        </MenuToggle>
                    )}
                >
                    <SelectList>
                        {!parameter.isNew && <SelectOption value={NO_CHANGE}>{NO_CHANGE}</SelectOption>}
                        {BOOLEAN_OPTIONS.map((option) => (
                            <SelectOption key={option} value={option}>
                                {option}
                            </SelectOption>
                        ))}
                    </SelectList>
                </Select>
            );
        }

        return (
            <TextInput
                id={`parameter-v2-value-${parameter.id}`}
                value={displayValue}
                type={parameterType === 'integer' ? 'number' : 'text'}
                readOnlyVariant={isMarkedForDelete ? 'default' : undefined}
                placeholder={parameter.isNew ? 'Enter a value' : undefined}
                onFocus={(event) => {
                    if (!parameter.isNew && !isChanged(parameter) && !isMarkedForDelete) {
                        event.currentTarget.select();
                    }
                }}
                onChange={(_event, value) => {
                    if (isMarkedForDelete) {
                        return;
                    }
                    if (!parameter.isNew && value === NO_CHANGE) {
                        handleReset(parameter);
                        return;
                    }
                    handleValueChange(parameter, value);
                }}
                aria-label={`Value for ${getParameterName(parameter) || 'new parameter'}`}
            />
        );
    };

    return (
        <Page>
            <PageSection variant={PageSectionVariants.light}>
                <Title headingLevel="h1" size="2xl">
                    Edit parameters v2
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
                    Edit global parameters for{' '}
                    <Text component="strong">{SELECTED_HOST_COUNT} selected hosts</Text>. All parameters are listed
                    below. You can also add new and delete parameters for selected hosts.
                </Text>

                <FormGroup
                    label="Parameters"
                    fieldId="parameter-typeahead-input"
                    style={{ marginTop: 'var(--pf-v5-global--spacer--md, 16px)' }}
                >
                    <ParameterTypeahead
                        availableParameters={availableParameters}
                        onSelect={handleSelectParameter}
                        onCreateNew={handleCreateNewParameter}
                    />
                    <Button
                        variant="link"
                        isInline
                        onClick={handleCreateNewParameter}
                        style={{ marginTop: 'var(--pf-v5-global--spacer--sm, 8px)' }}
                    >
                        Create global parameter
                    </Button>
                </FormGroup>

                <div style={{ marginTop: 'var(--pf-v5-global--spacer--md, 16px)', maxWidth: '100%' }}>
                    {selectedParameters.length > 0 && (
                        <Table
                            aria-label="Selected parameters"
                            variant="compact"
                            style={{ tableLayout: 'fixed', width: '100%' }}
                        >
                            <Thead>
                                <Tr>
                                    <Th style={{ width: '24%' }}>Name</Th>
                                    <Th style={{ width: '18%' }}>Type</Th>
                                    <Th style={{ width: '30%' }}>Value</Th>
                                    <Th style={{ width: '8%' }}>Hosts</Th>
                                    <Th screenReaderText="Actions" style={{ width: '20%' }} />
                                </Tr>
                            </Thead>
                            <Tbody>
                                {selectedParameters.map((parameter) => {
                                    const parameterName = getParameterName(parameter);

                                    return (
                                        <Tr key={parameter.id}>
                                            <Td dataLabel="Name" modifier="truncate">
                                                {parameter.isNew ? (
                                                    <TextInput
                                                        id={`parameter-v2-name-${parameter.id}`}
                                                        value={parameterName}
                                                        type="text"
                                                        placeholder="Enter parameter name"
                                                        onChange={(_event, value) =>
                                                            handleNameChange(parameter, value)
                                                        }
                                                        aria-label="Parameter name"
                                                    />
                                                ) : (
                                                    <span title={parameterName}>{parameterName}</span>
                                                )}
                                            </Td>
                                            <Td dataLabel="Type">
                                                {renderTypeField(parameter)}
                                            </Td>
                                            <Td dataLabel="Value">{renderValueField(parameter)}</Td>
                                            <Td dataLabel="Hosts">{parameter.hostCount}</Td>
                                            <Td isActionCell>
                                                <Flex
                                                    alignItems={{ default: 'alignItemsCenter' }}
                                                    spaceItems={{ default: 'spaceItemsSm' }}
                                                    style={{ flexWrap: 'nowrap', whiteSpace: 'nowrap' }}
                                                >
                                                    {!parameter.isNew && isChanged(parameter) && (
                                                        <FlexItem>
                                                            <Tooltip content="Reset">
                                                                <Button
                                                                    variant="plain"
                                                                    aria-label={`Reset ${parameterName}`}
                                                                    onClick={() => handleReset(parameter)}
                                                                >
                                                                    <UndoIcon />
                                                                </Button>
                                                            </Tooltip>
                                                        </FlexItem>
                                                    )}
                                                    {!parameter.isNew && (
                                                        <FlexItem>
                                                            <Tooltip content="Delete parameter from these hosts">
                                                                <Button
                                                                    variant="plain"
                                                                    aria-label={`Delete ${parameterName} from these hosts`}
                                                                    onClick={() => handleDeleteParameter(parameter)}
                                                                    isDisabled={
                                                                        getDisplayValue(parameter) === DELETE_VALUE
                                                                    }
                                                                >
                                                                    <TrashIcon />
                                                                </Button>
                                                            </Tooltip>
                                                        </FlexItem>
                                                    )}
                                                    <FlexItem>
                                                        <Tooltip content="Remove">
                                                            <Button
                                                                variant="plain"
                                                                aria-label={`Remove ${parameterName || 'new parameter'}`}
                                                                onClick={() => handleRemove(parameter)}
                                                            >
                                                                <TimesIcon />
                                                            </Button>
                                                        </Tooltip>
                                                    </FlexItem>
                                                </Flex>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    )}
                </div>
            </Modal>
        </Page>
    );
};
