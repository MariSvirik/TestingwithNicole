import * as React from 'react';
import {
    Button,
    Card,
    CardBody,
    DualListSelector,
    DualListSelectorControl,
    DualListSelectorControlsWrapper,
    DualListSelectorList,
    DualListSelectorPane,
    DualListSelectorTree,
    DualListSelectorTreeItemData,
    FormGroup,
    InputGroup,
    InputGroupItem,
    Label,
    LabelGroup,
    Menu,
    MenuContent,
    MenuItem,
    MenuList,
    MenuToggle,
    MenuToggleElement,
    PageSection,
    SearchInput,
    Select,
    SelectList,
    SelectOption,
    SelectOptionProps,
    Stack,
    StackItem,
    Tab,
    TabContentBody,
    Tabs,
    TabTitleText,
    Text,
    TextContent,
    TextInputGroup,
    TextInputGroupMain,
    TextInputGroupUtilities,
    Title,
    Tooltip,
} from '@patternfly/react-core';
import {
    AngleDoubleLeftIcon,
    AngleDoubleRightIcon,
    AngleLeftIcon,
    AngleRightIcon,
    TimesIcon,
} from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

type Location = {
    id: string;
    name: string;
    parentId?: string;
    isInherited?: boolean;
};

const HOST_GROUP_TOOLTIP = 'This is used by host group';

const ALL_LOCATIONS: Location[] = [
    { id: 'default', name: 'Default Location', isInherited: true },
    { id: 'testing', name: 'testing' },
    { id: 'brno', name: 'Brno' },
    { id: 'prague', name: 'Prague' },
    { id: 'boston', name: 'Boston' },
    { id: 'london', name: 'London' },
    { id: 'london-area1', name: 'area1', parentId: 'london' },
    { id: 'london-area2', name: 'area2', parentId: 'london' },
    { id: 'london-area3', name: 'area3', parentId: 'london' },
];

const ALL_ORGANISATIONS: Location[] = [
    { id: 'default-org', name: 'Default Organization' },
    { id: 'demo', name: 'Demo' },
    { id: 'redhat', name: 'Red Hat' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'sales', name: 'Sales' },
    { id: 'support', name: 'Support' },
];

const NO_RESULTS = 'no-results';
const SELECT_ALL = 'select-all';
const LIST_MAX_HEIGHT = '280px';
const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const spacingXl = 'var(--pf-v5-global--spacer--xl, var(--pf-global--spacer--xl, 32px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';
const tabContentPadding = {
    paddingTop: spacingXl,
    paddingLeft: 0,
    paddingRight: 0,
};

type LocationPickerProps = {
    locations: Location[];
    selectedLocationIds: string[];
    onSelectedChange: (ids: string[]) => void;
};

const getInheritedIds = (locations: Location[]) =>
    locations.filter((location) => location.isInherited).map((location) => location.id);

const isInheritedLocation = (locations: Location[], id: string) =>
    locations.some((location) => location.id === id && location.isInherited);

const getDescendantIds = (locations: Location[], id: string): string[] =>
    locations
        .filter((location) => location.parentId === id)
        .flatMap((child) => [child.id, ...getDescendantIds(locations, child.id)]);

const withRequiredSelections = (locations: Location[], ids: string[]) => {
    const inheritedIds = getInheritedIds(locations);
    return [...inheritedIds, ...ids.filter((id) => !inheritedIds.includes(id))];
};

const toggleLocationSelection = (locations: Location[], selectedIds: string[], id: string) => {
    if (isInheritedLocation(locations, id)) {
        return withRequiredSelections(locations, selectedIds);
    }

    const idsToToggle = [id, ...getDescendantIds(locations, id)];
    if (selectedIds.includes(id)) {
        const idsToRemove = new Set(
            idsToToggle.filter((candidateId) => !isInheritedLocation(locations, candidateId))
        );
        return withRequiredSelections(
            locations,
            selectedIds.filter((selectedId) => !idsToRemove.has(selectedId))
        );
    }

    return withRequiredSelections(locations, [...selectedIds, ...idsToToggle]);
};

const ancestorMatchesQuery = (location: Location, query: string, locations: Location[]): boolean => {
    if (!query || !location.parentId) {
        return false;
    }
    const parent = locations.find((candidate) => candidate.id === location.parentId);
    if (!parent) {
        return false;
    }
    if (parent.name.toLowerCase().includes(query)) {
        return true;
    }
    return ancestorMatchesQuery(parent, query, locations);
};

const locationMatchesQuery = (location: Location, query: string, locations: Location[]): boolean => {
    if (!query) {
        return true;
    }
    if (location.name.toLowerCase().includes(query)) {
        return true;
    }
    if (
        locations.some(
            (child) => child.parentId === location.id && locationMatchesQuery(child, query, locations)
        )
    ) {
        return true;
    }
    return ancestorMatchesQuery(location, query, locations);
};

const flattenDualListTreeIds = (nodes: DualListSelectorTreeItemData[]): string[] =>
    nodes.flatMap((node) => [node.id, ...(node.children ? flattenDualListTreeIds(node.children) : [])]);

