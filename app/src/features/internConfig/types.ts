/** One row on the Intern Configuration page */
export interface InternConfig {
  id: string;
  email: string;
  /** Empty until the intern completes their profile */
  name: string;
  title: string;
  weeklyHours: number;
}
