export interface LocalAgent {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export const localAgents: Record<string, LocalAgent[]> = {

  farmers: [
    { name: 'Dave Schmidt',                  address: '2834 Jackson Blvd Ste 101',    city: 'Rapid City', state: 'SD', zip: '57702', phone: '(605) 342-5434' },
    { name: 'Jodi Lawrence',                 address: '1404 Mt Rushmore Rd',           city: 'Rapid City', state: 'SD', zip: '57701', phone: '(605) 718-7020' },
    { name: 'TJ Monlux Agency',              address: '610 East Blvd Suite 2',         city: 'Rapid City', state: 'SD', zip: '57701', phone: '(605) 593-4173' },
    { name: 'Jeffrey Wangen',                address: '2050 W Main St Suite 1',        city: 'Rapid City', state: 'SD', zip: '57702', phone: '(605) 342-5350' },
    { name: 'Farmers Union / Keller Agency', address: '1506 Mountain View Rd Ste 103', city: 'Rapid City', state: 'SD', zip: '57702', phone: '(605) 343-4213' },
    { name: 'Farmers Union / Lewis Agency',  address: '2906 W Omaha St',               city: 'Rapid City', state: 'SD', zip: '57701', phone: '(605) 342-3585' },
  ],

  statefarm: [
    { name: 'Jeff Johnson',    address: '1620 Mt Rushmore Rd Ste 200', city: 'Rapid City', state: 'SD', zip: '57701', phone: '(605) 791-3333' },
    { name: 'Bruce Kitterman', address: '1222 Oregon St',              city: 'Rapid City', state: 'SD', zip: '57701', phone: '(605) 348-2525' },
    { name: 'Dave Raml',       address: '2130 Jackson Blvd',           city: 'Rapid City', state: 'SD', zip: '57702', phone: '(605) 342-1827' },
    { name: 'Andy Ainslie',    address: '1839 W Main St #1',           city: 'Rapid City', state: 'SD', zip: '57702', phone: '(605) 348-3338' },
    { name: 'Scott Carlson',   address: '716 N Lacrosse St #100',      city: 'Rapid City', state: 'SD', zip: '57701', phone: '(605) 342-0188' },
    { name: 'Matt McCormick',  address: '716 N Lacrosse St #100',      city: 'Rapid City', state: 'SD', zip: '57701', phone: '(605) 348-0464' },
  ],

  allstate: [
    { name: 'Greg Geary', address: '3423 W Main St', city: 'Rapid City', state: 'SD', zip: '57702', phone: '(605) 341-2345' },
  ],

  // Progressive: sold through independent agencies in Rapid City
  progressive: [
    { name: 'Herrmann Insurance',           address: '821 Mt Rushmore Rd', city: 'Rapid City', state: 'SD', zip: '57701', phone: '(605) 718-2200' },
    { name: 'Barbo Agency',                 address: '540 Deadwood Ave',   city: 'Rapid City', state: 'SD', zip: '57702', phone: '(605) 342-6004' },
    { name: 'Black Hills Insurance Agency', address: '820 St Joseph St',   city: 'Rapid City', state: 'SD', zip: '57701', phone: '(605) 342-5555' },
  ],

  amfam: [
    { name: 'Davis & Associates',   address: '900 Jackson Blvd',    city: 'Rapid City', state: 'SD', zip: '57702', phone: '(605) 343-5956' },
    { name: 'Gene Hufford Agency',  address: '2127 Jackson Blvd',   city: 'Rapid City', state: 'SD', zip: '57702', phone: '(605) 342-7757' },
    { name: 'Michael J Holzwarth', address: '2720 W Main St #1',   city: 'Rapid City', state: 'SD', zip: '57702', phone: '(605) 342-1311' },
    { name: 'Kimberlee Eccleston', address: '405 E Omaha St C',     city: 'Rapid City', state: 'SD', zip: '57701', phone: '(605) 348-2007' },
  ],

  // Travelers: sold through independent agencies in Rapid City
  travelers: [
    { name: 'Parks Insurance West', address: '809 South St Suite 111', city: 'Rapid City', state: 'SD', zip: '57701', phone: '(605) 430-8877' },
  ],

  aaa: [
    { name: 'AAA South Dakota', address: '815 St Joseph St', city: 'Rapid City', state: 'SD', zip: '57701', phone: '(605) 342-8482' },
  ],

  // GEICO: no local Rapid City office — direct-to-consumer via web/phone
  // Liberty Mutual: no local office — use independent agencies
  // Nationwide: no local office found
  // USAA: membership-based, no local office — online/phone only

};