const buildDualListTree = (
    locations: Location[],
    paneIds: string[],
    checkedIds: string[],
    query = ''
): DualListSelectorTreeItemData[] => {
    const paneSet = new Set(paneIds);
    const normalizedQuery = query.trim().toLowerCase();

    const isVisible = (location: Location): boolean => {
        if (!paneSet.has(location.id)) {
            return false;
        }
        if (!normalizedQuery) {
            return true;
        }
        return (
            locationMatchesQuery(location, normalizedQuery, locations)
        );
    };

    const walk = (parentId: string | undefined): DualListSelectorTreeItemData[] =>
        locations
            .filter((location) => location.parentId === parentId)
            .flatMap((location) => {
                const children = walk(location.id);
                if (!isVisible(location)) {
                    return children;
                }
                return [
                    {
                        id: location.id,
                        text: location.name,
                        isChecked: checkedIds.includes(location.id),
                        defaultExpanded: true,
                        checkProps: {
                            'aria-label': location.isInherited
                                ? `${location.name}. ${HOST_GROUP_TOOLTIP}`
                                : `Select ${location.name}`,
                            disabled: Boolean(location.isInherited),
                        },
                        ...(children.length > 0 ? { children } : {}),
                    },
                ];
            });

    return walk(undefined);
};

const getAllSelectableLocationIds = (locations: Location[]) =>
    locations.filter((location) => !location.isInherited).map((location) => location.id);

const flattenLocationsForSelect = (locations: Location[]) => {
    const result: { id: string; name: string; depth: number }[] = [];
    const walk = (parentId: string | undefined, depth: number) => {
        locations
            .filter((location) => location.parentId === parentId)
            .forEach((location) => {
                result.push({ id: location.id, name: location.name, depth });
                walk(location.id, depth + 1);
            });
    };
    walk(undefined, 0);
    return result;
};

const getTreeItemIndentStyle = (depth: number): React.CSSProperties | undefined =>
    depth > 0
        ? {
              ['--pf-v5-c-menu__item--PaddingLeft' as string]: `calc(var(--pf-v5-global--spacer--md) + ${depth} * ${spacingL})`,
          }
        : undefined;

const getVisibleFlattenedLocations = (
    locations: Location[],
    visibleIds?: string[],
    query = ''
) => {
    const visibleSet = visibleIds ? new Set(visibleIds) : null;
    const normalizedQuery = query.trim().toLowerCase();

    return flattenLocationsForSelect(locations).filter((item) => {
        const location = locations.find((candidate) => candidate.id === item.id);
        if (!location) {
            return false;
        }
        if (visibleSet && !visibleSet.has(location.id)) {
            return false;
        }
        if (normalizedQuery && !locationMatchesQuery(location, normalizedQuery, locations)) {
            return false;
        }
        return true;
    });
};

const AssignedLocationLabel: React.FunctionComponent<{
    location: Location;
    onRemove?: (id: string) => void;
}> = ({ location, onRemove }) => {
    if (location.isInherited) {
        return (
            <Tooltip content={HOST_GROUP_TOOLTIP}>
                <span>
                    <Label color="grey">{location.name}</Label>
                </span>
            </Tooltip>
        );
    }

    return (
        <Label
            color="blue"
            onClose={onRemove ? () => onRemove(location.id) : undefined}
            closeBtnAriaLabel={`Remove ${location.name}`}
        >
            {location.name}
        </Label>
    );
};

type LocationTreeProps = {
    locations: Location[];
    checkedIds: string[];
    onCheckedChange: (ids: string[]) => void;
    ariaLabel: string;
    searchValue?: string;
    visibleIds?: string[];
    emptyMessage: string;
};

const LocationTree: React.FunctionComponent<LocationTreeProps> = ({
    locations,
    checkedIds,
    onCheckedChange,
    ariaLabel,
    searchValue = '',
    visibleIds,
    emptyMessage,
}) => {
    const items = React.useMemo(
        () => getVisibleFlattenedLocations(locations, visibleIds, searchValue),
        [locations, visibleIds, searchValue]
    );

    if (items.length === 0) {
        return <Text component="p">{emptyMessage}</Text>;
    }

    return (
        <Menu
            isPlain
            selected={checkedIds}
            onSelect={(_event, itemId) => {
                if (itemId === undefined || itemId === null) {
                    return;
                }
                onCheckedChange(toggleLocationSelection(locations, checkedIds, String(itemId)));
            }}
        >
            <MenuContent>
                <MenuList aria-label={ariaLabel}>
                    {items.map((item) => {
                        const location = locations.find((candidate) => candidate.id === item.id);
                        return (
                        <MenuItem
                            key={item.id}
                            itemId={item.id}
                            hasCheckbox
                            isSelected={checkedIds.includes(item.id)}
                            isDisabled={Boolean(location?.isInherited)}
                            style={getTreeItemIndentStyle(item.depth)}
                        >
                            {item.name}
                        </MenuItem>
                        );
                    })}
                </MenuList>
            </MenuContent>
        </Menu>
    );
};

