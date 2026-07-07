/**
 * Seed Script — Populates erp_lead_management with realistic sample data.
 *
 * Usage:  npm run seed
 * Safe to run multiple times (clears existing data first).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const Employee = require('../models/Employee');

// ─── Realistic data pools ──────────────────────────────────────────────────────

const EMPLOYEES = [
  { name: 'Aisha Patel', role: 'Senior Counselor' },
  { name: 'Rohan Mehta', role: 'Admissions Manager' },
  { name: 'Priya Sharma', role: 'Counselor' },
  { name: 'Vikram Singh', role: 'Team Lead' },
  { name: 'Nisha Thomas', role: 'Counselor' },
  { name: 'Arjun Desai', role: 'Senior Counselor' },
  { name: 'Kavya Nair', role: 'Counselor' },
  { name: 'Rajesh Gupta', role: 'Admissions Executive' },
  { name: 'Sneha Iyer', role: 'Counselor' },
  { name: 'Manish Joshi', role: 'Team Lead' },
];

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun',
  'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Ananya', 'Diya', 'Myra', 'Sara', 'Aadhya',
  'Isha', 'Kiara', 'Riya', 'Prisha', 'Anvi',
  'Kabir', 'Shaurya', 'Atharv', 'Advait', 'Dhruv',
  'Meera', 'Zara', 'Aanya', 'Navya', 'Pari',
  'Rohan', 'Aryan', 'Tanvi', 'Nisha', 'Pooja',
  'Rahul', 'Deepika', 'Shreya', 'Varun', 'Neha',
  'Karthik', 'Lakshmi', 'Harini', 'Pranav', 'Divya',
  'Suresh', 'Anjali', 'Bhavna', 'Gaurav', 'Simran',
];

const LAST_NAMES = [
  'Kumar', 'Sharma', 'Patel', 'Singh', 'Nair',
  'Reddy', 'Gupta', 'Joshi', 'Menon', 'Iyer',
  'Verma', 'Rao', 'Das', 'Bhat', 'Pillai',
  'Mishra', 'Chauhan', 'Saxena', 'Agarwal', 'Kapoor',
  'Malhotra', 'Banerjee', 'Mukherjee', 'Ghosh', 'Sen',
];

const ADDRESSES = [
  '12, MG Road, Koramangala, Bangalore, Karnataka',
  '45, Anna Nagar, Chennai, Tamil Nadu',
  '78, Bandra West, Mumbai, Maharashtra',
  '23, Sector 15, Gurugram, Haryana',
  '56, Jubilee Hills, Hyderabad, Telangana',
  '9, Salt Lake, Sector V, Kolkata, West Bengal',
  '34, Aundh, Pune, Maharashtra',
  '67, Civil Lines, Jaipur, Rajasthan',
  '11, Gomti Nagar, Lucknow, Uttar Pradesh',
  '89, Satellite Road, Ahmedabad, Gujarat',
  '22, Indiranagar, Bangalore, Karnataka',
  '55, T. Nagar, Chennai, Tamil Nadu',
  '33, Andheri East, Mumbai, Maharashtra',
  '44, DLF Phase 3, Gurugram, Haryana',
  '77, Madhapur, Hyderabad, Telangana',
  '16, Park Street, Kolkata, West Bengal',
  '28, Kothrud, Pune, Maharashtra',
  '91, Vaishali Nagar, Jaipur, Rajasthan',
  '63, Hazratganj, Lucknow, Uttar Pradesh',
  '15, CG Road, Ahmedabad, Gujarat',
  '48, Whitefield, Bangalore, Karnataka',
  '72, Adyar, Chennai, Tamil Nadu',
  '31, Powai, Mumbai, Maharashtra',
  '58, Noida Sector 62, Uttar Pradesh',
  '84, Gachibowli, Hyderabad, Telangana',
];

const COURSES = [
  'MBA – Finance',
  'MBA – Marketing',
  'MBA – HR',
  'B.Tech – Computer Science',
  'B.Tech – Electronics',
  'B.Tech – Mechanical',
  'BCA',
  'MCA',
  'B.Sc – Data Science',
  'M.Sc – Artificial Intelligence',
  'UI/UX Design',
  'Digital Marketing',
  'Full Stack Web Development',
  'Data Science & Analytics',
  'Cloud Computing & DevOps',
  'Diploma – Graphic Design',
  'PG Diploma – Business Analytics',
  'BBA',
];

const LEAD_SOURCES = ['Website', 'Referral', 'Walk-in', 'Social Media', 'Call Center'];
const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

const NOTE_TEMPLATES = [
  'Called on {day}, requested a callback next week.',
  'Sent fee structure via email.',
  'Not reachable, will retry tomorrow.',
  'Interested in scholarship options — shared brochure.',
  'Visited campus for a tour, seemed very interested.',
  'Enquired about hostel facilities and placement stats.',
  'Wants to discuss with parents before committing.',
  'Asked for EMI / installment payment options.',
  'Followed up — confirmed interest, waiting for documents.',
  'Requested detailed syllabus for the program.',
  'Compared with competitor institutes — needs convincing.',
  'Shared alumni testimonial videos via WhatsApp.',
  'Scheduled a call with the program coordinator.',
  'Lead went cold — no response in 2 weeks.',
  'Re-engaged after seeing social media ad.',
  'Submitted application form, pending fee payment.',
  'Completed enrollment — converted successfully!',
  'Referred by existing student — warm lead.',
  'Attending upcoming webinar on career guidance.',
  'Called to clarify exam eligibility criteria.',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const EMAIL_DOMAINS = ['gmail.com', 'yahoo.co.in', 'outlook.com', 'hotmail.com', 'rediffmail.com'];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickIndex(arr, index) {
  return arr[index % arr.length];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateInLastNDays(n) {
  const now = Date.now();
  const offset = Math.floor(Math.random() * n * 24 * 60 * 60 * 1000);
  return new Date(now - offset);
}

function randomDateAfter(date, maxDaysAfter = 14) {
  const offset = Math.floor(Math.random() * maxDaysAfter * 24 * 60 * 60 * 1000);
  const result = new Date(date.getTime() + offset);
  // Don't go past today
  return result > new Date() ? new Date() : result;
}

function generateMobile(usedMobiles) {
  let mobile;
  do {
    const prefix = pick(['6', '7', '8', '9']);
    const rest = String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    mobile = prefix + rest;
  } while (usedMobiles.has(mobile));
  usedMobiles.add(mobile);
  return mobile;
}

function generateEmail(firstName, lastName, usedEmails) {
  const fn = firstName.toLowerCase();
  const ln = lastName.toLowerCase();
  const domain = pick(EMAIL_DOMAINS);
  const variants = [
    `${fn}.${ln}@${domain}`,
    `${fn}${ln}@${domain}`,
    `${fn}_${ln}@${domain}`,
    `${fn}.${ln}${randomInt(1, 99)}@${domain}`,
    `${fn}${randomInt(10, 999)}@${domain}`,
  ];
  let email;
  do {
    email = pick(variants);
  } while (usedEmails.has(email));
  usedEmails.add(email);
  return email;
}

// ─── Main seed function ─────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Lead.deleteMany({});
    await Employee.deleteMany({});
    console.log('Cleared existing leads and employees.');

    // Insert employees
    const insertedEmployees = await Employee.insertMany(EMPLOYEES);
    const employeeNames = insertedEmployees.map((e) => e.name);
    console.log(`✅ ${insertedEmployees.length} employees inserted.`);

    // Generate leads
    const usedMobiles = new Set();
    const usedEmails = new Set();
    const leads = [];

    const LEAD_COUNT = 45;

    for (let i = 0; i < LEAD_COUNT; i++) {
      const firstName = pickIndex(FIRST_NAMES, i);
      const lastName = pick(LAST_NAMES);
      const name = `${firstName} ${lastName}`;
      const mobile = generateMobile(usedMobiles);
      const email = generateEmail(firstName, lastName, usedEmails);
      const address = pickIndex(ADDRESSES, i);
      const courseInterested = pickIndex(COURSES, i);
      const leadSource = pickIndex(LEAD_SOURCES, i);
      const status = pickIndex(STATUSES, i);
      const assignedEmployee = pickIndex(employeeNames, i);
      const createdDate = randomDateInLastNDays(60);

      // Generate 0–3 notes per lead
      const noteCount = randomInt(0, 3);
      const notes = [];
      for (let n = 0; n < noteCount; n++) {
        const template = pick(NOTE_TEMPLATES);
        const text = template.replace('{day}', pick(DAYS));
        notes.push({
          text,
          createdBy: pick(employeeNames),
          createdDate: randomDateAfter(createdDate, 14),
        });
      }

      leads.push({
        name,
        mobile,
        email,
        address,
        courseInterested,
        leadSource,
        status,
        assignedEmployee,
        createdDate,
        notes,
      });
    }

    const insertedLeads = await Lead.insertMany(leads);
    console.log(`✅ ${insertedLeads.length} leads inserted.`);

    console.log('\n── Seed Summary ──────────────────────────────');
    console.log(`   Employees: ${insertedEmployees.length}`);
    console.log(`   Leads:     ${insertedLeads.length}`);
    console.log('──────────────────────────────────────────────\n');

    await mongoose.connection.close();
    console.log('MongoDB connection closed. Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
