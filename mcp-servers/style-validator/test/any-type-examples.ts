/**
 * This file contains examples of improper 'any' type usage
 * that violates Cyber Hand project standards
 * 
 * Used for testing the style-validator MCP server
 */

// Example 1: Explicit any in variable declarations
const userData: any = { name: "John", age: 30 };

// Example 2: any in function parameters
function processUser(user: any) {
  console.log(user.name);
  return user;
}

// Example 3: any in return type
function fetchData(): any {
  return { status: "success", data: [] };
}

// Example 4: any in array types
const items: any[] = [1, "two", { three: true }];

// Example 5: any in type aliases
type Config = {
  endpoint: string;
  timeout: number;
  options: any; // Should be a specific interface
};

// Example 6: Implicit any in parameters (missing type)
function calculateTotal(price, quantity) {
  return price * quantity;
}

// Example 7: any in generics
class DataStore<T = any> {
  private data: T;
  
  constructor(initialData: T) {
    this.data = initialData;
  }
  
  getData(): T {
    return this.data;
  }
}

// Example 8: any in interfaces
interface ApiResponse {
  status: string;
  data: any; // Should be a specific type
}

// Example 9: any in union types
type Result = string | number | any;

// Example 10: any in catch blocks
function tryOperation() {
  try {
    // Some operation
  } catch (error: any) {
    console.error(error.message);
  }
}

// Here's how these should be fixed according to Cyber Hand standards:

// CORRECT: Using specific interface instead of any
interface UserData {
  name: string;
  age: number;
}

// CORRECT: Using unknown + type guard instead of any for API data
function processUserSafely(user: unknown): UserData {
  // Type guard
  if (typeof user === 'object' && user !== null && 'name' in user && 'age' in user) {
    return user as UserData;
  }
  throw new Error('Invalid user data');
}

// CORRECT: Using specific return type
function fetchDataSafely(): { status: string; data: unknown[] } {
  return { status: "success", data: [] };
}

// CORRECT: Using union type instead of any[]
const typedItems: (number | string | { three: boolean })[] = [1, "two", { three: true }];

// CORRECT: Using proper interface instead of any
interface ConfigOptions {
  cacheEnabled: boolean;
  retryCount: number;
}

type ProperConfig = {
  endpoint: string;
  timeout: number;
  options: ConfigOptions;
};

// CORRECT: Using typed parameters
function calculateTotalTyped(price: number, quantity: number): number {
  return price * quantity;
}

// CORRECT: Using unknown in generics with constraints
class TypedDataStore<T extends object> {
  private data: T;
  
  constructor(initialData: T) {
    this.data = initialData;
  }
  
  getData(): T {
    return this.data;
  }
}

// CORRECT: Using specific interface in API responses
interface TypedApiResponse<T> {
  status: string;
  data: T;
}

// CORRECT: Using specific union types
type TypedResult = string | number | boolean;

// CORRECT: Using unknown in catch blocks
function tryOperationSafely() {
  try {
    // Some operation
  } catch (error) {
    // Type guard approach
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error");
    }
  }
}
