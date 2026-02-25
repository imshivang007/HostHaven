# UI/UX Redesign Plan for HostHaven

## Color Palette (from coolors.co)
- **#D8E2DC** - Light Sage (Backgrounds, subtle accents)
- **#FFE5D9** - Peach (Cards, highlights)
- **#FFCAD4** - Light Pink (Buttons, hover states)
- **#F4ACB7** - Dusty Rose (Primary accent, icons)
- **#9D8189** - Mauve (Text, secondary elements)

## Current Issues Identified
1. Inconsistent color scheme (using hardcoded #fe424d red)
2. Basic Bootstrap styling without custom enhancements
3. Cards lack proper shadows and rounded corners
4. No cohesive Airbnb-like aesthetic
5. Filter section looks dated

## Plan

### 1. Update Main Stylesheet
**File**: `public/css/style.css`
- Replace all hardcoded colors with new palette
- Add Airbnb-like card styles with shadows
- Add rounded corners (border-radius: 12px-24px)
- Enhance buttons with gradient and hover effects
- Add smooth transitions throughout
- Improve spacing and typography

### 2. Update Navbar
**File**: `views/includes/navbar.ejs`
- Update brand color from red to Dusty Rose (#F4ACB7)
- Style search bar with rounded edges
- Update buttons to use new pink palette
- Add subtle shadow to navbar

### 3. Update Footer
**File**: `views/includes/footer.ejs`
- Use Light Sage (#D8E2DC) background
- Update link colors to Mauve (#9D8189)
- Add rounded corners

### 4. Update Listings Page
**File**: `views/listings/index.ejs`
- Style filters with pill-shaped buttons
- Add card hover effects with shadow
- Update active filter states with Pink
- Improve spacing between cards

### 5. Update Show Page
**File**: `views/listings/show.ejs`
- Enhance booking card with shadow and rounded corners
- Style amenity badges with new palette
- Update button styles

### 6. Update Forms (Login/Signup/New Listing)
**Files**: `views/users/login.ejs`, `views/users/signup.ejs`, `views/listings/new.ejs`
- Add centered card layout with shadow
- Style inputs with proper focus states
- Update submit buttons with gradient
- Add background pattern/gradient

### 7. Update Bookings Page
**File**: `views/bookings/index.ejs`
- Update status badges with new palette
- Enhance card styling

### 8. Update Profile Page
**File**: `views/users/profile.ejs`
- Update header gradient to use new palette
- Style stat cards
- Update tab navigation

## Implementation Order
1. First update `public/css/style.css` (core styles)
2. Then update navbar and footer
3. Then update individual pages
4. Test all pages

## Files to Edit
1. `public/css/style.css`
2. `views/includes/navbar.ejs`
3. `views/includes/footer.ejs`
4. `views/listings/index.ejs`
5. `views/listings/show.ejs`
6. `views/listings/new.ejs`
7. `views/listings/edit.ejs`
8. `views/users/login.ejs`
9. `views/users/signup.ejs`
10. `views/bookings/index.ejs`
11. `views/users/profile.ejs`

## Expected Outcome
- Consistent color scheme across all pages
- Modern, Airbnb-like appearance
- Better visual hierarchy
- Improved user experience
- Responsive and accessible design
