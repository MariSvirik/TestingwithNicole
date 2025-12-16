import * as React from 'react';
import { CubesIcon } from '@patternfly/react-icons';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateIcon,
  EmptyStateVariant,
  PageSection,
  Text,
  Title,
} from '@patternfly/react-core';

export interface ISupportProps {
  sampleProp?: string;
}

let Support: React.FunctionComponent<ISupportProps> = () => (
  <PageSection>
    <EmptyState variant={EmptyStateVariant.full}>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h4" size="lg">
        Empty State (Stub Support Module)
      </Title>
      <EmptyStateBody>
        <Text component="p">
          This represents an the empty state pattern in Patternfly. Hopefully it&apos;s simple enough to use but
          flexible enough to meet a variety of needs.
        </Text>
        <Text component="small">
          This text has overridden a css component variable to demonstrate how to apply customizations using
          PatternFly&apos;s CSS tokens.
        </Text>
      </EmptyStateBody>
      <EmptyStateFooter>
        <Button variant="primary">Primary Action</Button>
        <EmptyStateActions>
          <Button variant="link">Multiple</Button>
          <Button variant="link">Action Buttons</Button>
          <Button variant="link">Can</Button>
          <Button variant="link">Go here</Button>
          <Button variant="link">In the secondary</Button>
          <Button variant="link">Action area</Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  </PageSection>
);

export { Support };