const LocationMultiTypeahead: React.FunctionComponent<LocationPickerProps> = ({
    locations,
    selectedLocationIds,
    onSelectedChange,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [focusedItemIndex, setFocusedItemIndex] = React.useState<number | null>(null);
    const [activeItemId, setActiveItemId] = React.useState<string | null>(null);
    const textInputRef = React.useRef<HTMLInputElement>(null);

    const selectedLocations = locations.filter((location) => selectedLocationIds.includes(location.id));
    const placeholder = `${selectedLocationIds.length} location${selectedLocationIds.length === 1 ? '' : 's'} selected`;

    const createItemId = (value: string) => `location-typeahead-${value}`;

    const selectOptions = React.useMemo(() => {
        const flattened = flattenLocationsForSelect(locations);
        let nextOptions: SelectOptionProps[] = flattened.map((location) => ({
            value: location.id,
            children: location.name,
            style: getTreeItemIndentStyle(location.depth),
            isDisabled: Boolean(
                locations.find((candidate) => candidate.id === location.id)?.isInherited
            ),
        }));

        if (inputValue.trim()) {
            const query = inputValue.trim().toLowerCase();
            nextOptions = nextOptions.filter((option) => {
                const location = locations.find((item) => item.id === option.value);
                return location ? locationMatchesQuery(location, query, locations) : false;
            });

            if (nextOptions.length === 0) {
                nextOptions = [
                    {
                        isAriaDisabled: true,
                        children: `No results found for "${inputValue}"`,
                        value: NO_RESULTS,
                        hasCheckbox: false,
                    },
                ];
            }
        }

        if (nextOptions[0]?.value !== NO_RESULTS) {
            nextOptions = [
                {
                    value: SELECT_ALL,
                    children: 'Select all',
                },
                ...nextOptions,
            ];
        }

        return nextOptions;
    }, [inputValue, locations]);

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

    const handleMenuArrowKeys = (key: string) => {
        if (!isOpen) {
            setIsOpen(true);
        }

        if (selectOptions.every((option) => option.isDisabled || option.isAriaDisabled)) {
            return;
        }

        let indexToFocus = 0;

        if (key === 'ArrowUp') {
            indexToFocus =
                focusedItemIndex === null || focusedItemIndex === 0
                    ? selectOptions.length - 1
                    : focusedItemIndex - 1;

            while (selectOptions[indexToFocus]?.isDisabled || selectOptions[indexToFocus]?.isAriaDisabled) {
                indexToFocus = indexToFocus === 0 ? selectOptions.length - 1 : indexToFocus - 1;
            }
        }

        if (key === 'ArrowDown') {
            indexToFocus =
                focusedItemIndex === null || focusedItemIndex === selectOptions.length - 1
                    ? 0
                    : focusedItemIndex + 1;

            while (selectOptions[indexToFocus]?.isDisabled || selectOptions[indexToFocus]?.isAriaDisabled) {
                indexToFocus = indexToFocus === selectOptions.length - 1 ? 0 : indexToFocus + 1;
            }
        }

        setActiveAndFocusedItem(indexToFocus);
    };

    const allSelectableLocationIds = getAllSelectableLocationIds(locations);
    const areAllLocationsSelected =
        allSelectableLocationIds.length > 0 &&
        allSelectableLocationIds.every((id) => selectedLocationIds.includes(id));

    const onSelect = (value: string) => {
        if (!value || value === NO_RESULTS) {
            return;
        }

        if (value === SELECT_ALL || value === 'Select all') {
            onSelectedChange(
                areAllLocationsSelected
                    ? withRequiredSelections(locations, [])
                    : withRequiredSelections(
                          locations,
                          locations.map((location) => location.id)
                      )
            );
            textInputRef.current?.focus();
            return;
        }

        const nextSelected = toggleLocationSelection(locations, selectedLocationIds, value);

        onSelectedChange(nextSelected);
        textInputRef.current?.focus();
    };

    const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const focusedItem = focusedItemIndex !== null ? selectOptions[focusedItemIndex] : null;

        switch (event.key) {
            case 'Enter':
                if (
                    isOpen &&
                    focusedItem &&
                    focusedItem.value !== NO_RESULTS &&
                    !focusedItem.isAriaDisabled
                ) {
                    onSelect(String(focusedItem.value));
                }

                if (!isOpen) {
                    setIsOpen(true);
                }
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                event.preventDefault();
                handleMenuArrowKeys(event.key);
                break;
            default:
                break;
        }
    };

    const onToggleClick = () => {
        setIsOpen(!isOpen);
        textInputRef.current?.focus();
    };

    const onTextInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setInputValue(value);
        resetActiveAndFocusedItem();
    };

    const onClearButtonClick = () => {
        onSelectedChange(withRequiredSelections(locations, []));
        setInputValue('');
        resetActiveAndFocusedItem();
        textInputRef.current?.focus();
    };

    const removeLocation = (id: string) => {
        onSelectedChange(toggleLocationSelection(locations, selectedLocationIds, id));
    };

    const removableSelectedCount = selectedLocationIds.filter(
        (id) => !isInheritedLocation(locations, id)
    ).length;

    const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
            variant="typeahead"
            aria-label="Location multi typeahead menu toggle"
            onClick={onToggleClick}
            innerRef={toggleRef}
            isExpanded={isOpen}
            isFullWidth
        >
            <TextInputGroup isPlain>
                <TextInputGroupMain
                    value={inputValue}
                    onClick={onInputClick}
                    onChange={onTextInputChange}
                    onKeyDown={onInputKeyDown}
                    id="location-multi-typeahead-input"
                    autoComplete="off"
                    innerRef={textInputRef}
                    placeholder={placeholder}
                    {...(activeItemId ? { 'aria-activedescendant': activeItemId } : {})}
                    role="combobox"
                    isExpanded={isOpen}
                    aria-controls="location-multi-typeahead-listbox"
                />
                <TextInputGroupUtilities
                    {...(removableSelectedCount === 0 ? { style: { display: 'none' } } : {})}
                >
                    <Button variant="plain" onClick={onClearButtonClick} aria-label="Clear selected locations">
                        <TimesIcon aria-hidden />
                    </Button>
                </TextInputGroupUtilities>
            </TextInputGroup>
        </MenuToggle>
    );

    return (
        <Stack hasGutter>
            <StackItem>
                <Title headingLevel="h2" size="xl">
                    Assign locations
                </Title>
            </StackItem>
            <StackItem>
                <FormGroup
                    label="Select locations"
                    fieldId="location-multi-typeahead"
                    isRequired={false}
                    style={{ maxWidth: '400px' }}
                >
                    <Select
                        role="menu"
                        id="location-multi-typeahead"
                        isOpen={isOpen}
                        selected={selectedLocationIds}
                        onSelect={(_event, selection) => onSelect(String(selection))}
                        onOpenChange={(open) => {
                            if (!open) {
                                closeMenu();
                            }
                        }}
                        toggle={toggle}
                        variant="typeahead"
                        maxMenuHeight="360px"
                        isScrollable
                        popperProps={{ appendTo: () => document.body }}
                    >
                        <SelectList isAriaMultiselectable id="location-multi-typeahead-listbox">
                            {selectOptions.map((option, index) => (
                                <SelectOption
                                    {...(option.value !== NO_RESULTS ? { hasCheckbox: true } : {})}
                                    key={String(option.value)}
                                    isFocused={focusedItemIndex === index}
                                    id={createItemId(String(option.value))}
                                    {...option}
                                    isSelected={
                                        option.value === SELECT_ALL
                                            ? areAllLocationsSelected
                                            : selectedLocationIds.includes(String(option.value))
                                    }
                                    ref={null}
                                />
                            ))}
                        </SelectList>
                    </Select>
                </FormGroup>
            </StackItem>
            <StackItem>
                <Title
                    headingLevel="h3"
                    size="md"
                    style={{ marginBottom: spacingMd }}
                >
                    Assigned locations
                </Title>
                {selectedLocations.length === 0 ? (
                    <Text component="p">No locations assigned.</Text>
                ) : (
                    <LabelGroup aria-label="Assigned locations" numLabels={10}>
                        {selectedLocations.map((location) => (
                            <AssignedLocationLabel
                                key={location.id}
                                location={location}
                                onRemove={removeLocation}
                            />
                        ))}
                    </LabelGroup>
                )}
            </StackItem>
        </Stack>
    );
};

