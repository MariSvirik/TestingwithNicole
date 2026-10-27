import * as React from 'react';
import {
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
  TextContent,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useNavigate } from 'react-router-dom';

/**
 * PF5 tokens with pixel fallbacks — if every `var()` in the chain is invalid, the browser drops the
 * whole declaration; ending with pixel fallbacks guarantees spacing still applies in this seed.
 */
const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

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

const TemplateIndex: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(5);
  const [search, setSearch] = React.useState('');
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [openActionId, setOpenActionId] = React.useState<string | null>(null);

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

  return (
    <PageSection
      aria-label="Template index"
      padding={{ default: 'noPadding' }}
      style={{ backgroundColor: background100 }}
    >
      {/* Title section: 24px top/sides; 16px bottom (matches template detail title rhythm) */}
      <div
        style={{
          paddingTop: spacingL,
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
                Template
              </Title>
            </TextContent>
          </LevelItem>
          <LevelItem>
            <Button variant="primary">Edit</Button>
          </LevelItem>
        </Level>
      </div>

      {/* Main content: no top padding; 24px right/bottom/left; toolbar flush under header */}
      <div
        style={{
          paddingTop: 0,
          paddingRight: spacingL,
          paddingBottom: spacingL,
          paddingLeft: spacingL,
        }}
      >
        <Toolbar
          id="template-index-toolbar"
          ouiaId="template-index-toolbar"
          inset={{ default: 'insetNone' }}
          style={{ marginBottom: 0 }}
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
                            id="template-index-bulk"
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
                  ouiaId="template-index-pagination-top"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <Table
          aria-label="Template data"
          variant="compact"
          borders
          ouiaId="template-index-table"
          style={{ marginBottom: 0 }}
        >
          <Thead>
            <Tr>
              <Th screenReaderText="Row select" />
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Last modified</Th>
              <Th screenReaderText="Actions" />
            </Tr>
          </Thead>
          <Tbody>
            {slice.map((row) => (
              <Tr key={row.id}>
                <Td dataLabel="Select row">
                  <Checkbox
                    isChecked={selected.has(row.id)}
                    onChange={(_e, c) => toggleRow(row.id, Boolean(c))}
                    aria-label={`Select ${row.name}`}
                    id={`template-select-${row.id}`}
                  />
                </Td>
                <Td dataLabel="Name">
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
          ouiaId="template-index-pagination-bottom"
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
    </PageSection>
  );
};

export { TemplateIndex };
