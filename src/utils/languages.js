export const SUPPORTED_LANGUAGES = [
  {
    id: 'python',
    name: 'Python',
    wandboxCompiler: 'cpython-3.14.0',
    monacoLanguage: 'python',
    extension: 'py',
    boilerplate: `# Python 3 Template
def main():
    print("Hello, World!")
    
    # Read from Stdin example:
    # name = input("Enter your name: ")
    # print(f"Hello, {name}!")

if __name__ == "__main__":
    main()
`
  },
  {
    id: 'javascript',
    name: 'JavaScript (Node.js)',
    wandboxCompiler: 'nodejs-20.17.0',
    monacoLanguage: 'javascript',
    extension: 'js',
    boilerplate: `// JavaScript (Node.js) Template
console.log("Hello, World!");

// Read from Stdin example:
// const readline = require('readline');
// const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
// rl.question('', (name) => {
//     console.log(\`Hello, \${name}!\`);
//     rl.close();
// });
`
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    wandboxCompiler: 'typescript-5.6.2',
    monacoLanguage: 'typescript',
    extension: 'ts',
    boilerplate: `// TypeScript Template
const greeting: string = "Hello, World!";
console.log(greeting);

interface User {
  id: number;
  name: string;
}

const user: User = { id: 1, name: "Developer" };
console.log(\`Logged in as: \${user.name}\`);
`
  },
  {
    id: 'cpp',
    name: 'C++',
    wandboxCompiler: 'gcc-13.2.0',
    monacoLanguage: 'cpp',
    extension: 'cpp',
    boilerplate: `// C++ Template
#include <iostream>
#include <string>

int main() {
    std::cout << "Hello, World!" << std::endl;
    
    // Read from Stdin example:
    // std::string name;
    // std::cout << "Enter name: ";
    // std::cin >> name;
    // std::cout << "Hello, " << name << "!" << std::endl;
    
    return 0;
}
`
  },
  {
    id: 'c',
    name: 'C',
    wandboxCompiler: 'gcc-13.2.0-c',
    monacoLanguage: 'c',
    extension: 'c',
    boilerplate: `// C Template
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    // Read from Stdin example:
    // char name[50];
    // printf("Enter name: ");
    // scanf("%s", name);
    // printf("Hello, %s!\\n", name);
    
    return 0;
}
`
  },
  {
    id: 'java',
    name: 'Java',
    wandboxCompiler: 'openjdk-jdk-22+36',
    monacoLanguage: 'java',
    extension: 'java',
    boilerplate: `// Java Template
// Note: Class name must be Main
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Read from Stdin example:
        // Scanner scanner = new Scanner(System.in);
        // if (scanner.hasNextLine()) {
        //     String name = scanner.nextLine();
        //     System.out.println("Hello, " + name + "!");
        // }
        // scanner.close();
    }
}
`
  },
  {
    id: 'go',
    name: 'Go',
    wandboxCompiler: 'go-1.23.2',
    monacoLanguage: 'go',
    extension: 'go',
    boilerplate: `// Go Template
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    
    // Read from Stdin example:
    // var name string
    // fmt.Scanln(&name)
    // fmt.Printf("Hello, %s!\\n", name)
}
`
  },
  {
    id: 'rust',
    name: 'Rust',
    wandboxCompiler: 'rust-1.82.0',
    monacoLanguage: 'rust',
    extension: 'rs',
    boilerplate: `// Rust Template
use std::io;

fn main() {
    println!("Hello, World!");
    
    // Read from Stdin example:
    // let mut name = String::new();
    // io::stdin().read_line(&mut name).unwrap();
    // println!("Hello, {}!", name.trim());
}
`
  },
  {
    id: 'php',
    name: 'PHP',
    wandboxCompiler: 'php-8.3.12',
    monacoLanguage: 'php',
    extension: 'php',
    boilerplate: `<?php
// PHP Template
echo "Hello, World!\\n";

// Read from Stdin example:
// $name = fgets(STDIN);
// echo "Hello, " . trim($name) . "!\\n";
?>
`
  },
  {
    id: 'ruby',
    name: 'Ruby',
    wandboxCompiler: 'ruby-3.4.9',
    monacoLanguage: 'ruby',
    extension: 'rb',
    boilerplate: `# Ruby Template
puts "Hello, World!"

# Read from Stdin example:
# name = gets.chomp
# puts "Hello, #{name}!"
`
  },
  {
    id: 'swift',
    name: 'Swift',
    wandboxCompiler: 'swift-6.0.1',
    monacoLanguage: 'swift',
    extension: 'swift',
    boilerplate: `// Swift Template
print("Hello, World!")

// Read from Stdin example:
// if let name = readLine() {
//     print("Hello, \\(name)!")
// }
`
  },
  {
    id: 'bash',
    name: 'Bash',
    wandboxCompiler: 'bash',
    monacoLanguage: 'shell',
    extension: 'sh',
    boilerplate: `# Bash Template
echo "Hello, World!"

# Read from Stdin example:
# read name
# echo "Hello, $name!"
`
  }
];

export const getLanguageById = (id) => SUPPORTED_LANGUAGES.find(lang => lang.id === id);
