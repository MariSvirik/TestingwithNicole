import * as React from 'react';
import {
    ActionGroup,
    Alert,
    AlertActionCloseButton,
    AlertGroup,
    Button,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Flex,
    FlexItem,
    Form,
    MenuToggle,
    PageSection,
    Popover,
    Select,
    SelectList,
    SelectOption,
    Stack,
    TextArea,
    TextContent,
    TextInput,
    Title,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const spacingL = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const spacingXs = 'var(--pf-v5-global--spacer--xs, var(--pf-global--spacer--xs, 4px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';

const SLA_OPTIONS = [
    'No service level preference',
    'Standard',
    'Premium',
    'Self-support',
] as const;

const DEBUG_CERTIFICATE_OPTIONS = ['Option1', 'Option2', 'Option3', 'Option4'] as const;

const DEBUG_CERTIFICATE_POPOVER =
    "Authenticate your browser with a debug certificate to access all the organization's repository content, including unpublished environments. You only need to generate a certificate if you want to inspect repositories outside the web UI.";

const DEBUG_CERTIFICATE_LEARN_MORE_URL =
    'https://docs.theforeman.org/latest/Managing_Organizations_and_Locations/index-katello.html';

const toLabel = (name: string) => name.trim().replace(/\s+/g, '_');

type PQCPageProps = {
    title: string;
    documentTitle: string;
    formId: string;
};

const PQCPage: React.FunctionComponent<PQCPageProps> = ({ title, documentTitle, formId }) => {
    useDocumentTitle(documentTitle);

    const [name, setName] = React.useState('Default Organization');
    const [label, setLabel] = React.useState('Default_Organization');
    const [sla, setSla] = React.useState<string>(SLA_OPTIONS[0]);
    const [isSlaOpen, setIsSlaOpen] = React.useState(false);
    const [description, setDescription] = React.useState('');
    const [debugCertificateOption, setDebugCertificateOption] = React.useState<string>(DEBUG_CERTIFICATE_OPTIONS[0]);
    const [isDebugCertificateOpen, setIsDebugCertificateOpen] = React.useState(false);
    const [isGenerateToastVisible, setIsGenerateToastVisible] = React.useState(false);

    const canGenerate = debugCertificateOption !== '';

    const handleNameChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setName(value);
        setLabel(toLabel(value));
    };

    const handleGenerate = () => {
        if (!canGenerate) {
            return;
        }
        setIsGenerateToastVisible(true);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <PageSection
            aria-label={title}
            padding={{ default: 'noPadding' }}
            style={{ backgroundColor: background100 }}
        >
            <section
                aria-label="Title and actions"
                style={{
                    paddingTop: spacingL,
                    paddingRight: spacingL,
                    paddingBottom: spacingMd,
                    paddingLeft: spacingL,
                    boxSizing: 'border-box',
                }}
            >
                <TextContent>
                    <Title headingLevel="h1" size="2xl">
                        {title}
                    </Title>
                </TextContent>
            </section>

            <section
                aria-label="Organization form"
                style={{
                    paddingTop: 0,
                    paddingRight: spacingL,
                    paddingBottom: spacingL,
                    paddingLeft: spacingL,
                    boxSizing: 'border-box',
                }}
            >
                <Form id={formId} isWidthLimited onSubmit={handleSubmit}>
                    <DescriptionList>
                        <DescriptionListGroup>
                            <DescriptionListTerm>Name *</DescriptionListTerm>
                            <DescriptionListDescription>
                                <TextInput
                                    id={`${formId}-name`}
                                    value={name}
                                    onChange={handleNameChange}
                                    isRequired
                                    aria-label="Name"
                                />
                            </DescriptionListDescription>
                        </DescriptionListGroup>

                        <DescriptionListGroup>
                            <DescriptionListTerm>Label *</DescriptionListTerm>
                            <DescriptionListDescription>
                                <TextInput
                                    id={`${formId}-label`}
                                    value={label}
                                    isDisabled
                                    isRequired
                                    aria-label="Label"
                                />
                            </DescriptionListDescription>
                        </DescriptionListGroup>

                        <DescriptionListGroup>
                            <DescriptionListTerm>Default system SLA</DescriptionListTerm>
                            <DescriptionListDescription>
                                <Select
                                    id={`${formId}-sla`}
                                    isOpen={isSlaOpen}
                                    selected={sla}
                                    onSelect={(_event, value) => {
                                        setSla(String(value));
                                        setIsSlaOpen(false);
                                    }}
                                    onOpenChange={setIsSlaOpen}
                                    toggle={(toggleRef) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            onClick={() => setIsSlaOpen(!isSlaOpen)}
                                            isExpanded={isSlaOpen}
                                            style={{ width: '100%' }}
                                            aria-label="Default system SLA"
                                        >
                                            {sla}
                                        </MenuToggle>
                                    )}
                                    popperProps={{ appendTo: () => document.body }}
                                >
                                    <SelectList>
                                        {SLA_OPTIONS.map((option) => (
                                            <SelectOption key={option} value={option}>
                                                {option}
                                            </SelectOption>
                                        ))}
                                    </SelectList>
                                </Select>
                            </DescriptionListDescription>
                        </DescriptionListGroup>

                        <DescriptionListGroup>
                            <DescriptionListTerm>Description</DescriptionListTerm>
                            <DescriptionListDescription>
                                <TextArea
                                    id={`${formId}-description`}
                                    value={description}
                                    onChange={(_event, value) => setDescription(value)}
                                    aria-label="Description"
                                    resizeOrientation="vertical"
                                    rows={4}
                                />
                            </DescriptionListDescription>
                        </DescriptionListGroup>

                        <DescriptionListGroup>
                            <DescriptionListTerm>
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: spacingXs,
                                    }}
                                >
                                    Debug certificate
                                    <Popover
                                        headerContent="Debug certificate"
                                        bodyContent={DEBUG_CERTIFICATE_POPOVER}
                                        footerContent={
                                            <Button
                                                variant="link"
                                                isInline
                                                component="a"
                                                href={DEBUG_CERTIFICATE_LEARN_MORE_URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Learn more
                                            </Button>
                                        }
                                    >
                                        <Button
                                            variant="plain"
                                            aria-label="More information for debug certificate"
                                            style={{ padding: 0 }}
                                        >
                                            <OutlinedQuestionCircleIcon />
                                        </Button>
                                    </Popover>
                                </span>
                            </DescriptionListTerm>
                            <DescriptionListDescription>
                                <Stack hasGutter>
                                    <Select
                                        id={`${formId}-debug-certificate`}
                                        isOpen={isDebugCertificateOpen}
                                        selected={debugCertificateOption}
                                        onSelect={(_event, value) => {
                                            setDebugCertificateOption(String(value));
                                            setIsDebugCertificateOpen(false);
                                        }}
                                        onOpenChange={setIsDebugCertificateOpen}
                                        toggle={(toggleRef) => (
                                            <MenuToggle
                                                ref={toggleRef}
                                                onClick={() => setIsDebugCertificateOpen(!isDebugCertificateOpen)}
                                                isExpanded={isDebugCertificateOpen}
                                                style={{ width: '100%' }}
                                                aria-label="Debug certificate option"
                                            >
                                                {debugCertificateOption}
                                            </MenuToggle>
                                        )}
                                        popperProps={{ appendTo: () => document.body }}
                                    >
                                        <SelectList>
                                            {DEBUG_CERTIFICATE_OPTIONS.map((option) => (
                                                <SelectOption key={option} value={option}>
                                                    {option}
                                                </SelectOption>
                                            ))}
                                        </SelectList>
                                    </Select>
                                    <Flex>
                                        <FlexItem>
                                            <Button
                                                variant="secondary"
                                                isSmall
                                                type="button"
                                                onClick={handleGenerate}
                                                isDisabled={!canGenerate}
                                            >
                                                Generate and download
                                            </Button>
                                        </FlexItem>
                                    </Flex>
                                </Stack>
                            </DescriptionListDescription>
                        </DescriptionListGroup>
                    </DescriptionList>

                    <ActionGroup>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                        <Button variant="secondary" type="button">
                            Cancel
                        </Button>
                    </ActionGroup>
                </Form>
            </section>
            <AlertGroup isToast isLiveRegion>
                {isGenerateToastVisible && (
                    <Alert
                        variant="info"
                        title="Generating and downloading in progress."
                        timeout={8000}
                        onTimeout={() => setIsGenerateToastVisible(false)}
                        actionClose={
                            <AlertActionCloseButton
                                title="Close generating and downloading notification"
                                onClose={() => setIsGenerateToastVisible(false)}
                            />
                        }
                    />
                )}
            </AlertGroup>
        </PageSection>
    );
};

export const PQC: React.FunctionComponent = () => (
    <PQCPage
        title="PQC1"
        documentTitle="PatternFly Seed | PQC1"
        formId="pqc1-organization-form"
    />
);

export const PQCV2: React.FunctionComponent = () => (
    <PQCPage
        title="PQC2"
        documentTitle="PatternFly Seed | PQC2"
        formId="pqc2-organization-form"
    />
);
