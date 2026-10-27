import * as React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Dropdown,
    DropdownItem,
    DropdownList,
    Flex,
    FlexItem,
    MenuToggle,
    PageSection,
    Progress,
    Stack,
    StackItem,
    Tab,
    TabContent,
    TabContentBody,
    TabTitleText,
    Tabs,
    Text,
    TextContent,
    Title,
} from '@patternfly/react-core';
import {
    EllipsisVIcon,
    ExclamationCircleIcon,
    RedoIcon,
} from '@patternfly/react-icons';
import { useNavigate, useParams } from 'react-router-dom';

const taskDetailMock = {
    taskName: 'Refresh Alternate Content Source refresh alternate content source',
    state: 'Failed',
    triggeredBy: 'admin',
    label: 'Actions::BulkAction',
    executionType: 'Immediate',
    id: '9762543820108bvvy6',
    startedAt: '09:15 UTC, 06 March 2023',
    endedAt: '09:15 UTC, 06 March 2023',
    progress: 100,
    errorMessage: "ActiveRecord::SubclassNotFound: The single-table inheritance mechanism failed to locate the subclass: 'Setting::RhCloud'. This error is raised because the column 'category' is reserved for storing the class in case of inheritance. Please rename this column if you didn't intend it to be used for storing the inheritance class or overwrite Setting.inheritance_column to use another column for that information.",
    input: '{}',
    output: '{}',
};

