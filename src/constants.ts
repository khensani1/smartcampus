/**
 * Mock data for the CSAS platform. 
 * In a real-world scenario, this would come from a database like Firestore.
 */
import { Course, Department } from './types';

export const COURSES: Course[] = [
  {
    id: 'dip-ict-appdev',
    name: 'Diploma in ICT in Applications Development',
    faculty: 'ICT',
    minAPS: 26,
    subjects: ['Mathematics/Technical Mathematics', 'English'],
    description: 'Specialized training in software development, mobile apps, and systems analysis.',
    careerPaths: ['Software Developer', 'Mobile App Developer', 'Systems Analyst']
  },
  {
    id: 'dip-ict-support',
    name: 'Diploma in ICT in Support Services',
    faculty: 'ICT',
    minAPS: 24,
    subjects: ['Mathematics/Technical Mathematics', 'English'],
    description: 'Focused on network support, infrastructure management, and technical troubleshooting.',
    careerPaths: ['Network Administrator', 'IT Support Specialist', 'Systems Administrator']
  },
  {
    id: 'ba-public-admin',
    name: 'Bachelors in Public Administration',
    faculty: 'Humanities',
    minAPS: 22,
    subjects: ['English'],
    description: 'Prepares students for management roles in the public sector and government institutions.',
    careerPaths: ['Public Sector Manager', 'Policy Analyst', 'Municipal Administrator']
  },
  {
    id: 'dip-journalism',
    name: 'Diploma in Journalism',
    faculty: 'Humanities',
    minAPS: 25,
    subjects: ['English'],
    description: 'Training in news writing, broadcasting, and mass communication.',
    careerPaths: ['Journalist', 'News Editor', 'Media Consultant']
  }
];

export const DEPARTMENTS: Department[] = [
  {
    id: 'dept-ict',
    name: 'Faculty of Information & Communication Technology',
    faculty: 'ICT',
    contactEmail: 'ict-info@tut.ac.za',
    contactPhone: '+27 12 382 9000',
    building: 'Building 10 (ICT Building)',
    location: { lat: -25.5413, lng: 28.0863 }
  },
  {
    id: 'dept-humanities',
    name: 'Faculty of Humanities',
    faculty: 'Humanities',
    contactEmail: 'humanities@tut.ac.za',
    contactPhone: '+27 12 382 9100',
    building: 'Building L (Humanities Building)',
    location: { lat: -25.5420, lng: 28.0870 }
  },
  {
    id: 'admin-registrar',
    name: 'Registrar & Student Admin',
    faculty: 'Administration',
    contactEmail: 'admissionsosh@tut.ac.za',
    contactPhone: '+27 12 382 9200',
    building: 'Building 21 (Admin Block)',
    location: { lat: -25.5408, lng: 28.0855 }
  },
  {
    id: 'campus-library',
    name: 'Soshanguve South Campus Library',
    faculty: 'Support',
    contactEmail: 'librarysosh@tut.ac.za',
    contactPhone: '+27 12 382 9300',
    building: 'Building 21 (Library Wing)',
    location: { lat: -25.5405, lng: 28.0850 }
  }
];
