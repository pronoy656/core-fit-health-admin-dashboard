export type UserPlan = "free" | "premium" | "yearly" | "trial";
export type UserStatus = "active" | "inactive" | "suspended";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: UserStatus;
  plan: UserPlan;
  lastLogin: string;
  joinDate: string;
  appUsageDays: number;
  metabolicScore: number;
  totalSessions: number;
  labResultsCount: number;
  country: string;
  platform: "ios" | "android";
}

export const mockUsers: MockUser[] = [
  { id: "u001", name: "Atiq Rahman", email: "atiq@example.com", avatar: "AR", status: "active", plan: "yearly", lastLogin: "2026-07-12", joinDate: "2025-01-15", appUsageDays: 178, metabolicScore: 99, totalSessions: 312, labResultsCount: 4, country: "BD", platform: "ios" },
  { id: "u002", name: "Sarah Mitchell", email: "sarah.m@example.com", avatar: "SM", status: "active", plan: "premium", lastLogin: "2026-07-11", joinDate: "2025-03-22", appUsageDays: 112, metabolicScore: 87, totalSessions: 198, labResultsCount: 3, country: "US", platform: "ios" },
  { id: "u003", name: "James Cooper", email: "jcooper@example.com", avatar: "JC", status: "active", plan: "premium", lastLogin: "2026-07-10", joinDate: "2025-02-08", appUsageDays: 145, metabolicScore: 91, totalSessions: 267, labResultsCount: 5, country: "UK", platform: "android" },
  { id: "u004", name: "Priya Sharma", email: "priya.s@example.com", avatar: "PS", status: "active", plan: "free", lastLogin: "2026-07-12", joinDate: "2026-05-01", appUsageDays: 41, metabolicScore: 72, totalSessions: 52, labResultsCount: 1, country: "IN", platform: "android" },
  { id: "u005", name: "Lucas Ferreira", email: "lucas.f@example.com", avatar: "LF", status: "inactive", plan: "trial", lastLogin: "2026-06-28", joinDate: "2026-06-14", appUsageDays: 14, metabolicScore: 65, totalSessions: 18, labResultsCount: 0, country: "BR", platform: "ios" },
  { id: "u006", name: "Emily Chen", email: "emily.c@example.com", avatar: "EC", status: "active", plan: "yearly", lastLogin: "2026-07-12", joinDate: "2024-11-20", appUsageDays: 224, metabolicScore: 95, totalSessions: 401, labResultsCount: 7, country: "CA", platform: "ios" },
  { id: "u007", name: "Omar Khalid", email: "omar.k@example.com", avatar: "OK", status: "active", plan: "premium", lastLogin: "2026-07-09", joinDate: "2025-08-03", appUsageDays: 88, metabolicScore: 83, totalSessions: 143, labResultsCount: 2, country: "AE", platform: "android" },
  { id: "u008", name: "Nina Johansson", email: "nina.j@example.com", avatar: "NJ", status: "suspended", plan: "free", lastLogin: "2026-06-01", joinDate: "2026-03-15", appUsageDays: 22, metabolicScore: 59, totalSessions: 28, labResultsCount: 0, country: "SE", platform: "ios" },
  { id: "u009", name: "David Park", email: "david.p@example.com", avatar: "DP", status: "active", plan: "yearly", lastLogin: "2026-07-11", joinDate: "2025-05-12", appUsageDays: 156, metabolicScore: 88, totalSessions: 289, labResultsCount: 6, country: "KR", platform: "ios" },
  { id: "u010", name: "Amara Osei", email: "amara.o@example.com", avatar: "AO", status: "active", plan: "free", lastLogin: "2026-07-08", joinDate: "2026-04-20", appUsageDays: 55, metabolicScore: 76, totalSessions: 74, labResultsCount: 1, country: "GH", platform: "android" },
  { id: "u011", name: "Marco Rossi", email: "marco.r@example.com", avatar: "MR", status: "active", plan: "premium", lastLogin: "2026-07-12", joinDate: "2025-10-05", appUsageDays: 102, metabolicScore: 89, totalSessions: 176, labResultsCount: 3, country: "IT", platform: "android" },
  { id: "u012", name: "Fatima Al-Rashid", email: "fatima.ar@example.com", avatar: "FA", status: "active", plan: "yearly", lastLogin: "2026-07-10", joinDate: "2024-12-01", appUsageDays: 211, metabolicScore: 97, totalSessions: 388, labResultsCount: 8, country: "SA", platform: "ios" },
  { id: "u013", name: "Tom Bradley", email: "tom.b@example.com", avatar: "TB", status: "inactive", plan: "trial", lastLogin: "2026-07-01", joinDate: "2026-06-17", appUsageDays: 14, metabolicScore: 68, totalSessions: 21, labResultsCount: 0, country: "AU", platform: "ios" },
  { id: "u014", name: "Yuki Tanaka", email: "yuki.t@example.com", avatar: "YT", status: "active", plan: "premium", lastLogin: "2026-07-11", joinDate: "2025-07-19", appUsageDays: 128, metabolicScore: 93, totalSessions: 231, labResultsCount: 4, country: "JP", platform: "ios" },
  { id: "u015", name: "Zara Williams", email: "zara.w@example.com", avatar: "ZW", status: "active", plan: "free", lastLogin: "2026-07-07", joinDate: "2026-02-11", appUsageDays: 63, metabolicScore: 74, totalSessions: 89, labResultsCount: 2, country: "UK", platform: "android" },
  { id: "u016", name: "Carlos Mendez", email: "carlos.m@example.com", avatar: "CM", status: "active", plan: "yearly", lastLogin: "2026-07-12", joinDate: "2025-01-30", appUsageDays: 192, metabolicScore: 94, totalSessions: 345, labResultsCount: 6, country: "MX", platform: "android" },
  { id: "u017", name: "Aisha Diallo", email: "aisha.d@example.com", avatar: "AD", status: "active", plan: "premium", lastLogin: "2026-07-09", joinDate: "2025-11-08", appUsageDays: 79, metabolicScore: 81, totalSessions: 132, labResultsCount: 2, country: "SN", platform: "ios" },
  { id: "u018", name: "Peter Novak", email: "peter.n@example.com", avatar: "PN", status: "suspended", plan: "premium", lastLogin: "2026-05-15", joinDate: "2025-04-02", appUsageDays: 48, metabolicScore: 62, totalSessions: 67, labResultsCount: 1, country: "CZ", platform: "android" },
  { id: "u019", name: "Hannah Schmidt", email: "hannah.s@example.com", avatar: "HS", status: "active", plan: "yearly", lastLogin: "2026-07-12", joinDate: "2025-02-28", appUsageDays: 168, metabolicScore: 96, totalSessions: 312, labResultsCount: 7, country: "DE", platform: "ios" },
  { id: "u020", name: "Kevin O'Brien", email: "kevin.ob@example.com", avatar: "KO", status: "active", plan: "free", lastLogin: "2026-07-05", joinDate: "2026-01-14", appUsageDays: 73, metabolicScore: 78, totalSessions: 98, labResultsCount: 2, country: "IE", platform: "android" },
  { id: "u021", name: "Mei Lin", email: "mei.lin@example.com", avatar: "ML", status: "active", plan: "premium", lastLogin: "2026-07-11", joinDate: "2025-09-10", appUsageDays: 95, metabolicScore: 90, totalSessions: 167, labResultsCount: 3, country: "CN", platform: "ios" },
  { id: "u022", name: "Ryan Johnson", email: "ryan.j@example.com", avatar: "RJ", status: "inactive", plan: "free", lastLogin: "2026-06-20", joinDate: "2026-05-22", appUsageDays: 18, metabolicScore: 61, totalSessions: 23, labResultsCount: 0, country: "US", platform: "android" },
  { id: "u023", name: "Sofia Andersson", email: "sofia.a@example.com", avatar: "SA", status: "active", plan: "yearly", lastLogin: "2026-07-10", joinDate: "2024-10-14", appUsageDays: 238, metabolicScore: 98, totalSessions: 443, labResultsCount: 9, country: "SE", platform: "ios" },
  { id: "u024", name: "Ali Hassan", email: "ali.h@example.com", avatar: "AH", status: "active", plan: "premium", lastLogin: "2026-07-12", joinDate: "2025-06-25", appUsageDays: 112, metabolicScore: 86, totalSessions: 198, labResultsCount: 4, country: "PK", platform: "android" },
  { id: "u025", name: "Isabella Conti", email: "isabella.c@example.com", avatar: "IC", status: "active", plan: "trial", lastLogin: "2026-07-12", joinDate: "2026-06-29", appUsageDays: 13, metabolicScore: 70, totalSessions: 17, labResultsCount: 0, country: "IT", platform: "ios" },
  { id: "u026", name: "Darius Thompson", email: "darius.t@example.com", avatar: "DT", status: "active", plan: "premium", lastLogin: "2026-07-08", joinDate: "2025-12-01", appUsageDays: 68, metabolicScore: 84, totalSessions: 112, labResultsCount: 2, country: "US", platform: "android" },
  { id: "u027", name: "Ingrid Berg", email: "ingrid.b@example.com", avatar: "IB", status: "active", plan: "yearly", lastLogin: "2026-07-11", joinDate: "2025-03-08", appUsageDays: 151, metabolicScore: 92, totalSessions: 274, labResultsCount: 5, country: "NO", platform: "ios" },
  { id: "u028", name: "Gabriel Santos", email: "gabriel.s@example.com", avatar: "GS", status: "inactive", plan: "free", lastLogin: "2026-07-02", joinDate: "2026-04-10", appUsageDays: 34, metabolicScore: 67, totalSessions: 45, labResultsCount: 1, country: "BR", platform: "android" },
  { id: "u029", name: "Chloe Martin", email: "chloe.m@example.com", avatar: "CM", status: "active", plan: "premium", lastLogin: "2026-07-12", joinDate: "2025-08-18", appUsageDays: 107, metabolicScore: 88, totalSessions: 189, labResultsCount: 3, country: "FR", platform: "ios" },
  { id: "u030", name: "Ivan Petrov", email: "ivan.p@example.com", avatar: "IP", status: "active", plan: "yearly", lastLogin: "2026-07-09", joinDate: "2025-01-05", appUsageDays: 187, metabolicScore: 91, totalSessions: 332, labResultsCount: 6, country: "RU", platform: "android" },
];
