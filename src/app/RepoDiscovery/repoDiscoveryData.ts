export type RepositoryType = 'yum' | 'container';
export type ProductMode = 'new' | 'existing';

export type DiscoveredRepository = {
  id: string;
  url: string;
  name: string;
  label: string;
  originalName: string;
  originalLabel: string;
};

export const EXISTING_PRODUCTS = ['AEE', 'RHEL 9 BaseOS', 'Fedora EPEL'];
export const GPG_KEYS = ['None', 'RPM-GPG-KEY-fedora-epel-9', 'RPM-GPG-KEY-redhat-release'];
export const REGISTRIES: { value: string; label: string }[] = [
  { value: 'redhat', label: 'Red Hat Registry (registry.redhat.io)' },
  { value: 'quay', label: 'Quay.io' },
  { value: 'docker', label: 'Docker Hub' },
  { value: 'custom', label: 'Custom' },
];

const YUM_DISCOVERY_URLS = [
  'https://dl.fedoraproject.org/pub/epel/9/Everything/x86_64/',
  'https://dl.fedoraproject.org/pub/epel/9/Everything/source/tree/',
  'https://dl.fedoraproject.org/pub/epel/9/Everything/aarch64/',
  'https://dl.fedoraproject.org/pub/epel/9/Everything/ppc64le/',
  'https://dl.fedoraproject.org/pub/epel/9/Everything/s390x/',
  'https://dl.fedoraproject.org/pub/epel/9/Modular/x86_64/',
  'https://dl.fedoraproject.org/pub/epel/9/Modular/aarch64/',
  'https://dl.fedoraproject.org/pub/epel/8/Everything/x86_64/',
  'https://dl.fedoraproject.org/pub/epel/8/Everything/aarch64/',
  'https://dl.fedoraproject.org/pub/epel/8/Modular/x86_64/',
  'https://mirrors.fedoraproject.org/metalink?repo=epel-9&arch=x86_64',
  'https://download.fedoraproject.org/pub/fedora/linux/releases/40/Everything/x86_64/os/',
];

const CONTAINER_DISCOVERY_URLS = [
  'registry.redhat.io/ubi9/ubi',
  'registry.redhat.io/ubi9/ubi-minimal',
  'registry.redhat.io/ubi9/ubi-micro',
  'registry.redhat.io/ubi9/ubi-init',
  'registry.redhat.io/ubi8/ubi',
  'registry.redhat.io/ubi8/ubi-minimal',
  'registry.redhat.io/rhel9/support-tools',
  'registry.redhat.io/rhel9/postgresql-15',
  'registry.redhat.io/rhel8/postgresql-13',
  'registry.redhat.io/openshift4/ose-cli',
];

export const toLabel = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

const urlEndName = (url: string) => {
  const normalized = url.includes('://') ? url : `https://${url}`;
  try {
    const pathname = new URL(normalized).pathname.replace(/\/+$/, '');
    const parts = pathname.split('/').filter(Boolean);
    const end = parts.slice(-2).join('/');
    return end ? `/${end}` : '/';
  } catch {
    const parts = url.replace(/\/+$/, '').split('/').filter(Boolean);
    const end = parts.slice(-2).join('/');
    return end ? `/${end}` : '/';
  }
};

const reposFromUrls = (urls: string[], idPrefix: string): DiscoveredRepository[] =>
  urls.map((url, index) => {
    const name = urlEndName(url);
    return {
      id: `${idPrefix}-${index + 1}`,
      url,
      name,
      label: toLabel(name),
      originalName: name,
      originalLabel: toLabel(name),
    };
  });

export const YUM_DISCOVERY_RESULTS = reposFromUrls(YUM_DISCOVERY_URLS, 'yum');
export const CONTAINER_DISCOVERY_RESULTS = reposFromUrls(CONTAINER_DISCOVERY_URLS, 'ctr');

export const truncateMiddle = (value: string, maxLength = 48) => {
  if (value.length <= maxLength) {
    return value;
  }
  const side = Math.floor((maxLength - 1) / 2);
  return `${value.slice(0, side)}…${value.slice(-side)}`;
};

export const isValidHttpUrl = (value: string) => {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const urlValidated = (value: string): 'default' | 'success' | 'error' => {
  if (!value.trim()) {
    return 'default';
  }
  return isValidHttpUrl(value) ? 'success' : 'error';
};
