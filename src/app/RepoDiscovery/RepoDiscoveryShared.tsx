import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  InputGroup,
  InputGroupItem,
  MenuToggle,
  Modal,
  ModalVariant,
  Progress,
  Select,
  SelectList,
  SelectOption,
  Stack,
  StackItem,
  Text,
  TextInput,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
} from '@patternfly/react-core';
import { UndoIcon } from '@patternfly/react-icons';
import { truncateMiddle } from './repoDiscoveryData';

export const nowrapHeader: React.CSSProperties = { whiteSpace: 'nowrap' };

export const selectedCountLabel = (count: number) => (count > 0 ? `${count} selected` : '');

type SimpleSelectProps = {
  id: string;
  ariaLabel: string;
  selected: string;
  onSelectValue: (value: string) => void;
  options: { value: string; label: string }[];
  isDisabled?: boolean;
};

export const SimpleSelect: React.FunctionComponent<SimpleSelectProps> = ({
  id,
  ariaLabel,
  selected,
  onSelectValue,
  options,
  isDisabled,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedLabel = options.find((option) => option.value === selected)?.label ?? selected;

  return (
    <Select
      id={id}
      isOpen={isOpen}
      selected={selected}
      onSelect={(_event, value) => {
        onSelectValue(String(value));
        setIsOpen(false);
      }}
      onOpenChange={setIsOpen}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          id={`${id}-toggle`}
          isFullWidth
          isDisabled={isDisabled}
          isExpanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={ariaLabel}
        >
          {selectedLabel}
        </MenuToggle>
      )}
      popperProps={{ appendTo: () => document.body }}
    >
      <SelectList>
        {options.map((option) => (
          <SelectOption key={option.value} value={option.value}>
            {option.label}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};

export const TruncatedUrl: React.FunctionComponent<{ url: string }> = ({ url }) => (
  <Tooltip content={url}>
    <span className="app-repo-discovery-url-truncate">{truncateMiddle(url)}</span>
  </Tooltip>
);

export const RowResetButton: React.FunctionComponent<{
  isDirty: boolean;
  onReset: () => void;
  ariaLabel: string;
}> = ({ isDirty, onReset, ariaLabel }) => {
  if (!isDirty) {
    return null;
  }

  return (
    <Tooltip content="Reset">
      <Button variant="plain" type="button" aria-label={ariaLabel} onClick={onReset}>
        <UndoIcon />
      </Button>
    </Tooltip>
  );
};

type ResettableTextInputProps = {
  id?: string;
  value: string;
  originalValue: string;
  ariaLabel: string;
  onChange: (value: string) => void;
  type?: 'text' | 'url' | 'password';
  validated?: 'default' | 'success' | 'error';
  isDisabled?: boolean;
  placeholder?: string;
};

export const ResettableTextInput: React.FunctionComponent<ResettableTextInputProps> = ({
  id,
  value,
  originalValue,
  ariaLabel,
  onChange,
  type,
  validated,
  isDisabled,
  placeholder,
}) => {
  const isDirty = value !== originalValue;

  return (
    <InputGroup>
      <InputGroupItem isFill>
        <TextInput
          id={id}
          type={type}
          value={value}
          validated={validated}
          isDisabled={isDisabled}
          placeholder={placeholder}
          aria-label={ariaLabel}
          onChange={(_event, nextValue) => onChange(nextValue)}
        />
      </InputGroupItem>
      {isDirty && (
        <InputGroupItem>
          <Tooltip content="Reset">
            <Button
              variant="plain"
              type="button"
              aria-label={`Reset ${ariaLabel}`}
              onClick={() => onChange(originalValue)}
            >
              <UndoIcon />
            </Button>
          </Tooltip>
        </InputGroupItem>
      )}
    </InputGroup>
  );
};

export const DiscoveredViewToggle: React.FunctionComponent<{
  view: 'selected' | 'all';
  onChange: (view: 'selected' | 'all') => void;
}> = ({ view, onChange }) => (
  <ToggleGroup aria-label="Show selected or all discovered repositories">
    <ToggleGroupItem
      text="Selected"
      buttonId="discovered-view-selected"
      isSelected={view === 'selected'}
      onChange={() => onChange('selected')}
    />
    <ToggleGroupItem
      text="All"
      buttonId="discovered-view-all"
      isSelected={view === 'all'}
      onChange={() => onChange('all')}
    />
  </ToggleGroup>
);

export const useAddingRepositories = () => {
  const navigate = useNavigate();
  const [isAddingRepositories, setIsAddingRepositories] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const progressIntervalRef = React.useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const clearProgressTimer = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = undefined;
    }
  };

  React.useEffect(
    () => () => {
      clearProgressTimer();
    },
    [],
  );

  const startAddingRepositories = React.useCallback(() => {
    setIsAddingRepositories((alreadyAdding) => {
      if (alreadyAdding) {
        return alreadyAdding;
      }
      clearProgressTimer();
      setProgress(8);
      progressIntervalRef.current = setInterval(() => {
        setProgress((current) => {
          if (current >= 100) {
            clearProgressTimer();
            return 100;
          }
          return Math.min(current + 14, 100);
        });
      }, 400);
      return true;
    });
  }, []);

  const closeAddingRepositories = React.useCallback(() => {
    clearProgressTimer();
    setIsAddingRepositories(false);
    setProgress(0);
  }, []);

  const viewTasks = React.useCallback(
    (productName: string) => {
      closeAddingRepositories();
      const encodedName = encodeURIComponent(productName.trim() || 'product');
      navigate(`/products/${encodedName}?tab=tasks`);
    },
    [closeAddingRepositories, navigate],
  );

  return {
    isAddingRepositories,
    progress,
    startAddingRepositories,
    closeAddingRepositories,
    viewTasks,
  };
};

export const AddingRepositoriesModal: React.FunctionComponent<{
  isOpen: boolean;
  productName: string;
  progress: number;
  onClose: () => void;
  onViewTasks: () => void;
}> = ({ isOpen, productName, progress, onClose, onViewTasks }) => (
  <Modal
    variant={ModalVariant.small}
    title="Creating repositories in progress"
    isOpen={isOpen}
    onClose={onClose}
    appendTo={() => document.body}
    aria-describedby="adding-repositories-description"
    ouiaId="adding-repositories-modal"
    actions={[
      <Button key="close" variant="primary" onClick={onClose}>
        Close
      </Button>,
    ]}
  >
    <Stack hasGutter>
      <StackItem>
        <Text id="adding-repositories-description" component="p">
          Repositories are being created. This could take a few minutes. You may close this window and view more
          information about progress in the{' '}
          <Button variant="link" isInline onClick={onViewTasks}>
            Tasks tab
          </Button>
          .
        </Text>
      </StackItem>
      <StackItem>
        <Progress
          value={progress}
          measureLocation="outside"
          variant={progress >= 100 ? 'success' : undefined}
          aria-label={`Creating repositories for ${productName}`}
        />
      </StackItem>
    </Stack>
  </Modal>
);
