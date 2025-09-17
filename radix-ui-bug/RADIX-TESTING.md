# Radix UI Hydration Testing

This application has been set up to investigate hydration issues with Radix UI components in RedwoodSDK.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the displayed URL (typically `http://localhost:5173`)

## Testing

1. **Home Page**: Navigate to the home page to see navigation links
2. **Radix Demo**: Click "View Radix UI Demo" or navigate to `/radix-demo`
3. **Component Testing**: Interact with various components to test state management
4. **Hydration Monitoring**: Check browser console for hydration warnings/errors

## Components Included

The demo page includes comprehensive examples of:

- **Form Controls**: Checkbox, Switch, Toggle, Labels
- **Progress & Sliders**: Progress bars, Range sliders
- **Selection**: Radio groups, Select dropdowns
- **Layout**: Tabs, Accordion, Separators
- **Interactive**: Dialogs, Collapsible content, Toasts
- **Additional**: Avatars, Tooltips, Hover cards

## Expected Issues

Watch for:
- Hydration mismatches in the browser console
- Component state not persisting after hydration
- Event handlers not working initially
- Portal-based components (Dialog, Toast, Tooltip) rendering issues
- Accessibility attributes not matching between server/client

## Work Log

See `.worklogs/justin/2025-09-16-radix-ui-hydration-investigation.md` for detailed investigation progress and findings.
