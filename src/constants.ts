/**
 * Mock data for the CSAS platform. 
 * In a real-world scenario, this would come from a database like Firestore.
 */
import { Course, Department } from './types';

export const COURSES: Course[] = [
  {
    id: 'bsc-cs',
    name: 'BSc Computer Science',
    faculty: 'Science',
    minAPS: 32,
    subjects: ['Mathematics', 'Physical Science'],
    description: 'A comprehensive study of computing principles, software development, and algorithm design.',
    careerPaths: ['Software Engineer', 'Data Scientist', 'Systems Architect']
  },
  {
    id: 'beng-civil',
    name: 'BEng Civil Engineering',
    faculty: 'Engineering & Built Environment',
    minAPS: 36,
    subjects: ['Mathematics', 'Physical Science'],
    description: 'Designing and maintaining infrastructures like roads, bridges, and water systems.',
    careerPaths: ['Civil Engineer', 'Structural Designer', 'Project Manager']
  },
  {
    id: 'bcom-acc',
    name: 'BCom Accounting',
    faculty: 'Commerce',
    minAPS: 30,
    subjects: ['Mathematics'],
    description: 'Professional training in accounting, auditing, and financial management.',
    careerPaths: ['Chartered Accountant', 'Financial Analyst', 'Auditor']
  },
  {
    id: 'ba-law',
    name: 'BA Law',
    faculty: 'Humanities',
    minAPS: 28,
    subjects: ['English'],
    description: 'Understanding legal systems, justice, and human rights.',
    careerPaths: ['Legal Advisor', 'Advocate', 'Politician']
  }
];

export const DEPARTMENTS: Department[] = [
  {
    id: 'dept-cs',
    name: 'Department of Computer Science',
    faculty: 'Science',
    contactEmail: 'cs-dept@university.ac.za',
    contactPhone: '+27 11 717 1000',
    building: 'Mathematical Sciences Building',
    location: { lat: -26.1906, lng: 28.0264 }
  },
  {
    id: 'dept-eng',
    name: 'School of Engineering',
    faculty: 'Engineering',
    contactEmail: 'eng-info@university.ac.za',
    contactPhone: '+27 11 717 2000',
    building: 'Chamber of Mines Building',
    location: { lat: -26.1920, lng: 28.0300 }
  },
  {
    id: 'admin-enrol',
    name: 'Student Enrolment Centre',
    faculty: 'Administration',
    contactEmail: 'admission@university.ac.za',
    contactPhone: '+27 11 717 3000',
    building: 'Solomon Mahlangu House',
    location: { lat: -26.1910, lng: 28.0280 }
  }
];
