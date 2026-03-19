// Topic content and YouTube video suggestions for each topic

export interface TopicContent {
  title: string
  subject: string
  duration: number
  overview: string
  keyPoints: string[]
  explanation: string
  formula?: string
  commonMistakes: string[]
  youtubeVideos: {
    title: string
    channel: string
    url: string
    duration: string
  }[]
  practiceQuestions?: string[]
}

const topicContent: Record<string, TopicContent> = {
  // ═══════════ C PROGRAMMING ═══════════
  'Variables & Data Types': {
    title: 'Variables & Data Types',
    subject: 'C Programming',
    duration: 15,
    overview: 'Variables are named containers that store data in memory. Data types define what kind of data a variable can hold — integers, decimals, characters, etc.',
    keyPoints: [
      'Variables must be declared before use in C',
      'int, float, double, char are primitive data types',
      'sizeof() operator returns the size of a data type in bytes',
      'Type casting converts one data type to another',
    ],
    explanation: `In C, every variable must have a data type that determines how much memory is allocated and how the stored bit pattern is interpreted.\n\n**Primitive Types:**\n- \`int\` — stores whole numbers (4 bytes, range: -2³¹ to 2³¹-1)\n- \`float\` — stores decimals with ~7 digits precision (4 bytes)\n- \`double\` — stores decimals with ~15 digits precision (8 bytes)\n- \`char\` — stores a single character (1 byte)\n\n**Declaration syntax:**\n\`\`\`c\nint age = 21;\nfloat gpa = 8.7;\nchar grade = 'A';\n\`\`\`\n\n**Type Modifiers:** \`short\`, \`long\`, \`unsigned\`, \`signed\` modify the range and size of data types. For example, \`unsigned int\` can store 0 to 2³²-1 (no negatives).`,
    formula: 'sizeof(int) = 4 bytes | sizeof(char) = 1 byte | sizeof(double) = 8 bytes',
    commonMistakes: [
      'Using uninitialized variables — always assign a value before use',
      'Integer overflow — storing a value larger than the type can hold',
      'Confusing = (assignment) with == (comparison)',
    ],
    youtubeVideos: [
      { title: 'C Variables and Data Types', channel: 'Neso Academy', url: 'https://www.youtube.com/watch?v=mI8K6SslIHA', duration: '12:34' },
      { title: 'Data Types in C Programming', channel: 'CodeWithHarry', url: 'https://www.youtube.com/watch?v=EExSSotojVI', duration: '18:21' },
      { title: 'Variables in C - Complete Tutorial', channel: 'Jenny\'s Lectures', url: 'https://www.youtube.com/watch?v=aIQk1O08zpg', duration: '15:42' },
    ],
    practiceQuestions: [
      'What is the output of sizeof(char)?',
      'What happens when you store 40000 in a short int?',
      'Write a program that swaps two integers without a temp variable.',
    ],
  },

  'Control Flow — if/else': {
    title: 'Control Flow — if/else',
    subject: 'C Programming',
    duration: 15,
    overview: 'Control flow statements determine which blocks of code execute based on conditions. if/else is the most fundamental decision-making construct.',
    keyPoints: [
      'if evaluates a boolean condition',
      'else executes when the condition is false',
      'else if chains multiple conditions',
      'Nested if/else for complex logic',
    ],
    explanation: `Control flow lets your program make decisions. The \`if\` statement checks a condition — if true, the code block runs; otherwise, the \`else\` block runs.\n\n\`\`\`c\nint marks = 75;\nif (marks >= 90) {\n    printf("Grade A");\n} else if (marks >= 75) {\n    printf("Grade B");\n} else if (marks >= 60) {\n    printf("Grade C");\n} else {\n    printf("Fail");\n}\n\`\`\`\n\n**Ternary operator** is a shorthand: \`result = (condition) ? value_if_true : value_if_false;\`\n\n**Switch-case** is better for multiple discrete values:\n\`\`\`c\nswitch(day) {\n    case 1: printf("Monday"); break;\n    case 2: printf("Tuesday"); break;\n    default: printf("Other");\n}\n\`\`\``,
    commonMistakes: [
      'Forgetting break in switch-case — causes fall-through',
      'Using = instead of == in conditions',
      'Not using braces for single-line if blocks — leads to bugs when adding lines',
    ],
    youtubeVideos: [
      { title: 'If-Else in C Programming', channel: 'Neso Academy', url: 'https://www.youtube.com/watch?v=2F6y2cLO9mQ', duration: '10:15' },
      { title: 'Control Statements in C', channel: 'Apna College', url: 'https://www.youtube.com/watch?v=2z1eFUPlJKY', duration: '22:30' },
      { title: 'Switch Case in C', channel: 'CodeWithHarry', url: 'https://www.youtube.com/watch?v=JA1AvVDdPXA', duration: '14:45' },
    ],
  },

  'Loops — for, while': {
    title: 'Loops — for, while, do-while',
    subject: 'C Programming',
    duration: 20,
    overview: 'Loops let you repeat a block of code multiple times. C provides for, while, and do-while loops.',
    keyPoints: [
      'for loop — when you know the number of iterations',
      'while loop — when the condition determines when to stop',
      'do-while — executes at least once before checking the condition',
      'break exits a loop; continue skips to the next iteration',
    ],
    explanation: `**for loop** — best when iteration count is known:\n\`\`\`c\nfor (int i = 0; i < 10; i++) {\n    printf("%d ", i);\n}\n\`\`\`\n\n**while loop** — checks condition first:\n\`\`\`c\nint n = 5;\nwhile (n > 0) {\n    printf("%d ", n);\n    n--;\n}\n\`\`\`\n\n**do-while** — executes body first, then checks:\n\`\`\`c\ndo {\n    scanf("%d", &input);\n} while (input != 0);\n\`\`\`\n\n**Nested loops** are used for 2D patterns and matrices. Time complexity becomes O(n²) with two nested loops.`,
    commonMistakes: [
      'Infinite loops — forgetting to update the loop variable',
      'Off-by-one errors — using <= instead of < or vice versa',
      'Modifying loop variable inside the loop body unintentionally',
    ],
    youtubeVideos: [
      { title: 'Loops in C - for, while, do-while', channel: 'Neso Academy', url: 'https://www.youtube.com/watch?v=Eg7Ry9JqTb0', duration: '16:20' },
      { title: 'C Loops Complete Tutorial', channel: 'CodeWithHarry', url: 'https://www.youtube.com/watch?v=3pJ3APHU1ME', duration: '25:10' },
      { title: 'Pattern Programs using Loops', channel: 'Apna College', url: 'https://www.youtube.com/watch?v=8l3Hl_xyORs', duration: '20:00' },
    ],
  },

  // ═══════════ C++ ═══════════
  'OOP Concepts': {
    title: 'OOP Concepts — Object-Oriented Programming',
    subject: 'C++',
    duration: 15,
    overview: 'OOP is a programming paradigm that organizes code into objects — bundles of data (attributes) and functions (methods) that represent real-world entities.',
    keyPoints: [
      'Four pillars: Encapsulation, Inheritance, Polymorphism, Abstraction',
      'Class is a blueprint; Object is an instance of a class',
      'Encapsulation — hiding internal state with access modifiers',
      'Abstraction — showing only essential features',
    ],
    explanation: `**Classes and Objects:**\n\`\`\`cpp\nclass Student {\nprivate:\n    int rollNo;\n    string name;\npublic:\n    void setName(string n) { name = n; }\n    string getName() { return name; }\n};\n\nStudent s1;  // Object creation\ns1.setName("Arjun");\n\`\`\`\n\n**The Four Pillars of OOP:**\n\n1. **Encapsulation** — Wrapping data + methods together. \`private\` hides internals, \`public\` exposes the interface.\n\n2. **Inheritance** — Creating new classes from existing ones. A \`Dog\` class can inherit from \`Animal\`.\n\n3. **Polymorphism** — One interface, many implementations. A \`draw()\` function behaves differently for \`Circle\` vs \`Rectangle\`.\n\n4. **Abstraction** — Hiding complexity. You use \`cout\` without knowing how it works internally.`,
    commonMistakes: [
      'Making everything public — defeats the purpose of encapsulation',
      'Confusing Abstraction with Encapsulation — abstraction is about WHAT, encapsulation is about HOW',
      'Not understanding when to use inheritance vs composition',
    ],
    youtubeVideos: [
      { title: 'OOP in C++ - Complete Course', channel: 'Apna College', url: 'https://www.youtube.com/watch?v=wN0x9eZLix4', duration: '28:45' },
      { title: 'Object Oriented Programming in C++', channel: 'CodeWithHarry', url: 'https://www.youtube.com/watch?v=_8-uu2AKO1w', duration: '35:20' },
      { title: 'C++ OOPs Concepts Explained', channel: 'The Cherno', url: 'https://www.youtube.com/watch?v=2BP8NhxjrO0', duration: '18:30' },
    ],
  },

  'Classes & Objects': {
    title: 'Classes & Objects',
    subject: 'C++',
    duration: 20,
    overview: 'A class defines the structure and behavior of objects. It contains data members (variables) and member functions (methods).',
    keyPoints: [
      'class keyword defines a new type',
      'Access specifiers: public, private, protected',
      'Objects are instances created from the class blueprint',
      'Member functions can be defined inside or outside the class',
    ],
    explanation: `\`\`\`cpp\nclass Rectangle {\nprivate:\n    int width, height;\npublic:\n    // Constructor\n    Rectangle(int w, int h) : width(w), height(h) {}\n    \n    // Member function\n    int area() { return width * height; }\n    \n    // Getter\n    int getWidth() { return width; }\n};\n\nint main() {\n    Rectangle r1(5, 10);    // Stack allocation\n    Rectangle* r2 = new Rectangle(3, 7);  // Heap allocation\n    \n    cout << r1.area();      // 50\n    cout << r2->area();     // 21\n    \n    delete r2;  // Free heap memory\n}\n\`\`\`\n\n**Key concepts:**\n- \`this\` pointer refers to the current object\n- Static members belong to the class, not individual objects\n- Friend functions can access private members`,
    commonMistakes: [
      'Forgetting to delete heap-allocated objects — memory leak',
      'Not initializing member variables — undefined behavior',
      'Writing overly large classes — violates Single Responsibility Principle',
    ],
    youtubeVideos: [
      { title: 'Classes and Objects in C++', channel: 'Neso Academy', url: 'https://www.youtube.com/watch?v=bI3jv7KakYE', duration: '14:50' },
      { title: 'C++ Classes Tutorial', channel: 'The Cherno', url: 'https://www.youtube.com/watch?v=2BP8NhxjrO0', duration: '16:22' },
      { title: 'OOP in C++ Hindi', channel: 'CodeWithHarry', url: 'https://www.youtube.com/watch?v=nGJTWaaFdjc', duration: '22:10' },
    ],
  },

  // ═══════════ DATA STRUCTURES ═══════════
  'Arrays & Linked Lists': {
    title: 'Arrays & Linked Lists',
    subject: 'Data Structures',
    duration: 20,
    overview: 'Arrays store elements in contiguous memory with O(1) access. Linked Lists store elements in nodes connected by pointers, allowing O(1) insertion/deletion.',
    keyPoints: [
      'Arrays: fixed size, O(1) random access, O(n) insertion/deletion',
      'Linked Lists: dynamic size, O(n) access, O(1) insertion at head',
      'Singly linked list — each node points to next',
      'Doubly linked list — each node points to next and previous',
    ],
    explanation: `**Array:**\n\`\`\`cpp\nint arr[5] = {10, 20, 30, 40, 50};\narr[2] = 35;  // O(1) access\n\`\`\`\n\n**Linked List:**\n\`\`\`cpp\nstruct Node {\n    int data;\n    Node* next;\n};\n\n// Insertion at head — O(1)\nvoid insertHead(Node*& head, int val) {\n    Node* newNode = new Node{val, head};\n    head = newNode;\n}\n\`\`\`\n\n**Comparison:**\n| | Array | Linked List |\n|---|---|---|\n| Access | O(1) | O(n) |\n| Insert at head | O(n) | O(1) |\n| Insert at end | O(1)* | O(n) or O(1) with tail |\n| Memory | Contiguous | Scattered |\n| Cache | Friendly | Unfriendly |`,
    formula: 'Array index access: O(1) | Linked List traversal: O(n) | Linked List insert at head: O(1)',
    commonMistakes: [
      'Array index out of bounds — no runtime error in C/C++, just undefined behavior',
      'Memory leaks in linked lists — always free deleted nodes',
      'Losing the head pointer — makes the entire list unreachable',
    ],
    youtubeVideos: [
      { title: 'Arrays vs Linked Lists', channel: 'mycodeschool', url: 'https://www.youtube.com/watch?v=lC-yYCOnN8Q', duration: '13:45' },
      { title: 'Linked List in C/C++', channel: 'Neso Academy', url: 'https://www.youtube.com/watch?v=R9PTBwOzceo', duration: '20:30' },
      { title: 'Linked List Full Course', channel: 'Apna College', url: 'https://www.youtube.com/watch?v=Nq7ok-OyEpg', duration: '45:00' },
      { title: 'Data Structures - Arrays', channel: 'Abdul Bari', url: 'https://www.youtube.com/watch?v=gDqQf4Ekr2A', duration: '18:20' },
    ],
  },

  'Stacks & Queues': {
    title: 'Stacks & Queues',
    subject: 'Data Structures',
    duration: 20,
    overview: 'Stacks follow LIFO (Last In, First Out) — like a stack of plates. Queues follow FIFO (First In, First Out) — like a line at a counter.',
    keyPoints: [
      'Stack operations: push, pop, peek/top — all O(1)',
      'Queue operations: enqueue, dequeue, front — all O(1)',
      'Stack applications: function calls, undo, expression evaluation',
      'Queue applications: BFS, scheduling, buffering',
    ],
    explanation: `**Stack:**\n\`\`\`cpp\nstack<int> s;\ns.push(10);  // [10]\ns.push(20);  // [10, 20]\ns.top();     // 20\ns.pop();     // [10]\n\`\`\`\n\n**Queue:**\n\`\`\`cpp\nqueue<int> q;\nq.push(10);  // [10]\nq.push(20);  // [10, 20]\nq.front();   // 10\nq.pop();     // [20]\n\`\`\`\n\n**Applications:**\n- Stack: Browser back button, parenthesis matching, converting infix to postfix\n- Queue: Printer queue, BFS traversal, CPU scheduling\n- Deque: Double-ended queue — insert/remove from both ends`,
    commonMistakes: [
      'Popping from an empty stack — always check isEmpty() first',
      'Confusing stack (LIFO) with queue (FIFO)',
      'Not considering circular queue implementation for arrays',
    ],
    youtubeVideos: [
      { title: 'Stack Data Structure', channel: 'Abdul Bari', url: 'https://www.youtube.com/watch?v=bxRVz8zklWM', duration: '16:40' },
      { title: 'Queue Implementation', channel: 'mycodeschool', url: 'https://www.youtube.com/watch?v=XuCbpw6Bj1U', duration: '14:22' },
      { title: 'Stacks and Queues', channel: 'Apna College', url: 'https://www.youtube.com/watch?v=bxRVz8zklWM', duration: '32:15' },
    ],
  },

  // ═══════════ ALGORITHMS ═══════════
  'Time Complexity Analysis': {
    title: 'Time Complexity Analysis',
    subject: 'Algorithms',
    duration: 15,
    overview: 'Time complexity measures how the runtime of an algorithm grows as input size increases. We use Big-O notation to express the upper bound.',
    keyPoints: [
      'Big-O: upper bound (worst case)',
      'Big-Ω (Omega): lower bound (best case)',
      'Big-Θ (Theta): tight bound (average case)',
      'Common complexities: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)',
    ],
    explanation: `**Big-O Examples:**\n\n| Complexity | Name | Example |\n|---|---|---|\n| O(1) | Constant | Array access |\n| O(log n) | Logarithmic | Binary search |\n| O(n) | Linear | Linear search |\n| O(n log n) | Linearithmic | Merge sort |\n| O(n²) | Quadratic | Bubble sort |\n| O(2ⁿ) | Exponential | Recursive Fibonacci |\n\n**How to calculate:**\n1. Count the number of operations\n2. Drop constants: O(2n) → O(n)\n3. Drop lower-order terms: O(n² + n) → O(n²)\n4. Nested loops multiply: O(n) × O(n) = O(n²)\n\n\`\`\`cpp\n// O(n²) — nested loop\nfor (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        // operation\n\n// O(n log n) — divide and conquer\nvoid mergeSort(int arr[], int l, int r) {\n    if (l < r) {\n        int mid = (l + r) / 2;\n        mergeSort(arr, l, mid);\n        mergeSort(arr, mid+1, r);\n        merge(arr, l, mid, r);\n    }\n}\n\`\`\``,
    formula: 'Drop constants: O(2n) → O(n) | Drop lower terms: O(n² + n) → O(n²) | Nested loops multiply',
    commonMistakes: [
      'Confusing O(n) with O(1) for hash table operations — hash tables are O(1) average but O(n) worst case',
      'Forgetting that recursive calls add to stack space (space complexity)',
      'Not considering the best/worst/average cases separately',
    ],
    youtubeVideos: [
      { title: 'Time Complexity Analysis - Big O', channel: 'Abdul Bari', url: 'https://www.youtube.com/watch?v=9TlHvipP5yA', duration: '22:15' },
      { title: 'Big O Notation', channel: 'CS Dojo', url: 'https://www.youtube.com/watch?v=D6xkbGLQesk', duration: '12:30' },
      { title: 'Time Complexity for Beginners', channel: 'Apna College', url: 'https://www.youtube.com/watch?v=FPu9Uld7W-E', duration: '18:00' },
    ],
  },

  // ═══════════ CAT SUBJECTS ═══════════
  'Number Systems': {
    title: 'Number Systems',
    subject: 'Quantitative Aptitude',
    duration: 20,
    overview: 'Number systems form the foundation of Quantitative Aptitude for CAT. Topics include divisibility rules, HCF/LCM, remainders, and properties of numbers.',
    keyPoints: [
      'Types: natural, whole, integers, rational, irrational, real',
      'Divisibility rules for 2, 3, 4, 5, 6, 8, 9, 11',
      'HCF (GCD) and LCM — relationship: HCF × LCM = Product of numbers',
      'Remainder theorem and modular arithmetic',
    ],
    explanation: `**Divisibility Rules:**\n- By 2: last digit is even\n- By 3: sum of digits divisible by 3\n- By 4: last two digits form a number divisible by 4\n- By 9: sum of digits divisible by 9\n- By 11: difference of alternating sum of digits is 0 or divisible by 11\n\n**HCF/LCM:**\n- HCF(a, b) × LCM(a, b) = a × b\n- For three numbers: HCF(a, b, c) = HCF(HCF(a, b), c)\n\n**Remainder Theorem:**\n- (a + b) mod n = ((a mod n) + (b mod n)) mod n\n- (a × b) mod n = ((a mod n) × (b mod n)) mod n\n\n**Example:** Find remainder when 2^100 is divided by 7\n- 2¹ mod 7 = 2, 2² mod 7 = 4, 2³ mod 7 = 1\n- Pattern repeats every 3: 2^100 = 2^(3×33 + 1) → remainder = 2`,
    formula: 'HCF × LCM = a × b | (a × b) mod n = ((a mod n) × (b mod n)) mod n',
    commonMistakes: [
      'Confusing HCF with LCM in word problems',
      'Forgetting that HCF of co-prime numbers is always 1',
      'Not checking all divisibility rules in complex problems',
    ],
    youtubeVideos: [
      { title: 'Number Systems for CAT', channel: 'Unacademy CAT', url: 'https://www.youtube.com/watch?v=w8p-uSGIaxk', duration: '45:00' },
      { title: 'HCF and LCM Tricks', channel: 'CareerRide', url: 'https://www.youtube.com/watch?v=HB5F-TYx6QM', duration: '22:30' },
      { title: 'Divisibility Rules Shortcut', channel: 'Arun Sharma', url: 'https://www.youtube.com/watch?v=S5aN5G2WXmI', duration: '18:45' },
    ],
  },

  // ═══════════ PHYSICS (JEE/NEET) ═══════════
  'Kinematics': {
    title: 'Kinematics — Motion in One & Two Dimensions',
    subject: 'Physics',
    duration: 20,
    overview: 'Kinematics describes the motion of objects without considering the forces causing motion. Key concepts: displacement, velocity, acceleration.',
    keyPoints: [
      'Displacement vs Distance — displacement is a vector',
      'Equations of motion: v = u + at, s = ut + ½at², v² = u² + 2as',
      'Projectile motion — independent horizontal and vertical components',
      'Relative velocity for problems with two moving objects',
    ],
    explanation: `**Equations of Motion (constant acceleration):**\n\n1. v = u + at\n2. s = ut + ½at²\n3. v² = u² + 2as\n\nwhere u = initial velocity, v = final velocity, a = acceleration, t = time, s = displacement\n\n**Projectile Motion:**\n- Horizontal: x = u·cos(θ)·t\n- Vertical: y = u·sin(θ)·t - ½gt²\n- Range: R = u²sin(2θ)/g\n- Maximum height: H = u²sin²(θ)/2g\n- Time of flight: T = 2u·sin(θ)/g\n\n**Key insight:** Max range occurs at θ = 45°`,
    formula: 'v = u + at | s = ut + ½at² | v² = u² + 2as | Range = u²sin(2θ)/g',
    commonMistakes: [
      'Confusing displacement with distance in sign conventions',
      'Forgetting that acceleration due to gravity is negative for upward motion',
      'Not resolving vectors into components for 2D problems',
    ],
    youtubeVideos: [
      { title: 'Kinematics Complete - JEE', channel: 'Physics Wallah', url: 'https://www.youtube.com/watch?v=1-jCFVc7SFo', duration: '55:00' },
      { title: 'Kinematics One Shot', channel: 'Vedantu JEE', url: 'https://www.youtube.com/watch?v=a3ePtKBfDEY', duration: '1:20:00' },
      { title: 'Projectile Motion', channel: 'Khan Academy India', url: 'https://www.youtube.com/watch?v=0xRlyixDKLU', duration: '18:30' },
    ],
  },

  // ═══════════ CHEMISTRY ═══════════
  'Atomic Structure': {
    title: 'Atomic Structure',
    subject: 'Chemistry',
    duration: 20,
    overview: 'Understanding the structure of atoms — electron configuration, quantum numbers, and models of the atom from Bohr to quantum mechanical.',
    keyPoints: [
      'Bohr model: electrons in fixed orbits with quantized energy',
      'Quantum numbers: n (principal), l (azimuthal), m (magnetic), s (spin)',
      'Aufbau principle, Pauli exclusion, and Hund\'s rule',
      'Electronic configuration determines chemical properties',
    ],
    explanation: `**Quantum Numbers:**\n- n (principal): 1, 2, 3... → shell/energy level\n- l (azimuthal): 0 to n-1 → subshell (s, p, d, f)\n- m (magnetic): -l to +l → orbital orientation\n- s (spin): +½ or -½ → electron spin\n\n**Rules for filling electrons:**\n1. **Aufbau**: Fill lowest energy first (1s → 2s → 2p → 3s → 3p → 4s → 3d...)\n2. **Pauli Exclusion**: No two electrons can have all 4 quantum numbers identical\n3. **Hund's Rule**: Electrons fill orbitals singly first (same spin), then pair up\n\n**Example:** Iron (Fe, Z=26)\n- Configuration: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶\n- Shorthand: [Ar] 4s² 3d⁶`,
    formula: 'Max electrons in shell n = 2n² | Max electrons in subshell = 2(2l + 1)',
    commonMistakes: [
      'Confusing 3d and 4s filling order — 4s fills before 3d but empties first',
      'Forgetting exceptions: Cr is [Ar]4s¹3d⁵ not [Ar]4s²3d⁴',
      'Cu is [Ar]4s¹3d¹⁰ — half-filled and fully-filled d-orbitals are extra stable',
    ],
    youtubeVideos: [
      { title: 'Atomic Structure - NEET', channel: 'Physics Wallah', url: 'https://www.youtube.com/watch?v=pM7V0S4MfeY', duration: '1:10:00' },
      { title: 'Quantum Numbers Explained', channel: 'Khan Academy India', url: 'https://www.youtube.com/watch?v=O-J0pvJJK98', duration: '15:30' },
      { title: 'Electronic Configuration', channel: 'Vedantu NEET', url: 'https://www.youtube.com/watch?v=M-E15yTcLao', duration: '35:00' },
    ],
  },
}

