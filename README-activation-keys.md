# PatternFly React Activation Keys Demo

A demonstration of **Red Hat Satellite Activation Keys** detail page built with **PatternFly v5** and React.

## 🚀 Features

- ✅ **Interactive Collapsible Sections** - System Purpose, Content View, Hosts, Repository Sets
- ✅ **Responsive Design** - Side-by-side cards layout
- ✅ **Tabbed Interface** - Host collections, Host groups, Associated hosts
- ✅ **Data Tables** - With pagination controls and interactive links
- ✅ **PatternFly v5 Components** - Using latest design system patterns
- ✅ **Accessibility** - WCAG compliant with proper ARIA labels

## 📋 Page Structure

### Header Section
- Breadcrumb navigation
- Page title with usage badge
- Edit and kebab menu buttons

### Expandable Cards
1. **System Purpose** - Role, SLA, Usage type, Release version
2. **Content View** - Content view and version information  
3. **Hosts** - Tabbed interface with host collections, groups, and associated hosts
4. **Repository Sets** - List of available repositories with pagination

## 🛠️ Tech Stack

- **React 18**
- **PatternFly v5** (react-core, react-table, react-icons)
- **TypeScript**
- **Webpack 5**
- **React Router v7**

## 🏃‍♂️ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Visit the activation keys page
http://localhost:8080/activation-keys
```

## 📁 Key Files

- `src/app/ActivationKeys/ActivationKeys.tsx` - Main component
- `src/app/routes.tsx` - Routing configuration
- `package.json` - Dependencies and PatternFly v5 versions

## 🎯 PatternFly Components Used

- `PageSection`, `Card`, `CardTitle`, `CardBody`
- `ExpandableSection`, `Tabs`, `Table`
- `Breadcrumb`, `Button`, `Label`, `Badge`
- `Flex`, `Grid`, `Stack` layouts
- `Pagination`, `DescriptionList`

## 📸 Preview

The page replicates the Red Hat Satellite interface with:
- Clean, modern PatternFly v5 styling
- Interactive expandable sections
- Professional data presentation
- Responsive mobile-friendly design

---

**Built by:** [MariSvirik](https://github.com/MariSvirik)  
**Framework:** PatternFly v5 + React