const LocationCheckboxList: React.FunctionComponent<LocationPickerProps> = ({
    locations,
    selectedLocationIds,
    onSelectedChange,
}) => {
    const [searchValue, setSearchValue] = React.useState('');
    const selectedLocations = locations.filter((location) => selectedLocationIds.includes(location.id));

    return (
        <Stack hasGutter>
            <StackItem>
                <FormGroup label="Selected locations" fieldId="checkbox-selected-locations">
                    {selectedLocations.length === 0 ? (
                        <Text component="p">No locations selected.</Text>
                    ) : (
                        <LabelGroup categoryName="Selected locations" numLabels={10}>
                            {selectedLocations.map((location) => (
                                <AssignedLocationLabel
                                    key={location.id}
                                    location={location}
                                    onRemove={(id) =>
                                        onSelectedChange(
                                            toggleLocationSelection(locations, selectedLocationIds, id)
                                        )
                                    }
                                />
                            ))}
                        </LabelGroup>
                    )}
                </FormGroup>
            </StackItem>
            <StackItem>
                <SearchInput
                    placeholder="Filter locations"
                    value={searchValue}
                    onChange={(_event, value) => setSearchValue(value)}
                    onClear={() => setSearchValue('')}
                    aria-label="Filter locations"
                />
            </StackItem>
            <StackItem>
                <Card isCompact>
                    <CardBody
                        style={{
                            maxHeight: LIST_MAX_HEIGHT,
                            overflowY: 'auto',
                        }}
                    >
                        <LocationTree
                            locations={locations}
                            checkedIds={selectedLocationIds}
                            onCheckedChange={onSelectedChange}
                            ariaLabel="Location tree"
                            searchValue={searchValue}
                            emptyMessage="No locations match the filter."
                        />
                    </CardBody>
                </Card>
            </StackItem>
        </Stack>
    );
};

