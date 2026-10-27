import * as React from 'react';
import {
    ActionGroup,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Checkbox,
    Divider,
    Form,
    FormGroup,
    FormSection,
    Grid,
    GridItem,
    MenuToggle,
    PageSection,
    Radio,
    Select,
    SelectList,
    SelectOption,
    Stack,
    StackItem,
    Text,
    TextArea,
    TextInput,
    Title,
    Wizard,
    WizardStep,
    WizardBody,
    useWizardFooter,
} from '@patternfly/react-core';
import {
    OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

const CreateHost: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = React.useState(0);

    // Host step state
    const [name, setName] = React.useState('petra-mclay');
    const [organization, setOrganization] = React.useState('Demo');
    const [location, setLocation] = React.useState('Brno');
    const [hostGroup, setHostGroup] = React.useState('');
    const [deployOn, setDeployOn] = React.useState('Bare Metal');
    const [contentSource, setContentSource] = React.useState('');
    const [lifecycleEnvironment, setLifecycleEnvironment] = React.useState('');
    const [contentView, setContentView] = React.useState('');
    const [environment, setEnvironment] = React.useState('inherit');
    const [puppetProxy, setPuppetProxy] = React.useState('inherit');
    const [puppetCAProxy, setPuppetCAProxy] = React.useState('inherit');
    const [openscapProxy, setOpenscapProxy] = React.useState('inherit');

    // Operating System step state
    const [architecture, setArchitecture] = React.useState('');
    const [operatingSystem, setOperatingSystem] = React.useState('');
    const [provisioningMethod, setProvisioningMethod] = React.useState('Network based');
    const [image, setImage] = React.useState('');
    const [rootPassword, setRootPassword] = React.useState('**********');
    const [buildMode, setBuildMode] = React.useState(true);
    const [mediaSelection, setMediaSelection] = React.useState('Synced content');
    const [media, setMedia] = React.useState('');
    const [partitionTable, setPartitionTable] = React.useState('');
    const [customPartitionTable, setCustomPartitionTable] = React.useState('');

    // Virtual Machine step state
    const [cpus, setCpus] = React.useState(1);
    const [memory, setMemory] = React.useState(2048);
    const [startVM, setStartVM] = React.useState(true);
    const [firmware, setFirmware] = React.useState('Automatic');
    const [storagePool, setStoragePool] = React.useState('provision');
    const [sizeGB, setSizeGB] = React.useState('10G');
    const [allocationGB, setAllocationGB] = React.useState('0G');
    const [allocationType, setAllocationType] = React.useState('None');
    const [volumeType, setVolumeType] = React.useState('RAW');

    // Dropdown open states
    const [isDeployOnOpen, setIsDeployOnOpen] = React.useState(false);
    const [isContentSourceOpen, setIsContentSourceOpen] = React.useState(false);
    const [isLifecycleEnvironmentOpen, setIsLifecycleEnvironmentOpen] = React.useState(false);
    const [isContentViewOpen, setIsContentViewOpen] = React.useState(false);
    const [isEnvironmentOpen, setIsEnvironmentOpen] = React.useState(false);
    const [isPuppetProxyOpen, setIsPuppetProxyOpen] = React.useState(false);
    const [isPuppetCAProxyOpen, setIsPuppetCAProxyOpen] = React.useState(false);
    const [isOpenscapProxyOpen, setIsOpenscapProxyOpen] = React.useState(false);
    const [isArchitectureOpen, setIsArchitectureOpen] = React.useState(false);
    const [isOperatingSystemOpen, setIsOperatingSystemOpen] = React.useState(false);
    const [isImageOpen, setIsImageOpen] = React.useState(false);
    const [isMediaOpen, setIsMediaOpen] = React.useState(false);
    const [isPartitionTableOpen, setIsPartitionTableOpen] = React.useState(false);
    const [isStoragePoolOpen, setIsStoragePoolOpen] = React.useState(false);
    const [isVolumeTypeOpen, setIsVolumeTypeOpen] = React.useState(false);

    const totalSteps = 7; // Overview, OS, Interface, Parameters, Plugins, Ansible, Puppet

    const onNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const onBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        console.log('Form submitted');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const renderOverviewStep = () => (
        <Form>
            <Grid hasGutter>
                <GridItem span={12}>
                    <FormGroup
                        label={
                            <span>
                                Name <span style={{ color: 'var(--pf-global--danger-color--100)' }}>*</span>
                            </span>
                        }
                        fieldId="name"
                    >
                        <div style={{ display: 'flex', gap: 'var(--pf-global--spacer--xs)', alignItems: 'center' }}>
                            <TextInput
                                id="name"
                                value={name}
                                onChange={(_event, value) => setName(value)}
                                aria-label="Host name"
                                style={{ flex: 1 }}
                            />
                            <Button variant="plain" aria-label="Refresh">
                                <span style={{ fontSize: '16px' }}>⇄</span>
                            </Button>
                        </div>
                        <Text component="small">Also used as the host&apos;s primary interface name</Text>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup 
                        label={
                            <span>
                                Organization <span style={{ color: 'var(--pf-global--danger-color--100)' }}>*</span>
                            </span>
                        } 
                        fieldId="organization"
                    >
                        <Select
                            selected={organization}
                            onSelect={(event, value) => {
                                setOrganization(value as string);
                            }}
                            isOpen={false}
                            toggle={(toggleRef) => (
                                <MenuToggle
                                    ref={toggleRef}
                                    isExpanded={false}
                                    style={{ width: '100%' }}
                                >
                                    {organization}
                                </MenuToggle>
                            )}
                        >
                            <SelectList>
                                <SelectOption value="Demo">Demo</SelectOption>
                            </SelectList>
                        </Select>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup 
                        label={
                            <span>
                                Location <span style={{ color: 'var(--pf-global--danger-color--100)' }}>*</span>
                            </span>
                        } 
                        fieldId="location"
                    >
                        <Select
                            selected={location}
                            onSelect={(event, value) => {
                                setLocation(value as string);
                            }}
                            isOpen={false}
                            toggle={(toggleRef) => (
                                <MenuToggle
                                    ref={toggleRef}
                                    isExpanded={false}
                                    style={{ width: '100%' }}
                                >
                                    {location}
                                </MenuToggle>
                            )}
                        >
                            <SelectList>
                                <SelectOption value="Brno">Brno</SelectOption>
                            </SelectList>
                        </Select>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup label="Host group" fieldId="host-group">
                        <Select
                            selected={hostGroup}
                            onSelect={(event, value) => {
                                setHostGroup(value as string);
                            }}
                            isOpen={false}
                            toggle={(toggleRef) => (
                                <MenuToggle
                                    ref={toggleRef}
                                    isExpanded={false}
                                    style={{ width: '100%' }}
                                >
                                    {hostGroup || 'Select...'}
                                </MenuToggle>
                            )}
                        >
                            <SelectList>
                                <SelectOption value="">Select...</SelectOption>
                            </SelectList>
                        </Select>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup label="Deploy on" fieldId="deploy-on">
                        <div style={{ display: 'flex', gap: 'var(--pf-global--spacer--xs)' }}>
                            <Select
                                selected={deployOn}
                                onSelect={(event, value) => {
                                    setDeployOn(value as string);
                                    setIsDeployOnOpen(false);
                                }}
                                isOpen={isDeployOnOpen}
                                onOpenChange={setIsDeployOnOpen}
                                toggle={(toggleRef) => (
                                    <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => setIsDeployOnOpen(!isDeployOnOpen)}
                                        isExpanded={isDeployOnOpen}
                                        style={{ flex: 1 }}
                                    >
                                        {deployOn}
                                    </MenuToggle>
                                )}
                            >
                                <SelectList>
                                    <SelectOption value="Bare Metal">Bare Metal</SelectOption>
                                    <SelectOption value="Local libvirt (Libvirt)">Local libvirt (Libvirt)</SelectOption>
                                    <SelectOption value="mhulan aws (eu-central-1-EC2)">mhulan aws (eu-central-1-EC2)</SelectOption>
                                    <SelectOption value="vmware (VMware)">vmware (VMware)</SelectOption>
                                </SelectList>
                            </Select>
                            <Button variant="secondary" size="sm">inherit</Button>
                        </div>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup label="Content source" fieldId="content-source">
                        <Select
                            selected={contentSource}
                            onSelect={(event, value) => {
                                setContentSource(value as string);
                                setIsContentSourceOpen(false);
                            }}
                            isOpen={isContentSourceOpen}
                            onOpenChange={setIsContentSourceOpen}
                            toggle={(toggleRef) => (
                                <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsContentSourceOpen(!isContentSourceOpen)}
                                    isExpanded={isContentSourceOpen}
                                    style={{ width: '100%' }}
                                >
                                    {contentSource || 'Select...'}
                                </MenuToggle>
                            )}
                        >
                            <SelectList>
                                <SelectOption value="Bare Metal">Bare Metal</SelectOption>
                                <SelectOption value="Local libvirt (Libvirt)">Local libvirt (Libvirt)</SelectOption>
                                <SelectOption value="mhulan aws (eu-central-1-EC2)">mhulan aws (eu-central-1-EC2)</SelectOption>
                                <SelectOption value="vmware (VMware)">vmware (VMware)</SelectOption>
                            </SelectList>
                        </Select>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup label="Lifecycle environment" fieldId="lifecycle-environment">
                        <Select
                            selected={lifecycleEnvironment}
                            onSelect={(event, value) => {
                                setLifecycleEnvironment(value as string);
                                setIsLifecycleEnvironmentOpen(false);
                            }}
                            isOpen={isLifecycleEnvironmentOpen}
                            onOpenChange={setIsLifecycleEnvironmentOpen}
                            toggle={(toggleRef) => (
                                <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsLifecycleEnvironmentOpen(!isLifecycleEnvironmentOpen)}
                                    isExpanded={isLifecycleEnvironmentOpen}
                                    style={{ width: '100%' }}
                                >
                                    {lifecycleEnvironment || 'Select...'}
                                </MenuToggle>
                            )}
                        >
                            <SelectList>
                                <SelectOption value="">Select...</SelectOption>
                            </SelectList>
                        </Select>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup label="Content view" fieldId="content-view">
                        <Select
                            selected={contentView}
                            onSelect={(event, value) => {
                                setContentView(value as string);
                                setIsContentViewOpen(false);
                            }}
                            isOpen={isContentViewOpen}
                            onOpenChange={setIsContentViewOpen}
                            toggle={(toggleRef) => (
                                <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsContentViewOpen(!isContentViewOpen)}
                                    isExpanded={isContentViewOpen}
                                    style={{ width: '100%' }}
                                >
                                    {contentView || 'Select...'}
                                </MenuToggle>
                            )}
                        >
                            <SelectList>
                                <SelectOption value="">Select...</SelectOption>
                            </SelectList>
                        </Select>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup label="Environment" fieldId="environment">
                        <div style={{ display: 'flex', gap: 'var(--pf-global--spacer--xs)' }}>
                            <Select
                                selected={environment}
                                onSelect={(event, value) => {
                                    setEnvironment(value as string);
                                    setIsEnvironmentOpen(false);
                                }}
                                isOpen={isEnvironmentOpen}
                                onOpenChange={setIsEnvironmentOpen}
                                toggle={(toggleRef) => (
                                    <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => setIsEnvironmentOpen(!isEnvironmentOpen)}
                                        isExpanded={isEnvironmentOpen}
                                        style={{ flex: 1 }}
                                    >
                                        {environment}
                                    </MenuToggle>
                                )}
                            >
                                <SelectList>
                                    <SelectOption value="inherit">inherit</SelectOption>
                                </SelectList>
                            </Select>
                            <Button variant="secondary" size="sm">inherit</Button>
                        </div>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup 
                        label="Puppet proxy" 
                        fieldId="puppet-proxy"
                        labelIcon={<OutlinedQuestionCircleIcon />}
                    >
                        <div style={{ display: 'flex', gap: 'var(--pf-global--spacer--xs)' }}>
                            <Select
                                selected={puppetProxy}
                                onSelect={(event, value) => {
                                    setPuppetProxy(value as string);
                                    setIsPuppetProxyOpen(false);
                                }}
                                isOpen={isPuppetProxyOpen}
                                onOpenChange={setIsPuppetProxyOpen}
                                toggle={(toggleRef) => (
                                    <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => setIsPuppetProxyOpen(!isPuppetProxyOpen)}
                                        isExpanded={isPuppetProxyOpen}
                                        style={{ flex: 1 }}
                                    >
                                        {puppetProxy}
                                    </MenuToggle>
                                )}
                            >
                                <SelectList>
                                    <SelectOption value="inherit">inherit</SelectOption>
                                </SelectList>
                            </Select>
                            <Button variant="secondary" size="sm">inherit</Button>
                        </div>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup 
                        label="Puppet CA proxy" 
                        fieldId="puppet-ca-proxy"
                        labelIcon={<OutlinedQuestionCircleIcon />}
                    >
                        <div style={{ display: 'flex', gap: 'var(--pf-global--spacer--xs)' }}>
                            <Select
                                selected={puppetCAProxy}
                                onSelect={(event, value) => {
                                    setPuppetCAProxy(value as string);
                                    setIsPuppetCAProxyOpen(false);
                                }}
                                isOpen={isPuppetCAProxyOpen}
                                onOpenChange={setIsPuppetCAProxyOpen}
                                toggle={(toggleRef) => (
                                    <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => setIsPuppetCAProxyOpen(!isPuppetCAProxyOpen)}
                                        isExpanded={isPuppetCAProxyOpen}
                                        style={{ flex: 1 }}
                                    >
                                        {puppetCAProxy}
                                    </MenuToggle>
                                )}
                            >
                                <SelectList>
                                    <SelectOption value="inherit">inherit</SelectOption>
                                </SelectList>
                            </Select>
                            <Button variant="secondary" size="sm">inherit</Button>
                        </div>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup 
                        label="OpenSCAP proxy" 
                        fieldId="openscap-proxy"
                        labelIcon={<OutlinedQuestionCircleIcon />}
                    >
                        <div style={{ display: 'flex', gap: 'var(--pf-global--spacer--xs)' }}>
                            <Select
                                selected={openscapProxy}
                                onSelect={(event, value) => {
                                    setOpenscapProxy(value as string);
                                    setIsOpenscapProxyOpen(false);
                                }}
                                isOpen={isOpenscapProxyOpen}
                                onOpenChange={setIsOpenscapProxyOpen}
                                toggle={(toggleRef) => (
                                    <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => setIsOpenscapProxyOpen(!isOpenscapProxyOpen)}
                                        isExpanded={isOpenscapProxyOpen}
                                        style={{ flex: 1 }}
                                    >
                                        {openscapProxy}
                                    </MenuToggle>
                                )}
                            >
                                <SelectList>
                                    <SelectOption value="inherit">inherit</SelectOption>
                                </SelectList>
                            </Select>
                            <Button variant="secondary" size="sm">inherit</Button>
                        </div>
                    </FormGroup>
                </GridItem>
            </Grid>
        </Form>
    );

    const renderAnsibleRolesStep = () => (
        <Form>
            <Grid hasGutter>
                <GridItem span={6}>
                    <FormSection title="Available Ansible Roles">
                        <Text component="p" style={{ marginBottom: 'var(--pf-global--spacer--md)' }}>
                            1 - 10 of 10 items
                        </Text>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--pf-global--spacer--sm)' }}>
                                <Text component="p">{i}. mock.ansible.role.{i}</Text>
                                <Button variant="primary" size="sm">Add</Button>
                            </div>
                        ))}
                    </FormSection>
                </GridItem>
                <GridItem span={6}>
                    <FormSection title="Assigned Ansible Roles">
                        <Text component="p" style={{ color: 'var(--pf-global--Color--200)' }}>
                            No roles assigned
                        </Text>
                    </FormSection>
                </GridItem>
            </Grid>
        </Form>
    );

    const renderVirtualMachineStep = () => (
        <Form>
            <Grid hasGutter>
                <GridItem span={6}>
                    <FormGroup label="CPUs" fieldId="cpus">
                        <TextInput
                            id="cpus"
                            type="number"
                            value={cpus.toString()}
                            onChange={(_event, value) => setCpus(parseInt(value) || 1)}
                            aria-label="Number of CPUs"
                        />
                    </FormGroup>
                </GridItem>
                <GridItem span={6}>
                    <FormGroup label="Memory" fieldId="memory">
                        <TextInput
                            id="memory"
                            type="number"
                            value={memory.toString()}
                            onChange={(_event, value) => setMemory(parseInt(value) || 0)}
                            aria-label="Memory in MB"
                        />
                        <Text component="small" style={{ marginTop: 'var(--pf-global--spacer--xs)' }}>
                            MB
                        </Text>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup fieldId="start">
                        <Checkbox
                            id="start"
                            label="Power ON this machine"
                            isChecked={startVM}
                            onChange={(_event, checked) => setStartVM(checked)}
                        />
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup 
                        label="Firmware" 
                        fieldId="firmware"
                        labelIcon={<OutlinedQuestionCircleIcon />}
                    >
                        <div>
                            <Radio
                                id="firmware-automatic"
                                name="firmware"
                                label="Automatic"
                                isChecked={firmware === 'Automatic'}
                                onChange={() => setFirmware('Automatic')}
                            />
                            <Radio
                                id="firmware-bios"
                                name="firmware"
                                label="BIOS"
                                isChecked={firmware === 'BIOS'}
                                onChange={() => setFirmware('BIOS')}
                            />
                            <Radio
                                id="firmware-uefi"
                                name="firmware"
                                label="UEFI"
                                isChecked={firmware === 'UEFI'}
                                onChange={() => setFirmware('UEFI')}
                            />
                            <Radio
                                id="firmware-uefi-secure"
                                name="firmware"
                                label="UEFI Secure Boot"
                                isChecked={firmware === 'UEFI Secure Boot'}
                                onChange={() => setFirmware('UEFI Secure Boot')}
                            />
                        </div>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormSection title="Storage">
                        <Grid hasGutter>
                            <GridItem span={6}>
                                <FormGroup label="Storage pool" fieldId="storage-pool">
                                    <Select
                                        selected={storagePool}
                                        onSelect={(event, value) => {
                                            setStoragePool(value as string);
                                            setIsStoragePoolOpen(false);
                                        }}
                                        isOpen={isStoragePoolOpen}
                                        onOpenChange={setIsStoragePoolOpen}
                                        toggle={(toggleRef) => (
                                            <MenuToggle
                                                ref={toggleRef}
                                                onClick={() => setIsStoragePoolOpen(!isStoragePoolOpen)}
                                                isExpanded={isStoragePoolOpen}
                                                style={{ width: '100%' }}
                                            >
                                                {storagePool}
                                            </MenuToggle>
                                        )}
                                    >
                                        <SelectList>
                                            <SelectOption value="provision">provision</SelectOption>
                                        </SelectList>
                                    </Select>
                                </FormGroup>
                            </GridItem>
                            <GridItem span={6}>
                                <FormGroup label="Size (GB)" fieldId="size-gb">
                                    <TextInput
                                        id="size-gb"
                                        value={sizeGB}
                                        onChange={(_event, value) => setSizeGB(value)}
                                        aria-label="Size in GB"
                                    />
                                </FormGroup>
                            </GridItem>
                            <GridItem span={6}>
                                <FormGroup label="Allocation (GB)" fieldId="allocation-gb">
                                    <div style={{ display: 'flex', gap: 'var(--pf-global--spacer--xs)' }}>
                                        <TextInput
                                            id="allocation-gb"
                                            value={allocationGB}
                                            onChange={(_event, value) => setAllocationGB(value)}
                                            aria-label="Allocation in GB"
                                        />
                                        <Button
                                            variant={allocationType === 'None' ? 'primary' : 'secondary'}
                                            size="sm"
                                            onClick={() => setAllocationType('None')}
                                        >
                                            None
                                        </Button>
                                        <Button
                                            variant={allocationType === 'Size' ? 'primary' : 'secondary'}
                                            size="sm"
                                            onClick={() => setAllocationType('Size')}
                                        >
                                            Size
                                        </Button>
                                        <Button
                                            variant={allocationType === 'Full' ? 'primary' : 'secondary'}
                                            size="sm"
                                            onClick={() => setAllocationType('Full')}
                                        >
                                            Full
                                        </Button>
                                    </div>
                                </FormGroup>
                            </GridItem>
                            <GridItem span={6}>
                                <FormGroup label="Type" fieldId="volume-type">
                                    <Select
                                        selected={volumeType}
                                        onSelect={(event, value) => {
                                            setVolumeType(value as string);
                                            setIsVolumeTypeOpen(false);
                                        }}
                                        isOpen={isVolumeTypeOpen}
                                        onOpenChange={setIsVolumeTypeOpen}
                                        toggle={(toggleRef) => (
                                            <MenuToggle
                                                ref={toggleRef}
                                                onClick={() => setIsVolumeTypeOpen(!isVolumeTypeOpen)}
                                                isExpanded={isVolumeTypeOpen}
                                                style={{ width: '100%' }}
                                            >
                                                {volumeType}
                                            </MenuToggle>
                                        )}
                                    >
                                        <SelectList>
                                            <SelectOption value="RAW">RAW</SelectOption>
                                            <SelectOption value="QCOW2">QCOW2</SelectOption>
                                        </SelectList>
                                    </Select>
                                </FormGroup>
                            </GridItem>
                            <GridItem span={12}>
                                <Button variant="primary">+ Add Volume</Button>
                            </GridItem>
                        </Grid>
                    </FormSection>
                </GridItem>
            </Grid>
        </Form>
    );

    const renderOperatingSystemStep = () => (
        <Form>
            <Grid hasGutter>
                <GridItem span={12}>
                    <FormGroup 
                        label={
                            <span>
                                Operating system <span style={{ color: 'var(--pf-global--danger-color--100)' }}>*</span>
                            </span>
                        } 
                        fieldId="operating-system"
                    >
                        <Select
                            selected={operatingSystem}
                            onSelect={(event, value) => {
                                setOperatingSystem(value as string);
                                setIsOperatingSystemOpen(false);
                            }}
                            isOpen={isOperatingSystemOpen}
                            onOpenChange={setIsOperatingSystemOpen}
                            toggle={(toggleRef) => (
                                <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsOperatingSystemOpen(!isOperatingSystemOpen)}
                                    isExpanded={isOperatingSystemOpen}
                                    style={{ width: '100%' }}
                                >
                                    {operatingSystem || 'No options available for selected Architecture'}
                                </MenuToggle>
                            )}
                        >
                            <SelectList>
                                <SelectOption value="">No options available</SelectOption>
                            </SelectList>
                        </Select>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup 
                        label={
                            <span>
                                Architecture <span style={{ color: 'var(--pf-global--danger-color--100)' }}>*</span>
                            </span>
                        } 
                        fieldId="architecture"
                    >
                        <Select
                            selected={architecture}
                            onSelect={(event, value) => {
                                setArchitecture(value as string);
                                setIsArchitectureOpen(false);
                            }}
                            isOpen={isArchitectureOpen}
                            onOpenChange={setIsArchitectureOpen}
                            toggle={(toggleRef) => (
                                <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsArchitectureOpen(!isArchitectureOpen)}
                                    isExpanded={isArchitectureOpen}
                                    style={{ width: '100%' }}
                                >
                                    {architecture || 'No options available for selected Architecture'}
                                </MenuToggle>
                            )}
                        >
                            <SelectList>
                                <SelectOption value="">No options available</SelectOption>
                            </SelectList>
                        </Select>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup 
                        label={
                            <span>
                                Provisioning method <span style={{ color: 'var(--pf-global--danger-color--100)' }}>*</span>
                            </span>
                        } 
                        fieldId="provisioning-method"
                    >
                        <div>
                            <Radio
                                id="provisioning-boot-disk"
                                name="provisioning-method"
                                label="Boot disk based"
                                isChecked={provisioningMethod === 'Boot disk based'}
                                onChange={() => setProvisioningMethod('Boot disk based')}
                            />
                            <Radio
                                id="provisioning-network"
                                name="provisioning-method"
                                label="Network based"
                                isChecked={provisioningMethod === 'Network based'}
                                onChange={() => setProvisioningMethod('Network based')}
                            />
                            <Radio
                                id="provisioning-image"
                                name="provisioning-method"
                                label="Image based"
                                isChecked={provisioningMethod === 'Image based'}
                                onChange={() => setProvisioningMethod('Image based')}
                            />
                        </div>
                    </FormGroup>
                </GridItem>
                {provisioningMethod === 'Image based' && (
                    <GridItem span={6}>
                        <FormGroup label="Image" fieldId="image">
                            <Select
                                selected={image}
                                onSelect={(event, value) => {
                                    setImage(value as string);
                                    setIsImageOpen(false);
                                }}
                                isOpen={isImageOpen}
                                onOpenChange={setIsImageOpen}
                                toggle={(toggleRef) => (
                                    <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => setIsImageOpen(!isImageOpen)}
                                        isExpanded={isImageOpen}
                                        style={{ width: '100%' }}
                                    >
                                        {image || 'Select...'}
                                    </MenuToggle>
                                )}
                            >
                                <SelectList>
                                    <SelectOption value="">Select...</SelectOption>
                                </SelectList>
                            </Select>
                        </FormGroup>
                    </GridItem>
                )}
                <GridItem span={12}>
                    <FormGroup fieldId="build-mode">
                        <Checkbox
                            id="build-mode"
                            label="Enable this host for provisioning"
                            isChecked={buildMode}
                            onChange={(_event, checked) => setBuildMode(checked)}
                        />
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup label="Media selection" fieldId="media-selection">
                        <div>
                            <Radio
                                id="media-synced"
                                name="media-selection"
                                label="Synced content"
                                isChecked={mediaSelection === 'Synced content'}
                                onChange={() => setMediaSelection('Synced content')}
                            />
                            <OutlinedQuestionCircleIcon style={{ marginLeft: 'var(--pf-global--spacer--xs)', color: 'var(--pf-global--primary-color--100)' }} />
                            <Radio
                                id="media-all"
                                name="media-selection"
                                label="All media"
                                isChecked={mediaSelection === 'All media'}
                                onChange={() => setMediaSelection('All media')}
                            />
                        </div>
                        <Text component="p" style={{ marginTop: 'var(--pf-global--spacer--sm)' }}>
                            Select the installation media that will be used to provision this host. Choose 'Synced Content' for Synced Kickstart Repositories or 'All Media' for other media.
                        </Text>
                    </FormGroup>
                </GridItem>
                <GridItem span={6}>
                    <FormGroup 
                        label={
                            <span>
                                Media <span style={{ color: 'var(--pf-global--danger-color--100)' }}>*</span>
                            </span>
                        } 
                        fieldId="media"
                    >
                        <Select
                            selected={media}
                            onSelect={(event, value) => {
                                setMedia(value as string);
                                setIsMediaOpen(false);
                            }}
                            isOpen={isMediaOpen}
                            onOpenChange={setIsMediaOpen}
                            toggle={(toggleRef) => (
                                <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsMediaOpen(!isMediaOpen)}
                                    isExpanded={isMediaOpen}
                                    style={{ width: '100%' }}
                                >
                                    {media || 'No options available for selected Operating System'}
                                </MenuToggle>
                            )}
                        >
                            <SelectList>
                                <SelectOption value="">No options available</SelectOption>
                            </SelectList>
                        </Select>
                    </FormGroup>
                </GridItem>
                <GridItem span={6}>
                    <FormGroup 
                        label={
                            <span>
                                Partition table <span style={{ color: 'var(--pf-global--danger-color--100)' }}>*</span>
                            </span>
                        } 
                        fieldId="partition-table"
                    >
                        <Select
                            selected={partitionTable}
                            onSelect={(event, value) => {
                                setPartitionTable(value as string);
                                setIsPartitionTableOpen(false);
                            }}
                            isOpen={isPartitionTableOpen}
                            onOpenChange={setIsPartitionTableOpen}
                            toggle={(toggleRef) => (
                                <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsPartitionTableOpen(!isPartitionTableOpen)}
                                    isExpanded={isPartitionTableOpen}
                                    style={{ width: '100%' }}
                                >
                                    {partitionTable || 'No options available for selected Operating System'}
                                </MenuToggle>
                            )}
                        >
                            <SelectList>
                                <SelectOption value="">No options available</SelectOption>
                            </SelectList>
                        </Select>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup label="Custom partition table" fieldId="custom-partition-table">
                        <TextArea
                            id="custom-partition-table"
                            value={customPartitionTable}
                            onChange={(_event, value) => setCustomPartitionTable(value)}
                            rows={6}
                            aria-label="Custom partition table"
                        />
                        <Text component="small" style={{ marginTop: 'var(--pf-global--spacer--xs)' }}>
                            Text (or ERB template) to be used as your OS disk layout options. Leave empty if you want to use the partition table option
                        </Text>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup 
                        label={
                            <span>
                                Root password <span style={{ color: 'var(--pf-global--danger-color--100)' }}>*</span>
                            </span>
                        } 
                        fieldId="root-password"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-global--spacer--sm)' }}>
                            <TextInput
                                id="root-password"
                                type="password"
                                value={rootPassword}
                                onChange={(_event, value) => setRootPassword(value)}
                                aria-label="Root password"
                            />
                            <Button variant="plain" aria-label="Generate password">
                                <span style={{ 
                                    width: '16px', 
                                    height: '16px', 
                                    backgroundColor: 'var(--pf-global--danger-color--100)',
                                    display: 'inline-block',
                                    borderRadius: '2px'
                                }}>⋯</span>
                            </Button>
                        </div>
                        <Text component="p" style={{ marginTop: 'var(--pf-global--spacer--xs)', color: 'var(--pf-global--Color--200)' }}>
                            Password must be 8 characters or more. The password is currently set by global setting.
                        </Text>
                    </FormGroup>
                </GridItem>
                <GridItem span={12}>
                    <FormGroup label="Provisioning templates" fieldId="provisioning-templates">
                        <Button variant="secondary">Resolve</Button>
                        <Text component="p" style={{ marginTop: 'var(--pf-global--spacer--sm)' }}>
                            Display the templates that will be used to provision this host
                        </Text>
                    </FormGroup>
                </GridItem>
            </Grid>
        </Form>
    );


    return (
        <PageSection variant="light" style={{ backgroundColor: 'white' }}>
            <Stack hasGutter>
                <StackItem>
                    <Breadcrumb style={{ marginBottom: 'var(--pf-global--spacer--md)' }}>
                        <BreadcrumbItem to="#" onClick={() => navigate('/')}>
                            All Hosts
                        </BreadcrumbItem>
                        <BreadcrumbItem isActive>Create Host</BreadcrumbItem>
                    </Breadcrumb>
                </StackItem>
                <StackItem>
                    <Title headingLevel="h1" size="2xl">Create Host</Title>
                </StackItem>
                <StackItem>
                    <Divider style={{ marginBottom: '24px' }} />
                </StackItem>
                <StackItem style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <Wizard
                            key={currentStep}
                            startIndex={currentStep + 1}
                            footer={
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '16px',
                                    paddingTop: '24px',
                                    paddingBottom: 'var(--pf-global--spacer--md)',
                                    paddingLeft: '24px',
                                    paddingRight: 'var(--pf-global--spacer--md)',
                                    backgroundColor: 'white',
                                    borderTop: '1px solid var(--pf-global--BorderColor--300)',
                                    position: 'sticky',
                                    bottom: 0,
                                    zIndex: 100
                                }}>
                                    <Button 
                                        variant="secondary" 
                                        onClick={onBack}
                                        isDisabled={currentStep === 0}
                                    >
                                        Back
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        onClick={onNext}
                                        isDisabled={currentStep === totalSteps - 1}
                                    >
                                        Next
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        onClick={handleSubmit}
                                        isDisabled={currentStep !== totalSteps - 1}
                                    >
                                        Create host
                                    </Button>
                                    <Button variant="link" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </div>
                            }
                        >
                            <WizardStep name="Overview" id="overview-step">
                                <WizardBody>{renderOverviewStep()}</WizardBody>
                            </WizardStep>
                            <WizardStep name="OS" id="os-step">
                                <WizardBody>{renderOperatingSystemStep()}</WizardBody>
                            </WizardStep>
                            <WizardStep name="Interface" id="interface-step">
                                <WizardBody>
                                    <Form><Text component="p">Interface configuration will be implemented here.</Text></Form>
                                </WizardBody>
                            </WizardStep>
                            <WizardStep name="Parameters" id="parameters-step">
                                <WizardBody>
                                    <Form><Text component="p">Parameters configuration will be implemented here.</Text></Form>
                                </WizardBody>
                            </WizardStep>
                            <WizardStep name="Plugins" id="plugins-step">
                                <WizardStep name="Ansible" id="ansible-step">
                                    <WizardBody>{renderAnsibleRolesStep()}</WizardBody>
                                </WizardStep>
                                <WizardStep name="Puppet" id="puppet-step">
                                    <WizardBody>
                                        <Form><Text component="p">Puppet configuration will be implemented here.</Text></Form>
                                    </WizardBody>
                                </WizardStep>
                            </WizardStep>
                        </Wizard>
                    </div>
                </StackItem>
            </Stack>
        </PageSection>
    );
};

export { CreateHost };
