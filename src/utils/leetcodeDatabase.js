export const LEETCODE_QUESTIONS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    solutions: {
      python: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: 'Uses a hash map (dictionary) to store each number and its index. For each number, check if its complement (target - num) exists in the map. This achieves a single-pass linear time lookup.',
        code: `def twoSum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`
      },
      javascript: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: 'Uses a JavaScript Map to store elements and their corresponding indices. As we iterate through the array, we check if the complement (target - num) exists in the map.',
        code: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`
      },
      java: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: 'Uses a HashMap to track the values and their indices. For each element in the array, check if target - nums[i] is already present in the HashMap.',
        code: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`
      },
      cpp: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: 'Uses std::unordered_map to achieve average O(1) lookups for the complement of each element.',
        code: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> numMap;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (numMap.find(complement) != numMap.end()) {
                return {numMap[complement], i};
            }
            numMap[nums[i]] = i;
        }
        return {};
    }
};`
      },
      go: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: 'Uses a map in Go to store numbers and their indices, allowing complement lookups in O(1) time.',
        code: `func twoSum(nums []int, target int) []int {
    m := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if idx, found := m[complement]; found {
            return []int{idx, i}
        }
        m[num] = i
    }
    return nil
}`
      },
      rust: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: 'Uses std::collections::HashMap to record numbers and check for their complements in single-pass linear time.',
        code: `use std::collections::HashMap;

pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let mut map = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;
        if let Some(&prev_idx) = map.get(&complement) {
            return vec![prev_idx as i32, i as i32];
        }
        map.insert(num, i);
    }
    vec![]
}`
      }
    }
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    solutions: {
      python: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        explanation: 'Reverses the list iteratively in-place by maintaining pointers to the previous, current, and next nodes, updating current.next to point to prev at each step.',
        code: `def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`
      },
      javascript: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        explanation: 'Iterates through the linked list, updating the next pointer of each node to point to its predecessor node.',
        code: `function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr !== null) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`
      },
      java: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        explanation: 'Maintains references to the prev and next nodes, traversing the list and changing curr.next to point to the prev node.',
        code: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}`
      },
      cpp: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        explanation: 'Iteratively shifts pointers: points curr->next to prev node, then advances prev and curr forward.',
        code: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr != nullptr) {
            ListNode* nextTemp = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
};`
      },
      go: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        explanation: 'Iterates through the linked list, changing the Next pointer of each node to prev to reverse list in-place.',
        code: `func reverseList(head *ListNode) *ListNode {
    var prev *ListNode
    curr := head
    for curr != nil {
        nextTemp := curr.Next
        curr.Next = prev
        prev = curr
        curr = nextTemp
    }
    return prev
}`
      },
      rust: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        explanation: 'Takes the next node and mutates node.next to point to prev node, traversing iteratively.',
        code: `pub fn reverse_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    let mut prev = None;
    let mut curr = head;
    while let Some(mut node) = curr {
        let next = node.next.take();
        node.next = prev;
        prev = Some(node);
        curr = next;
    }
    prev
}`
      }
    }
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: 'Given a string s containing just the characters \'( \', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    solutions: {
      python: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: 'Uses a stack to keep track of opening brackets. When a closing bracket is encountered, verify if it matches the stack\'s top element.',
        code: `def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack`
      },
      javascript: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: 'Pushes opening brackets onto a stack. When a closing bracket appears, checks if it corresponds to the popped element from the stack.',
        code: `function isValid(s) {
    const stack = [];
    const map = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    for (let char of s) {
        if (map[char]) {
            const top = stack.length > 0 ? stack.pop() : '#';
            if (map[char] !== top) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}`
      },
      java: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: 'Iterates through the string pushing opening delimiters to a Stack. Pop and check on matching closing characters.',
        code: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }
}`
      },
      cpp: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: 'Uses std::stack to push opening characters and validate correctness upon receiving matching closing characters.',
        code: `#include <string>
#include <stack>

class Solution {
public:
    bool isValid(std::string s) {
        std::stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') {
                st.push(c);
            } else {
                if (st.empty()) return false;
                if (c == ')' && st.top() != '(') return false;
                if (c == '}' && st.top() != '{') return false;
                if (c == ']' && st.top() != '[') return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`
      },
      go: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: 'Uses a slice of runes as a stack, matching opening and closing braces with a map lookup.',
        code: `func isValid(s string) bool {
    stack := []rune{}
    mapping := map[rune]rune{')': '(', '}': '{', ']': '['}
    for _, char := range s {
        if open, ok := mapping[char]; ok {
            if len(stack) == 0 || stack[len(stack)-1] != open {
                return false
            }
            stack = stack[:len(stack)-1]
        } else {
            stack = append(stack, char)
        }
    }
    return len(stack) == 0
}`
      },
      rust: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        explanation: 'Pushes opening symbols to a vector stack and checks matching pairs on pops for valid bracket matching.',
        code: `pub fn is_valid(s: String) -> bool {
    let mut stack = Vec::new();
    for c in s.chars() {
        match c {
            '(' | '{' | '[' => stack.push(c),
            ')' => if stack.pop() != Some('(') { return false; },
            '}' => if stack.pop() != Some('{') { return false; },
            ']' => if stack.pop() != Some('[') { return false; },
            _ => {}
        }
    }
    stack.is_empty()
}`
      }
    }
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
    solutions: {
      python: {
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        explanation: 'Applies binary search by maintaining low and high bounds, computing mid-point at each step, and narrowing the search space by half.',
        code: `def search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`
      },
      javascript: {
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        explanation: 'Performs a binary search on a sorted array using two pointers (left and right) representing bounds.',
        code: `function search(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`
      },
      java: {
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        explanation: 'Finds elements in a sorted array by dividing search interval in half recursively/iteratively.',
        code: `class Solution {
    public int search(int[] nums, int target) {
        int pivot, left = 0, right = nums.length - 1;
        while (left <= right) {
            pivot = left + (right - left) / 2;
            if (nums[pivot] == target) return pivot;
            if (target < nums[pivot]) right = pivot - 1;
            else left = pivot + 1;
        }
        return -1;
    }
}`
      },
      cpp: {
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        explanation: 'Maintains left and right indices. Modifies bounds based on mid element comparison.',
        code: `#include <vector>

class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
};`
      },
      go: {
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        explanation: 'Maintains low and high boundaries and halves the search space in each step.',
        code: `func search(nums []int, target int) int {
    left, right := 0, len(nums)-1
    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target {
            return mid
        } else if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}`
      },
      rust: {
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        explanation: 'Uses iterative range slicing using integer arithmetic, preventing potential overflow.',
        code: `pub fn search(nums: Vec<i32>, target: i32) -> i32 {
    let mut left = 0;
    let mut right = nums.len() as i32 - 1;
    while left <= right {
        let mid = left + (right - left) / 2;
        if nums[mid as usize] == target {
            return mid;
        } else if nums[mid as usize] < target {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    -1
}`
      }
    }
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    description: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    solutions: {
      python: {
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        explanation: 'Sorts intervals by start times, then iterates and merges overlapping intervals into a results array by updating end times.',
        code: `def merge(intervals):
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current in intervals[1:]:
        prev = merged[-1]
        if current[0] <= prev[1]:
            prev[1] = max(prev[1], current[1])
        else:
            merged.append(current)
    return merged`
      },
      javascript: {
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        explanation: 'Sorts intervals by their starting boundary. Merges intervals sequentially by evaluating if current start <= previous end.',
        code: `function merge(intervals) {
    if (intervals.length === 0) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const last = merged[merged.length - 1];
        const current = intervals[i];
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.push(current);
        }
    }
    return merged;
}`
      },
      java: {
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        explanation: 'Sorts the intervals array. Utilizes a LinkedList to easily append or merge the last item in place.',
        code: `import java.util.Arrays;
import java.util.LinkedList;

class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        LinkedList<int[]> merged = new LinkedList<>();
        for (int[] interval : intervals) {
            if (merged.isEmpty() || merged.getLast()[1] < interval[0]) {
                merged.add(interval);
            } else {
                merged.getLast()[1] = Math.max(merged.getLast()[1], interval[1]);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}`
      },
      cpp: {
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        explanation: 'Sorts the intervals. If the current interval overlaps with the last element in merged list, merge them; else push to back.',
        code: `#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {
        if (intervals.empty()) return {};
        std::sort(intervals.begin(), intervals.end(), [](const std::vector<int>& a, const std::vector<int>& b) {
            return a[0] < b[0];
        });
        std::vector<std::vector<int>> merged;
        merged.push_back(intervals[0]);
        for (int i = 1; i < intervals.size(); ++i) {
            if (intervals[i][0] <= merged.back()[1]) {
                merged.back()[1] = std::max(merged.back()[1], intervals[i][1]);
            } else {
                merged.push_back(intervals[i]);
            }
        }
        return merged;
    }
};`
      },
      go: {
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        explanation: 'Sorts the intervals by start time and iterates through them to merge overlapping elements.',
        code: `import "sort"

func merge(intervals [][]int) [][]int {
    if len(intervals) <= 1 {
        return intervals
    }
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })
    merged := [][]int{intervals[0]}
    for _, current := range intervals[1:] {
        last := &merged[len(merged)-1]
        if current[0] <= (*last)[1] {
            if current[1] > (*last)[1] {
                (*last)[1] = current[1]
            }
        } else {
            merged = append(merged, current)
        }
    }
    return merged
}`
      },
      rust: {
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        explanation: 'Sorts intervals by their start index and applies a greedy merge loop to resolve overlaps.',
        code: `pub fn merge(mut intervals: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
    if intervals.is_empty() {
        return vec![];
    }
    intervals.sort_unstable_by_key(|val| val[0]);
    let mut merged = vec![intervals[0].clone()];
    for current in intervals.into_iter().skip(1) {
        let last = merged.last_mut().unwrap();
        if current[0] <= last[1] {
            last[1] = last[1].max(current[1]);
        } else {
            merged.push(current);
        }
    }
    merged
}`
      }
    }
  }
];

export const getQuestionById = (id) => LEETCODE_QUESTIONS.find(q => q.id === id);
