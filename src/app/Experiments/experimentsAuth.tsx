import * as React from 'react';
import {
  Alert,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateIcon,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  PageSection,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';

const STORAGE_KEY = 'experiments-unlocked';
/** Password required to open Experiments pages */
export const EXPERIMENTS_PASSWORD = 'Otvorsa123?';

type ExperimentsAuthContextValue = {
  unlocked: boolean;
  unlock: (password: string) => boolean;
  lock: () => void;
};

const ExperimentsAuthContext = React.createContext<ExperimentsAuthContextValue | undefined>(undefined);

const readUnlocked = (): boolean => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const ExperimentsAuthProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [unlocked, setUnlocked] = React.useState(readUnlocked);

  const unlock = React.useCallback((password: string) => {
    if (password !== EXPERIMENTS_PASSWORD) {
      return false;
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore storage failures (private mode, etc.)
    }
    setUnlocked(true);
    return true;
  }, []);

  const lock = React.useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setUnlocked(false);
  }, []);

  const value = React.useMemo(() => ({ unlocked, unlock, lock }), [unlocked, unlock, lock]);

  return <ExperimentsAuthContext.Provider value={value}>{children}</ExperimentsAuthContext.Provider>;
};

export const useExperimentsAuth = (): ExperimentsAuthContextValue => {
  const ctx = React.useContext(ExperimentsAuthContext);
  if (!ctx) {
    throw new Error('useExperimentsAuth must be used within ExperimentsAuthProvider');
  }
  return ctx;
};

const PasswordFields: React.FunctionComponent<{
  password: string;
  error: string | null;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  inputId: string;
  submitLabel?: string;
}> = ({ password, error, onPasswordChange, onSubmit, inputId, submitLabel = 'Unlock' }) => (
  <Form onSubmit={onSubmit}>
    <FormGroup label="Password" fieldId={inputId} isRequired>
      <TextInput
        type="password"
        id={inputId}
        name={inputId}
        value={password}
        onChange={(_event, value) => onPasswordChange(value)}
        validated={error ? 'error' : 'default'}
        autoFocus
        autoComplete="current-password"
      />
    </FormGroup>
    {error && (
      <Alert variant="danger" isInline title={error} className="pf-v5-u-mt-md" />
    )}
    <Button type="submit" variant="primary" className="pf-v5-u-mt-md">
      {submitLabel}
    </Button>
  </Form>
);

export const ExperimentsPasswordModal: React.FunctionComponent<{
  isOpen: boolean;
  onClose: () => void;
  onUnlocked?: () => void;
}> = ({ isOpen, onClose, onUnlocked }) => {
  const { unlock } = useExperimentsAuth();
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (unlock(password)) {
      setError(null);
      onUnlocked?.();
      onClose();
      return;
    }
    setError('Incorrect password.');
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title="Unlock Experiments"
      isOpen={isOpen}
      onClose={onClose}
      appendTo={() => document.body}
      aria-describedby="experiments-password-description"
      actions={[
        <Button key="unlock" variant="primary" onClick={handleSubmit}>
          Unlock
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <p id="experiments-password-description" className="pf-v5-u-mb-md">
        Enter the password to view Experiments pages. This work is not finalised — WIP.
      </p>
      <Form onSubmit={handleSubmit}>
        <FormGroup label="Password" fieldId="experiments-password-modal" isRequired>
          <TextInput
            type="password"
            id="experiments-password-modal"
            name="experiments-password-modal"
            value={password}
            onChange={(_event, value) => setPassword(value)}
            validated={error ? 'error' : 'default'}
            autoFocus
            autoComplete="current-password"
          />
        </FormGroup>
        {error && (
          <Alert variant="danger" isInline title={error} className="pf-v5-u-mt-md" />
        )}
      </Form>
    </Modal>
  );
};

export const RequireExperimentsAuth: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const { unlocked, unlock } = useExperimentsAuth();
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  if (unlocked) {
    return <>{children}</>;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (unlock(password)) {
      setError(null);
      return;
    }
    setError('Incorrect password.');
  };

  return (
    <PageSection>
      <EmptyState variant="full">
        <EmptyStateIcon icon={LockIcon} />
        <Title headingLevel="h1" size="lg">
          Experiments are locked
        </Title>
        <EmptyStateBody>Enter the password to view this page.</EmptyStateBody>
        <EmptyStateFooter>
          <PasswordFields
            password={password}
            error={error}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            inputId="experiments-password-page"
          />
        </EmptyStateFooter>
      </EmptyState>
    </PageSection>
  );
};

/** Wrap a page element so it requires the Experiments password. */
export const withExperimentsAuth = (element: React.ReactElement): React.ReactElement => (
  <RequireExperimentsAuth>{element}</RequireExperimentsAuth>
);
