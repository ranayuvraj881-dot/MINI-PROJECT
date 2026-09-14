import { AttendanceSummary, SubjectAttendance, TimetableSlot } from '../../types';

export const mockSubjectAttendanceList: SubjectAttendance[] = [
  {
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    facultyName: 'Dr. Sanjeev Kumar Sharma',
    totalClasses: 48,
    attendedClasses: 35,
    percentage: 73.0,
    status: 'At Risk',
    minRequired: 75,
    classesNeededToSafe: 2,
    classesCanAffordToMiss: 0,
    history: [
      { date: '2026-03-10', status: 'Present' },
      { date: '2026-03-09', status: 'Absent' },
      { date: '2026-03-06', status: 'Present' },
      { date: '2026-03-05', status: 'Absent' },
      { date: '2026-03-03', status: 'Present' }
    ]
  },
  {
    subjectCode: 'KCS-602',
    subjectName: 'Operating Systems',
    facultyName: 'Prof. Meenakshi Sundaram',
    totalClasses: 50,
    attendedClasses: 44,
    percentage: 88.0,
    status: 'Safe',
    minRequired: 75,
    classesNeededToSafe: 0,
    classesCanAffordToMiss: 8,
    history: [
      { date: '2026-03-10', status: 'Present' },
      { date: '2026-03-08', status: 'Present' },
      { date: '2026-03-05', status: 'Present' },
      { date: '2026-03-04', status: 'Present' },
      { date: '2026-03-02', status: 'Absent' }
    ]
  },
  {
    subjectCode: 'KCS-603',
    subjectName: 'Compiler Design',
    facultyName: 'Dr. Arvind Kumar Pandey',
    totalClasses: 44,
    attendedClasses: 34,
    percentage: 77.2,
    status: 'Safe',
    minRequired: 75,
    classesNeededToSafe: 0,
    classesCanAffordToMiss: 1,
    history: [
      { date: '2026-03-10', status: 'Present' },
      { date: '2026-03-09', status: 'Present' },
      { date: '2026-03-07', status: 'Absent' },
      { date: '2026-03-04', status: 'Present' },
      { date: '2026-03-01', status: 'Present' }
    ]
  },
  {
    subjectCode: 'KOE-064',
    subjectName: 'Machine Learning Techniques',
    facultyName: 'Dr. Priyanka Rastogi',
    totalClasses: 42,
    attendedClasses: 34,
    percentage: 81.0,
    status: 'Safe',
    minRequired: 75,
    classesNeededToSafe: 0,
    classesCanAffordToMiss: 3,
    history: [
      { date: '2026-03-11', status: 'Present' },
      { date: '2026-03-08', status: 'Present' },
      { date: '2026-03-06', status: 'Absent' },
      { date: '2026-03-03', status: 'Present' },
      { date: '2026-02-28', status: 'Present' }
    ]
  },
  {
    subjectCode: 'KIT-601',
    subjectName: 'Web Technology & Cloud Applications',
    facultyName: 'Prof. Ankit Verma',
    totalClasses: 40,
    attendedClasses: 34,
    percentage: 85.0,
    status: 'Safe',
    minRequired: 75,
    classesNeededToSafe: 0,
    classesCanAffordToMiss: 5,
    history: [
      { date: '2026-03-11', status: 'Present' },
      { date: '2026-03-09', status: 'Present' },
      { date: '2026-03-07', status: 'Present' },
      { date: '2026-03-04', status: 'Present' },
      { date: '2026-03-02', status: 'Present' }
    ]
  },
  {
    subjectCode: 'KCS-651',
    subjectName: 'Database Management Systems Lab',
    facultyName: 'Er. Rohitashwa Saxena',
    totalClasses: 14,
    attendedClasses: 13,
    percentage: 92.8,
    status: 'Safe',
    minRequired: 75,
    classesNeededToSafe: 0,
    classesCanAffordToMiss: 3,
    history: [
      { date: '2026-03-09', status: 'Present' },
      { date: '2026-03-02', status: 'Present' },
      { date: '2026-02-23', status: 'Present' },
      { date: '2026-02-16', status: 'Absent' }
    ]
  }
];

export const mockAttendanceSummary: AttendanceSummary = {
  overallPercentage: 78.4,
  totalClasses: 238,
  classesAttended: 187,
  classesMissed: 51,
  subjectsAtRiskCount: 1,
  targetRequirement: 75.0,
  insight: {
    subject: 'Database Management Systems (KCS-601)',
    currentPercentage: 73.0,
    classesNeeded: 2,
    message: 'Your DBMS attendance is below the 75% requirement. You need to attend the next 2 consecutive classes to reach the required safe percentage.'
  }
};

