import type { Agency } from "./agencies.js";
import { localAgents } from "./localAgents.js";

// ── Sample data pools ────────────────────────────────────────
const firstNames = [
  "James",
  "Maria",
  "Robert",
  "Linda",
  "Michael",
  "Patricia",
  "David",
  "Jennifer",
  "William",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
  "Christopher",
  "Lisa",
  "Daniel",
  "Nancy",
  "Matthew",
  "Betty",
  "Anthony",
  "Margaret",
  "Mark",
  "Sandra",
  "Donald",
  "Ashley",
  "Steven",
  "Dorothy",
  "Paul",
  "Kimberly",
  "Andrew",
  "Emily",
  "Kenneth",
  "Donna",
  "Joshua",
  "Michelle",
  "Kevin",
  "Carol",
  "Brian",
  "Amanda",
  "George",
  "Melissa",
  "Edward",
  "Deborah",
  "Ronald",
  "Stephanie",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Taylor",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Perez",
  "Hall",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Mitchell",
  "Carter",
  "Roberts",
  "Turner",
  "Phillips",
  "Campbell",
  "Parker",
  "Evans",
  "Collins",
  "Edwards",
];

const streets = [
  "Oak",
  "Main",
  "Maple",
  "Cedar",
  "Pine",
  "Elm",
  "Washington",
  "Lake",
  "Hill",
  "Park",
  "Sunset",
  "Willow",
  "River",
  "Highland",
  "Meadow",
  "Forest",
  "Valley",
  "Ridge",
  "Spring",
  "Church",
];
const streetTypes = [
  "St",
  "Ave",
  "Blvd",
  "Dr",
  "Ln",
  "Rd",
  "Way",
  "Ct",
  "Pl",
  "Cir",
];

const cities: Record<string, string[]> = {
  CA: [
    "Los Angeles",
    "San Diego",
    "San Jose",
    "Sacramento",
    "Fresno",
    "Long Beach",
    "Oakland",
    "Bakersfield",
    "Anaheim",
    "Riverside",
  ],
  TX: [
    "Houston",
    "San Antonio",
    "Dallas",
    "Austin",
    "Fort Worth",
    "El Paso",
    "Arlington",
    "Corpus Christi",
    "Plano",
    "Lubbock",
  ],
  FL: [
    "Jacksonville",
    "Miami",
    "Tampa",
    "Orlando",
    "St. Petersburg",
    "Hialeah",
    "Tallahassee",
    "Fort Lauderdale",
    "Port St. Lucie",
    "Pensacola",
  ],
  NY: [
    "New York",
    "Buffalo",
    "Rochester",
    "Yonkers",
    "Syracuse",
    "Albany",
    "New Rochelle",
    "Mount Vernon",
    "Schenectady",
    "Utica",
  ],
  IL: [
    "Chicago",
    "Aurora",
    "Naperville",
    "Joliet",
    "Rockford",
    "Springfield",
    "Elgin",
    "Peoria",
    "Champaign",
    "Waukegan",
  ],
  OH: [
    "Columbus",
    "Cleveland",
    "Cincinnati",
    "Toledo",
    "Akron",
    "Dayton",
    "Parma",
    "Canton",
    "Youngstown",
    "Lorain",
  ],
  PA: [
    "Philadelphia",
    "Pittsburgh",
    "Allentown",
    "Erie",
    "Reading",
    "Scranton",
    "Bethlehem",
    "Lancaster",
    "Harrisburg",
    "Altoona",
  ],
  AZ: [
    "Phoenix",
    "Tucson",
    "Mesa",
    "Chandler",
    "Glendale",
    "Scottsdale",
    "Gilbert",
    "Tempe",
    "Peoria",
    "Surprise",
  ],
  GA: [
    "Atlanta",
    "Augusta",
    "Columbus",
    "Savannah",
    "Athens",
    "Sandy Springs",
    "Macon",
    "Roswell",
    "Albany",
    "Johns Creek",
  ],
  NC: [
    "Charlotte",
    "Raleigh",
    "Greensboro",
    "Durham",
    "Winston-Salem",
    "Fayetteville",
    "Cary",
    "Wilmington",
    "High Point",
    "Concord",
  ],
};

const states = Object.keys(cities);

const vehicleData = [
  { year: 2024, make: "Toyota", model: "Camry" },
  { year: 2023, make: "Honda", model: "Accord" },
  { year: 2024, make: "Ford", model: "F-150" },
  { year: 2022, make: "Chevrolet", model: "Silverado 1500" },
  { year: 2023, make: "Toyota", model: "RAV4" },
  { year: 2024, make: "Honda", model: "CR-V" },
  { year: 2022, make: "Nissan", model: "Altima" },
  { year: 2023, make: "Hyundai", model: "Tucson" },
  { year: 2024, make: "Ford", model: "Explorer" },
  { year: 2022, make: "Jeep", model: "Grand Cherokee" },
  { year: 2023, make: "Toyota", model: "Highlander" },
  { year: 2024, make: "Chevrolet", model: "Equinox" },
  { year: 2021, make: "Kia", model: "Sorento" },
  { year: 2023, make: "Subaru", model: "Outback" },
  { year: 2022, make: "Tesla", model: "Model 3" },
  { year: 2024, make: "GMC", model: "Sierra 1500" },
  { year: 2023, make: "Mazda", model: "CX-5" },
  { year: 2022, make: "Volkswagen", model: "Tiguan" },
  { year: 2024, make: "Toyota", model: "Tacoma" },
  { year: 2023, make: "Honda", model: "Pilot" },
];

