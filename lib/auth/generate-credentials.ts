/**
 * Generates secure, readable credentials for child student accounts
 */

export interface StudentCredentials {
  email: string
  password: string
  username: string
  displayName: string
}

/**
 * Generate a student email in format: firstname.lastname.uuid@gstat-student.local
 */
export function generateStudentEmail(firstName: string, lastName: string, studentId: string): string {
  const sanitized = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${studentId.substring(0, 8)}`
  return `${sanitized}@gstat-student.local`
}

/**
 * Generate a strong but memorable password for students
 * Format: AdjectiveNoun+Numbers (e.g., "BraveTiger1456")
 */
export function generateStudentPassword(): string {
  const adjectives = [
    'Brave', 'Happy', 'Smart', 'Quick', 'Strong', 'Bright', 'Clever', 'Swift',
    'Keen', 'Bold', 'Sharp', 'Wise', 'Steady', 'Active', 'Lively', 'Keen'
  ]
  
  const nouns = [
    'Tiger', 'Eagle', 'Wolf', 'Lion', 'Fox', 'Hawk', 'Dolphin', 'Panda',
    'Phoenix', 'Dragon', 'Shark', 'Cheetah', 'Bear', 'Owl', 'Otter', 'Raven'
  ]
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const numbers = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  
  return `${adjective}${noun}${numbers}`
}

/**
 * Generate complete credentials for a student
 */
export function generateStudentCredentials(
  firstName: string,
  lastName: string,
  studentId: string
): StudentCredentials {
  const email = generateStudentEmail(firstName, lastName, studentId)
  const password = generateStudentPassword()
  const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`
  const displayName = `${firstName} ${lastName}`
  
  return {
    email,
    password,
    username,
    displayName
  }
}

/**
 * Format credentials for display/printing
 */
export function formatCredentialsForDisplay(credentials: StudentCredentials): string {
  return `
STUDENT LOGIN CREDENTIALS
========================
Name: ${credentials.displayName}
Email/Username: ${credentials.email}
Password: ${credentials.password}

Login at: https://gstat.com/login
Select "Student" and enter the above credentials.

⚠️ Keep this information safe and don't share your password with others.
`
}
