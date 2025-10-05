const Child = require('../Models/Child');

describe('Child Model', () => {
  describe('Schema Validation', () => {
    test('should validate required fields', () => {
      const child = new Child({});

      const validationError = child.validateSync();

      expect(validationError.errors.parent).toBeDefined();
      expect(validationError.errors.firstName).toBeDefined();
      expect(validationError.errors.lastName).toBeDefined();
      expect(validationError.errors.dateOfBirth).toBeDefined();
      expect(validationError.errors.gender).toBeDefined();
      expect(validationError.errors.grade).toBeDefined();
      expect(validationError.errors.schoolName).toBeDefined();
    });

    test('should validate age range', () => {
      // Test child too young
      const youngChild = new Child({
        parent: 'parent123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2020-01-01'), // 5 years old (too young)
        gender: 'male',
        grade: 'preschool',
        schoolName: 'Test School',
        emergencyContacts: [
          { name: 'Mom', relationship: 'parent', phone: '123-456-7890', isPrimary: true },
          { name: 'Dad', relationship: 'parent', phone: '098-765-4321', isPrimary: false }
        ]
      });

      const youngValidation = youngChild.validateSync();
      expect(youngValidation.errors.dateOfBirth).toBeDefined();

      // Test child too old
      const oldChild = new Child({
        parent: 'parent123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2000-01-01'), // 25 years old (too old)
        gender: 'male',
        grade: 'grade12',
        schoolName: 'Test School',
        emergencyContacts: [
          { name: 'Mom', relationship: 'parent', phone: '123-456-7890', isPrimary: true },
          { name: 'Dad', relationship: 'parent', phone: '098-765-4321', isPrimary: false }
        ]
      });

      const oldValidation = oldChild.validateSync();
      expect(oldValidation.errors.dateOfBirth).toBeDefined();
    });

    test('should validate emergency contacts requirement', async () => {
      const child = new Child({
        parent: 'parent123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2015-01-01'),
        gender: 'male',
        grade: 'grade1',
        schoolName: 'Test School',
        emergencyContacts: [
          { name: 'Mom', relationship: 'parent', phone: '123-456-7890', isPrimary: true }
          // Only one contact - should fail
        ]
      });

      await expect(child.save()).rejects.toThrow('At least 2 emergency contacts are required');
    });

    test('should validate primary contact requirement', async () => {
      const child = new Child({
        parent: 'parent123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2015-01-01'),
        gender: 'male',
        grade: 'grade1',
        schoolName: 'Test School',
        emergencyContacts: [
          { name: 'Mom', relationship: 'parent', phone: '123-456-7890', isPrimary: false },
          { name: 'Dad', relationship: 'parent', phone: '098-765-4321', isPrimary: false }
          // No primary contact - should fail
        ]
      });

      await expect(child.save()).rejects.toThrow('Exactly one emergency contact must be marked as primary');
    });

    test('should validate phone number format', () => {
      const child = new Child({
        parent: 'parent123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2015-01-01'),
        gender: 'male',
        grade: 'grade1',
        schoolName: 'Test School',
        emergencyContacts: [
          { name: 'Mom', relationship: 'parent', phone: 'invalid-phone', isPrimary: true },
          { name: 'Dad', relationship: 'parent', phone: '098-765-4321', isPrimary: false }
        ]
      });

      const validationError = child.validateSync();
      expect(validationError.errors['emergencyContacts.0.phone']).toBeDefined();
    });

    test('should validate grade enum', () => {
      const child = new Child({
        parent: 'parent123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2015-01-01'),
        gender: 'male',
        grade: 'invalid-grade',
        schoolName: 'Test School',
        emergencyContacts: [
          { name: 'Mom', relationship: 'parent', phone: '123-456-7890', isPrimary: true },
          { name: 'Dad', relationship: 'parent', phone: '098-765-4321', isPrimary: false }
        ]
      });

      const validationError = child.validateSync();
      expect(validationError.errors.grade).toBeDefined();
    });

    test('should validate gender enum', () => {
      const child = new Child({
        parent: 'parent123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2015-01-01'),
        gender: 'invalid-gender',
        grade: 'grade1',
        schoolName: 'Test School',
        emergencyContacts: [
          { name: 'Mom', relationship: 'parent', phone: '123-456-7890', isPrimary: true },
          { name: 'Dad', relationship: 'parent', phone: '098-765-4321', isPrimary: false }
        ]
      });

      const validationError = child.validateSync();
      expect(validationError.errors.gender).toBeDefined();
    });
  });

  describe('Virtual Properties', () => {
    test('should return full name', () => {
      const child = new Child({
        firstName: 'John',
        lastName: 'Doe'
      });

      expect(child.fullName).toBe('John Doe');
    });

    test('should calculate age correctly', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 10); // 10 years ago

      const child = new Child({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: birthDate
      });

      expect(child.age).toBe(10);
    });

    test('should return null age for missing dateOfBirth', () => {
      const child = new Child({
        firstName: 'John',
        lastName: 'Doe'
      });

      expect(child.age).toBeNull();
    });
  });

  describe('Static Methods', () => {
    test('should find active children by parent', async () => {
      const mockChildren = [
        { parent: 'parent123', status: 'active', isActive: true },
        { parent: 'parent123', status: 'inactive', isActive: false }
      ];

      Child.find = jest.fn().mockResolvedValue(mockChildren);

      const result = await Child.findActiveByParent('parent123');

      expect(Child.find).toHaveBeenCalledWith({
        parent: 'parent123',
        status: 'active',
        isActive: true
      });
      expect(result).toEqual(mockChildren);
    });
  });

  describe('Instance Methods', () => {
    test('should deactivate child', async () => {
      const child = new Child({
        parent: 'parent123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2015-01-01'),
        gender: 'male',
        grade: 'grade1',
        schoolName: 'Test School',
        status: 'active',
        isActive: true,
        emergencyContacts: [
          { name: 'Mom', relationship: 'parent', phone: '123-456-7890', isPrimary: true },
          { name: 'Dad', relationship: 'parent', phone: '098-765-4321', isPrimary: false }
        ]
      });

      child.save = jest.fn().mockResolvedValue(child);

      const result = await child.deactivate();

      expect(child.status).toBe('inactive');
      expect(child.isActive).toBe(false);
      expect(child.save).toHaveBeenCalled();
      expect(result).toBe(child);
    });
  });

  describe('Schema Indexes', () => {
    test('should have proper indexes defined', () => {
      // This is more of a documentation test since we can't easily test indexes in unit tests
      // But we can verify the schema has the expected index fields
      const schema = Child.schema;

      // Check that parent field has index
      expect(schema.paths.parent.options.index).toBe(true);

      // Check that emergencyContacts.phone has index (this would be tested in integration)
      // For now, we just verify the schema structure exists
      expect(schema).toBeDefined();
    });
  });

  describe('Default Values', () => {
    test('should set default values', () => {
      const child = new Child({
        parent: 'parent123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2015-01-01'),
        gender: 'male',
        grade: 'grade1',
        schoolName: 'Test School',
        emergencyContacts: [
          { name: 'Mom', relationship: 'parent', phone: '123-456-7890', isPrimary: true },
          { name: 'Dad', relationship: 'parent', phone: '098-765-4321', isPrimary: false }
        ]
      });

      expect(child.status).toBe('active');
      expect(child.isActive).toBe(true);
      expect(child.emergencyContacts[0].isPrimary).toBe(true);
      expect(child.emergencyContacts[1].isPrimary).toBe(false);
    });
  });

  describe('Field Validation', () => {
    test('should validate string field lengths', () => {
      const child = new Child({
        parent: 'parent123',
        firstName: 'A'.repeat(51), // Too long
        lastName: 'Doe',
        dateOfBirth: new Date('2015-01-01'),
        gender: 'male',
        grade: 'grade1',
        schoolName: 'Test School',
        emergencyContacts: [
          { name: 'Mom', relationship: 'parent', phone: '123-456-7890', isPrimary: true },
          { name: 'Dad', relationship: 'parent', phone: '098-765-4321', isPrimary: false }
        ]
      });

      const validationError = child.validateSync();
      expect(validationError.errors.firstName).toBeDefined();
    });

    test('should validate email format in emergency contacts', () => {
      const child = new Child({
        parent: 'parent123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2015-01-01'),
        gender: 'male',
        grade: 'grade1',
        schoolName: 'Test School',
        emergencyContacts: [
          { name: 'Mom', relationship: 'parent', phone: '123-456-7890', email: 'invalid-email', isPrimary: true },
          { name: 'Dad', relationship: 'parent', phone: '098-765-4321', isPrimary: false }
        ]
      });

      const validationError = child.validateSync();
      expect(validationError.errors['emergencyContacts.0.email']).toBeDefined();
    });
  });
});