const LocationTwoPanel: React.FunctionComponent<LocationPickerProps> = ({
    locations,
    selectedLocationIds,
    onSelectedChange,
}) => {
    const [availableFilter, setAvailableFilter] = React.useState('');
    const [chosenFilter, setChosenFilter] = React.useState('');
    const [checkedIds, setCheckedIds] = React.useState<string[]>([]);

    const availableOptions = React.useMemo(() => {
        const availableLocationIds = locations
            .filter((location) => !selectedLocationIds.includes(location.id))
            .map((location) => location.id);
        return buildDualListTree(locations, availableLocationIds, checkedIds, availableFilter);
    }, [locations, selectedLocationIds, checkedIds, availableFilter]);
    const chosenOptions = React.useMemo(
        () => buildDualListTree(locations, selectedLocationIds, checkedIds, chosenFilter),
        [locations, selectedLocationIds, checkedIds, chosenFilter]
    );

    const availableOptionIds = flattenDualListTreeIds(availableOptions);
    const chosenOptionIds = flattenDualListTreeIds(chosenOptions);
    const checkedAvailableIds = checkedIds.filter((id) => availableOptionIds.includes(id));
    const checkedChosenIds = checkedIds.filter(
        (id) => chosenOptionIds.includes(id) && !isInheritedLocation(locations, id)
    );
    const removableChosenIds = chosenOptionIds.filter((id) => !isInheritedLocation(locations, id));

    const onOptionCheck = (
        _event: React.MouseEvent | React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent,
        _isChecked: boolean,
        itemData: DualListSelectorTreeItemData
    ) => {
        if (isInheritedLocation(locations, itemData.id)) {
            return;
        }
        setCheckedIds((previousCheckedIds) => {
            const idsToToggle = [itemData.id, ...getDescendantIds(locations, itemData.id)];
            if (previousCheckedIds.includes(itemData.id)) {
                return previousCheckedIds.filter((id) => !idsToToggle.includes(id));
            }
            return [...previousCheckedIds, ...idsToToggle.filter((id) => !previousCheckedIds.includes(id))];
        });
    };

    const moveChecked = (toChosen: boolean) => {
        if (toChosen) {
            const idsToAdd = Array.from(
                new Set(
                    checkedAvailableIds.flatMap((id) => [id, ...getDescendantIds(locations, id)])
                ),
            );
            onSelectedChange(withRequiredSelections(locations, [...selectedLocationIds, ...idsToAdd]));
            setCheckedIds((previousCheckedIds) =>
                previousCheckedIds.filter((id) => !idsToAdd.includes(id))
            );
            return;
        }
        const idsToRemove = new Set(
            checkedChosenIds
                .flatMap((id) => [id, ...getDescendantIds(locations, id)])
                .filter((id) => !isInheritedLocation(locations, id))
        );
        onSelectedChange(
            withRequiredSelections(
                locations,
                selectedLocationIds.filter((id) => !idsToRemove.has(id))
            )
        );
        setCheckedIds((previousCheckedIds) => previousCheckedIds.filter((id) => !idsToRemove.has(id)));
    };

    const moveAll = (toChosen: boolean) => {
        if (toChosen) {
            onSelectedChange(withRequiredSelections(locations, locations.map((location) => location.id)));
        } else {
            onSelectedChange(withRequiredSelections(locations, []));
        }
        setCheckedIds([]);
    };

    const buildSearchInput = (isChosen: boolean) => (
        <SearchInput
            placeholder={isChosen ? 'Filter selected locations' : 'Filter available locations'}
            value={isChosen ? chosenFilter : availableFilter}
            onChange={(_event, value) => (isChosen ? setChosenFilter(value) : setAvailableFilter(value))}
            onClear={() => (isChosen ? setChosenFilter('') : setAvailableFilter(''))}
            aria-label={isChosen ? 'Filter selected locations' : 'Filter available locations'}
        />
    );

    const buildPane = (isChosen: boolean) => {
        const options = isChosen ? chosenOptions : availableOptions;
        const optionIds = isChosen ? chosenOptionIds : availableOptionIds;
        const checkedOnPane = isChosen ? checkedChosenIds : checkedAvailableIds;
        const emptyMessage = isChosen ? 'No locations selected.' : 'No available locations.';

        return (
            <DualListSelectorPane
                title={isChosen ? 'Selected locations' : 'Available locations'}
                status={`${checkedOnPane.length} of ${optionIds.length} items selected`}
                searchInput={buildSearchInput(isChosen)}
                isChosen={isChosen}
                listMinHeight={LIST_MAX_HEIGHT}
            >
                {options.length === 0 ? (
                    <Text component="p">{emptyMessage}</Text>
                ) : (
                    <DualListSelectorList>
                        <DualListSelectorTree
                            data={options}
                            defaultAllExpanded
                            onOptionCheck={(event, isChecked, itemData) =>
                                onOptionCheck(event, isChecked, itemData)
                            }
                        />
                    </DualListSelectorList>
                )}
            </DualListSelectorPane>
        );
    };

    return (
        <DualListSelector isTree className="location-dual-list-selector">
            {buildPane(false)}
            <DualListSelectorControlsWrapper aria-label="Location selector controls">
                <DualListSelectorControl
                    isDisabled={checkedAvailableIds.length === 0}
                    onClick={() => moveChecked(true)}
                    aria-label="Add selected locations"
                >
                    <AngleRightIcon />
                </DualListSelectorControl>
                <DualListSelectorControl
                    isDisabled={availableOptionIds.length === 0}
                    onClick={() => moveAll(true)}
                    aria-label="Add all locations"
                >
                    <AngleDoubleRightIcon />
                </DualListSelectorControl>
                <DualListSelectorControl
                    isDisabled={removableChosenIds.length === 0}
                    onClick={() => moveAll(false)}
                    aria-label="Remove all locations"
                >
                    <AngleDoubleLeftIcon />
                </DualListSelectorControl>
                <DualListSelectorControl
                    isDisabled={checkedChosenIds.length === 0}
                    onClick={() => moveChecked(false)}
                    aria-label="Remove selected locations"
                >
                    <AngleLeftIcon />
                </DualListSelectorControl>
            </DualListSelectorControlsWrapper>
            {buildPane(true)}
        </DualListSelector>
    );
};

