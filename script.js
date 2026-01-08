// Form State Management
const formState = {
    currentStep: 1,
    totalSteps: 3,
    data: {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        avatar: null,
        avatarPreview: null
    }
};

// DOM Elements
const form = document.getElementById('signupForm');
const steps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-step');
const nextToStep2Btn = document.getElementById('nextToStep2');
const nextToStep3Btn = document.getElementById('nextToStep3');
const backToStep1Btn = document.getElementById('backToStep1');
const backToStep2Btn = document.getElementById('backToStep2');
const submitBtn = document.getElementById('submitForm');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const avatarInput = document.getElementById('avatar');
const avatarPreview = document.getElementById('avatar-preview');
const successMessage = document.getElementById('successMessage');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    setupEventListeners();
    updateProgressIndicator();
});

// Initialize form
function initializeForm() {
    // Set initial focus on first input
    const firstInput = document.getElementById('email');
    if (firstInput) {
        firstInput.focus();
    }
    // Initialize button states
    updateButtonStates();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    nextToStep2Btn.addEventListener('click', () => validateAndGoToStep(2));
    nextToStep3Btn.addEventListener('click', () => validateAndGoToStep(3));
    backToStep1Btn.addEventListener('click', () => goToStep(1));
    backToStep2Btn.addEventListener('click', () => goToStep(2));
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Password toggle
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    
    // Avatar upload
    avatarInput.addEventListener('change', handleAvatarUpload);
    
    // Real-time validation
    setupRealTimeValidation();
    
    // Keyboard navigation
    setupKeyboardNavigation();
}

// Step Navigation
function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > formState.totalSteps) return;
    
    // Save current step data
    saveCurrentStepData();
    
    // Update current step
    formState.currentStep = stepNumber;
    
    // Hide all steps
    steps.forEach((step, index) => {
        const isActive = index + 1 === stepNumber;
        step.classList.toggle('active', isActive);
        step.setAttribute('aria-hidden', !isActive);
    });
    
    // Update progress indicator
    updateProgressIndicator();
    
    // Focus management
    focusOnStepChange(stepNumber);
    
    // Update review section if on step 3
    if (stepNumber === 3) {
        updateReviewSection();
    }
    
    // Update button states
    updateButtonStates();
}

// Validate and go to step
function validateAndGoToStep(stepNumber) {
    if (validateCurrentStep()) {
        goToStep(stepNumber);
    } else {
        // Focus on first invalid field
        focusFirstInvalidField();
    }
}

// Save current step data
function saveCurrentStepData() {
    const currentStep = formState.currentStep;
    
    if (currentStep === 1) {
        formState.data.email = document.getElementById('email').value;
        formState.data.password = document.getElementById('password').value;
        formState.data.confirmPassword = document.getElementById('confirmPassword').value;
    } else if (currentStep === 2) {
        formState.data.firstName = document.getElementById('firstName').value;
        formState.data.lastName = document.getElementById('lastName').value;
    }
}

// Restore step data
function restoreStepData() {
    const currentStep = formState.currentStep;
    
    if (currentStep === 1) {
        document.getElementById('email').value = formState.data.email;
        document.getElementById('password').value = formState.data.password;
        document.getElementById('confirmPassword').value = formState.data.confirmPassword;
    } else if (currentStep === 2) {
        document.getElementById('firstName').value = formState.data.firstName;
        document.getElementById('lastName').value = formState.data.lastName;
        if (formState.data.avatarPreview) {
            displayAvatarPreview(formState.data.avatarPreview);
        }
    }
}

// Update progress indicator
function updateProgressIndicator() {
    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < formState.currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === formState.currentStep) {
            step.classList.add('active');
            step.querySelector('.step-number').setAttribute('aria-current', 'step');
        } else {
            step.querySelector('.step-number').removeAttribute('aria-current');
        }
    });
}

// Focus management on step change
function focusOnStepChange(stepNumber) {
    // Small delay to ensure step is visible
    setTimeout(() => {
        let focusTarget = null;
        
        if (stepNumber === 1) {
            focusTarget = document.getElementById('email');
        } else if (stepNumber === 2) {
            focusTarget = document.getElementById('firstName');
        } else if (stepNumber === 3) {
            focusTarget = submitBtn;
        }
        
        if (focusTarget) {
            focusTarget.focus();
        }
    }, 100);
}

// Validation
function validateCurrentStep() {
    const currentStep = formState.currentStep;
    let isValid = true;
    
    if (currentStep === 1) {
        isValid = validateStep1();
    } else if (currentStep === 2) {
        isValid = validateStep2();
    }
    
    return isValid;
}

function validateStep1() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    let isValid = true;
    
    // Validate email
    if (!validateEmail(email.value)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError('email');
    }
    
    // Validate password
    const passwordError = validatePassword(password.value);
    if (passwordError) {
        showError('password', passwordError);
        isValid = false;
    } else {
        clearError('password');
    }
    
    // Validate password confirmation
    if (password.value !== confirmPassword.value) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    } else {
        clearError('confirmPassword');
    }
    
    return isValid;
}

function validateStep2() {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    
    let isValid = true;
    
    // Validate first name
    if (!firstName.value.trim()) {
        showError('firstName', 'First name is required');
        isValid = false;
    } else {
        clearError('firstName');
    }
    
    // Validate last name
    if (!lastName.value.trim()) {
        showError('lastName', 'Last name is required');
        isValid = false;
    } else {
        clearError('lastName');
    }
    
    // Validate avatar (optional, but check file type if provided)
    if (avatarInput.files.length > 0) {
        const file = avatarInput.files[0];
        if (!file.type.startsWith('image/')) {
            showError('avatar', 'Please select a valid image file');
            isValid = false;
        } else if (file.size > 5 * 1024 * 1024) {
            showError('avatar', 'Image size must be less than 5MB');
            isValid = false;
        } else {
            clearError('avatar');
        }
    }
    
    return isValid;
}

