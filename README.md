# Accessible Multi-step Signup Form

A fully accessible, 3-step signup form built with HTML, CSS, and vanilla JavaScript. This form demonstrates best practices for web accessibility, including ARIA attributes, keyboard navigation, and screen reader support.

## Features

### Form Structure
- **3 Steps**: Account Information → Profile Information → Review & Confirm
- **Progress Indicator**: Visual and accessible progress tracking
- **State Management**: Form data is preserved when navigating between steps
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Accessibility Features

#### ARIA Attributes
- `role="form"` on the main form element
- `aria-labelledby` to associate form sections with headings
- `aria-hidden` to properly hide/show form steps
- `aria-required="true"` on required fields
- `aria-describedby` to link inputs with error messages and help text
- `aria-invalid` to indicate validation state
- `aria-live="polite"` on error messages for screen reader announcements
- `aria-current="step"` on the active progress step
- `aria-pressed` on the password visibility toggle button
- `role="alert"` on error messages for immediate screen reader feedback

#### Keyboard Navigation
- **Tab Navigation**: All interactive elements are keyboard accessible
- **Enter Key**: 
  - On steps 1-2: Moves to the next step (if valid)
  - On step 3: Submits the form
- **Focus Management**: 
  - Focus automatically moves to the first input when changing steps
  - Focus moves to the first invalid field when validation fails
  - Focus moves to success message after form submission
- **Focus Indicators**: Clear visual focus indicators on all interactive elements

#### Screen Reader Support
- **Semantic HTML**: Proper use of headings, labels, and form elements
- **Screen Reader Only Text**: Hidden but accessible text for context (`.sr-only` class)
- **Live Regions**: Error messages use `aria-live` for dynamic updates
- **Descriptive Labels**: All form fields have associated labels
- **Help Text**: Password requirements are announced to screen readers

#### Visual Accessibility
- **Color Contrast**: Meets WCAG AA standards for text contrast
- **Focus Indicators**: High-contrast focus outlines on all interactive elements
- **Error States**: Visual and programmatic indication of errors
- **Required Fields**: Visual indicator (asterisk) and `aria-required` attribute

### Validation Features

#### Step 1: Account Information
- **Email Validation**: 
  - Format validation (HTML5 + custom regex)
  - Real-time validation on blur
- **Password Validation**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - Real-time validation feedback
- **Password Confirmation**:
  - Must match the password field
  - Real-time validation

#### Step 2: Profile Information
- **Name Fields**: Required, cannot be empty
- **Avatar Upload**:
  - Optional field
  - File type validation (images only)
  - File size validation (max 5MB)
  - Image preview functionality

#### Step 3: Review
- Displays all entered information
- Allows users to review before submission

### User Experience Features

- **Progress Indicator**: Visual representation of current step and completion status
- **Smooth Transitions**: Fade-in animations when switching steps
- **Password Visibility Toggle**: Eye icon to show/hide password
- **Avatar Preview**: Instant preview of uploaded profile picture
- **Inline Error Messages**: Clear, contextual error messages
- **Disabled States**: Next buttons are disabled until current step is valid
- **Success Message**: Confirmation message after successful submission

## File Structure

```
.
├── signup.html      # Main HTML file with form structure
├── styles.css       # All styling and responsive design
├── script.js        # Form logic, validation, and accessibility features
└── README.md        # This file
```

## Usage

1. Open `signup.html` in a modern web browser
2. Fill out the form step by step:
   - **Step 1**: Enter email and password
   - **Step 2**: Enter name and optionally upload an avatar
   - **Step 3**: Review your information and submit
3. Navigate using:
   - Mouse/touch for visual navigation
   - Keyboard (Tab, Enter) for keyboard navigation
   - Screen reader for assistive technology users

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- All modern browsers with JavaScript enabled

## Accessibility Standards

This form follows:
- **WCAG 2.1 Level AA** guidelines
- **WAI-ARIA 1.1** specifications
- **HTML5** semantic markup
- **Best practices** for form accessibility

## Testing with Screen Readers

The form has been designed to work with:
- **NVDA** (Windows)
- **JAWS** (Windows)
- **VoiceOver** (macOS/iOS)
- **TalkBack** (Android)

### Testing Checklist
- [x] All form fields are labeled
- [x] Error messages are announced
- [x] Progress indicator is accessible
- [x] Keyboard navigation works throughout
- [x] Focus management is logical
- [x] Required fields are indicated
- [x] Form validation is announced
- [x] Success message is announced

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #4f46e5;
    --error-color: #ef4444;
    --success-color: #10b981;
    /* ... */
}
```

### Validation Rules
Modify validation functions in `script.js`:
- `validateEmail()` - Email format
- `validatePassword()` - Password requirements
- `validateStep1()` - Step 1 validation
- `validateStep2()` - Step 2 validation

### Form Fields
Add or remove fields by:
1. Adding HTML in the appropriate step section
2. Updating validation functions
3. Adding to `formState.data` object
4. Updating review section if needed

## Notes

- This is a **client-side only** form (no backend integration)
- Form data is logged to console on submission (for demonstration)
- In production, you would send data to a server endpoint
- File uploads are previewed but not actually uploaded (no server)

## License

This project is provided as-is for educational and demonstration purposes.

