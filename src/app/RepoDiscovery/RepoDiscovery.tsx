import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Dropdown,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  InputGroup,
  InputGroupItem,
  Level,
  LevelItem,
  MenuToggle,
  MenuToggleCheckbox,
  PageSection,
  PageSectionTypes,
  PageSectionVariants,
  Pagination,
  PaginationVariant,
  Radio,
  SearchInput,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Wizard,
  WizardStep,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import {
  CONTAINER_DISCOVERY_RESULTS,
  EXISTING_PRODUCTS,
  GPG_KEYS,
  REGISTRIES,
  YUM_DISCOVERY_RESULTS,
  isValidHttpUrl,
  toLabel,
  urlValidated,
  type DiscoveredRepository,
  type ProductMode,
  type RepositoryType,
} from './repoDiscoveryData';
import { SimpleSelect, TruncatedUrl, nowrapHeader, ResettableTextInput, RowResetButton, selectedCountLabel } from './RepoDiscoveryShared';

/**
 * PF5 tokens with pixel fallbacks — if every `var()` in the chain is invalid, the browser drops the
 * whole declaration; ending with pixel fallbacks guarantees spacing still applies in this seed.
 */
const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const RepoDiscovery: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const [repositoryType, setRepositoryType] = React.useState<RepositoryType>('yum');
  const [discoverUrl, setDiscoverUrl] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [registry, setRegistry] = React.useState('redhat');
  const [customRegistryUrl, setCustomRegistryUrl] = React.useState('');
  const [searchParameter, setSearchParameter] = React.useState('');

  const [isDiscovering, setIsDiscovering] = React.useState(false);
  const [hasDiscovered, setHasDiscovered] = React.useState(false);
  const [discovered, setDiscovered] = React.useState<DiscoveredRepository[]>([]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [filter, setFilter] = React.useState('');
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(5);

  const [productMode, setProductMode] = React.useState<ProductMode>('existing');
  const [productName, setProductName] = React.useState('');
  const [productLabel, setProductLabel] = React.useState('');
  const [isLabelManual, setIsLabelManual] = React.useState(false);
  const [existingProduct, setExistingProduct] = React.useState(EXISTING_PRODUCTS[0]);
  const [gpgKey, setGpgKey] = React.useState(GPG_KEYS[0]);
  const [isUnprotected, setIsUnprotected] = React.useState(true);
  const [verifySsl, setVerifySsl] = React.useState(true);

  const discoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(
    () => () => {
      if (discoverTimeoutRef.current) {
        clearTimeout(discoverTimeoutRef.current);
      }
    },
    [],
  );

  const discoverUrlValidated = urlValidated(discoverUrl);
  const customRegistryValidated = urlValidated(customRegistryUrl);
  const canDiscover =
    repositoryType === 'yum'
      ? isValidHttpUrl(discoverUrl)
      : registry !== 'custom' || isValidHttpUrl(customRegistryUrl);

  const filteredDiscovered = React.useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) {
      return discovered;
    }
    return discovered.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.label.toLowerCase().includes(query) ||
        repo.url.toLowerCase().includes(query),
    );
  }, [discovered, filter]);

  const selectedRepos = discovered.filter((repo) => selected.has(repo.id));
  const hasSelection = selected.size > 0;
  const itemCount = filteredDiscovered.length;
  const pageCount = Math.max(1, Math.ceil(itemCount / perPage));
  const safePage = Math.min(page, pageCount);
  const slice = filteredDiscovered.slice((safePage - 1) * perPage, safePage * perPage);
  const idsOnPage = slice.map((repo) => repo.id);
  const allOnPageSelected = idsOnPage.length > 0 && idsOnPage.every((id) => selected.has(id));
  const partiallySelected = idsOnPage.some((id) => selected.has(id)) && !allOnPageSelected;
  const bulkCheck: boolean | null = allOnPageSelected ? true : partiallySelected ? null : false;

  React.useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  const isProductValid =
    productMode === 'existing' ? existingProduct.trim().length > 0 : productName.trim().length > 0;
  const targetProductName = productMode === 'existing' ? existingProduct : productName.trim();

  const registrySummary =
    registry === 'custom'
      ? customRegistryUrl || 'Custom'
      : (REGISTRIES.find((item) => item.value === registry)?.label ?? registry);

  const resetDiscoveryResults = () => {
    setHasDiscovered(false);
    setDiscovered([]);
    setSelected(new Set());
    setFilter('');
    setPage(1);
  };

  const handleRepositoryTypeChange = (nextType: RepositoryType) => {
    setRepositoryType(nextType);
    resetDiscoveryResults();
  };

  const handleDiscover = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!canDiscover || isDiscovering) {
      return;
    }
    setIsDiscovering(true);
    if (discoverTimeoutRef.current) {
      clearTimeout(discoverTimeoutRef.current);
    }
    discoverTimeoutRef.current = setTimeout(() => {
      const results = repositoryType === 'yum' ? YUM_DISCOVERY_RESULTS : CONTAINER_DISCOVERY_RESULTS;
      setDiscovered(results.map((repo) => ({ ...repo })));
      setSelected(new Set());
      setHasDiscovered(true);
      setIsDiscovering(false);
      setPage(1);
    }, 700);
  };

  const selectAllDiscovered = (checked: boolean) => {
    setSelected(checked ? new Set(discovered.map((repo) => repo.id)) : new Set());
  };

  const selectPage = (checked = true) => {
    const next = new Set(selected);
    idsOnPage.forEach((id) => {
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
    });
    setSelected(next);
  };

  const toggleRepo = (id: string, isSelecting: boolean) => {
    const next = new Set(selected);
    if (isSelecting) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelected(next);
  };

  const handleProductNameChange = (value: string) => {
    setProductName(value);
    if (!isLabelManual) {
      setProductLabel(toLabel(value));
    }
  };

  const updateDiscoveredRepo = (id: string, field: 'name' | 'label', value: string) => {
    setDiscovered((current) =>
      current.map((repo) => {
        if (repo.id !== id) {
          return repo;
        }
        if (field === 'name') {
          const shouldSyncLabel = repo.label === toLabel(repo.name) || !repo.label;
          return {
            ...repo,
            name: value,
            label: shouldSyncLabel ? toLabel(value) : repo.label,
          };
        }
        return { ...repo, label: value };
      }),
    );
  };

  const resetDiscoveredRepo = (id: string) => {
    setDiscovered((current) =>
      current.map((repo) =>
        repo.id === id ? { ...repo, name: repo.originalName, label: repo.originalLabel } : repo,
      ),
    );
  };

  const handleClose = () => {
    navigate('/repositories');
  };

  const handleSave = () => {
    if (!hasSelection || !isProductValid) {
      return;
    }
    const encodedName = encodeURIComponent(targetProductName.trim() || 'product');
    navigate(`/products/${encodedName}?tab=tasks`, {
      state: { showRepositoryCreateToast: true },
    });
  };

  const renderDiscoverButton = (id: string) => (
    <Button
      id={id}
      variant="secondary"
      type="submit"
      form="repo-discovery-form"
      isLoading={isDiscovering}
      isDisabled={!canDiscover || isDiscovering}
      spinnerAriaValueText="Discovering repositories"
    >
      Discover
    </Button>
  );

  const renderDiscoveryForm = () => (
    <Form id="repo-discovery-form" isWidthLimited onSubmit={handleDiscover}>
      <button type="submit" hidden disabled={!canDiscover || isDiscovering} />
      <FormGroup label="Repository type" isRequired fieldId="repository-type">
        <SimpleSelect
          id="repository-type"
          ariaLabel="Repository type"
          selected={repositoryType}
          onSelectValue={(value) => handleRepositoryTypeChange(value as RepositoryType)}
          options={[
            { value: 'yum', label: 'Yum repositories' },
            { value: 'container', label: 'Container images' },
          ]}
        />
      </FormGroup>

      {repositoryType === 'yum' ? (
        <FormGroup label="URL to discover" isRequired fieldId="url-to-discover">
          <InputGroup>
            <InputGroupItem isFill>
              <TextInput
                id="url-to-discover"
                type="url"
                value={discoverUrl}
                validated={discoverUrlValidated}
                onChange={(_event, value) => setDiscoverUrl(value)}
                aria-label="URL to discover"
                placeholder="Enter a URL to scan for repositories."
              />
            </InputGroupItem>
            <InputGroupItem>{renderDiscoverButton('discover-url')}</InputGroupItem>
          </InputGroup>
          {discoverUrlValidated === 'error' && (
            <FormHelperText>
              <HelperText>
                <HelperTextItem variant="error" hasIcon>
                  Enter a valid URL that starts with http:// or https://.
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </FormGroup>
      ) : (
        <>
          <FormGroup label="Registry to discover" isRequired fieldId="registry-to-discover">
            <SimpleSelect
              id="registry-to-discover"
              ariaLabel="Registry to discover"
              selected={registry}
              onSelectValue={setRegistry}
              options={REGISTRIES}
            />
            <div style={{ marginBlockStart: spacingMd }}>
              <InputGroup>
                <InputGroupItem isFill>
                  <TextInput
                    id="custom-registry-url"
                    type="url"
                    value={customRegistryUrl}
                    validated={registry === 'custom' ? customRegistryValidated : 'default'}
                    onChange={(_event, value) => setCustomRegistryUrl(value)}
                    isDisabled={registry !== 'custom'}
                    placeholder="Example: https://private.registry.example.com"
                    aria-label="Custom registry URL"
                  />
                </InputGroupItem>
                <InputGroupItem>{renderDiscoverButton('discover-registry')}</InputGroupItem>
              </InputGroup>
            </div>
            <FormHelperText>
              <HelperText>
                <HelperTextItem
                  variant={registry === 'custom' && customRegistryValidated === 'error' ? 'error' : 'default'}
                  hasIcon={registry === 'custom' && customRegistryValidated === 'error'}
                >
                  {registry === 'custom' && customRegistryValidated === 'error'
                    ? 'Enter a valid URL that starts with http:// or https://.'
                    : 'Choose a registry to discover containers. To examine a private registry, choose Custom and provide the URL.'}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
          <FormGroup label="Registry search parameter" fieldId="registry-search-parameter">
            <ResettableTextInput
              id="registry-search-parameter"
              value={searchParameter}
              originalValue=""
              onChange={setSearchParameter}
              placeholder="Default: * (search all)"
              ariaLabel="Registry search parameter"
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>
                  Using a search parameter improves repository discovery. A blank search might return an incomplete list
                  because of registry API limits.
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        </>
      )}

      <FormGroup label="Username" fieldId="discovery-username">
        <ResettableTextInput
          id="discovery-username"
          value={username}
          originalValue=""
          onChange={setUsername}
          ariaLabel="Username"
        />
      </FormGroup>
      <FormGroup label="Password" fieldId="discovery-password">
        <ResettableTextInput
          id="discovery-password"
          type="password"
          value={password}
          originalValue=""
          onChange={setPassword}
          ariaLabel="Password"
        />
        {repositoryType === 'container' && (
          <FormHelperText>
            <HelperText>
              <HelperTextItem>
                Username and password are required for syncing the repository after it is created. Credentials are not
                validated during discovery.
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        )}
      </FormGroup>
    </Form>
  );

  const renderDiscoveredTable = () => {
    if (filteredDiscovered.length === 0) {
      return (
        <EmptyState variant={EmptyStateVariant.sm}>
          <EmptyStateHeader
            titleText="Your search returned zero results."
            headingLevel="h4"
            icon={<EmptyStateIcon icon={SearchIcon} />}
          />
          <EmptyStateBody>Try a different filter, or discover from another URL or registry.</EmptyStateBody>
        </EmptyState>
      );
    }

    return (
      <Table
        aria-label="Discovered repositories"
        variant="compact"
        borders
        isStriped
        ouiaId="discovered-repositories-table"
        style={{ marginBottom: 0, width: '100%', tableLayout: 'fixed' }}
      >
        <colgroup>
          <col style={{ width: '45px' }} />
          <col style={{ width: '28%' }} />
          <col style={{ width: '22%' }} />
          <col />
          <col style={{ width: '48px' }} />
        </colgroup>
        <Thead>
          <Tr>
            <Th screenReaderText="Row select" />
            <Th style={nowrapHeader}>Repository name</Th>
            <Th style={nowrapHeader}>Repository label</Th>
            <Th style={nowrapHeader}>Repository URL</Th>
            <Th screenReaderText="Reset row" />
          </Tr>
        </Thead>
        <Tbody>
          {slice.map((repo) => (
            <Tr key={repo.id}>
              <Td dataLabel="Select row">
                <Checkbox
                  id={`discover-select-${repo.id}`}
                  isChecked={selected.has(repo.id)}
                  onChange={(_event, checked) => toggleRepo(repo.id, checked)}
                  aria-label={`Select ${repo.name}`}
                />
              </Td>
              <Td dataLabel="Repository name">
                <TextInput
                  aria-label={`Repository name for ${repo.url}`}
                  value={repo.name}
                  onChange={(_event, value) => updateDiscoveredRepo(repo.id, 'name', value)}
                />
              </Td>
              <Td dataLabel="Repository label">
                <TextInput
                  aria-label={`Repository label for ${repo.url}`}
                  value={repo.label}
                  onChange={(_event, value) => updateDiscoveredRepo(repo.id, 'label', value)}
                />
              </Td>
              <Td dataLabel="Repository URL">
                <TruncatedUrl url={repo.url} />
              </Td>
              <Td dataLabel="Reset">
                <RowResetButton
                  isDirty={repo.name !== repo.originalName || repo.label !== repo.originalLabel}
                  onReset={() => resetDiscoveredRepo(repo.id)}
                  ariaLabel={`Reset ${repo.name}`}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };

  const renderDiscoveryStep = () => (
    <Stack hasGutter>
      <StackItem>{renderDiscoveryForm()}</StackItem>
      {hasDiscovered && (
        <StackItem>
          <Alert
            isInline
            variant="info"
            title={`${discovered.length} ${discovered.length === 1 ? 'repository' : 'repositories'} found. Select at least one to continue. You can edit repository names and labels.`}
          />
        </StackItem>
      )}
      {hasDiscovered && (
      <StackItem>
        <Toolbar
          id="discovered-repositories-toolbar"
          ouiaId="discovered-repositories-toolbar"
          inset={{ default: 'insetNone' }}
          style={{ marginBottom: 0 }}
        >
          <ToolbarContent alignItems="center">
            <ToolbarGroup>
              <ToolbarItem>
                <Dropdown
                  isOpen={bulkOpen}
                  onSelect={() => setBulkOpen(false)}
                  onOpenChange={setBulkOpen}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setBulkOpen(!bulkOpen)}
                      isExpanded={bulkOpen}
                      isDisabled={!hasDiscovered || discovered.length === 0}
                      splitButtonOptions={{
                        items: [
                          <MenuToggleCheckbox
                            key="bulk"
                            id="discovered-bulk-select"
                            aria-label="Select all discovered repositories"
                            isChecked={bulkCheck}
                            isDisabled={!hasDiscovered || discovered.length === 0}
                            onChange={(checked) => selectPage(Boolean(checked))}
                          >
                            {selectedCountLabel(selected.size)}
                          </MenuToggleCheckbox>,
                        ],
                      }}
                      aria-label="Bulk select"
                    />
                  )}
                  popperProps={{ appendTo: () => document.body }}
                >
                  <DropdownList>
                    <DropdownItem key="none" onClick={() => selectAllDiscovered(false)}>
                      Select none ({discovered.length} items)
                    </DropdownItem>
                    <DropdownItem key="page" onClick={() => selectPage(true)}>
                      Select page ({slice.length} items)
                    </DropdownItem>
                    <DropdownItem key="all" onClick={() => selectAllDiscovered(true)}>
                      Select all ({discovered.length} items)
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem>
                <SearchInput
                  placeholder="Filter"
                  value={filter}
                  onChange={(_event, value) => {
                    setFilter(value);
                    setPage(1);
                  }}
                  onClear={() => {
                    setFilter('');
                    setPage(1);
                  }}
                  aria-label="Filter discovered repositories"
                />
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup align={{ default: 'alignRight' }}>
              <ToolbarItem variant="pagination">
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
                  isDisabled={!hasDiscovered}
                  ouiaId="discovered-pagination-top"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </StackItem>
      )}
      {hasDiscovered && (
      <StackItem>
        {renderDiscoveredTable()}
        {hasDiscovered && itemCount > 0 && (
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
            isStatic
            isCompact
            ouiaId="discovered-pagination-bottom"
            toggleTemplate={({ firstIndex, lastIndex, itemCount: total }) => (
              <span>
                {firstIndex} - {lastIndex} of {total}
              </span>
            )}
            style={{
              marginTop: spacingMd,
              paddingTop: 0,
              paddingLeft: 0,
              paddingRight: 0,
              paddingInline: 0,
            }}
          />
        )}
      </StackItem>
      )}
    </Stack>
  );

  const renderProductStep = () => (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size="xl">
          Add to product
        </Title>
      </StackItem>
      <StackItem>
        <Form isWidthLimited>
          <FormGroup role="radiogroup" isInline isRequired fieldId="product-mode" label="Product">
            <Radio
              id="product-existing"
              name="product-mode"
              label="Existing product"
              isChecked={productMode === 'existing'}
              onChange={() => setProductMode('existing')}
            />
            <Radio
              id="product-new"
              name="product-mode"
              label="New product"
              isChecked={productMode === 'new'}
              onChange={() => setProductMode('new')}
            />
          </FormGroup>
          {productMode === 'new' ? (
            <FormGroup label="Product name" isRequired fieldId="product-name">
              <ResettableTextInput
                id="product-name"
                value={productName}
                originalValue=""
                onChange={handleProductNameChange}
                ariaLabel="Product name"
              />
            </FormGroup>
          ) : (
            <FormGroup label="Product name" isRequired fieldId="existing-product-name">
              <SimpleSelect
                id="existing-product-name"
                ariaLabel="Product name"
                selected={existingProduct}
                onSelectValue={setExistingProduct}
                options={EXISTING_PRODUCTS.map((name) => ({ value: name, label: name }))}
              />
            </FormGroup>
          )}
          <FormGroup
            role="group"
            fieldId="repository-flags"
            isInline
            hasNoPaddingTop
            label="Repository options"
          >
            <Checkbox
              id="unprotected"
              label="Unprotected"
              isChecked={isUnprotected}
              onChange={(_event, checked) => setIsUnprotected(checked)}
            />
            <Checkbox
              id="verify-ssl"
              label="Verify SSL"
              isChecked={verifySsl}
              onChange={(_event, checked) => setVerifySsl(checked)}
            />
          </FormGroup>
          {productMode === 'new' && (
            <>
              <FormGroup label="Label" fieldId="product-label">
                <ResettableTextInput
                  id="product-label"
                  value={productLabel}
                  originalValue=""
                  onChange={(value) => {
                    setIsLabelManual(true);
                    setProductLabel(value);
                  }}
                  ariaLabel="Label"
                />
              </FormGroup>
              <FormGroup label="GPG key" fieldId="gpg-key">
                <SimpleSelect
                  id="gpg-key"
                  ariaLabel="GPG key"
                  selected={gpgKey}
                  onSelectValue={setGpgKey}
                  options={GPG_KEYS.map((key) => ({ value: key, label: key }))}
                />
              </FormGroup>
            </>
          )}
        </Form>
      </StackItem>
    </Stack>
  );

  const renderReviewStep = () => (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size="xl">
          Review
        </Title>
      </StackItem>
      <StackItem>
        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Repository type</DescriptionListTerm>
            <DescriptionListDescription>
              {repositoryType === 'yum' ? 'Yum repositories' : 'Container images'}
            </DescriptionListDescription>
          </DescriptionListGroup>
          {repositoryType === 'yum' ? (
            <DescriptionListGroup>
              <DescriptionListTerm>URL to discover</DescriptionListTerm>
              <DescriptionListDescription>{discoverUrl || '—'}</DescriptionListDescription>
            </DescriptionListGroup>
          ) : (
            <>
              <DescriptionListGroup>
                <DescriptionListTerm>Registry to discover</DescriptionListTerm>
                <DescriptionListDescription>{registrySummary || '—'}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Registry search parameter</DescriptionListTerm>
                <DescriptionListDescription>{searchParameter || '* (search all)'}</DescriptionListDescription>
              </DescriptionListGroup>
            </>
          )}
          <DescriptionListGroup>
            <DescriptionListTerm>Username</DescriptionListTerm>
            <DescriptionListDescription>{username || '—'}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Password</DescriptionListTerm>
            <DescriptionListDescription>{password ? '********' : '—'}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Product</DescriptionListTerm>
            <DescriptionListDescription>
              {productMode === 'new' ? 'New product' : 'Existing product'}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Product name</DescriptionListTerm>
            <DescriptionListDescription>
              {productMode === 'new' ? productName || '—' : existingProduct}
            </DescriptionListDescription>
          </DescriptionListGroup>
          {productMode === 'new' && (
            <>
              <DescriptionListGroup>
                <DescriptionListTerm>Label</DescriptionListTerm>
                <DescriptionListDescription>{productLabel || '—'}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>GPG key</DescriptionListTerm>
                <DescriptionListDescription>{gpgKey}</DescriptionListDescription>
              </DescriptionListGroup>
            </>
          )}
          <DescriptionListGroup>
            <DescriptionListTerm>Unprotected</DescriptionListTerm>
            <DescriptionListDescription>{isUnprotected ? 'Yes' : 'No'}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Verify SSL</DescriptionListTerm>
            <DescriptionListDescription>{verifySsl ? 'Yes' : 'No'}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </StackItem>
      <StackItem>
        <Table
          aria-label="Selected repositories"
          variant="compact"
          borders
          isStriped
          ouiaId="review-repositories-table"
          style={{ marginBottom: 0, width: '100%', tableLayout: 'fixed' }}
        >
          <colgroup>
            <col style={{ width: '28%' }} />
            <col style={{ width: '22%' }} />
            <col />
          </colgroup>
          <Thead>
            <Tr>
              <Th style={nowrapHeader}>Repository name</Th>
              <Th style={nowrapHeader}>Repository label</Th>
              <Th style={nowrapHeader}>Repository URL</Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedRepos.map((repo) => (
              <Tr key={repo.id}>
                <Td dataLabel="Repository name">{repo.name}</Td>
                <Td dataLabel="Repository label">{repo.label}</Td>
                <Td dataLabel="Repository URL">
                  <TruncatedUrl url={repo.url} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </StackItem>
    </Stack>
  );

  return (
    <React.Fragment>
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
        style={{ backgroundColor: background100 }}
        aria-label="Repository discovery header"
      >
        <div
          style={{
            paddingTop: spacingMd,
            paddingRight: spacingL,
            paddingBottom: 0,
            paddingLeft: spacingL,
            boxSizing: 'border-box',
          }}
        >
          <Breadcrumb>
            <BreadcrumbItem
              to="/repositories"
              render={({ className, ariaCurrent }) => (
                <Link className={className} to="/repositories" aria-current={ariaCurrent}>
                  Products
                </Link>
              )}
            />
            <BreadcrumbItem isActive>Discover repositories</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div
          style={{
            paddingTop: spacingMd,
            paddingRight: spacingL,
            paddingBottom: spacingMd,
            paddingLeft: spacingL,
            boxSizing: 'border-box',
          }}
        >
          <Level hasGutter>
            <LevelItem>
              <TextContent>
                <Title headingLevel="h1" size="2xl">
                  Repository discovery
                </Title>
                <Text component="p">
                Enter a source and discover repositories to edit and add to a product.
                </Text>
              </TextContent>
            </LevelItem>
          </Level>
        </div>
      </PageSection>

      <PageSection
        type={PageSectionTypes.wizard}
        variant={PageSectionVariants.light}
        isFilled
        className="app-repo-discovery-wizard-section"
        aria-label="Repository discovery wizard"
      >
        <Wizard
          className="app-repo-discovery-wizard"
          navAriaLabel="Repository discovery steps"
          isVisitRequired
          shouldFocusContent
          onClose={handleClose}
          onSave={handleSave}
        >
          <WizardStep name="Discovery" id="discovery-step" footer={{ isNextDisabled: !hasSelection }}>
            {renderDiscoveryStep()}
          </WizardStep>
          <WizardStep
            name="Add to product"
            id="product-step"
            isDisabled={!hasSelection}
            footer={{ isNextDisabled: !isProductValid }}
          >
            {renderProductStep()}
          </WizardStep>
          <WizardStep
            name="Review"
            id="review-step"
            isDisabled={!hasSelection || !isProductValid}
            footer={{ nextButtonText: 'Finish' }}
          >
            {renderReviewStep()}
          </WizardStep>
        </Wizard>
      </PageSection>
    </React.Fragment>
  );
};

export { RepoDiscovery };
