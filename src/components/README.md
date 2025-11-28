# UI Components Library

This directory contains reusable UI components for the FindMenu Admin application.

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`from-blue-600 to-blue-700`)
- **Secondary**: Gray tones
- **Success**: Green (`from-green-600 to-green-700`)
- **Danger**: Red (`from-red-600 to-red-700`)
- **Warning**: Amber (`from-amber-600 to-amber-700`)
- **Accent**: Orange (`from-orange-600 to-orange-700`)

### Typography
- **Font Family**: Inter, system fonts
- **Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- **Weights**: normal (400), medium (500), semibold (600), bold (700)

## 📦 Components

### Core Components

#### Button
```jsx
import { Button } from '../components/ui';

<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

**Props:**
- `variant`: primary | secondary | success | danger | warning | accent | ghost
- `size`: sm | md | lg | xl
- `loading`: boolean
- `icon`: React element
- `iconPosition`: left | right

#### Card
```jsx
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui';

<Card>
  <CardHeader>Header content</CardHeader>
  <CardBody>Body content</CardBody>
  <CardFooter>Footer content</CardFooter>
</Card>
```

#### Input
```jsx
import { Input } from '../components/ui';

<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  error="Error message"
  icon={<Mail size={20} />}
/>
```

#### Select
```jsx
import { Select } from '../components/ui';

<Select
  label="Category"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
  placeholder="Select option"
/>
```

#### Modal
```jsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../components/ui';

<Modal isOpen={true} onClose={handleClose} title="Modal Title">
  <ModalBody>
    Modal content
  </ModalBody>
  <ModalFooter>
    <Button onClick={handleClose}>Close</Button>
  </ModalFooter>
</Modal>
```

#### Badge
```jsx
import { Badge } from '../components/ui';

<Badge variant="success">Available</Badge>
```

#### Table
```jsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item 1</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Specialized Components

#### StatCard
```jsx
import { StatCard } from '../components/ui';

<StatCard
  title="Total Items"
  value={150}
  change="+12%"
  changeType="positive"
  icon={<Package className="w-6 h-6" />}
  color="from-blue-500 to-blue-600"
/>
```

#### ImageUpload
```jsx
import { ImageUpload } from '../components/ui';

<ImageUpload
  value={imageFile}
  onChange={(file, preview) => handleImageChange(file, preview)}
  onRemove={() => handleImageRemove()}
/>
```

#### LoadingSpinner
```jsx
import { LoadingSpinner } from '../components/ui';

<LoadingSpinner size="lg" text="Loading..." />
```

## 🔔 Notification System

### NotificationProvider
Wrap your app with the NotificationProvider to enable notifications:

```jsx
import { NotificationProvider } from '../components/providers/NotificationProvider';

<NotificationProvider>
  <App />
</NotificationProvider>
```

### useNotification Hook
```jsx
import { useNotification } from '../components/providers/NotificationProvider';

const { success, error, warning, info } = useNotification();

// Usage
success('Success!', 'Item created successfully');
error('Error!', 'Failed to save item');
warning('Warning!', 'Please check your input');
info('Info', 'New feature available');
```

## 🎨 CSS Classes

### Layout Classes
- `.grid-2`: 2-column responsive grid
- `.grid-3`: 3-column responsive grid  
- `.grid-4`: 4-column responsive grid
- `.page-header`: Standard page header
- `.page-title`: Main page title
- `.page-subtitle`: Page subtitle

### Utility Classes
- `.line-clamp-1`: Single line text truncation
- `.line-clamp-2`: Two line text truncation
- `.line-clamp-3`: Three line text truncation

### Component Classes
- `.card`: Base card component
- `.btn`: Base button component
- `.form-input`: Form input styling
- `.form-select`: Form select styling
- `.badge`: Badge component
- `.stat-card`: Statistics card
- `.modal-overlay`: Modal backdrop
- `.notification`: Notification component

## 🚀 Best Practices

1. **Consistency**: Always use the provided components instead of creating custom ones
2. **Accessibility**: All components include proper ARIA attributes
3. **Responsive**: Components are mobile-first and responsive
4. **Performance**: Components are optimized and use React.forwardRef
5. **Type Safety**: Use TypeScript for better development experience

## 📱 Responsive Design

All components are designed mobile-first with these breakpoints:
- **sm**: 640px and up
- **md**: 768px and up  
- **lg**: 1024px and up
- **xl**: 1280px and up

## 🎯 Component Guidelines

### Do's
- ✅ Use semantic HTML elements
- ✅ Include proper accessibility attributes
- ✅ Follow the established design system
- ✅ Use consistent spacing and typography
- ✅ Make components reusable and flexible

### Don'ts
- ❌ Create inline styles
- ❌ Use hardcoded colors or sizes
- ❌ Ignore accessibility requirements
- ❌ Create components that are too specific
- ❌ Forget to handle loading and error states

## 🔧 Development

To add a new component:

1. Create the component in `/src/components/ui/`
2. Export it from `/src/components/ui/index.js`
3. Add documentation and examples
4. Test across different screen sizes
5. Ensure accessibility compliance