type CombinedCategory = 'locations' | 'organisations';

type CombinedLocOrgProps = {
    locations: Location[];
    organisations: Location[];
    selectedLocationIds: string[];
    selectedOrganisationIds: string[];
    onLocationsChange: (ids: string[]) => void;
    onOrganisationsChange: (ids: string[]) => void;
};

const CombinedLocOrgTypeahead: React.FunctionComponent<CombinedLocOrgProps> = ({
    locations,
    organisations,
    selectedLocationIds,
    selectedOrganisationIds,
    onLocationsChange,
    onOrganisationsChange,
}) => {
    const [category, setCategory] = React.useState<CombinedCategory>('locations');
    const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [focusedItemIndex, setFocusedItemIndex] = React.useState<number | null>(null);
    const [activeItemId, setActiveItemId] = React.useState<string | null>(null);
    const textInputRef = React.useRef<HTMLInputElement>(null);

    const isLocations = category === 'locations';
    const options = isLocations ? locations : organisations;
    const selectedIds = isLocations ? selectedLocationIds : selectedOrganisationIds;
    const onSelectedChange = isLocations ? onLocationsChange : onOrganisationsChange;
    const selectedLocations = locations.filter((location) => selectedLocationIds.includes(location.id));
    const selectedOrganisations = organisations.filter((organisation) =>
        selectedOrganisationIds.includes(organisation.id)
    );
    const categoryLabel = isLocations ? 'Locations' : 'Organisations';
    const placeholder = `${selectedIds.length} ${
        isLocations
            ? selectedIds.length === 1
                ? 'location'
                : 'locations'
            : selectedIds.length === 1
              ? 'organisation'
              : 'organisations'
    } selected`;

    const removableSelectedCount = selectedIds.filter(
        (id) => !isLocations || !isInheritedLocation(options, id)
    ).length;

    const createItemId = (value: string) => `combined-typeahead-${category}-${value}`;

    const selectOptions = React.useMemo(() => {
        const flattened = isLocations
            ? flattenLocationsForSelect(options).map((location) => ({
                  value: location.id,
                  children: location.name,
                  style: getTreeItemIndentStyle(location.depth),
                  isDisabled: Boolean(
                      options.find((candidate) => candidate.id === location.id)?.isInherited
                  ),
              }))
            : options.map((item) => ({
                  value: item.id,
                  children: item.name,
              }));
        let nextOptions: SelectOptionProps[] = flattened;

        if (inputValue.trim()) {
            const query = inputValue.trim().toLowerCase();
            nextOptions = nextOptions.filter((option) => {
                const item = options.find((candidate) => candidate.id === option.value);
                if (!item) {
                    return false;
                }
                return isLocations
                    ? locationMatchesQuery(item, query, options)
                    : item.name.toLowerCase().includes(query);
            });

            if (nextOptions.length === 0) {
                nextOptions = [
                    {
                        isAriaDisabled: true,
                        children: `No results found for "${inputValue}"`,
                        value: NO_RESULTS,
                        hasCheckbox: false,
                    },
                ];
            }
        }

        return nextOptions;
    }, [inputValue, options, isLocations]);

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

    const handleMenuArrowKeys = (key: string) => {
        if (!isOpen) {
            setIsOpen(true);
        }

        if (selectOptions.every((option) => option.isDisabled || option.isAriaDisabled)) {
            return;
        }

        let indexToFocus = 0;

        if (key === 'ArrowUp') {
            indexToFocus =
                focusedItemIndex === null || focusedItemIndex === 0
                    ? selectOptions.length - 1
                    : focusedItemIndex - 1;

            while (selectOptions[indexToFocus]?.isDisabled || selectOptions[indexToFocus]?.isAriaDisabled) {
                indexToFocus = indexToFocus === 0 ? selectOptions.length - 1 : indexToFocus - 1;
            }
        }

        if (key === 'ArrowDown') {
            indexToFocus =
                focusedItemIndex === null || focusedItemIndex === selectOptions.length - 1
                    ? 0
                    : focusedItemIndex + 1;

            while (selectOptions[indexToFocus]?.isDisabled || selectOptions[indexToFocus]?.isAriaDisabled) {
                indexToFocus = indexToFocus === selectOptions.length - 1 ? 0 : indexToFocus + 1;
            }
        }

        setActiveAndFocusedItem(indexToFocus);
    };

    const onSelect = (value: string) => {
        if (!value || value === NO_RESULTS) {
            return;
        }

        const nextSelected = isLocations
            ? toggleLocationSelection(options, selectedIds, value)
            : selectedIds.includes(value)
              ? selectedIds.filter((id) => id !== value)
              : [...selectedIds, value];

        onSelectedChange(nextSelected);
        textInputRef.current?.focus();
    };

    const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const focusedItem = focusedItemIndex !== null ? selectOptions[focusedItemIndex] : null;

        switch (event.key) {
            case 'Enter':
                if (isOpen && focusedItem && focusedItem.value !== NO_RESULTS && !focusedItem.isAriaDisabled) {
                    onSelect(String(focusedItem.value));
                }

                if (!isOpen) {
                    setIsOpen(true);
                }
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                event.preventDefault();
                handleMenuArrowKeys(event.key);
                break;
            default:
                break;
        }
    };

    const onToggleClick = () => {
        setIsOpen(!isOpen);
        textInputRef.current?.focus();
    };

    const onTextInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setInputValue(value);
        resetActiveAndFocusedItem();
    };

    const onClearButtonClick = () => {
        onSelectedChange(isLocations ? withRequiredSelections(options, []) : []);
        setInputValue('');
        resetActiveAndFocusedItem();
        textInputRef.current?.focus();
    };

    const handleCategoryChange = (nextCategory: CombinedCategory) => {
        setCategory(nextCategory);
        setIsCategoryOpen(false);
        setInputValue('');
        closeMenu();
    };

    const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
            variant="typeahead"
            aria-label={`${categoryLabel} multi typeahead menu toggle`}
            onClick={onToggleClick}
            innerRef={toggleRef}
            isExpanded={isOpen}
            isFullWidth
        >
            <TextInputGroup isPlain>
                <TextInputGroupMain
                    value={inputValue}
                    onClick={onInputClick}
                    onChange={onTextInputChange}
                    onKeyDown={onInputKeyDown}
                    id="combined-multi-typeahead-input"
                    autoComplete="off"
                    innerRef={textInputRef}
                    placeholder={placeholder}
                    {...(activeItemId ? { 'aria-activedescendant': activeItemId } : {})}
                    role="combobox"
                    isExpanded={isOpen}
                    aria-controls="combined-multi-typeahead-listbox"
                />
                <TextInputGroupUtilities {...(removableSelectedCount === 0 ? { style: { display: 'none' } } : {})}>
                    <Button
                        variant="plain"
                        onClick={onClearButtonClick}
                        aria-label={`Clear selected ${isLocations ? 'locations' : 'organisations'}`}
                    >
                        <TimesIcon aria-hidden />
                    </Button>
                </TextInputGroupUtilities>
            </TextInputGroup>
        </MenuToggle>
    );

    return (
        <Stack hasGutter>
            <StackItem>
                <Title headingLevel="h2" size="xl">
                    Assign locations and organisations
                </Title>
            </StackItem>
            <StackItem>
                <FormGroup fieldId="combined-multi-typeahead" style={{ maxWidth: '560px' }}>
                    <InputGroup>
                        <InputGroupItem>
                            <Select
                                id="combined-category-select"
                                isOpen={isCategoryOpen}
                                selected={category}
                                onSelect={(_event, value) => handleCategoryChange(value as CombinedCategory)}
                                onOpenChange={setIsCategoryOpen}
                                toggle={(toggleRef) => (
                                    <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                        isExpanded={isCategoryOpen}
                                        aria-label="Category"
                                        style={{ width: '160px' }}
                                    >
                                        {categoryLabel}
                                    </MenuToggle>
                                )}
                                popperProps={{ appendTo: () => document.body }}
                            >
                                <SelectList>
                                    <SelectOption value="organisations">Organisations</SelectOption>
                                    <SelectOption value="locations">Locations</SelectOption>
                                </SelectList>
                            </Select>
                        </InputGroupItem>
                        <InputGroupItem isFill>
                            <Select
                                role="menu"
                                id="combined-multi-typeahead"
                                isOpen={isOpen}
                                selected={selectedIds}
                                onSelect={(_event, selection) => onSelect(String(selection))}
                                onOpenChange={(open) => {
                                    if (!open) {
                                        closeMenu();
                                    }
                                }}
                                toggle={toggle}
                                variant="typeahead"
                                maxMenuHeight="360px"
                                isScrollable
                                popperProps={{ appendTo: () => document.body }}
                            >
                                <SelectList isAriaMultiselectable id="combined-multi-typeahead-listbox">
                                    {selectOptions.map((option, index) => (
                                        <SelectOption
                                            {...(option.value !== NO_RESULTS ? { hasCheckbox: true } : {})}
                                            isSelected={selectedIds.includes(String(option.value))}
                                            key={String(option.value)}
                                            isFocused={focusedItemIndex === index}
                                            id={createItemId(String(option.value))}
                                            {...option}
                                            ref={null}
                                        />
                                    ))}
                                </SelectList>
                            </Select>
                        </InputGroupItem>
                    </InputGroup>
                </FormGroup>
            </StackItem>
            <StackItem>
                <Title headingLevel="h3" size="md" style={{ marginBottom: spacingMd }}>
                    Assigned locations
                </Title>
                {selectedLocations.length === 0 ? (
                    <Text component="p">No locations assigned.</Text>
                ) : (
                    <LabelGroup aria-label="Assigned locations" numLabels={10}>
                        {selectedLocations.map((location) => (
                            <AssignedLocationLabel
                                key={location.id}
                                location={location}
                                onRemove={(id) =>
                                    onLocationsChange(
                                        toggleLocationSelection(locations, selectedLocationIds, id)
                                    )
                                }
                            />
                        ))}
                    </LabelGroup>
                )}
            </StackItem>
            <StackItem>
                <Title headingLevel="h3" size="md" style={{ marginBottom: spacingMd }}>
                    Assigned organisations
                </Title>
                {selectedOrganisations.length === 0 ? (
                    <Text component="p">No organisations assigned.</Text>
                ) : (
                    <LabelGroup aria-label="Assigned organisations" numLabels={10}>
                        {selectedOrganisations.map((organisation) => (
                            <Label
                                key={organisation.id}
                                color="blue"
                                onClose={() =>
                                    onOrganisationsChange(
                                        selectedOrganisationIds.filter(
                                            (organisationId) => organisationId !== organisation.id
                                        )
                                    )
                                }
                                closeBtnAriaLabel={`Remove ${organisation.name}`}
                            >
                                {organisation.name}
                            </Label>
                        ))}
                    </LabelGroup>
                )}
            </StackItem>
        </Stack>
    );
};

