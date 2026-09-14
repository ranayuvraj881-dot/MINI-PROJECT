import { TimetableDaySchedule, TimetableSlot } from '../../types';

export const mockWeeklyTimetable: TimetableDaySchedule[] = [
  {
    day: 'Monday',
    slots: [
      {
        id: 'mon-1',
        day: 'Monday',
        time: '09:00 AM – 09:55 AM',
        startTime: '09:00',
        endTime: '09:55',
        subjectCode: 'KCS-601',
        subjectName: 'Database Management Systems',
        facultyName: 'Dr. Sanjeev Kumar Sharma',
        room: 'AB-1, Room 304',
        type: 'Lecture',
        attendanceStatus: 'Present'
      },
      {
        id: 'mon-2',
        day: 'Monday',
        time: '10:00 AM – 10:55 AM',
        startTime: '10:00',
        endTime: '10:55',
        subjectCode: 'KCS-602',
        subjectName: 'Operating Systems',
        facultyName: 'Prof. Meenakshi Sundaram',
        room: 'AB-2, Room 108',
        type: 'Lecture',
        attendanceStatus: 'Present'
      },
      {
        id: 'mon-3',
        day: 'Monday',
        time: '11:15 AM – 12:10 PM',
        startTime: '11:15',
        endTime: '12:10',
        subjectCode: 'KCS-603',
        subjectName: 'Compiler Design',
        facultyName: 'Dr. Arvind Kumar Pandey',
        room: 'AB-1, Room 202',
        type: 'Lecture',
        attendanceStatus: 'Upcoming'
      },
      {
        id: 'mon-4',
        day: 'Monday',
        time: '01:30 PM – 03:20 PM',
        startTime: '13:30',
        endTime: '15:20',
        subjectCode: 'KCS-651',
        subjectName: 'Database Management Systems Lab',
        facultyName: 'Er. Rohitashwa Saxena',
        room: 'Lab Complex 2, Lab 5',
        type: 'Lab',
        attendanceStatus: 'Upcoming'
      }
    ]
  },
  {
    day: 'Tuesday',
    slots: [
      {
        id: 'tue-1',
        day: 'Tuesday',
        time: '09:00 AM – 09:55 AM',
        startTime: '09:00',
        endTime: '09:55',
        subjectCode: 'KOE-064',
        subjectName: 'Machine Learning Techniques',
        facultyName: 'Dr. Priyanka Rastogi',
        room: 'AB-3, Seminar Hall 2',
        type: 'Lecture',
        attendanceStatus: 'Upcoming'
      },
      {
        id: 'tue-2',
        day: 'Tuesday',
        time: '10:00 AM – 10:55 AM',
        startTime: '10:00',
        endTime: '10:55',
        subjectCode: 'KIT-601',
        subjectName: 'Web Technology & Cloud Applications',
        facultyName: 'Prof. Ankit Verma',
        room: 'Lab Complex 4, System Lab 12',
        type: 'Lecture',
        attendanceStatus: 'Upcoming'
      },
      {
        id: 'tue-3',
        day: 'Tuesday',
        time: '11:15 AM – 12:10 PM',
        startTime: '11:15',
        endTime: '12:10',
        subjectCode: 'KCS-601',
        subjectName: 'Database Management Systems',
        facultyName: 'Dr. Sanjeev Kumar Sharma',
        room: 'AB-1, Room 304',
        type: 'Tutorial',
        attendanceStatus: 'Upcoming'
      }
    ]
  },
  {
    day: 'Wednesday',
    slots: [
      {
        id: 'wed-1',
        day: 'Wednesday',
        time: '09:00 AM – 09:55 AM',
        startTime: '09:00',
        endTime: '09:55',
        subjectCode: 'KCS-602',
        subjectName: 'Operating Systems',
        facultyName: 'Prof. Meenakshi Sundaram',
        room: 'AB-2, Room 108',
        type: 'Lecture',
        attendanceStatus: 'Upcoming'
      },
      {
        id: 'wed-2',
        day: 'Wednesday',
        time: '10:00 AM – 10:55 AM',
        startTime: '10:00',
        endTime: '10:55',
        subjectCode: 'KCS-603',
        subjectName: 'Compiler Design',
        facultyName: 'Dr. Arvind Kumar Pandey',
        room: 'AB-1, Room 202',
        type: 'Lecture',
        attendanceStatus: 'Upcoming'
      },
      {
        id: 'wed-3',
        day: 'Wednesday',
        time: '01:30 PM – 03:20 PM',
        startTime: '13:30',
        endTime: '15:20',
        subjectCode: 'KIT-651',
        subjectName: 'Web Technology Lab',
        facultyName: 'Prof. Ankit Verma',
        room: 'Lab Complex 4, Lab 12',
        type: 'Lab',
        attendanceStatus: 'Upcoming'
      }
    ]
  },
  {
    day: 'Thursday',
    slots: [
      {
        id: 'thu-1',
        day: 'Thursday',
        time: '09:00 AM – 09:55 AM',
        startTime: '09:00',
        endTime: '09:55',
        subjectCode: 'KOE-064',
        subjectName: 'Machine Learning Techniques',
        facultyName: 'Dr. Priyanka Rastogi',
        room: 'AB-3, Seminar Hall 2',
        type: 'Lecture',
        attendanceStatus: 'Upcoming'
      },
      {
        id: 'thu-2',
        day: 'Thursday',
        time: '10:00 AM – 10:55 AM',
        startTime: '10:00',
        endTime: '10:55',
        subjectCode: 'KCS-601',
        subjectName: 'Database Management Systems',
        facultyName: 'Dr. Sanjeev Kumar Sharma',
        room: 'AB-1, Room 304',
        type: 'Lecture',
        attendanceStatus: 'Upcoming'
      },
      {
        id: 'thu-3',
        day: 'Thursday',
        time: '11:15 AM – 12:10 PM',
        startTime: '11:15',
        endTime: '12:10',
        subjectCode: 'KCS-602',
        subjectName: 'Operating Systems',
        facultyName: 'Prof. Meenakshi Sundaram',
        room: 'AB-2, Room 108',
        type: 'Tutorial',
        attendanceStatus: 'Upcoming'
      }
    ]
  },
  {
    day: 'Friday',
    slots: [
      {
        id: 'fri-1',
        day: 'Friday',
        time: '09:00 AM – 09:55 AM',
        startTime: '09:00',
        endTime: '09:55',
        subjectCode: 'KCS-603',
        subjectName: 'Compiler Design',
        facultyName: 'Dr. Arvind Kumar Pandey',
        room: 'AB-1, Room 202',
        type: 'Lecture',
        attendanceStatus: 'Upcoming'
      },
      {
        id: 'fri-2',
        day: 'Friday',
        time: '10:00 AM – 10:55 AM',
        startTime: '10:00',
        endTime: '10:55',
        subjectCode: 'KIT-601',
        subjectName: 'Web Technology & Cloud Applications',
        facultyName: 'Prof. Ankit Verma',
        room: 'Lab Complex 4, System Lab 12',
        type: 'Lecture',
        attendanceStatus: 'Upcoming'
      },
      {
        id: 'fri-3',
        day: 'Friday',
        time: '02:00 PM – 04:00 PM',
        startTime: '14:00',
        endTime: '16:00',
        subjectCode: 'KCS-652',
        subjectName: 'Compiler Design Lab',
        facultyName: 'Dr. Arvind Kumar Pandey',
        room: 'Lab Complex 1, Lab 3',
        type: 'Lab',
        attendanceStatus: 'Upcoming'
      }
    ]
  }
];
