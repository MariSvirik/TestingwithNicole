import React, { useState } from 'react';
import {
    Alert,
    AlertVariant,
    Backdrop,
    Button,
    Checkbox,
    Dropdown,
    DropdownItem,
    DropdownList,
    Form,
    FormGroup,
    MenuToggle,
    Modal,
    ModalVariant,
    Page,
    PageSection,
    PageSectionVariants,
    Stack,
    StackItem,
    Text,
    TextContent,
    Title,
} from '@patternfly/react-core';

export const MirrorRepository: React.FunctionComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [mirrorDependency, setMirrorDependency] = useState(false);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleCheckboxChange = (event, checked: boolean) => {
        setMirrorDependency(checked);
    };

    const onProductSelect = (event, selection) => {
        setSelectedProduct(selection);
        setIsProductOpen(false);
    };

    const onProductToggle = (isOpen) => {
        setIsProductOpen(isOpen);
    };

    const products = [
        'Red Hat Enterprise Linux 9',
        'Red Hat Enterprise Linux 8',
        'Red Hat Enterprise Linux 7',
        'Red Hat Enterprise Linux 6'
    ];

    return (
        <Page>
            <PageSection variant={PageSectionVariants.light}>
                <Title headingLevel="h1" size="2xl">
                    Mirror repository Page
                </Title>
                <Text component="p">
                    This is a simple test page to see if it works.
                </Text>
            </PageSection>

            {/* Grey Overlay */}
            <Backdrop open={isModalOpen} />

            {/* Modal */}
            <Modal
                variant={ModalVariant.medium}
                title="Mirror repository"
                isOpen={isModalOpen}
                onClose={handleModalToggle}
                actions={[
                    <Button key="mirror" variant="primary" isDisabled={!selectedProduct}>
                        Mirror
                    </Button>,
                    <Button key="cancel" variant="link" onClick={handleModalToggle}>
                        Cancel
                    </Button>
                ]}
            >
                <Stack hasGutter>
                    <StackItem>
                        <TextContent>
                            <Text component="p">
                                Mirroring will import the remote flatpak repository <strong>rhel10/firefox-flatpak</strong> into a product.
                                Details from the flatpak remote will automatically populate the repository fields.
                                The repository will be available for syncing once it has been mirrored into a product.
                            </Text>
                        </TextContent>
                    </StackItem>

                    <StackItem>
                        <Alert
                            variant={AlertVariant.info}
                            title="Dependency found"
                            isInline
                        >
                            <Stack hasGutter>
                                <StackItem>
                                    <Text component="p">
                                        Mirror also dependant repository <strong>rhel/10/very dependant</strong>.
                                    </Text>
                                </StackItem>
                                <StackItem>
                                    <Checkbox
                                        id="mirror-dependency"
                                        label="Mirror also rhel/10/very dependant"
                                        isChecked={mirrorDependency}
                                        onChange={handleCheckboxChange}
                                    />
                                </StackItem>
                            </Stack>
                        </Alert>
                    </StackItem>

                    <StackItem>
                        <Form>
                            <FormGroup
                                label="Product"
                                isRequired
                                fieldId="product-select"
                            >
                                <Dropdown
                                    isOpen={isProductOpen}
                                    onOpenChange={onProductToggle}
                                    toggle={(toggleRef) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            onClick={() => onProductToggle(!isProductOpen)}
                                            isExpanded={isProductOpen}
                                        >
                                            {selectedProduct || 'Select a product to mirror the repository into'}
                                        </MenuToggle>
                                    )}
                                >
                                    <DropdownList>
                                        {products.map((product, index) => (
                                            <DropdownItem
                                                key={index}
                                                onClick={() => onProductSelect(null, product)}
                                            >
                                                {product}
                                            </DropdownItem>
                                        ))}
                                    </DropdownList>
                                </Dropdown>
                            </FormGroup>
                        </Form>
                    </StackItem>
                </Stack>
            </Modal>
        </Page>
    );
}; 