const colors = [
  "White",
  "Black",
  "Silver",
  "Gray",
  "Red",
  "Blue",
  "Dark Blue",
  "Pearl White",
  "Charcoal",
  "Burgundy",
  "Green",
  "Bronze",
];

const agentNames = [
  "Rivera Insurance Agency",
  "Coastal Auto Insurance",
  "Summit Coverage Group",
  "Horizon Insurance Services",
  "Alliance Auto Group",
  "Premier Insurance Agency",
  "Eagle Insurance Partners",
  "Liberty Coverage Center",
  "Keystone Insurance Group",
  "Apex Auto Insurance",
];

// ── Utility helpers ──────────────────────────────────────────
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const pad = (n: number, len: number) => String(n).padStart(len, "0");

function generateVIN(): string {
  const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
  return Array.from(
    { length: 17 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

function formatPhone(): string {
  return `(${rand(200, 999)}) ${rand(200, 999)}-${pad(rand(1000, 9999), 4)}`;
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

// ── Company-specific policy number formats ───────────────────
function generatePolicyNumber(agencyId: string): string {
  switch (agencyId) {
    case "farmers":
      // Farmers: 01-XXXXXXX-X (two digits, 7 digits, 1 check digit)
      return `${pad(rand(1, 99), 2)}-${pad(rand(1000000, 9999999), 7)}-${rand(1, 9)}`;
    case "statefarm":
      // State Farm: XXX XXXX-XXX-XX
      return `${pad(rand(100, 999), 3)} ${pad(rand(1000, 9999), 4)}-${pad(rand(100, 999), 3)}-${pad(rand(10, 99), 2)}`;
    case "allstate":
      // Allstate: XXX XXX XXX X
      return `${pad(rand(100, 999), 3)} ${pad(rand(100, 999), 3)} ${pad(rand(100, 999), 3)} ${rand(1, 9)}`;
    case "progressive":
      // Progressive: XXXXXX-X (8-9 digit with dash)
      return `${pad(rand(10000000, 99999999), 8)}-${rand(1, 9)}`;
    case "geico":
      // GEICO: XXXXXXXXXX (10 digit)
      return pad(rand(1000000000, 9999999999), 10);
    case "libertymutual":
      // Liberty Mutual: AOS-XXX-XXXXXX-XX
      return `AOS-${pad(rand(100, 999), 3)}-${pad(rand(100000, 999999), 6)}-${pad(rand(10, 99), 2)}`;
    case "nationwide":
      // Nationwide: XXXX-XX-XXXXXX
      return `${pad(rand(1000, 9999), 4)}-${pad(rand(10, 99), 2)}-${pad(rand(100000, 999999), 6)}`;
    case "usaa":
      // USAA: XXX XX XXXX X
      return `${pad(rand(100, 999), 3)} ${pad(rand(10, 99), 2)} ${pad(rand(1000, 9999), 4)} ${rand(1, 9)}`;
    default:
      return `POL-${pad(rand(100000, 999999), 6)}`;
  }
}

function generateAgentCode(agencyId: string): string {
  switch (agencyId) {
    case "farmers":
      return `${pad(rand(1, 99), 2)}-${pad(rand(100, 999), 3)}`;
    case "statefarm":
      return pad(rand(10000000, 99999999), 8);
    case "allstate":
      return `R${pad(rand(100000, 999999), 6)}`;
    case "progressive":
      return `AG${pad(rand(10000, 99999), 5)}`;
    case "geico":
      return `GC${pad(rand(1000, 9999), 4)}`;
    case "libertymutual":
      return `LM${pad(rand(100000, 999999), 6)}`;
    case "nationwide":
      return `NW${pad(rand(10000, 99999), 5)}`;
    case "usaa":
      return `UA${pad(rand(10000, 99999), 5)}`;
    default:
      return `AGT-${pad(rand(1000, 9999), 4)}`;
  }
}

function generateCompanyPool(agency: Agency): string {
  return pick(agency.pools);
}

// ── Main generator ───────────────────────────────────────────
export function generateRandomPolicy(agency: Agency) {
  const state = pick(states);
  const city = pick(cities[state]);
  const firstName = pick(firstNames);
  const lastName = pick(lastNames);
  const veh1 = pick(vehicleData);
  const addVeh2 = Math.random() > 0.5;
  const veh2 = addVeh2 ? pick(vehicleData.filter((v) => v !== veh1)) : null;

  const zip = pad(rand(10000, 99999), 5);

  // Use a local Rapid City agent if we have one for this company
  const agencyLocalAgents = localAgents[agency.id];
  const localAgent = agencyLocalAgents ? pick(agencyLocalAgents) : null;

  // When using a local agent, insured location matches the agent's market
  const insuredCity = localAgent ? localAgent.city : city;
  const insuredState = localAgent ? localAgent.state : state;
  const insuredZip = localAgent
    ? pick(["57701", "57702", "57703", "57709"])
    : zip;
  const policyStateVal = localAgent ? localAgent.state : state;

  const today = new Date().toISOString().split("T")[0];
  const effectiveDate = today;
  const expirationDate = addMonths(today, 6);

  // Liability — weighted toward common tiers (most customers carry 100/300/100)
  const liabilityOptions = [
    "25/50/25",
    "25/50/25",
    "50/100/50",
    "100/300/100",
    "100/300/100",
    "100/300/100",
    "250/500/250",
    "500/500/500",
  ];
  const liability = pick(liabilityOptions);

  // UM/UIM — matches or exceeds liability
  const umOptions = ["25/50", "50/100", "100/300", "250/500"];
  const umBi = pick(umOptions);

  // Med Pay
  const medPayOptions = ["", "$1,000", "$2,000", "$5,000", "$10,000"];
  const medPay = pick(medPayOptions);

  const hasFullCoverage = Math.random() > 0.35;
  const collisionDed = hasFullCoverage
    ? pick(["$250", "$500", "$500", "$1,000", "$1,000", "$2,000"])
    : "";
  const comprehensiveDed = hasFullCoverage
    ? pick(["$100", "$250", "$500", "$500", "$1,000"])
    : "";
  const rental = hasFullCoverage
    ? pick([
        "",
        "$30/day (max $900)",
        "$40/day (max $1,200)",
        "$50/day (max $1,500)",
      ])
    : "";
  const roadside = pick([
    "",
    "",
    "Included — Basic",
    "Included — Basic",
    "Included — Premium",
  ]);

  const basePremium = rand(450, 1400);
  const veh2Premium = addVeh2 ? rand(180, 450) : 0;
  const totalPremium = (basePremium + veh2Premium).toFixed(2);
  const downPayment = (
    Math.ceil(((basePremium + veh2Premium) * 0.2) / 5) * 5
  ).toFixed(2);

  const dob = new Date(rand(1955, 2000), rand(0, 11), rand(1, 28))
    .toISOString()
    .split("T")[0];

  return {
    policyNumber: generatePolicyNumber(agency.id),
    effectiveDate,
    expirationDate,
    issueDate: today,
    agentName: localAgent ? localAgent.name : agency.shortName + " Insurance",
    agentPhone: localAgent ? localAgent.phone : agency.phone,
    agentAddress: localAgent
      ? [localAgent.address, localAgent.city, localAgent.state, localAgent.zip]
          .filter(Boolean)
          .join(", ")
      : agency.address,
    agentCode: generateAgentCode(agency.id),
    policyStatus: "Active",
    companyPool: generateCompanyPool(agency),
    naicNumber: String(Math.floor(10000 + Math.random() * 90000)),
    policyState: policyStateVal,
    insuredName: `${lastName.toUpperCase()}, ${firstName.toUpperCase()}`,
    insuredDOB: dob,
    insuredAddress: `${rand(100, 9999)} ${pick(streets)} ${pick(streetTypes)}`,
    insuredCity,
    insuredState,
    insuredZip,
    insuredPhone: formatPhone(),
    insuredEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${rand(1, 99)}@email.com`,
    vehYear: String(veh1.year),
    vehMake: veh1.make,
    vehModel: veh1.model,
    vehVin: generateVIN(),
    vehColor: pick(colors),
    veh2Year: veh2 ? String(veh2.year) : "",
    veh2Make: veh2?.make ?? "",
    veh2Model: veh2?.model ?? "",
    veh2Vin: veh2 ? generateVIN() : "",
    veh2Color: veh2 ? pick(colors) : "",
    coverage: hasFullCoverage ? "Full Coverage" : "Liability",
    liabilityCoverage: liability,
    umBiCoverage: umBi,
    medPayCoverage: medPay,
    collisionDed,
    comprehensiveDed,
    rentalCoverage: rental,
    rideshareCoverage: "",
    roadsideCoverage: roadside,
    vehicles: [],
    limit: liability,
    deductible: collisionDed || comprehensiveDed || "",
    totalPremium: `$${totalPremium}`,
    downPayment: `$${downPayment}`,
    paymentPlan: pick([
      "Monthly",
      "Monthly",
      "Monthly",
      "Quarterly",
      "Semi-Annual",
      "Paid in Full",
    ]),
    billingSchedule: pick([
      "Monthly — 1st",
      "Monthly — 5th",
      "Monthly — 15th",
      "Quarterly — 1st",
    ]),
    multiPolicyDiscount: Math.random() > 0.6,
    advanceQuoteDiscount: Math.random() > 0.7,
    claimFreeDiscount: Math.random() > 0.5,
    safeDriverDiscount: Math.random() > 0.55,
    paperlessDiscount: Math.random() > 0.4,
    paidInFullDiscount: false,
    affinityDiscount: Math.random() > 0.8,
    otherDiscount1: "",
    otherDiscount2: "",
  };
}
