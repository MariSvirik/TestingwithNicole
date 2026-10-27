import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownList,
  Level,
  LevelItem,
  MenuToggle,
  MenuToggleCheckbox,
  PageSection,
  Pagination,
  PaginationVariant,
  SearchInput,
  Text,
  TextContent,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import tabStyles from '@patternfly/react-styles/css/components/Tabs/tabs.mjs';
import tabContentStyles from '@patternfly/react-styles/css/components/TabContent/tab-content.mjs';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useNavigate, useParams } from 'react-router-dom';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const TAB_IDS = {
  items: 'template-detail-tab-items',
  details: 'template-detail-tab-details',
} as const;

const PANEL_IDS = {
  items: 'template-detail-panel-items',
  details: 'template-detail-panel-details',
} as const;

type TemplateRow = {
  id: string;
  name: string;
  status: string;
  lastModified: string;
};

const MOCK_ROWS: TemplateRow[] = [
  { id: '1', name: 'alpha-service', status: 'Running', lastModified: '2026-04-01 14:22 UTC' },
  { id: '2', name: 'beta-worker', status: 'Stopped', lastModified: '2026-03-28 09:05 UTC' },
  { id: '3', name: 'gamma-api', status: 'Running', lastModified: '2026-04-06 11:40 UTC' },
  { id: '4', name: 'delta-cache', status: 'Pending', lastModified: '2026-04-05 16:18 UTC' },
  { id: '5', name: 'epsilon-jobs', status: 'Failed', lastModified: '2026-03-30 22:11 UTC' },
  { id: '6', name: 'zeta-stream', status: 'Running', lastModified: '2026-04-02 08:00 UTC' },
  { id: '7', name: 'eta-gateway', status: 'Stopped', lastModified: '2026-03-25 13:50 UTC' },
  { id: '8', name: 'theta-index', status: 'Running', lastModified: '2026-04-04 10:33 UTC' },
  { id: '9', name: 'iota-sync', status: 'Pending', lastModified: '2026-04-03 12:00 UTC' },
  { id: '10', name: 'kappa-batch', status: 'Running', lastModified: '2026-03-29 18:45 UTC' },
  { id: '11', name: 'lambda-edge', status: 'Failed', lastModified: '2026-03-27 09:12 UTC' },
  { id: '12', name: 'mu-storage', status: 'Running', lastModified: '2026-04-07 07:30 UTC' },
];

