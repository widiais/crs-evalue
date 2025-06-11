# 🤝 Contributing Guide - CRS Web App

## 📋 Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Git Workflow](#git-workflow)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Standards](#documentation-standards)
- [Issue Reporting](#issue-reporting)
- [Community Guidelines](#community-guidelines)

---

## 🎯 Getting Started

Welcome to the CRS (Competency Review System) project! We appreciate your interest in contributing. This guide will help you understand how to contribute effectively to the project.

### Ways to Contribute
- 🐛 **Bug Reports**: Find and report bugs
- 🚀 **Feature Requests**: Suggest new features
- 💻 **Code Contributions**: Implement features and fix bugs
- 📚 **Documentation**: Improve project documentation
- 🧪 **Testing**: Write tests and improve test coverage
- 🎨 **Design**: UI/UX improvements and design suggestions

### Prerequisites
Before contributing, ensure you have:
- Node.js 18+ installed
- Git installed and configured
- Basic knowledge of TypeScript, React, and Next.js
- Firebase account for development
- Understanding of the project structure

---

## ⚙️ Development Setup

### 1. Fork and Clone the Repository

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/crs-evalue.git
cd crs-evalue

# Add upstream remote
git remote add upstream https://github.com/original-repo/crs-evalue.git
```

### 2. Install Dependencies

```bash
# Install npm dependencies
npm install

# Install global tools
npm install -g firebase-tools
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Configure your local Firebase project
# Update .env.local with your Firebase configuration
```

### 4. Firebase Setup

```bash
# Login to Firebase
firebase login

# Create a development project or use existing
firebase use --add your-dev-project-id --alias dev

# Initialize Firestore (if needed)
firebase firestore:indexes
```

### 5. Start Development Server

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### 6. Verify Setup

```bash
# Run tests (when available)
npm test

# Check linting
npm run lint

# Build the project
npm run build
```

---

## 📝 Code Standards

### TypeScript Guidelines

#### Type Definitions
```typescript
// ✅ Good: Explicit interface definitions
interface Employee {
  id: string;
  name: string;
  position: Position;
  isActive: boolean;
}

// ✅ Good: Use union types for enums
type Position = 'Supervisor' | 'Team Leader' | 'All Star';

// ❌ Bad: Using any type
const processData = (data: any) => {
  // avoid this
};
```

#### Function Signatures
```typescript
// ✅ Good: Explicit return types
const getEmployees = async (): Promise<Employee[]> => {
  try {
    return await employeeService.getAllEmployees();
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// ✅ Good: Proper error handling
const createEmployee = async (data: CreateEmployeeRequest): Promise<Employee> => {
  if (!data.name || !data.position) {
    throw new Error('Name and position are required');
  }
  
  return await employeeService.createEmployee(data);
};
```

### React Component Guidelines

#### Component Structure
```typescript
// ✅ Good: Functional components with TypeScript
interface Props {
  employee: Employee;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeCard({ employee, onEdit, onDelete }: Props) {
  const handleEdit = () => onEdit(employee.id);
  const handleDelete = () => onDelete(employee.id);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold">{employee.name}</h3>
      <p className="text-gray-600">{employee.position}</p>
      <div className="mt-4 space-x-2">
        <button
          onClick={handleEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
```

#### Hooks Usage
```typescript
// ✅ Good: Custom hooks for logic
const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getAllEmployees();
        setEmployees(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  return { employees, loading, error, refetch: () => loadEmployees() };
};
```

### Service Layer Guidelines

#### Service Implementation
```typescript
// ✅ Good: Consistent service structure
export const employeeService = {
  async getAllEmployees(): Promise<Employee[]> {
    try {
      if (!db) {
        throw new Error('Database not initialized');
      }

      const q = query(
        collection(db, 'employees'),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees:', error);
      throw new Error('Failed to fetch employees');
    }
  },

  // ... other methods
};
```

### CSS and Styling Guidelines

#### Tailwind CSS Usage
```typescript
// ✅ Good: Organized class names
const cardClasses = [
  'bg-white',
  'rounded-lg',
  'shadow-md',
  'p-6',
  'hover:shadow-lg',
  'transition-shadow',
  'duration-200'
].join(' ');

// ✅ Good: Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* content */}
</div>

// ✅ Good: Consistent spacing
<div className="space-y-4">
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Employee Name
    </label>
    <input className="w-full px-3 py-2 border border-gray-300 rounded-md" />
  </div>
</div>
```

---

## 🔄 Git Workflow

### Branch Naming Convention

```bash
# Feature branches
feature/employee-management
feature/assessment-templates
feature/reporting-dashboard

# Bug fix branches
fix/pin-validation-error
fix/firebase-connection-issue

# Documentation branches
docs/api-documentation
docs/deployment-guide

# Chore branches
chore/dependency-updates
chore/eslint-configuration
```

### Commit Message Format

```bash
# Format: type(scope): description
# Example commits:

feat(employees): add employee management functionality
fix(assessments): resolve PIN validation issue
docs(readme): update installation instructions
style(components): improve button styling consistency
refactor(services): extract common Firebase operations
test(employees): add unit tests for employee service
chore(deps): update Firebase SDK to latest version
```

### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic changes)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates

### Development Workflow

```bash
# 1. Sync with upstream
git checkout main
git pull upstream main

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make changes and commit
git add .
git commit -m "feat(feature): implement new feature"

# 4. Push to your fork
git push origin feature/new-feature

# 5. Create pull request on GitHub
```

---

## 🔍 Pull Request Process

### Before Creating a Pull Request

#### 1. Code Quality Checklist
- [ ] Code follows project style guidelines
- [ ] All new features have appropriate TypeScript types
- [ ] Components are properly documented
- [ ] No console.log statements in production code
- [ ] Error handling is implemented where needed

#### 2. Testing Checklist
- [ ] Code builds successfully (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] All existing functionality still works
- [ ] New features are manually tested
- [ ] Edge cases are considered

#### 3. Documentation Checklist
- [ ] Code is self-documenting with clear variable names
- [ ] Complex logic has comments explaining the reasoning
- [ ] Public API changes are documented
- [ ] README is updated if needed

### Pull Request Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran to verify your changes.

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged and published
```

### Pull Request Review Process

#### For Contributors
1. **Create Draft PR**: Start with a draft PR for early feedback
2. **Self Review**: Review your own code before marking as ready
3. **Address Feedback**: Respond to review comments promptly
4. **Keep Updated**: Rebase/merge latest changes from main branch

#### For Reviewers
1. **Code Quality**: Check for adherence to coding standards
2. **Functionality**: Verify the feature/fix works as intended
3. **Performance**: Consider performance implications
4. **Security**: Look for potential security issues
5. **Documentation**: Ensure adequate documentation

---

## 🧪 Testing Guidelines

### Testing Strategy

#### Unit Tests (Future Implementation)
```typescript
// Example: Testing service functions
describe('employeeService', () => {
  describe('createEmployee', () => {
    it('should create employee with valid data', async () => {
      const employeeData = {
        name: 'John Doe',
        position: 'Supervisor',
        location: 'Jakarta Timur',
        division: 'Operations'
      };

      const result = await employeeService.createEmployee(employeeData);
      
      expect(result).toBeDefined();
      expect(result.name).toBe(employeeData.name);
      expect(result.isActive).toBe(true);
    });

    it('should throw error with invalid data', async () => {
      const invalidData = { name: '' };
      
      await expect(
        employeeService.createEmployee(invalidData as any)
      ).rejects.toThrow('Name is required');
    });
  });
});
```

#### Integration Tests
```typescript
// Example: Testing component integration
describe('EmployeeManagement', () => {
  it('should load and display employees', async () => {
    render(<EmployeeManagement />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Check if employees are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Supervisor')).toBeInTheDocument();
  });
});
```

### Manual Testing Checklist

#### Feature Testing
- [ ] Feature works in different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Feature is responsive on different screen sizes
- [ ] Feature handles loading states appropriately
- [ ] Feature shows proper error messages
- [ ] Feature validates user input correctly

#### Regression Testing
- [ ] Existing features still work correctly
- [ ] No breaking changes to public APIs
- [ ] Database operations work as expected
- [ ] Authentication/authorization still functions

---

## 📚 Documentation Standards

### Code Documentation

#### Function Documentation
```typescript
/**
 * Creates a new employee in the system
 * @param data Employee creation data including name, position, location, and division
 * @returns Promise that resolves to the created Employee object
 * @throws Error if employee data is invalid or creation fails
 * 
 * @example
 * ```typescript
 * const employee = await createEmployee({
 *   name: 'John Doe',
 *   position: 'Supervisor',
 *   location: 'Jakarta Timur',
 *   division: 'Operations'
 * });
 * ```
 */
async function createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
  // implementation
}
```

#### Component Documentation
```typescript
/**
 * EmployeeCard displays employee information in a card format
 * 
 * @param employee - Employee object containing id, name, position, etc.
 * @param onEdit - Callback function called when edit button is clicked
 * @param onDelete - Callback function called when delete button is clicked
 * @param className - Additional CSS classes to apply to the card
 * 
 * @example
 * ```tsx
 * <EmployeeCard
 *   employee={employee}
 *   onEdit={(id) => handleEdit(id)}
 *   onDelete={(id) => handleDelete(id)}
 *   className="mb-4"
 * />
 * ```
 */
interface EmployeeCardProps {
  employee: Employee;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}
```

### README Updates

When adding new features, update relevant README sections:
- Installation steps (if dependencies added)
- Configuration (if new environment variables)
- Usage examples (if new functionality)
- API documentation (if new endpoints)

---

## 🐛 Issue Reporting

### Bug Report Template

```markdown
**Bug Description**
A clear and concise description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear description of what you expected to happen.

**Actual Behavior**
A clear description of what actually happened.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment**
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]
- OS: [e.g. Windows, macOS, Linux]
- Node.js version: [e.g. 18.0.0]

**Additional Context**
Add any other context about the problem here.
```

### Feature Request Template

```markdown
**Feature Description**
A clear and concise description of the feature you'd like to see.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
Describe the solution you'd like to see implemented.

**Alternative Solutions**
Describe any alternative solutions you've considered.

**Additional Context**
Add any other context, mockups, or examples about the feature request.
```

### Issue Labels

Use appropriate labels when creating issues:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested
- `wontfix` - This will not be worked on

---

## 🤝 Community Guidelines

### Code of Conduct

#### Our Pledge
We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

#### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Communication Guidelines

#### GitHub Discussions
- Use clear, descriptive titles
- Search existing discussions before creating new ones
- Stay on topic and be respectful
- Provide context and examples when asking questions

#### Pull Request Reviews
- Be constructive and specific in feedback
- Explain the reasoning behind suggestions
- Acknowledge good code and improvements
- Be patient with new contributors

#### Issue Discussions
- Provide as much relevant information as possible
- Be respectful when disagreeing
- Stay focused on the technical aspects
- Help others when you can

### Recognition

#### Contributors
All contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes for significant contributions
- Project documentation
- Annual contributor appreciation posts

#### Types of Contributions Recognized
- Code contributions (features, fixes, refactoring)
- Documentation improvements
- Bug reports and testing
- Design and UX contributions
- Community support and mentoring

---

## 🚀 Getting Help

### Resources
- **Documentation**: Check existing docs in the `/docs` folder
- **GitHub Issues**: Search existing issues for solutions
- **GitHub Discussions**: Ask questions and get community help
- **Code Examples**: Look at existing code for patterns

### Contact Information
- **Project Maintainer**: [Your Name] - [email@example.com]
- **Technical Lead**: [Name] - [email@example.com]
- **Community Manager**: [Name] - [email@example.com]

### Response Times
- **Bug Reports**: Within 2-3 business days
- **Feature Requests**: Within 1 week
- **Pull Requests**: Within 3-5 business days
- **Questions**: Within 1-2 business days

---

## 📈 Contributor Progression

### New Contributor Path
1. **First Contribution**: Start with documentation or small bug fixes
2. **Regular Contributor**: Take on feature development
3. **Trusted Contributor**: Review other PRs, mentor new contributors
4. **Maintainer**: Help with project direction and major decisions

### Skills Development
- Learn TypeScript and React best practices
- Understand Firebase and Firestore concepts
- Practice testing methodologies
- Improve documentation writing
- Develop code review skills

---

**Thank you for contributing to CRS Web App! 🙏**

Your contributions help make this project better for everyone. Whether you're fixing a small typo or implementing a major feature, every contribution is valued and appreciated.

---

**Questions?** Feel free to reach out through GitHub Issues or Discussions. We're here to help! 😊 