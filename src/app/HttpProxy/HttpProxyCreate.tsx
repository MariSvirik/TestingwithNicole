import * as React from 'react';
import {
    Backdrop,
    Button,
    Checkbox,
    Dropdown,
    DropdownItem,
    DropdownList,
    ExpandableSection,
    Form,
    FormGroup,
    FormHelperText,
    FormSection,
    HelperText,
    HelperTextItem,
    InputGroup,
    InputGroupItem,
    InputGroupText,
    MenuToggle,
    Modal,
    ModalVariant,
    Page,
    PageSection,
    PageSectionVariants,
    Spinner,
    Text,
    TextArea,
    TextInput,
    Title,
} from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

const ORGANISATIONS = ['Demo'];
const LOCATIONS = ['Brno', 'Default Location', 'Prague'];

export const HttpProxyCreate: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = React.useState(true);
    const [name, setName] = React.useState('');
    const [organisation, setOrganisation] = React.useState('Demo');
    const [location, setLocation] = React.useState('Brno');
    const [isOrganisationOpen, setIsOrganisationOpen] = React.useState(false);
    const [isLocationOpen, setIsLocationOpen] = React.useState(false);
    const [urlPath, setUrlPath] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [cacert, setCacert] = React.useState('');
    const [isDefaultProxy, setIsDefaultProxy] = React.useState(false);
    const [isAuthExpanded, setIsAuthExpanded] = React.useState(false);
    const [connectionTestPassed, setConnectionTestPassed] = React.useState(false);
    const [connectionTestStatus, setConnectionTestStatus] = React.useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle');
    const testTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const URL_PREFIX = 'https://';
    const URL_TEST_DURATION_MS = 2000;

    const url = urlPath.trim() ? `${URL_PREFIX}${urlPath.trim()}` : '';
    const isTestingConnection = connectionTestStatus === 'loading';
    const urlFieldValidated =
        connectionTestStatus === 'success' ? 'success' : connectionTestStatus === 'error' ? 'error' : 'default';

    const isValidHttpUrl = (value: string) => {
        const normalizedUrl = value.trim().toLowerCase();
        return normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://');
    };

    const resetConnectionTest = () => {
        setConnectionTestStatus('idle');
        setConnectionTestPassed(false);
    };

    const runConnectionTest = React.useCallback((urlToTest: string) => {
        if (testTimeoutRef.current) {
            clearTimeout(testTimeoutRef.current);
        }

        const trimmedUrl = urlToTest.trim();
        if (!trimmedUrl) {
            resetConnectionTest();
            return;
        }

        setConnectionTestStatus('loading');
        setConnectionTestPassed(false);

        testTimeoutRef.current = setTimeout(() => {
            if (isValidHttpUrl(trimmedUrl)) {
                setConnectionTestStatus('success');
                setConnectionTestPassed(true);
            } else {
                setConnectionTestStatus('error');
                setConnectionTestPassed(false);
            }
        }, URL_TEST_DURATION_MS);
    }, []);

    React.useEffect(() => {
        resetConnectionTest();
    }, [urlPath, username, password, cacert]);

    React.useEffect(
        () => () => {
            if (testTimeoutRef.current) {
                clearTimeout(testTimeoutRef.current);
            }
        },
        []
    );

    const handleClose = () => {
        setIsModalOpen(false);
        navigate(-1);
    };

    const handleTestConnection = () => {
        runConnectionTest(url);
    };

    const handleUrlKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            runConnectionTest(url);
        }
    };

    const handleUrlPathChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        let nextValue = value;
        if (nextValue.startsWith('https://')) {
            nextValue = nextValue.slice('https://'.length);
        } else if (nextValue.startsWith('http://')) {
            nextValue = nextValue.slice('http://'.length);
        }
        setUrlPath(nextValue);
    };

    const handleSubmit = () => {
        console.log('Create HTTP proxy', { name, organisation, location, url, username, isDefaultProxy });
        handleClose();
    };

    return (
        <Page>
            <PageSection variant={PageSectionVariants.light}>
                <Title headingLevel="h1" size="2xl">
                    HTTP Proxy
                </Title>
                <Text component="p">
                    Create a new HTTP proxy for content management.
                </Text>
            </PageSection>

            <Backdrop open={isModalOpen} />

            <Modal
                variant={ModalVariant.medium}
                title="Create HTTP Proxy"
                isOpen={isModalOpen}
                onClose={handleClose}
                actions={[
                    <Button
                        key="create"
                        variant="primary"
                        onClick={handleSubmit}
                        isDisabled={!name.trim() || !connectionTestPassed}
                    >
                        Create
                    </Button>,
                    <Button
                        key="test"
                        variant="secondary"
                        onClick={handleTestConnection}
                        isLoading={isTestingConnection}
                    >
                        Test connection
                    </Button>,
                    <Button key="cancel" variant="link" onClick={handleClose}>
                        Cancel
                    </Button>,
                ]}
            >
                <Text component="p">
                    HTTP proxy configurations are only used for requests from Foreman or Foreman plugins. System-wide
                    proxies must be configured at operating system level.
                </Text>
                <Form id="create-http-proxy-form" style={{ marginTop: 'var(--pf-v5-global--spacer--lg, 24px)' }}>
                    <FormSection title="Organisation">
                        <FormGroup label="Organisation" fieldId="http-proxy-organisation" isRequired>
                            <Dropdown
                                isOpen={isOrganisationOpen}
                                onOpenChange={setIsOrganisationOpen}
                                toggle={(toggleRef) => (
                                    <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => setIsOrganisationOpen(!isOrganisationOpen)}
                                        isExpanded={isOrganisationOpen}
                                        style={{ width: '100%' }}
                                    >
                                        {organisation}
                                    </MenuToggle>
                                )}
                            >
                                <DropdownList>
                                    {ORGANISATIONS.map((option) => (
                                        <DropdownItem
                                            key={option}
                                            onClick={() => {
                                                setOrganisation(option);
                                                setIsOrganisationOpen(false);
                                            }}
                                        >
                                            {option}
                                        </DropdownItem>
                                    ))}
                                </DropdownList>
                            </Dropdown>
                        </FormGroup>
                    </FormSection>

                    <FormSection title="Location">
                        <FormGroup label="Location" fieldId="http-proxy-location" isRequired>
                            <Dropdown
                                isOpen={isLocationOpen}
                                onOpenChange={setIsLocationOpen}
                                toggle={(toggleRef) => (
                                    <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => setIsLocationOpen(!isLocationOpen)}
                                        isExpanded={isLocationOpen}
                                        style={{ width: '100%' }}
                                    >
                                        {location}
                                    </MenuToggle>
                                )}
                            >
                                <DropdownList>
                                    {LOCATIONS.map((option) => (
                                        <DropdownItem
                                            key={option}
                                            onClick={() => {
                                                setLocation(option);
                                                setIsLocationOpen(false);
                                            }}
                                        >
                                            {option}
                                        </DropdownItem>
                                    ))}
                                </DropdownList>
                            </Dropdown>
                        </FormGroup>
                    </FormSection>

                    <FormGroup label="Name" fieldId="http-proxy-name" isRequired>
                        <TextInput
                            id="http-proxy-name"
                            name="http-proxy-name"
                            type="text"
                            value={name}
                            onChange={(_event, value) => setName(value)}
                            aria-label="Name"
                        />
                    </FormGroup>

                    <FormGroup label="URL" fieldId="http-proxy-url" isRequired>
                        <InputGroup>
                            <InputGroupText>{URL_PREFIX}</InputGroupText>
                            <InputGroupItem isFill>
                                <TextInput
                                    id="http-proxy-url"
                                    name="http-proxy-url"
                                    type="text"
                                    value={urlPath}
                                    validated={urlFieldValidated}
                                    onChange={handleUrlPathChange}
                                    onKeyDown={handleUrlKeyDown}
                                    placeholder="proxy.example.com:8080"
                                    aria-label="URL"
                                    aria-describedby="http-proxy-url-helper"
                                />
                            </InputGroupItem>
                            {isTestingConnection && (
                                <InputGroupItem>
                                    <InputGroupText>
                                        <Spinner size="md" aria-label="Testing connection" />
                                    </InputGroupText>
                                </InputGroupItem>
                            )}
                        </InputGroup>
                        <FormHelperText id="http-proxy-url-helper">
                            {isTestingConnection ? (
                                <Text component="small">Testing connection</Text>
                            ) : (
                                <HelperText>
                                    {connectionTestStatus === 'success' && (
                                        <HelperTextItem variant="success">Connection tested</HelperTextItem>
                                    )}
                                    {connectionTestStatus === 'error' && (
                                        <HelperTextItem variant="error">
                                            Connection invalid. If authentication is required, enter credentials in the
                                            Authentication section and test again.
                                        </HelperTextItem>
                                    )}
                                    {connectionTestStatus === 'idle' && (
                                        <HelperTextItem>
                                            Enter an https:// URL and then test the connection.
                                        </HelperTextItem>
                                    )}
                                </HelperText>
                            )}
                        </FormHelperText>
                    </FormGroup>

                    <FormGroup fieldId="http-proxy-default">
                        <Checkbox
                            id="http-proxy-default"
                            label="Set this proxy as the default for content, updating the 'Default HTTP Proxy' setting."
                            isChecked={isDefaultProxy}
                            onChange={(_event, checked) => setIsDefaultProxy(checked)}
                        />
                    </FormGroup>

                    <ExpandableSection
                        toggleText="Authentication (optional)"
                        isExpanded={isAuthExpanded}
                        onToggle={(_event, isExpanded) => setIsAuthExpanded(isExpanded)}
                        isIndented
                    >
                        <Text
                            component="small"
                            style={{ marginTop: 'var(--pf-v5-global--spacer--xs, 4px)' }}
                        >
                            Only complete these fields if your proxy requires authentication.
                        </Text>
                        <FormGroup label="Username" fieldId="http-proxy-username">
                            <TextInput
                                id="http-proxy-username"
                                name="http-proxy-username"
                                type="text"
                                value={username}
                                onChange={(_event, value) => setUsername(value)}
                                aria-label="Username"
                            />
                        </FormGroup>

                        <FormGroup label="Password" fieldId="http-proxy-password">
                            <InputGroup>
                                <InputGroupItem isFill>
                                    <TextInput
                                        id="http-proxy-password"
                                        name="http-proxy-password"
                                        type="password"
                                        value={password}
                                        onChange={(_event, value) => setPassword(value)}
                                        aria-label="Password"
                                    />
                                </InputGroupItem>
                                <InputGroupItem>
                                    <Button variant="control" aria-label="Edit password">
                                        <PencilAltIcon />
                                    </Button>
                                </InputGroupItem>
                            </InputGroup>
                        </FormGroup>

                        <FormGroup label="Cacert" fieldId="http-proxy-cacert">
                            <TextArea
                                id="http-proxy-cacert"
                                name="http-proxy-cacert"
                                value={cacert}
                                onChange={(_event, value) => setCacert(value)}
                                aria-label="Cacert"
                                rows={2}
                                resizeOrientation="vertical"
                            />
                            <FormHelperText>
                                SSL CA certificate to use if authentication is required.
                            </FormHelperText>
                        </FormGroup>
                    </ExpandableSection>
                </Form>
            </Modal>
        </Page>
    );
};