const TaskDetail: React.FunctionComponent = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
    const [isKebabOpen, setIsKebabOpen] = React.useState(false);

    const handleTabClick = (_event: React.MouseEvent, tabIndex: string | number) => {
        setActiveTabKey(tabIndex);
    };

    return (
        <PageSection style={{ backgroundColor: 'white' }}>
            <Stack hasGutter>
                <StackItem>
                    <Breadcrumb>
                        <BreadcrumbItem to="#" onClick={() => navigate('/tasks')}>
                            Tasks
                        </BreadcrumbItem>
                        <BreadcrumbItem isActive>{taskId || 'Synhosts_task'}</BreadcrumbItem>
                    </Breadcrumb>
                </StackItem>
                <StackItem>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                        <FlexItem>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <Title headingLevel="h1" size="2xl">
                                    {taskDetailMock.taskName}
                                </Title>
                                <ExclamationCircleIcon style={{ color: 'var(--pf-global--danger-color--100)', flexShrink: 0 }} />
                            </Flex>
                        </FlexItem>
                        <FlexItem>
                            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                                <Button variant="primary" icon={<RedoIcon />}>
                                    Auto reload
                                </Button>
                                <Button variant="secondary">Dynflow console</Button>
                                <Dropdown
                                    isOpen={isKebabOpen}
                                    onOpenChange={setIsKebabOpen}
                                    toggle={(toggleRef) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            variant="plain"
                                            onClick={() => setIsKebabOpen(!isKebabOpen)}
                                            isExpanded={isKebabOpen}
                                            aria-label="Actions"
                                        >
                                            <EllipsisVIcon />
                                        </MenuToggle>
                                    )}
                                    popperProps={{ appendTo: () => document.body }}
                                >
                                    <DropdownList>
                                        <DropdownItem key="action1">Action</DropdownItem>
                                    </DropdownList>
                                </Dropdown>
                            </Flex>
                        </FlexItem>
                    </Flex>
                </StackItem>
                <StackItem>
                    <DescriptionList isHorizontal columnModifier={{ default: '2Col' }}>
                        <DescriptionListGroup>
                            <DescriptionListTerm>Triggered by</DescriptionListTerm>
                            <DescriptionListDescription>{taskDetailMock.triggeredBy}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                            <DescriptionListTerm>Label</DescriptionListTerm>
                            <DescriptionListDescription>{taskDetailMock.label}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                            <DescriptionListTerm>Execution type</DescriptionListTerm>
                            <DescriptionListDescription>{taskDetailMock.executionType}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                            <DescriptionListTerm>Id</DescriptionListTerm>
                            <DescriptionListDescription>{taskDetailMock.id}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                            <DescriptionListTerm>Started at</DescriptionListTerm>
                            <DescriptionListDescription>{taskDetailMock.startedAt}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                            <DescriptionListTerm>Ended at</DescriptionListTerm>
                            <DescriptionListDescription>{taskDetailMock.endedAt}</DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                            <DescriptionListTerm>State</DescriptionListTerm>
                            <DescriptionListDescription>{taskDetailMock.state}</DescriptionListDescription>
                        </DescriptionListGroup>
                    </DescriptionList>
                </StackItem>
                <StackItem>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <span>{taskDetailMock.progress}%</span>
                        <FlexItem style={{ flex: 1 }}>
                            <Progress
                                value={taskDetailMock.progress}
                                min={0}
                                max={100}
                                measureLocation="outside"
                                variant="danger"
                            />
                        </FlexItem>
                        <ExclamationCircleIcon style={{ color: 'var(--pf-global--danger-color--100)' }} />
                    </Flex>
                </StackItem>
                <StackItem>
                    <Title headingLevel="h2" size="lg">
                        Error
                    </Title>
                    <TextContent>
                        <Text component="p">{taskDetailMock.errorMessage}</Text>
                    </TextContent>
                </StackItem>
                <StackItem>
                    <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
                        <Tab
                            eventKey={0}
                            title={
                                <span>
                                    <ExclamationCircleIcon style={{ marginRight: 'var(--pf-global--spacer--xs)', color: 'var(--pf-global--danger-color--100)', verticalAlign: 'middle' }} />
                                    <TabTitleText>Execution details</TabTitleText>
                                </span>
                            }
                            aria-label="Execution details tab"
                        >
                            <TabContent eventKey={0} id="execution-details-content">
                                <TabContentBody>
                                    <Stack hasGutter>
                                        <StackItem>
                                            <Title headingLevel="h3" size="md">
                                                Input
                                            </Title>
                                            <pre style={{ background: 'var(--pf-global--BackgroundColor--100)', padding: 'var(--pf-global--spacer--md)', border: '1px solid var(--pf-global--BorderColor--300)', borderRadius: 'var(--pf-global--BorderRadius--sm)', margin: 0 }}>
                                                {taskDetailMock.input}
                                            </pre>
                                        </StackItem>
                                        <StackItem>
                                            <Title headingLevel="h3" size="md">
                                                Output
                                            </Title>
                                            <pre style={{ background: 'var(--pf-global--BackgroundColor--100)', padding: 'var(--pf-global--spacer--md)', border: '1px solid var(--pf-global--BorderColor--300)', borderRadius: 'var(--pf-global--BorderRadius--sm)', margin: 0 }}>
                                                {taskDetailMock.output}
                                            </pre>
                                        </StackItem>
                                        <StackItem>
                                            <Title headingLevel="h3" size="md">
                                                Exception
                                            </Title>
                                            <pre style={{ background: 'var(--pf-global--BackgroundColor--100)', padding: 'var(--pf-global--spacer--md)', border: '1px solid var(--pf-global--BorderColor--300)', borderRadius: 'var(--pf-global--BorderRadius--sm)', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                {taskDetailMock.errorMessage}
                                            </pre>
                                        </StackItem>
                                    </Stack>
                                </TabContentBody>
                            </TabContent>
                        </Tab>
                        <Tab eventKey={1} title={<TabTitleText>Locks</TabTitleText>} aria-label="Locks tab">
                            <TabContent eventKey={1} id="locks-content">
                                <TabContentBody>
                                    <Text component="p">Locks content would be displayed here.</Text>
                                </TabContentBody>
                            </TabContent>
                        </Tab>
                        <Tab eventKey={2} title={<TabTitleText>Raw</TabTitleText>} aria-label="Raw tab">
                            <TabContent eventKey={2} id="raw-content">
                                <TabContentBody>
                                    <Text component="p">Raw content would be displayed here.</Text>
                                </TabContentBody>
                            </TabContent>
                        </Tab>
                    </Tabs>
                </StackItem>
            </Stack>
        </PageSection>
    );
};

export { TaskDetail };
