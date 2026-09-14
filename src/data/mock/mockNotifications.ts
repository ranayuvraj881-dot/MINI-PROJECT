import { AppNotification } from '../../types';

export const mockNotificationsList: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'DBMS assignment due tomorrow',
    message: 'B+ Tree Indexing & 3NF/BCNF Decomposition assignment is due on March 15 at 11:59 PM. Complete and upload your report.',
    category: 'Assignments',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/assignments',
    actionLabel: 'View Assignment'
  },
  {
    id: 'notif-2',
    title: 'Attendance Alert: DBMS below 75%',
    message: 'Your attendance in Database Management Systems has fallen to 73.0%. You need to attend the next 2 classes to restore compliance.',
    category: 'Attendance',
    timestamp: '5 hours ago',
    read: false,
    actionUrl: '/attendance',
    actionLabel: 'Check Attendance'
  },
  {
    id: 'notif-3',
    title: 'Machine Learning Mid-Sem in 5 days',
    message: 'AKTU Sessional II examination for KOE-064 is scheduled for March 18, 10:00 AM at Seminar Hall 2.',
    category: 'Academic',
    timestamp: '1 day ago',
    read: false,
    actionUrl: '/exams',
    actionLabel: 'View Exam Schedule'
  },
  {
    id: 'notif-4',
    title: 'New PYQs uploaded for Operating Systems',
    message: 'Department of CSE uploaded 2024 End-Sem solved PYQs for Unit 3 (Deadlocks & Memory Management).',
    category: 'Important',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/pyqs',
    actionLabel: 'Explore PYQs'
  },
  {
    id: 'notif-5',
    title: 'Campus Placement Pre-Assessment Registration',
    message: 'Training and Placement Cell has opened mock technical assessment rounds for 2026 batch on Saturday.',
    category: 'General',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/timetable',
    actionLabel: 'View Saturday Slot'
  },
  {
    id: 'notif-6',
    title: 'Notes added: Compiler Design Unit 3 SDT',
    message: 'Dr. Arvind Kumar Pandey uploaded revised handout with 12 solved desk-calculator SDD problems.',
    category: 'Academic',
    timestamp: '3 days ago',
    read: true,
    actionUrl: '/notes',
    actionLabel: 'Open Notes'
  }
];