export const mockTodayTimetable: TimetableSlot[] = [
  {
    id: 'tt-01',
    day: 'Monday',
    time: '09:00 AM - 09:50 AM',
    startTime: '09:00',
    endTime: '09:50',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    facultyName: 'Dr. Sanjeev Kumar Sharma',
    room: 'AB-1, Room 304',
    type: 'Lecture',
    attendanceStatus: 'Present'
  },
  {
    id: 'tt-02',
    day: 'Monday',
    time: '09:55 AM - 10:45 AM',
    startTime: '09:55',
    endTime: '10:45',
    subjectCode: 'KCS-602',
    subjectName: 'Operating Systems',
    facultyName: 'Prof. Meenakshi Sundaram',
    room: 'AB-2, Room 108',
    type: 'Lecture',
    attendanceStatus: 'Present'
  },
  {
    id: 'tt-03',
    day: 'Monday',
    time: '11:00 AM - 11:50 AM',
    startTime: '11:00',
    endTime: '11:50',
    subjectCode: 'KCS-603',
    subjectName: 'Compiler Design',
    facultyName: 'Dr. Arvind Kumar Pandey',
    room: 'AB-1, Room 202',
    type: 'Lecture',
    attendanceStatus: 'Upcoming'
  },
  {
    id: 'tt-04',
    day: 'Monday',
    time: '11:55 AM - 12:45 PM',
    startTime: '11:55',
    endTime: '12:45',
    subjectCode: 'KOE-064',
    subjectName: 'Machine Learning Techniques',
    facultyName: 'Dr. Priyanka Rastogi',
    room: 'AB-3, Seminar Hall 2',
    type: 'Lecture',
    attendanceStatus: 'Upcoming'
  },
  {
    id: 'tt-05',
    day: 'Monday',
    time: '01:45 PM - 03:25 PM',
    startTime: '13:45',
    endTime: '15:25',
    subjectCode: 'KCS-651',
    subjectName: 'Database Management Systems Lab',
    facultyName: 'Er. Rohitashwa Saxena',
    room: 'Lab Complex 2, Lab 5',
    type: 'Lab',
    attendanceStatus: 'Upcoming'
  },
  {
    id: 'tt-06',
    day: 'Monday',
    time: '03:30 PM - 04:20 PM',
    startTime: '15:30',
    endTime: '16:20',
    subjectCode: 'KIT-601',
    subjectName: 'Web Technology Tutorial',
    facultyName: 'Prof. Ankit Verma',
    room: 'AB-1, Room 304',
    type: 'Tutorial',
    attendanceStatus: 'Upcoming'
  }
];

