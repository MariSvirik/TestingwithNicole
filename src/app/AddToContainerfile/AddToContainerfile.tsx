import * as React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    CardBody,
    CodeBlock,
    CodeBlockAction,
    CodeBlockCode,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    FileUpload,
    PageSection,
    Radio,
    Stack,
    Text,
    Title,
} from '@patternfly/react-core';
import {
    CodeIcon,
    CopyIcon,
} from '@patternfly/react-icons';
import { useLocation, useNavigate } from 'react-router-dom';

interface AddToContainerfileProps {
    selectedPackages?: Set<number>;
}

const AddToContainerfile: React.FunctionComponent<AddToContainerfileProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedOption, setSelectedOption] = React.useState('manage');
    const [value, setValue] = React.useState('');
    const [filename, setFilename] = React.useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoading, _setIsLoading] = React.useState(false);

    // Get selected packages from location state or default
    const selectedPackages = location.state?.selectedPackages || new Set([2, 5]); // nginx, openssh as defaults
    const selectedCount = selectedPackages.size;

    const handleFileInputChange = (event: any, file: File) => {
        setFilename(file.name);
    };

    const handleDataChange = (event: any, data: string) => {
        setValue(data);
    };

    const handleTextChange = (event: any, text: string) => {
        setValue(text);
    };

    const handleClear = () => {
        setValue('');
        setFilename('');
    };

    const handleReturnToHost = () => {
        navigate('/powerpuffgirl');
    };

    const runCommand = `RUN pip3 install \\
    mysql-connector-python \\
    pino-logger \\
    express-validator \\
    lodash.debounce \\
    moment-timezone`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(runCommand);
    };

    return (
        <PageSection style={{ backgroundColor: 'white' }}>
            <Stack hasGutter>
                <Breadcrumb>
                    <BreadcrumbItem to="#" onClick={handleReturnToHost}>Hosts</BreadcrumbItem>
                    <BreadcrumbItem to="#" onClick={handleReturnToHost}>PowerPuffGirl3.0-Everythingnice.com</BreadcrumbItem>
                    <BreadcrumbItem isActive>Add transient packages to Containerfile</BreadcrumbItem>
                </Breadcrumb>

                <div>
                    <Title headingLevel="h1" size="lg">Add transient packages to Containerfile</Title>
                    <Text component="p" style={{ marginTop: 'var(--pf-global--spacer--sm)' }}>
                        Select a way to add <span style={{ color: 'var(--pf-global--link--Color)' }}>
                            {selectedCount} selected transient packages
                        </span> to your Containerfile and use it in your next image build.
                    </Text>
                    <Text component="p" style={{ marginTop: 'var(--pf-global--spacer--xs)' }}>
                        <Button variant="link" isInline component="a" href="#" style={{ padding: 0, fontSize: 'inherit' }}>
                            Learn more about transient packages.
                        </Button>
                    </Text>
                </div>

                <Stack hasGutter>
                    <div>
                        <Radio
                            isChecked={selectedOption === 'copy'}
                            name="containerfile-option"
                            onChange={() => setSelectedOption('copy')}
                            label="Copy a dnf install command to add to your Containerfile"
                            id="copy-option"
                            style={{ marginBottom: 'var(--pf-global--spacer--sm)' }}
                        />
                        <Text component="p" style={{ marginLeft: 'var(--pf-global--spacer--xl)', color: 'var(--pf-global--Color--200)' }}>
                            Add this command to your container file to incorporate selected transient packages in your next image.
                        </Text>

                        {selectedOption === 'copy' && (
                            <div style={{ marginLeft: 'var(--pf-global--spacer--xl)', marginTop: 'var(--pf-global--spacer--md)' }}>
                                <CodeBlock
                                    actions={
                                        <CodeBlockAction>
                                            <Button variant="plain" onClick={copyToClipboard} aria-label="Copy to clipboard">
                                                <CopyIcon />
                                            </Button>
                                        </CodeBlockAction>
                                    }
                                >
                                    <CodeBlockCode>{runCommand}</CodeBlockCode>
                                </CodeBlock>
                            </div>
                        )}
                    </div>

                    <div>
                        <Radio
                            isChecked={selectedOption === 'manage'}
                            name="containerfile-option"
                            onChange={() => setSelectedOption('manage')}
                            label="Manage Containerfile"
                            id="manage-option"
                            style={{ marginBottom: 'var(--pf-global--spacer--sm)' }}
                        />
                        <Text component="p" style={{ marginLeft: 'var(--pf-global--spacer--xl)', color: 'var(--pf-global--Color--200)' }}>
                            Upload an existing Containerfile and the RUN command with the selected packages will be automatically added.
                            You may also generate a new Containerfile template with embedded packages. You can then download and use it locally.
                            Files are not stored after download.
                        </Text>

                        {selectedOption === 'manage' && (
                            <div style={{ marginLeft: 'var(--pf-global--spacer--xl)', marginTop: 'var(--pf-global--spacer--md)' }}>
                                <Card>
                                    <CardBody>
                                        <FileUpload
                                            id="containerfile-upload"
                                            type="text"
                                            value={value}
                                            filename={filename}
                                            filenamePlaceholder="Drag and drop a file or upload one"
                                            onFileInputChange={handleFileInputChange}
                                            onDataChange={handleDataChange}
                                            onTextChange={handleTextChange}
                                            onClearClick={handleClear}
                                            isLoading={isLoading}
                                            allowEditingUploadedText={false}
                                            browseButtonText="Upload"
                                            clearButtonText="Clear"
                                            dropzoneProps={{
                                                accept: {
                                                    'text/plain': ['.dockerfile', '.containerfile', '.txt']
                                                }
                                            }}
                                        >
                                            <EmptyState>
                                                <EmptyStateIcon icon={CodeIcon} />
                                                <Title headingLevel="h4" size="lg">
                                                    Manage Containerfile
                                                </Title>
                                                <EmptyStateBody>
                                                    Drag a file here, upload Containerfile, or generate a template with embedded transient packages.
                                                </EmptyStateBody>
                                                <Stack hasGutter>
                                                    <Button variant="primary">Upload and modify Containerfile</Button>
                                                    <Button variant="link">Generate a Containerfile template</Button>
                                                </Stack>
                                            </EmptyState>
                                        </FileUpload>
                                    </CardBody>
                                </Card>
                            </div>
                        )}
                    </div>
                </Stack>

                <div style={{ marginTop: 'var(--pf-global--spacer--xl)' }}>
                    <Button variant="link" onClick={handleReturnToHost}>
                        Return to host page
                    </Button>
                </div>
            </Stack>
        </PageSection>
    );
};

export { AddToContainerfile }; 