
import React from 'react';

export const MOCK_QUESTIONS = [
  {
    id: '1',
    text: 'What is the primary function of the CPU in a computer?',
    options: [
      { id: 'a', text: 'To store large amounts of data permanently' },
      { id: 'b', text: 'To perform calculations and execute instructions' },
      { id: 'c', text: 'To display graphics on the monitor' },
      { id: 'd', text: 'To connect the computer to the internet' }
    ],
    correctAnswerId: 'b'
  },
  {
    id: '2',
    text: 'Which programming language is primarily used for Android development?',
    options: [
      { id: 'a', text: 'Swift' },
      { id: 'b', text: 'Kotlin' },
      { id: 'c', text: 'C#' },
      { id: 'd', text: 'Ruby' }
    ],
    correctAnswerId: 'b'
  },
  {
    id: '3',
    text: 'What does "HTML" stand for?',
    options: [
      { id: 'a', text: 'Hyper Text Preprocessor' },
      { id: 'b', text: 'Hyper Text Markup Language' },
      { id: 'c', text: 'Hyper Text Multiple Language' },
      { id: 'd', text: 'Hyper Tool Multi Language' }
    ],
    correctAnswerId: 'b'
  },
  {
    id: '4',
    text: 'In cloud computing, what does "SaaS" mean?',
    options: [
      { id: 'a', text: 'Software as a Service' },
      { id: 'b', text: 'Storage as a System' },
      { id: 'c', text: 'System as a Service' },
      { id: 'd', text: 'Software and a System' }
    ],
    correctAnswerId: 'a'
  },
  {
    id: '5',
    text: 'Which data structure follows the LIFO (Last In First Out) principle?',
    options: [
      { id: 'a', text: 'Queue' },
      { id: 'b', text: 'Linked List' },
      { id: 'c', text: 'Stack' },
      { id: 'd', text: 'Tree' }
    ],
    correctAnswerId: 'c'
  }
];

export const Icons = {
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  ),
  Cloud: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c3.037 0 5.5-2.463 5.5-5.5 0-2.822-2.115-5.152-4.887-5.458C17.447 5.087 14.896 3 11.83 3c-3.15 0-5.78 2.15-6.577 5.097A4.99 4.99 0 0 0 1.5 13c0 2.761 2.239 5 5 5h11z"></path></svg>
  ),
  LogOut: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
  ),
  AlertTriangle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  )
};