const TemplateDetail: React.FunctionComponent = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const displayName = templateId ? decodeURIComponent(templateId) : 'Template';

  const [activeTabKey, setActiveTabKey] = React.useState<'items' | 'details'>('items');

  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(5);
  const [search, setSearch] = React.useState('');
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [openActionId, setOpenActionId] = React.useState<string | null>(null);
  const [createActionsOpen, setCreateActionsOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return MOCK_ROWS;
    }
    return MOCK_ROWS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.lastModified.toLowerCase().includes(q),
    );
  }, [search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pageCount);
  const slice = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  React.useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  const idsOnPage = slice.map((r) => r.id);
  const allOnPageSelected = idsOnPage.length > 0 && idsOnPage.every((id) => selected.has(id));
  const partiallySelected = idsOnPage.some((id) => selected.has(id)) && !allOnPageSelected;
  const bulkCheck: boolean | null = allOnPageSelected ? true : partiallySelected ? null : false;

  const selectAllFiltered = (checked: boolean) => {
    setSelected(checked ? new Set(filtered.map((r) => r.id)) : new Set());
  };

  const selectPage = () => {
    const next = new Set(selected);
    idsOnPage.forEach((id) => next.add(id));
    setSelected(next);
  };

  const toggleRow = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelected(next);
  };

  const itemCount = filtered.length;

  const cellTightCheckbox = {
    paddingRight: 'var(--pf-v5-global--spacer--xs, var(--pf-global--spacer--xs, 8px))',
    width: '1%',
    whiteSpace: 'nowrap' as const,
  };
  const cellTightName = {
    paddingLeft: 'var(--pf-v5-global--spacer--xs, var(--pf-global--spacer--xs, 8px))',
  };

  const tableSection = (
    <div
      style={{
        paddingLeft: spacingL,
        paddingRight: spacingL,
        boxSizing: 'border-box',
      }}
    >
      <Toolbar
        id="template-detail-toolbar"
        ouiaId="template-detail-toolbar"
        inset={{ default: 'insetNone' }}
        style={{ marginBottom: 0, paddingLeft: 0, paddingRight: 0 }}
      >
        <ToolbarContent>
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
                    splitButtonOptions={{
                      items: [
                        <MenuToggleCheckbox
                          key="bulk"
                          id="template-detail-bulk"
                          aria-label="Select all"
                          isChecked={bulkCheck}
                          onChange={(checked) => selectAllFiltered(checked)}
                        />,
                      ],
                    }}
                    aria-label="Bulk select"
                  />
                )}
                popperProps={{ appendTo: () => document.body }}
              >
                <DropdownList>
                  <DropdownItem key="none" onClick={() => selectAllFiltered(false)}>
                    Select none ({filtered.length} items)
                  </DropdownItem>
                  <DropdownItem key="page" onClick={() => selectPage()}>
                    Select page ({slice.length} items)
                  </DropdownItem>
                  <DropdownItem key="all" onClick={() => selectAllFiltered(true)}>
                    Select all ({filtered.length} items)
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <SearchInput
                placeholder="Search by name or status…"
                value={search}
                onChange={(_e, v) => {
                  setSearch(v);
                  setPage(1);
                }}
                onClear={() => setSearch('')}
                aria-label="Search table"
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="primary">Create item</Button>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={createActionsOpen}
                onSelect={() => setCreateActionsOpen(false)}
                onOpenChange={setCreateActionsOpen}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    onClick={() => setCreateActionsOpen(!createActionsOpen)}
                    isExpanded={createActionsOpen}
                    aria-label="Create item actions"
                  >
                    <EllipsisVIcon />
                  </MenuToggle>
                )}
                popperProps={{ appendTo: () => document.body }}
              >
                <DropdownList>
                  <DropdownItem key="import">Import items</DropdownItem>
                  <DropdownItem key="template">Use a template</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup align={{ default: 'alignRight' }}>
            <ToolbarItem>
              <Pagination
                itemCount={itemCount}
                perPage={perPage}
                page={safePage}
                onSetPage={(_e, nextPage) => setPage(nextPage)}
                onPerPageSelect={(_e, nextPerPage) => {
                  setPerPage(nextPerPage);
                  setPage(1);
                }}
                variant={PaginationVariant.top}
                isCompact
                ouiaId="template-detail-pagination-top"
              />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <Table
        aria-label="Template detail data"
        variant="compact"
        borders
        ouiaId="template-detail-table"
        style={{ marginBottom: 0 }}
      >
        <Thead>
          <Tr>
            <Th screenReaderText="Row select" style={cellTightCheckbox} />
            <Th style={cellTightName}>Name</Th>
            <Th>Status</Th>
            <Th>Last modified</Th>
            <Th screenReaderText="Actions" />
          </Tr>
        </Thead>
        <Tbody>
          {slice.map((row) => (
            <Tr key={row.id}>
              <Td dataLabel="Select row" style={cellTightCheckbox}>
                <Checkbox
                  isChecked={selected.has(row.id)}
                  onChange={(_e, c) => toggleRow(row.id, Boolean(c))}
                  aria-label={`Select ${row.name}`}
                  id={`template-detail-select-${row.id}`}
                />
              </Td>
              <Td dataLabel="Name" style={cellTightName}>
                <Button
                  variant="link"
                  isInline
                  onClick={() => navigate(`/template/${encodeURIComponent(row.name)}`)}
                >
                  {row.name}
                </Button>
              </Td>
              <Td dataLabel="Status">{row.status}</Td>
              <Td dataLabel="Last modified">{row.lastModified}</Td>
              <Td isActionCell>
                <Dropdown
                  isOpen={openActionId === row.id}
                  onOpenChange={(open) => setOpenActionId(open ? row.id : null)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      variant="plain"
                      onClick={() => setOpenActionId(openActionId === row.id ? null : row.id)}
                      isExpanded={openActionId === row.id}
                      aria-label={`Actions for ${row.name}`}
                    >
                      <EllipsisVIcon />
                    </MenuToggle>
                  )}
                  popperProps={{ appendTo: () => document.body }}
                >
                  <DropdownList>
                    <DropdownItem key="view">View</DropdownItem>
                    <DropdownItem key="edit">Edit</DropdownItem>
                    <DropdownItem key="del" isDanger>
                      Delete
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Pagination
        itemCount={itemCount}
        perPage={perPage}
        page={safePage}
        onSetPage={(_e, nextPage) => setPage(nextPage)}
        onPerPageSelect={(_e, nextPerPage) => {
          setPerPage(nextPerPage);
          setPage(1);
        }}
        variant={PaginationVariant.bottom}
        isStatic
        isCompact
        ouiaId="template-detail-pagination-bottom"
        style={{
          marginTop: 0,
          paddingTop: spacingMd,
          paddingBlockStart: spacingMd,
          paddingLeft: 0,
          paddingRight: 0,
          paddingInline: 0,
        }}
      />
    </div>
  );

  return (
    <PageSection
      aria-label="Template detail"
      padding={{ default: 'noPadding' }}
      style={{ backgroundColor: background100 }}
    >
      {/* 1. Breadcrumb section */}
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
          <BreadcrumbItem to="#" onClick={() => navigate('/template')}>
            Template
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{displayName}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* 2. Title section (spacing unchanged: 16px top/bottom, 24px sides) */}
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
                {displayName}
              </Title>
              <Text component="p">
                Summary and status for this template. Use the items tab to review child resources, or open
                details for metadata and activity.
              </Text>
            </TextContent>
          </LevelItem>
          <LevelItem>
            <Button variant="primary">Edit</Button>
          </LevelItem>
        </Level>
      </div>

      {/* 3. Tabs section — tab list only (not the table); PF tabs visuals */}
      <div
        style={{
          paddingTop: 0,
          paddingRight: spacingL,
          paddingLeft: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <div className={css(tabStyles.tabs)} aria-label="Template detail tabs">
          <ul className={css(tabStyles.tabsList)} role="tablist">
            <li
              className={css(tabStyles.tabsItem, activeTabKey === 'items' && tabStyles.modifiers.current)}
              role="presentation"
            >
              <button
                type="button"
                id={TAB_IDS.items}
                className={css(tabStyles.tabsLink)}
                role="tab"
                aria-selected={activeTabKey === 'items'}
                aria-controls={PANEL_IDS.items}
                tabIndex={activeTabKey === 'items' ? 0 : -1}
                onClick={() => setActiveTabKey('items')}
              >
                <span className={css(tabStyles.tabsItemText)}>Items</span>
              </button>
            </li>
            <li
              className={css(tabStyles.tabsItem, activeTabKey === 'details' && tabStyles.modifiers.current)}
              role="presentation"
            >
              <button
                type="button"
                id={TAB_IDS.details}
                className={css(tabStyles.tabsLink)}
                role="tab"
                aria-selected={activeTabKey === 'details'}
                aria-controls={PANEL_IDS.details}
                tabIndex={activeTabKey === 'details' ? 0 : -1}
                onClick={() => setActiveTabKey('details')}
              >
                <span className={css(tabStyles.tabsItemText)}>Details</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. Table / content section — separate from tabs; tab panels */}
      <div
        style={{
          paddingBottom: spacingL,
          boxSizing: 'border-box',
        }}
      >
        <section
          id={PANEL_IDS.items}
          role="tabpanel"
          aria-labelledby={TAB_IDS.items}
          className={css(tabContentStyles.tabContent)}
          style={{ padding: 0 }}
          hidden={activeTabKey !== 'items'}
          tabIndex={0}
        >
          {tableSection}
        </section>

        <section
          id={PANEL_IDS.details}
          role="tabpanel"
          aria-labelledby={TAB_IDS.details}
          className={css(tabContentStyles.tabContent)}
          style={{ paddingLeft: spacingL, paddingRight: spacingL }}
          hidden={activeTabKey !== 'details'}
          tabIndex={0}
        >
          <Text component="p">
            Additional detail content for <strong>{displayName}</strong> can be placed here (forms,
            description lists, or related links).
          </Text>
        </section>
      </div>
    </PageSection>
  );
};

export { TemplateDetail };