// Generate generic content for topics not in the database
export function getTopicContent(topic: string, subject: string): TopicContent {
  if (topicContent[topic]) {
    return topicContent[topic]
  }

  // Generate fallback content
  return {
    title: topic,
    subject,
    duration: 15,
    overview: `This module covers the fundamentals of ${topic} in ${subject}. Understanding this concept is essential for building a strong foundation and performing well in exams.`,
    keyPoints: [
      `Core concepts of ${topic}`,
      `Important formulas and definitions`,
      `Problem-solving techniques`,
      `Common exam patterns for this topic`,
    ],
    explanation: `**${topic}** is a key concept in ${subject} that you'll encounter frequently in exams.\n\nThis topic builds on your existing knowledge and connects to several other areas in the curriculum. Make sure to practice problems after reviewing the theory.\n\n**Study approach:**\n1. Read through the conceptual explanation carefully\n2. Note down key formulas and definitions\n3. Watch the recommended videos below\n4. Solve at least 10 practice problems\n5. Revisit weak areas before your exam`,
    commonMistakes: [
      'Rushing through theory without understanding the "why"',
      'Memorizing formulas without practicing application',
      'Skipping edge cases in problem solving',
    ],
    youtubeVideos: [
      { title: `${topic} — Complete Explanation`, channel: 'Neso Academy', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' ' + subject + ' tutorial')}`, duration: '15-20 min' },
      { title: `${topic} — Practice Problems`, channel: 'Apna College', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' ' + subject + ' problems solved')}`, duration: '20-30 min' },
      { title: `${topic} — Quick Revision`, channel: 'Unacademy', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' ' + subject + ' one shot')}`, duration: '10-15 min' },
    ],
  }
}