export const mockWeeklyTimetable: { [key: string]: TimetableSlot[] } = {
  Monday: mockTodayTimetable,
  Tuesday: [
    {
      id: 'tt-tue-1',
      day: 'Tuesday',
      time: '09:00 AM - 09:50 AM',
      startTime: '09:00',
      endTime: '09:50',
      subjectCode: 'KOE-064',
      subjectName: 'Machine Learning Techniques',
      facultyName: 'Dr. Priyanka Rastogi',
      room: 'AB-3, Seminar Hall 2',
      type: 'Lecture'
    },
    {
      id: 'tt-tue-2',
      day: 'Tuesday',
      time: '09:55 AM - 10:45 AM',
      startTime: '09:55',
      endTime: '10:45',
      subjectCode: 'KCS-601',
      subjectName: 'Database Management Systems',
      facultyName: 'Dr. Sanjeev Kumar Sharma',
      room: 'AB-1, Room 304',
      type: 'Lecture'
    },
    {
      id: 'tt-tue-3',
      day: 'Tuesday',
      time: '11:00 AM - 11:50 AM',
      startTime: '11:00',
      endTime: '11:50',
      subjectCode: 'KIT-601',
      subjectName: 'Web Technology & Cloud Applications',
      facultyName: 'Prof. Ankit Verma',
      room: 'Lab Complex 4, System Lab 12',
      type: 'Lecture'
    },
    {
      id: 'tt-tue-4',
      day: 'Tuesday',
      time: '01:45 PM - 03:25 PM',
      startTime: '13:45',
      endTime: '15:25',
      subjectCode: 'KCS-652',
      subjectName: 'Compiler Design Lab',
      facultyName: 'Dr. Arvind Kumar Pandey',
      room: 'Lab Complex 1, Lab 3',
      type: 'Lab'
    }
  ],
  Wednesday: [
    {
      id: 'tt-wed-1',
      day: 'Wednesday',
      time: '09:00 AM - 09:50 AM',
      startTime: '09:00',
      endTime: '09:50',
      subjectCode: 'KCS-602',
      subjectName: 'Operating Systems',
      facultyName: 'Prof. Meenakshi Sundaram',
      room: 'AB-2, Room 108',
      type: 'Lecture'
    },
    {
      id: 'tt-wed-2',
      day: 'Wednesday',
      time: '09:55 AM - 10:45 AM',
      startTime: '09:55',
      endTime: '10:45',
      subjectCode: 'KCS-603',
      subjectName: 'Compiler Design',
      facultyName: 'Dr. Arvind Kumar Pandey',
      room: 'AB-1, Room 202',
      type: 'Lecture'
    },
    {
      id: 'tt-wed-3',
      day: 'Wednesday',
      time: '11:00 AM - 11:50 AM',
      startTime: '11:00',
      endTime: '11:50',
      subjectCode: 'KCS-601',
      subjectName: 'Database Management Systems',
      facultyName: 'Dr. Sanjeev Kumar Sharma',
      room: 'AB-1, Room 304',
      type: 'Lecture'
    },
    {
      id: 'tt-wed-4',
      day: 'Wednesday',
      time: '01:45 PM - 02:35 PM',
      startTime: '13:45',
      endTime: '14:35',
      subjectCode: 'KOE-064',
      subjectName: 'Machine Learning Tutorial',
      facultyName: 'Dr. Priyanka Rastogi',
      room: 'AB-3, Seminar Hall 2',
      type: 'Tutorial'
    }
  ],
  Thursday: [
    {
      id: 'tt-thu-1',
      day: 'Thursday',
      time: '09:00 AM - 09:50 AM',
      startTime: '09:00',
      endTime: '09:50',
      subjectCode: 'KIT-601',
      subjectName: 'Web Technology & Cloud Applications',
      facultyName: 'Prof. Ankit Verma',
      room: 'Lab Complex 4, System Lab 12',
      type: 'Lecture'
    },
    {
      id: 'tt-thu-2',
      day: 'Thursday',
      time: '09:55 AM - 10:45 AM',
      startTime: '09:55',
      endTime: '10:45',
      subjectCode: 'KCS-602',
      subjectName: 'Operating Systems',
      facultyName: 'Prof. Meenakshi Sundaram',
      room: 'AB-2, Room 108',
      type: 'Lecture'
    },
    {
      id: 'tt-thu-3',
      day: 'Thursday',
      time: '11:00 AM - 12:40 PM',
      startTime: '11:00',
      endTime: '12:40',
      subjectCode: 'KIT-651',
      subjectName: 'Web Tech & Cloud Lab',
      facultyName: 'Prof. Ankit Verma',
      room: 'Lab Complex 4, System Lab 14',
      type: 'Lab'
    }
  ],
  Friday: [
    {
      id: 'tt-fri-1',
      day: 'Friday',
      time: '09:00 AM - 09:50 AM',
      startTime: '09:00',
      endTime: '09:50',
      subjectCode: 'KCS-603',
      subjectName: 'Compiler Design',
      facultyName: 'Dr. Arvind Kumar Pandey',
      room: 'AB-1, Room 202',
      type: 'Lecture'
    },
    {
      id: 'tt-fri-2',
      day: 'Friday',
      time: '09:55 AM - 10:45 AM',
      startTime: '09:55',
      endTime: '10:45',
      subjectCode: 'KOE-064',
      subjectName: 'Machine Learning Techniques',
      facultyName: 'Dr. Priyanka Rastogi',
      room: 'AB-3, Seminar Hall 2',
      type: 'Lecture'
    },
    {
      id: 'tt-fri-3',
      day: 'Friday',
      time: '11:00 AM - 11:50 AM',
      startTime: '11:00',
      endTime: '11:50',
      subjectCode: 'KCS-601',
      subjectName: 'DBMS Problem Solving Session',
      facultyName: 'Dr. Sanjeev Kumar Sharma',
      room: 'AB-1, Room 304',
      type: 'Tutorial'
    },
    {
      id: 'tt-fri-4',
      day: 'Friday',
      time: '02:00 PM - 04:00 PM',
      startTime: '14:00',
      endTime: '16:00',
      subjectCode: 'KCS-653',
      subjectName: 'Mini Project Lab / CampusOS Hack Session',
      facultyName: 'Dr. Sanjeev Kumar Sharma',
      room: 'Innovation Center Lab 2',
      type: 'Lab'
    }
  ],
  Saturday: [
    {
      id: 'tt-sat-1',
      day: 'Saturday',
      time: '10:00 AM - 12:00 PM',
      startTime: '10:00',
      endTime: '12:00',
      subjectCode: 'TRAIN-01',
      subjectName: 'Placement Aptitude & Coding Drill',
      facultyName: 'Career Development Cell (CDC GLBITM)',
      room: 'Auditorium 1',
      type: 'Tutorial'
    }
  ]
};
