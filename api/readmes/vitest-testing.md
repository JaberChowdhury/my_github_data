![Tests](https://github.com/JaberChowdhury/vitest-testing/actions/workflows/vitest.yml/badge.svg)

**_<h1 style="text-align:center;">String</h1>_**

### 1. **Exact String Matching**

To check if a string exactly matches an expected value, you can use the `.toBe()` matcher.

```javascript
import { expect, test } from "vitest";

test("exact string match", () => {
  const greeting = "Hello, World!";
  expect(greeting).toBe("Hello, World!");
});
```

---

### 2. **Partial String Matching**

If you want to check if a string contains a specific substring, you can use `.toContain()`.

```javascript
test("string contains substring", () => {
  const message = "Welcome to Vitest!";
  expect(message).toContain("Vitest");
});
```

---

### 3. **Regex Matching**

For more complex string patterns, you can use `.toMatch()` with a regular expression.

```javascript
test("string matches regex", () => {
  const email = "user@example.com";
  expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Basic email regex
});
```

---

### 4. **String Length**

To check the length of a string, you can use `.toHaveLength()`.

```javascript
test("string has correct length", () => {
  const str = "Vitest";
  expect(str).toHaveLength(6);
});
```

---

### 5. **Case-Insensitive Matching**

If you want to perform a case-insensitive match, you can combine `.toMatch()` with a regex flag.

```javascript
test("case-insensitive match", () => {
  const str = "Hello World";
  expect(str).toMatch(/hello world/i);
});
```

---

### 6. **Checking for Empty Strings**

To verify that a string is empty, you can use `.toBe('')` or `.toHaveLength(0)`.

```javascript
test("string is empty", () => {
  const str = "";
  expect(str).toBe("");
  expect(str).toHaveLength(0);
});
```

---

### 7. **Trimming and Whitespace**

If you need to test strings with leading or trailing whitespace, you can use `.trim()` in combination with matchers.

```javascript
test("string has no extra whitespace", () => {
  const str = "  Vitest  ";
  expect(str.trim()).toBe("Vitest");
});
```

---

### 8. **Custom String Assertions**

For more complex scenarios, you can write custom logic and use `.toBeTruthy()` or `.toBeFalsy()`.

```javascript
test("custom string assertion", () => {
  const str = "Vitest is awesome!";
  expect(str.startsWith("Vitest")).toBeTruthy();
  expect(str.endsWith("awesome!")).toBeTruthy();
});
```

---

### 9. **Snapshot Testing for Strings**

If you want to ensure that a string doesn’t change unexpectedly, you can use snapshot testing.

```javascript
test("string snapshot", () => {
  const str = "This is a snapshot test";
  expect(str).toMatchSnapshot();
});
```

When you run this test for the first time, Vitest will create a snapshot file. On subsequent runs, it will compare the string to the saved snapshot.

---

### 10. **Testing Template Literals**

If your strings are dynamically generated using template literals, you can test them like any other string.

```javascript
test("template literal string", () => {
  const name = "Vitest";
  const message = `Hello, ${name}!`;
  expect(message).toBe("Hello, Vitest!");
});
```

---

### Summary of Matchers for Strings

| Matcher              | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `.toBe()`            | Exact string equality                    |
| `.toContain()`       | Check if a string contains a substring   |
| `.toMatch()`         | Match a string against a regex           |
| `.toHaveLength()`    | Check the length of a string             |
| `.toMatchSnapshot()` | Ensure a string matches a saved snapshot |

**_<h1 style="text-align:center;">Number</h1>_**

### 1. **Exact Number Matching**

To check if a number is exactly equal to an expected value, use the `.toBe()` matcher.

```javascript
import { expect, test } from "vitest";

test("exact number match", () => {
  const num = 42;
  expect(num).toBe(42);
});
```

---

### 2. **Floating-Point Number Matching**

For floating-point numbers, use `.toBeCloseTo()` to avoid precision issues caused by floating-point arithmetic.

```javascript
test("floating-point number match", () => {
  const num = 0.1 + 0.2; // 0.30000000000000004
  expect(num).toBeCloseTo(0.3, 5); // Second argument is the number of decimal places to check
});
```

---

### 3. **Greater Than or Less Than**

To check if a number is greater than or less than a specific value, use `.toBeGreaterThan()`, `.toBeGreaterThanOrEqual()`, `.toBeLessThan()`, or `.toBeLessThanOrEqual()`.

```javascript
test("number is greater than", () => {
  const num = 10;
  expect(num).toBeGreaterThan(5);
  expect(num).toBeGreaterThanOrEqual(10);
});

test("number is less than", () => {
  const num = 3.14;
  expect(num).toBeLessThan(4);
  expect(num).toBeLessThanOrEqual(3.14);
});
```

---

### 4. **Checking for NaN**

To verify that a value is `NaN` (Not a Number), use `.toBeNaN()`.

```javascript
test("value is NaN", () => {
  const num = NaN;
  expect(num).toBeNaN();
});
```

---

### 5. **Checking for Infinity**

To check if a number is `Infinity` or `-Infinity`, use `.toBe()`.

```javascript
test("value is Infinity", () => {
  const num = 1 / 0;
  expect(num).toBe(Infinity);
});

test("value is -Infinity", () => {
  const num = -1 / 0;
  expect(num).toBe(-Infinity);
});
```

---

### 6. **Checking for Even or Odd**

You can write custom logic to test if a number is even or odd.

```javascript
test("number is even", () => {
  const num = 4;
  expect(num % 2).toBe(0);
});

test("number is odd", () => {
  const num = 3;
  expect(num % 2).toBe(1);
});
```

---

### 7. **Checking for Positive or Negative**

To verify if a number is positive or negative, use `.toBeGreaterThan()` or `.toBeLessThan()`.

```javascript
test("number is positive", () => {
  const num = 7;
  expect(num).toBeGreaterThan(0);
});

test("number is negative", () => {
  const num = -7;
  expect(num).toBeLessThan(0);
});
```

---

### 8. **Range Checking**

To check if a number falls within a specific range, combine `.toBeGreaterThan()` and `.toBeLessThan()`.

```javascript
test("number is within range", () => {
  const num = 50;
  expect(num).toBeGreaterThan(0);
  expect(num).toBeLessThan(100);
});
```

---

### 9. **Checking for Integer**

To verify if a number is an integer, you can use `Number.isInteger()` in combination with `.toBeTruthy()`.

```javascript
test("number is an integer", () => {
  const num = 42;
  expect(Number.isInteger(num)).toBeTruthy();
});
```

---

### 10. **Custom Number Assertions**

For more complex scenarios, you can write custom logic and use `.toBeTruthy()` or `.toBeFalsy()`.

```javascript
test("number is a perfect square", () => {
  const num = 16;
  const sqrt = Math.sqrt(num);
  expect(Number.isInteger(sqrt)).toBeTruthy();
});
```

---

### 11. **Snapshot Testing for Numbers**

If you want to ensure that a number doesn’t change unexpectedly, you can use snapshot testing.

```javascript
test("number snapshot", () => {
  const num = 42;
  expect(num).toMatchSnapshot();
});
```

When you run this test for the first time, Vitest will create a snapshot file. On subsequent runs, it will compare the number to the saved snapshot.

---

### Summary of Matchers for Numbers

| Matcher                     | Purpose                                         |
| --------------------------- | ----------------------------------------------- |
| `.toBe()`                   | Exact number equality                           |
| `.toBeCloseTo()`            | Floating-point number equality (with precision) |
| `.toBeGreaterThan()`        | Check if a number is greater than               |
| `.toBeGreaterThanOrEqual()` | Check if a number is greater than or equal to   |
| `.toBeLessThan()`           | Check if a number is less than                  |
| `.toBeLessThanOrEqual()`    | Check if a number is less than or equal to      |
| `.toBeNaN()`                | Check if a value is NaN                         |
| `.toMatchSnapshot()`        | Ensure a number matches a saved snapshot        |

**_<h1 style="text-align:center;">Array</h1>_**

### 1. **Exact Array Matching**

To check if an array is exactly equal to an expected array, use the `.toEqual()` matcher.

```javascript
import { expect, test } from "vitest";

test("exact array match", () => {
  const arr = [1, 2, 3];
  expect(arr).toEqual([1, 2, 3]);
});
```

---

### 2. **Array Length**

To check the length of an array, use `.toHaveLength()`.

```javascript
test("array has correct length", () => {
  const arr = [1, 2, 3];
  expect(arr).toHaveLength(3);
});
```

---

### 3. **Array Contains an Item**

To check if an array contains a specific item, use `.toContain()`.

```javascript
test("array contains an item", () => {
  const arr = ["apple", "banana", "cherry"];
  expect(arr).toContain("banana");
});
```

---

### 4. **Array Does Not Contain an Item**

To verify that an array does **not** contain a specific item, use `.not.toContain()`.

```javascript
test("array does not contain an item", () => {
  const arr = ["apple", "banana", "cherry"];
  expect(arr).not.toContain("grape");
});
```

---

### 5. **Array Contains All Items**

To check if an array contains all items from another array, you can combine `.arrayContaining()` with `.toEqual()`.

```javascript
test("array contains all items", () => {
  const arr = [1, 2, 3, 4, 5];
  expect(arr).toEqual(expect.arrayContaining([2, 4]));
});
```

---

### 6. **Array Structure Matching**

To check if an array matches a specific structure (e.g., objects in an array), use `.toEqual()` with nested matchers.

```javascript
test("array structure matches", () => {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  expect(users).toEqual([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]);
});
```

---

### 7. **Empty Array**

To verify that an array is empty, use `.toHaveLength(0)` or `.toEqual([])`.

```javascript
test("array is empty", () => {
  const arr = [];
  expect(arr).toHaveLength(0);
  expect(arr).toEqual([]);
});
```

---

### 8. **Array of Specific Length**

To check if an array has a specific length, use `.toHaveLength()`.

```javascript
test("array has specific length", () => {
  const arr = [1, 2, 3];
  expect(arr).toHaveLength(3);
});
```

---

### 9. **Array Slicing and Subsets**

To test a subset of an array, you can use `.slice()` or `.arrayContaining()`.

```javascript
test("array subset matches", () => {
  const arr = [1, 2, 3, 4, 5];
  expect(arr.slice(1, 3)).toEqual([2, 3]);
});
```

---

### 10. **Array Sorting**

To verify that an array is sorted, you can write a custom test.

```javascript
test("array is sorted", () => {
  const arr = [1, 2, 3, 4, 5];
  const isSorted = arr.every((val, i, arr) => !i || val >= arr[i - 1]);
  expect(isSorted).toBeTruthy();
});
```

---

### 11. **Array of Objects**

To test an array of objects, you can use `.toEqual()` with nested matchers.

```javascript
test("array of objects matches", () => {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  expect(users).toEqual([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]);
});
```

---

### 12. **Snapshot Testing for Arrays**

To ensure that an array doesn’t change unexpectedly, you can use snapshot testing.

```javascript
test("array snapshot", () => {
  const arr = [1, 2, 3];
  expect(arr).toMatchSnapshot();
});
```

When you run this test for the first time, Vitest will create a snapshot file. On subsequent runs, it will compare the array to the saved snapshot.

---

### 13. **Custom Array Assertions**

For more complex scenarios, you can write custom logic and use `.toBeTruthy()` or `.toBeFalsy()`.

```javascript
test("array contains only even numbers", () => {
  const arr = [2, 4, 6, 8];
  const allEven = arr.every((num) => num % 2 === 0);
  expect(allEven).toBeTruthy();
});
```

---

### 14. **Array Methods**

You can test the behavior of array methods like `.map()`, `.filter()`, `.reduce()`, etc.

```javascript
test("array map works correctly", () => {
  const arr = [1, 2, 3];
  const doubled = arr.map((num) => num * 2);
  expect(doubled).toEqual([2, 4, 6]);
});

test("array filter works correctly", () => {
  const arr = [1, 2, 3, 4, 5];
  const evens = arr.filter((num) => num % 2 === 0);
  expect(evens).toEqual([2, 4]);
});
```

---

### Summary of Matchers for Arrays

| Matcher              | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| `.toEqual()`         | Exact array equality                                    |
| `.toContain()`       | Check if an array contains an item                      |
| `.not.toContain()`   | Check if an array does not contain an item              |
| `.arrayContaining()` | Check if an array contains all items from another array |
| `.toHaveLength()`    | Check the length of an array                            |
| `.toMatchSnapshot()` | Ensure an array matches a saved snapshot                |

**_<h1 style="text-align:center;">Boolean</h1>_**

Great! Let’s move on to **boolean testing** in Vitest. Boolean testing involves verifying that a value is either `true` or `false`, or that it evaluates to a truthy or falsy value. Vitest provides simple and powerful matchers for working with boolean values.

---

### 1. **Exact Boolean Matching**

To check if a value is exactly `true` or `false`, use the `.toBe()` matcher.

```javascript
import { expect, test } from "vitest";

test("value is true", () => {
  const isTrue = true;
  expect(isTrue).toBe(true);
});

test("value is false", () => {
  const isFalse = false;
  expect(isFalse).toBe(false);
});
```

---

### 2. **Truthy and Falsy Values**

In JavaScript, values like `0`, `''`, `null`, `undefined`, and `NaN` are considered **falsy**, while all other values are **truthy**. You can use `.toBeTruthy()` and `.toBeFalsy()` to test for these.

```javascript
test("value is truthy", () => {
  const truthyValue = "hello";
  expect(truthyValue).toBeTruthy();
});

test("value is falsy", () => {
  const falsyValue = "";
  expect(falsyValue).toBeFalsy();
});
```

---

### 3. **Negating Boolean Checks**

To check that a value is **not** `true` or **not** `false`, use `.not` with `.toBe()`.

```javascript
test("value is not true", () => {
  const isFalse = false;
  expect(isFalse).not.toBe(true);
});

test("value is not false", () => {
  const isTrue = true;
  expect(isTrue).not.toBe(false);
});
```

---

### 4. **Boolean Expressions**

You can test the result of boolean expressions, such as comparisons or logical operations.

```javascript
test("boolean expression is true", () => {
  const a = 5;
  const b = 10;
  expect(a < b).toBe(true);
});

test("logical AND operation", () => {
  const isTrue = true;
  const isAlsoTrue = true;
  expect(isTrue && isAlsoTrue).toBe(true);
});
```

---

### 5. **Checking for Null or Undefined**

While not strictly boolean, you can use `.toBeNull()` or `.toBeUndefined()` to check for `null` or `undefined`.

```javascript
test("value is null", () => {
  const nullValue = null;
  expect(nullValue).toBeNull();
});

test("value is undefined", () => {
  const undefinedValue = undefined;
  expect(undefinedValue).toBeUndefined();
});
```

---

### 6. **Custom Boolean Logic**

For more complex scenarios, you can write custom logic and use `.toBeTruthy()` or `.toBeFalsy()`.

```javascript
test("custom boolean logic", () => {
  const isEven = (num) => num % 2 === 0;
  expect(isEven(4)).toBeTruthy();
  expect(isEven(5)).toBeFalsy();
});
```

---

### 7. **Boolean Return Values from Functions**

You can test functions that return boolean values.

```javascript
function isPositive(num) {
  return num > 0;
}

test("function returns true for positive numbers", () => {
  expect(isPositive(10)).toBe(true);
});

test("function returns false for non-positive numbers", () => {
  expect(isPositive(-5)).toBe(false);
});
```

---

### 8. **Snapshot Testing for Booleans**

While snapshot testing is less common for booleans, you can still use it if needed.

```javascript
test("boolean snapshot", () => {
  const isTrue = true;
  expect(isTrue).toMatchSnapshot();
});
```

When you run this test for the first time, Vitest will create a snapshot file. On subsequent runs, it will compare the boolean value to the saved snapshot.

---

### Summary of Matchers for Booleans

| Matcher                        | Purpose                                   |
| ------------------------------ | ----------------------------------------- |
| `.toBe(true)` / `.toBe(false)` | Exact boolean equality                    |
| `.toBeTruthy()`                | Check if a value is truthy                |
| `.toBeFalsy()`                 | Check if a value is falsy                 |
| `.not.toBe()`                  | Negate a boolean check                    |
| `.toBeNull()`                  | Check if a value is `null`                |
| `.toBeUndefined()`             | Check if a value is `undefined`           |
| `.toMatchSnapshot()`           | Ensure a boolean matches a saved snapshot |

---

### Example: Testing a Function That Returns a Boolean

Let’s test a function that checks if a string is a palindrome.

```javascript
function isPalindrome(str) {
  const cleanedStr = str.replace(/[\W_]/g, "").toLowerCase();
  return cleanedStr === cleanedStr.split("").reverse().join("");
}

test("isPalindrome returns true for palindromes", () => {
  expect(isPalindrome("racecar")).toBe(true);
  expect(isPalindrome("A man, a plan, a canal, Panama")).toBe(true);
});

test("isPalindrome returns false for non-palindromes", () => {
  expect(isPalindrome("hello")).toBe(false);
  expect(isPalindrome("Vitest")).toBe(false);
});
```

**_<h1 style="text-align:center;">Object</h1>_**

### 1. **Testing Objects**

Objects are a fundamental part of JavaScript, and testing them involves checking their properties, structure, and values.

#### Example:

```javascript
import { expect, test } from "vitest";

const user = {
  name: "John Doe",
  age: 30,
  isAdmin: false,
};

test("user object should have correct properties", () => {
  expect(user).toEqual({
    name: "John Doe",
    age: 30,
    isAdmin: false,
  });
});

test("user should not be an admin", () => {
  expect(user.isAdmin).toBe(false);
});
```

- Use `.toEqual()` for deep equality checks on objects.
- Use `.toHaveProperty()` to check if an object has a specific property.

---

### 2. **Testing Functions**

Testing functions involves verifying their return values, side effects, and behavior with different inputs.

#### Example:

```javascript
import { expect, test } from "vitest";

function add(a, b) {
  return a + b;
}

test("add function should return the sum of two numbers", () => {
  expect(add(2, 3)).toBe(5);
  expect(add(-1, 1)).toBe(0);
  expect(add(0, 0)).toBe(0);
});
```

- Use `.toBe()` for primitive return values.
- Use `.toThrow()` to test if a function throws an error.

---

### 3. **Testing Asynchronous Code**

Vitest makes it easy to test asynchronous code, such as Promises or `async/await`.

#### Example with Promises:

```javascript
import { expect, test } from "vitest";

function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("data"), 100);
  });
}

test('fetchData should return "data"', async () => {
  await expect(fetchData()).resolves.toBe("data");
});
```

#### Example with `async/await`:

```javascript
import { expect, test } from "vitest";

async function fetchData() {
  return "data";
}

test('fetchData should return "data"', async () => {
  const data = await fetchData();
  expect(data).toBe("data");
});
```

- Use `.resolves` and `.rejects` for testing Promises.
- Use `async/await` for cleaner asynchronous test code.

---

### 4. **Testing React Components (if applicable)**

If you’re working with React, Vitest can be combined with libraries like **React Testing Library** to test components.

#### Example:

```javascript
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

- Use `render` to render components.
- Use `screen` to query elements in the rendered output.

---

### 5. **Mocking**

Mocking is essential for isolating the code under test. Vitest provides utilities for mocking functions, modules, and dependencies.

#### Example:

```javascript
import { expect, test, vi } from "vitest";

const fetchData = vi.fn(() => Promise.resolve("data"));

test('fetchData should return "data"', async () => {
  const result = await fetchData();
  expect(result).toBe("data");
  expect(fetchData).toHaveBeenCalled();
});
```

- Use `vi.fn()` to create mock functions.
- Use `vi.spyOn()` to spy on existing functions.

---

### 6. **Snapshot Testing**

Snapshot testing is useful for ensuring that the output of a component or function doesn’t change unexpectedly.

#### Example:

```javascript
import { expect, test } from "vitest";

function generateMarkup() {
  return "<div>Hello, World!</div>";
}

test("markup should match snapshot", () => {
  const markup = generateMarkup();
  expect(markup).toMatchSnapshot();
});
```

- Use `.toMatchSnapshot()` to compare the output with a stored snapshot.
- Update snapshots with `vitest -u` if the output changes intentionally.

---

### 7. **Testing Edge Cases**

Always test edge cases to ensure your code handles unexpected inputs gracefully.

#### Example:

```javascript
import { expect, test } from "vitest";

function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

test("divide should throw an error when dividing by zero", () => {
  expect(() => divide(10, 0)).toThrow("Division by zero");
});
```

- Use `.toThrow()` to test error handling.

---

### 8. **Grouping Tests with `describe`**

Use `describe` to group related tests and improve readability.

#### Example:

```javascript
import { describe, expect, test } from "vitest";

describe("Math operations", () => {
  test("add", () => {
    expect(1 + 1).toBe(2);
  });

  test("subtract", () => {
    expect(3 - 1).toBe(2);
  });
});
```

- Use `describe` to organize tests into logical groups.

---

### 9. **Setup and Teardown**

Use `beforeEach`, `afterEach`, `beforeAll`, and `afterAll` to run setup and teardown code.

#### Example:

```javascript
import { beforeEach, expect, test } from "vitest";

let counter = 0;

beforeEach(() => {
  counter = 0;
});

test("increment counter", () => {
  counter++;
  expect(counter).toBe(1);
});

test("reset counter", () => {
  expect(counter).toBe(0);
});
```

# advanced testing concepts

### 1. **Parameterized Tests**

Parameterized tests allow you to run the same test with multiple inputs. This is useful for testing functions with a variety of inputs.

#### Example:

```javascript
import { expect, test } from "vitest";

function isEven(num) {
  return num % 2 === 0;
}

test.each([
  [2, true],
  [3, false],
  [0, true],
  [-4, true],
])("isEven(%i) should return %s", (input, expected) => {
  expect(isEven(input)).toBe(expected);
});
```

- Use `test.each` to run the same test with different inputs.
- This reduces code duplication and makes tests more maintainable.

---

### 2. **Testing Side Effects**

Sometimes, functions have side effects (e.g., modifying external state or making API calls). Testing these requires mocking or spying.

#### Example:

```javascript
import { expect, test, vi } from "vitest";

let counter = 0;

function increment() {
  counter++;
}

test("increment should increase counter by 1", () => {
  increment();
  expect(counter).toBe(1);
});
```

- Use `vi.spyOn()` to spy on functions and track their calls.
- Use `vi.fn()` to mock functions and control their behavior.

---

### 3. **Testing Error Handling**

Ensure your code handles errors gracefully by testing error scenarios.

#### Example:

```javascript
import { expect, test } from "vitest";

function throwError() {
  throw new Error("Something went wrong");
}

test("throwError should throw an error", () => {
  expect(() => throwError()).toThrow("Something went wrong");
});
```

- Use `.toThrow()` to test if a function throws an error.
- You can also test for specific error messages or error types.

---

### 4. **Testing API Calls**

When testing code that makes API calls, you can mock the API to avoid making real network requests.

#### Example:

```javascript
import { expect, test, vi } from "vitest";
import axios from "axios";

vi.mock("axios");

test("fetchUser should return user data", async () => {
  const mockUser = { name: "John Doe" };
  axios.get.mockResolvedValue({ data: mockUser });

  const user = await axios.get("/user");
  expect(user.data).toEqual(mockUser);
});
```

- Use `vi.mock()` to mock modules like `axios`.
- Use `.mockResolvedValue()` to simulate successful API responses.

---

### 5. **Testing Hooks (e.g., React Hooks)**

If you’re working with React, you can test hooks using **React Testing Library**.

#### Example:

```javascript
import { renderHook, act } from "@testing-library/react";
import { expect, test } from "vitest";
import useCounter from "./useCounter";

test("useCounter should increment count", () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

- Use `renderHook` to test custom hooks.
- Use `act` to wrap state updates.

---

### 6. **Testing Context (e.g., React Context)**

Testing components that rely on context can be tricky. You can mock the context provider for testing.

#### Example:

```javascript
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { UserContext } from "./UserContext";
import UserProfile from "./UserProfile";

test("UserProfile should display user name", () => {
  const user = { name: "John Doe" };

  render(
    <UserContext.Provider value={user}>
      <UserProfile />
    </UserContext.Provider>
  );

  expect(screen.getByText("John Doe")).toBeInTheDocument();
});
```

- Wrap your component in a context provider during testing.
- Use `screen` to query the rendered output.

---

### 7. **Testing Performance**

You can write tests to ensure your code meets performance benchmarks.

#### Example:

```javascript
import { expect, test } from "vitest";

function heavyComputation() {
  let sum = 0;
  for (let i = 0; i < 1e6; i++) {
    sum += i;
  }
  return sum;
}

test("heavyComputation should complete within 50ms", () => {
  const start = performance.now();
  heavyComputation();
  const end = performance.now();
  expect(end - start).toBeLessThan(50);
});
```

- Use `performance.now()` to measure execution time.
- Use `.toBeLessThan()` to enforce performance constraints.

---

### 8. **Testing Environment Variables**

Sometimes, your code relies on environment variables. You can mock these in your tests.

#### Example:

```javascript
import { expect, test, vi } from "vitest";

function getApiUrl() {
  return process.env.API_URL || "https://default-api.com";
}

test("getApiUrl should return the correct URL", () => {
  process.env.API_URL = "https://test-api.com";
  expect(getApiUrl()).toBe("https://test-api.com");

  delete process.env.API_URL;
  expect(getApiUrl()).toBe("https://default-api.com");
});
```

- Use `process.env` to access environment variables.
- Mock environment variables as needed for your tests.

---

### 9. **Testing Third-Party Libraries**

When using third-party libraries, you may want to mock or spy on their behavior.

#### Example:

```javascript
import { expect, test, vi } from "vitest";
import moment from "moment";

vi.mock("moment", () => ({
  default: vi.fn(() => ({
    format: vi.fn(() => "2023-10-01"),
  })),
}));

test("moment should return mocked date", () => {
  const date = moment().format("YYYY-MM-DD");
  expect(date).toBe("2023-10-01");
});
```

- Use `vi.mock()` to mock third-party libraries.
- Replace their behavior with mock implementations.

---

### 10. **Testing with TypeScript**

If you’re using TypeScript, Vitest works seamlessly with it. You can write type-safe tests.

#### Example:

```typescript
import { expect, test } from "vitest";

function add(a: number, b: number): number {
  return a + b;
}

test("add should return the sum of two numbers", () => {
  expect(add(2, 3)).toBe(5);
});
```

- Vitest automatically infers types in TypeScript.
- Use type annotations to ensure your tests are type-safe.

---

### 11. **Continuous Integration (CI) with Vitest**

Integrate Vitest into your CI/CD pipeline to run tests automatically.

#### Example (GitHub Actions):

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test
```

- Use Vitest in your CI pipeline to ensure code quality.
- Configure your CI tool (e.g., GitHub Actions, CircleCI) to run `vitest`.

---

### 12. **Debugging Tests**

Vitest provides tools for debugging tests, such as `--inspect` and `--ui`.

#### Example:

Run Vitest in debug mode:

```bash
vitest --inspect
```

- Use `console.log` or breakpoints to debug your tests.
- Use the `--ui` flag for an interactive testing interface.

---

### 13. **Best Practices**

Here are some best practices for writing tests with Vitest:

1. **Keep tests small and focused**: Test one thing at a time.
2. **Use descriptive test names**: Make it clear what each test is checking.
3. **Avoid testing implementation details**: Focus on behavior, not how the code is implemented.
4. **Use mocks and spies sparingly**: Over-mocking can make tests brittle.
5. **Run tests frequently**: Integrate tests into your development workflow.