// Helper validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    return null;
}

// Error handling
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
    }
    
    const field = document.getElementById(fieldId);
    if (field) {
        field.setAttribute('aria-invalid', 'true');
    }
}

function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    const field = document.getElementById(fieldId);
    if (field) {
        field.setAttribute('aria-invalid', 'false');
    }
}

function focusFirstInvalidField() {
    const currentStep = formState.currentStep;
    let firstInvalidField = null;
    
    if (currentStep === 1) {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (email.getAttribute('aria-invalid') === 'true') {
            firstInvalidField = email;
        } else if (password.getAttribute('aria-invalid') === 'true') {
            firstInvalidField = password;
        } else if (confirmPassword.getAttribute('aria-invalid') === 'true') {
            firstInvalidField = confirmPassword;
        }
    } else if (currentStep === 2) {
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        
        if (firstName.getAttribute('aria-invalid') === 'true') {
            firstInvalidField = firstName;
        } else if (lastName.getAttribute('aria-invalid') === 'true') {
            firstInvalidField = lastName;
        }
    }
    
    if (firstInvalidField) {
        firstInvalidField.focus();
    }
}

// Real-time validation
function setupRealTimeValidation() {
    // Email validation
    const email = document.getElementById('email');
    email.addEventListener('blur', () => {
        if (email.value) {
            if (!validateEmail(email.value)) {
                showError('email', 'Please enter a valid email address');
            } else {
                clearError('email');
            }
        }
    });
    
    // Password validation
    passwordInput.addEventListener('input', () => {
        if (passwordInput.value) {
            const error = validatePassword(passwordInput.value);
            if (error) {
                showError('password', error);
            } else {
                clearError('password');
            }
        }
    });
    
    // Password confirmation validation
    confirmPasswordInput.addEventListener('input', () => {
        if (confirmPasswordInput.value) {
            if (passwordInput.value !== confirmPasswordInput.value) {
                showError('confirmPassword', 'Passwords do not match');
            } else {
                clearError('confirmPassword');
            }
        }
    });
    
    // Name validation
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    
    firstName.addEventListener('blur', () => {
        if (!firstName.value.trim()) {
            showError('firstName', 'First name is required');
        } else {
            clearError('firstName');
        }
    });
    
    lastName.addEventListener('blur', () => {
        if (!lastName.value.trim()) {
            showError('lastName', 'Last name is required');
        } else {
            clearError('lastName');
        }
    });
}

// Password visibility toggle
function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    confirmPasswordInput.type = isPassword ? 'text' : 'password';
    
    togglePasswordBtn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
    togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
}

// Avatar upload handling
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('avatar', 'Please select a valid image file');
        return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showError('avatar', 'Image size must be less than 5MB');
        return;
    }
    
    clearError('avatar');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewUrl = e.target.result;
        displayAvatarPreview(previewUrl);
        formState.data.avatar = file;
        formState.data.avatarPreview = previewUrl;
    };
    reader.readAsDataURL(file);
}

function displayAvatarPreview(imageUrl) {
    avatarPreview.innerHTML = `<img src="${imageUrl}" alt="Avatar preview">`;
    avatarPreview.classList.add('has-image');
}

// Update review section
function updateReviewSection() {
    // Save all data first
    saveCurrentStepData();
    
    // Update review fields
    document.getElementById('review-email').textContent = formState.data.email || '-';
    document.getElementById('review-name').textContent = 
        `${formState.data.firstName || ''} ${formState.data.lastName || ''}`.trim() || '-';
    
    if (formState.data.avatarPreview) {
        const reviewAvatar = document.getElementById('review-avatar');
        reviewAvatar.innerHTML = `<img src="${formState.data.avatarPreview}" alt="Avatar" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">`;
    }
}

// Form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate all steps
    if (!validateStep1() || !validateStep2()) {
        // Go to first invalid step
        if (!validateStep1()) {
            goToStep(1);
        } else if (!validateStep2()) {
            goToStep(2);
        }
        return;
    }
    
    // Save all data
    saveCurrentStepData();
    
    // Hide form
    form.style.display = 'none';
    
    // Show success message
    successMessage.setAttribute('aria-hidden', 'false');
    successMessage.focus();
    
    // In a real application, you would send the data to a server here
    console.log('Form submitted with data:', formState.data);
}

// Keyboard navigation
function setupKeyboardNavigation() {
    // Allow Enter key to submit on step 3, but navigate on other steps
    form.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.target.tagName !== 'BUTTON' && event.target.tagName !== 'TEXTAREA') {
            if (formState.currentStep === 3) {
                // On step 3, Enter submits the form
                event.preventDefault();
                submitBtn.click();
            } else {
                // On other steps, Enter goes to next step
                event.preventDefault();
                if (formState.currentStep === 1) {
                    nextToStep2Btn.click();
                } else if (formState.currentStep === 2) {
                    nextToStep3Btn.click();
                }
            }
        }
    });
}

// Update button states based on validation
function updateButtonStates() {
    // Only disable buttons if we're on that step
    if (formState.currentStep === 1) {
        const isValid = validateStep1();
        nextToStep2Btn.disabled = !isValid;
    } else if (formState.currentStep === 2) {
        const isValid = validateStep2();
        nextToStep3Btn.disabled = !isValid;
    }
}

// Call updateButtonStates on input changes
document.addEventListener('DOMContentLoaded', () => {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            // Debounce validation
            clearTimeout(input.validationTimeout);
            input.validationTimeout = setTimeout(() => {
                updateButtonStates();
            }, 300);
        });
    });
});