export const ExperimentsLocations: React.FunctionComponent = () => {
    useDocumentTitle('PatternFly Seed | Experiments | Locations');
    const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
    const initialLocationIds = withRequiredSelections(ALL_LOCATIONS, ['brno']);
    const [typeaheadSelectedIds, setTypeaheadSelectedIds] = React.useState<string[]>(initialLocationIds);
    const [checkboxSelectedIds, setCheckboxSelectedIds] = React.useState<string[]>(initialLocationIds);
    const [twoPanelSelectedIds, setTwoPanelSelectedIds] = React.useState<string[]>(initialLocationIds);
    const [combinedLocationIds, setCombinedLocationIds] = React.useState<string[]>(initialLocationIds);
    const [combinedOrganisationIds, setCombinedOrganisationIds] = React.useState<string[]>(['demo']);

    return (
        <PageSection
            aria-label="Locations"
            padding={{ default: 'noPadding' }}
            style={{ backgroundColor: background100 }}
        >
            <div
                style={{
                    paddingTop: spacingMd,
                    paddingRight: spacingL,
                    paddingBottom: spacingMd,
                    paddingLeft: spacingL,
                    boxSizing: 'border-box',
                }}
            >
                <TextContent>
                    <Title headingLevel="h1" size="2xl">
                        Locations
                    </Title>
                </TextContent>
            </div>

            <div
                style={{
                    paddingTop: 0,
                    paddingRight: spacingL,
                    paddingLeft: spacingL,
                    paddingBottom: spacingL,
                    boxSizing: 'border-box',
                }}
            >
                <Tabs
                    activeKey={activeTabKey}
                    onSelect={(_event, tabIndex) => setActiveTabKey(tabIndex)}
                    aria-label="Dual selector alternative options"
                    role="region"
                >
                    <Tab eventKey={0} title={<TabTitleText>1. Multi-typeahead</TabTitleText>}>
                        <TabContentBody style={tabContentPadding}>
                            <LocationMultiTypeahead
                                locations={ALL_LOCATIONS}
                                selectedLocationIds={typeaheadSelectedIds}
                                onSelectedChange={setTypeaheadSelectedIds}
                            />
                        </TabContentBody>
                    </Tab>
                    <Tab eventKey={1} title={<TabTitleText>2. Checkbox list</TabTitleText>}>
                        <TabContentBody style={tabContentPadding}>
                            <Stack hasGutter>
                                <Text component="p">
                                    One filtered checkbox list plus labels for the current selection. No arrows
                                    and no second panel. Best when people browse and compare.
                                </Text>
                                <LocationCheckboxList
                                    locations={ALL_LOCATIONS}
                                    selectedLocationIds={checkboxSelectedIds}
                                    onSelectedChange={setCheckboxSelectedIds}
                                />
                            </Stack>
                        </TabContentBody>
                    </Tab>
                    <Tab eventKey={2} title={<TabTitleText>3. Dual selector</TabTitleText>}>
                        <TabContentBody style={tabContentPadding}>
                            <Stack hasGutter>
                                <Text component="p">
                                    Dual list selector with a location tree. Parents stay at the left; children
                                    such as area1, area2, and area3 are indented with no expanders.
                                </Text>
                                <LocationTwoPanel
                                    locations={ALL_LOCATIONS}
                                    selectedLocationIds={twoPanelSelectedIds}
                                    onSelectedChange={setTwoPanelSelectedIds}
                                />
                            </Stack>
                        </TabContentBody>
                    </Tab>
                    <Tab eventKey={3} title={<TabTitleText>4. Combined loc and org</TabTitleText>}>
                        <TabContentBody style={tabContentPadding}>
                            <CombinedLocOrgTypeahead
                                locations={ALL_LOCATIONS}
                                organisations={ALL_ORGANISATIONS}
                                selectedLocationIds={combinedLocationIds}
                                selectedOrganisationIds={combinedOrganisationIds}
                                onLocationsChange={setCombinedLocationIds}
                                onOrganisationsChange={setCombinedOrganisationIds}
                            />
                        </TabContentBody>
                    </Tab>
                </Tabs>
            </div>
        </PageSection>
    );
};
