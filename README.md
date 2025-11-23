# Mathlytics

Mathlytics is a web-based platform that provides a set of mathematical and statistical tools for students, analysts, and mathematicians. The project allows users to perform calculations and visualize results without writing any scripts.

## Features

### Matrix Calculator
- Compute determinants, inverse matrices, ranks.
- Find eigenvalues and eigenvectors.
- Perform addition, subtraction, and multiplication of matrices.

### Statistical Tools
- Calculate mean, median, and mode for a dataset.
- Compute variance and standard deviation.
- Determine correlation between two variables.
- Perform simple linear regression.

### Function Graphing
- Plot functions of one variable.
- Find extrema (maximum and minimum points) of a function.

### Contact Form
- Users can submit feedback or questions directly through the site.

## Project Structure
/Mathlytics

├── index.html # Home page

├── about.html # About the project

├── contacts.html # Contact form

├── linearalgebra.html # Matrix calculator page

├── statistics.html # Statistical calculator page

├── graphic.html # Function graphing page

├── /css # Stylesheets

│ ├── style.css # Main stylesheet (imports all others)

│ ├── base.css # CSS variables, reset, typography

│ ├── layout.css # Layout and positioning styles

│ ├── components.css # Component-specific styles

│ └── adapt.css # Responsive styles and media queries

├── /js # JavaScript files for calculators and graphing

│ └── main.js #In future

└── /images # Images, including logo


## Technologies Used

- **HTML5** was used for semantic markup and modern structure;
- **CSS3** was used for advanced styling and animations;
  
- **CSS Flexbox** was used for: header and footer layouts, tool cards grid on homepage, button groups and content containers, responsive navigation menus

- **CSS Grid** was used for: matrix calculator layout (matrices-row), statistical samples layout (samples-row), action button grids (stats-actions, matrix-actions) and other complex component arrangements

### Responsive Features:

- **CSS Media Queries** - Mobile-first responsive approach:
  - Mobile devices (up to 768px);
  - Tablets (769px - 1024px);
  - Desktop (1025px and above);

- **Viewport Meta Tag** - Proper mobile rendering;

- **Adaptive Layouts** - Restructuring for different screen sizes;

- **Hamburger Menu** - Mobile navigation toggle;
- **Adaptive Grids** - Single-column layouts on mobile;
- **Flexible Images** - Responsive canvas and media;
- **Touch-friendly Interfaces** - Appropriate button sizes and spacing;

### Cross-browser Compatibility
- Tested and optimized for:
  - Chrome;
  - Firefox;
  - Edge;
  - Opera;

Author - Mykhailo Tymoshenko. This project is for educational purposes.
