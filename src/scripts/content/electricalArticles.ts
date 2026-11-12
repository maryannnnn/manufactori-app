export type ElectricalArticle = {
  slug: string
  title: string
  h1: string
  previewTitle: string
  previewText: string
  metaTitle: string // ~50-60 chars
  metaDescription: string // ~140-160 chars
  publishedAt: string // YYYY-MM-DD only
  image: string // filename in public/media
  alt: string // describe the image, not keyword-stuff the title
  blogCategorySlugs: string[] // primary first
  siteCategorySlugs: string[]
  sections: { heading: string; html: string }[] // html: <p>, <ul>, <li>, <a> only
  faq: { question: string; answer: string }[] // 4-6 each
  discussion: {
    buyerAuthor: string
    buyerRole: string
    buyerDate: string
    buyerBody: string[]
    expertDate: string
    expertBody: string[]
  }[] // 2-3 exchanges
}

export const ELECTRICAL_ARTICLES: ElectricalArticle[] = [
  // ---------------------------------------------------------------------------
  // 1. Electrical equipment manufacturing: processes, components, applications
  // ---------------------------------------------------------------------------
  {
    slug: 'electrical-equipment-manufacturing-processes-applications',
    title:
      'Electrical Equipment Manufacturing: Production Processes, Components and Industrial Applications',
    h1: 'Electrical Equipment Manufacturing: Production Processes, Components and Industrial Applications',
    previewTitle: 'Electrical Equipment Manufacturing: Processes and Applications',
    previewText:
      'How industrial electrical equipment is made: product groups, core components, winding, panel assembly, metal enclosures, testing and the points a buyer should specify.',
    metaTitle: 'Electrical Equipment Manufacturing: Processes and Uses',
    metaDescription:
      'How industrial electrical equipment is manufactured: product groups, components, winding, assembly, enclosures and testing, plus what buyers should specify.',
    publishedAt: '2026-05-22',
    image: 'blog-electrical-equipment-manufacturing.jpg',
    alt: 'Technician assembling wiring and busbars inside an industrial electrical cabinet',
    blogCategorySlugs: ['electrical-electronics-manufacturing', 'electrical-equipment-manufacturing'],
    siteCategorySlugs: ['electrical-equipment-manufacturing', 'electrical--electronic-equipment'],
    sections: [
      {
        heading: `Electrical and electronic equipment: where the line sits`,
        html: `<p>The two words are often used as one, but in manufacturing they describe different products and different factories. Electrical equipment generates, distributes, controls or converts electrical power: transformers, switchgear, motors, cables, protective devices and the enclosures that house them. Electronic equipment processes signals and controls current with semiconductors, and it is built mostly on printed circuit boards. A motor starter panel is electrical. The controller board inside a variable speed drive is electronic. Most industrial products contain both.</p>
<p>The distinction matters when you buy. An electrical manufacturer is organised around winding, metal fabrication, busbar work, wiring and high-voltage testing. An electronics manufacturer is organised around surface mount lines, soldering profiles, static control and functional test. A supplier strong in one is not automatically strong in the other, and a finished product often needs both to be coordinated.</p>
<p>The <a href="/industrial/electrical-electronics-manufacturing">Electrical &amp; Electronic Equipment Manufacturing</a> industry page covers the full range. This article concentrates on the electrical side: what is made, from what, by which processes, and what a buyer needs to state clearly to get a usable result.</p>`,
      },
      {
        heading: `Main product groups`,
        html: `<p>Industrial electrical equipment is easiest to understand by function. Each group has its own materials, its own production routes and its own typical failure modes.</p>
<ul>
<li>Power transformers and reactors: convert voltage levels or limit current. Built from laminated steel cores, copper or aluminium windings and insulation systems, either oil-filled or dry-type.</li>
<li>Switchgear and controlgear: switch, protect and isolate circuits. Low-voltage assemblies, motor control centres and distribution boards are the most common in factories.</li>
<li>Electric motors and generators: convert between electrical and mechanical energy. Stators, rotors, bearings and cooling arrangements define the product.</li>
<li>Cables, wiring harnesses and busbar systems: carry power and signals inside machines and between buildings. Conductor size, insulation type and termination quality are the main variables.</li>
<li>Protective and switching devices: circuit breakers, contactors, fuses, relays, isolators and surge protection. Usually bought as components and integrated into assemblies.</li>
<li>Enclosures, cabinets and cable management: sheet steel, stainless steel or polymer housings that protect the equipment and carry the mounting plate, cooling and cable entries.</li>
<li>Lighting and power supply equipment: industrial luminaires, rectifiers, chargers and uninterruptible power supply units, which cross the line into power electronics.</li>
</ul>
<p>A single project can span several groups. A packaged substation, for example, combines a transformer, medium and low-voltage switchgear, protection relays, metering and a metal or concrete housing.</p>`,
      },
      {
        heading: `Core components and materials`,
        html: `<p>Electrical equipment is built from a limited set of materials, and their quality decides much of the finished product's life. Copper and aluminium are the main conductors. Copper has higher conductivity and is easier to terminate reliably, while aluminium is lighter and cheaper by weight but needs suitable connectors and attention to joint preparation. Silicon steel laminations form transformer and motor cores, where grade and lamination thickness influence losses and noise.</p>
<p>Insulation is the second critical material group. Enamel on winding wire, impregnating varnish or resin, paper and film barriers, epoxy cast resin, mica and polymer sleeving all work under heat, voltage and mechanical stress. The insulation class and the operating temperature of the application have to match, otherwise service life shortens sharply.</p>
<p>Purchased components then complete the assembly: breakers, contactors, terminal blocks, relays, meters, cooling fans, gland plates and fixings. Their make, rating and approvals are usually fixed in the specification. Substituting a different brand or rating without agreement changes the short-circuit rating, heat dissipation and sometimes the certification basis of the whole assembly, so approved alternatives should be listed in advance.</p>`,
      },
      {
        heading: `How production runs from design to dispatch`,
        html: `<p>Routes vary by product, but the main stages are similar across most electrical equipment. Understanding them helps when you compare quotations, because suppliers differ in how many stages they perform themselves.</p>
<ul>
<li>Engineering and design: single-line diagrams, load and fault level calculations, component selection, layout drawings, thermal assessment and a bill of materials. Errors found here cost far less than errors found at test.</li>
<li>Material procurement and incoming inspection: conductors, laminations, components and enclosure steel are received, checked against the order and traced to batches.</li>
<li>Component manufacture: coil winding, lamination stacking, core assembly, rotor and stator work, busbar cutting, bending and plating, cable cutting and crimping.</li>
<li>Mechanical fabrication and finishing: cutting, punching, bending, welding and powder coating of enclosures and frames, covered in more detail below.</li>
<li>Assembly and wiring: mounting devices on plates, fitting busbars, cutting and ferruling wires, torque-controlled terminations and labelling to the drawings.</li>
<li>Impregnation, curing or filling: used for windings and cast products, where process time and temperature control affect insulation quality.</li>
<li>Inspection and testing: visual and dimensional checks, insulation and dielectric tests, functional checks and, for some products, heat-run or short-circuit related verification.</li>
<li>Documentation, packing and dispatch: test records, drawings, manuals and packaging suited to the transport route and storage conditions.</li>
</ul>
<p>Workmanship in wiring and terminations is a quiet source of field failures. A loose or wrongly crimped joint heats under load for months before it fails, so torque records and crimp checks are worth asking about.</p>`,
      },
      {
        heading: `Enclosures, busbars and metal fabrication`,
        html: `<p>A large share of the cost and lead time in electrical equipment sits in metalwork. Enclosures are cut, punched and bent from sheet steel, galvanised steel, stainless steel or aluminium, then welded or bolted, cleaned and coated. The finish and thickness depend on the environment: indoor clean rooms, outdoor substations, washdown food plants and coastal sites impose very different requirements.</p>
<p>Ingress protection is expressed with an IP code under IEC 60529, and mechanical impact resistance with an IK rating. The right values depend on where the equipment will stand and how it will be cleaned. A high IP rating also affects heat, because a sealed enclosure cannot rely on natural ventilation, so cooling by fans, filters, heat exchangers or air conditioning becomes part of the design.</p>
<p>Busbars are usually cut, punched and bent from copper or aluminium and often tin or silver plated at the contact surfaces. Clearances, creepage distances, support spacing and the ability to withstand short-circuit forces are calculated rather than estimated. Companies that need fabricated enclosures and frames at volume sometimes source them separately from a specialist; the <a href="/industrial/metalworking-metal-manufacturing">Metalworking &amp; Metal Manufacturing</a> category lists manufacturers who cut, form and finish sheet and structural steel.</p>`,
      },
      {
        heading: `Industrial applications`,
        html: `<p>Electrical equipment is bought for the process it serves, and the application sets the priorities. In manufacturing plants, the main needs are reliable motor control, distribution boards and power factor correction, with space and cooling constraints inside electrical rooms. In process industries, such as chemicals, oil and gas and mining, hazardous area requirements, corrosion resistance and long service intervals often dominate.</p>
<p>Utilities and energy projects use transformers, medium-voltage switchgear and protection systems to connect generation, storage and loads, which also links to <a href="/industrial/electrical-electronics-manufacturing/batteries-energy-storage-manufacturing">batteries and energy storage manufacturing</a> where stored energy is part of the system. Buildings and infrastructure need distribution boards, cable systems and lighting, and projects of this kind are often coordinated with suppliers in <a href="/industrial/building-products-construction-manufacturing">building products and construction manufacturing</a>.</p>
<p>Machine builders form a separate customer group. They want compact control cabinets that match a specific machine, arrive wired and tested, and come with documentation to the standards that apply to machinery in their market. For them, delivery repeatability and drawing discipline often matter as much as the unit price.</p>`,
      },
      {
        heading: `What to specify when ordering`,
        html: `<p>Vague enquiries produce quotations that cannot be compared. A usable specification does not need to be long, but it should state the following.</p>
<ul>
<li>Electrical data: supply voltage and frequency, earthing system, load list, required fault level or short-circuit withstand rating, and any harmonic or power quality concerns.</li>
<li>Environment: indoor or outdoor, ambient temperature range, altitude, humidity, dust, chemical exposure, vibration and washdown requirements.</li>
<li>Mechanical requirements: footprint limits, access from front or rear, cable entry direction, lifting arrangements, finish and colour.</li>
<li>Component preferences: required brands or equivalent approved makes, communication protocols and any customer standard parts.</li>
<li>Applicable standards and market: where the equipment will be installed and operated, since the standards, marking and documentation expected there differ.</li>
<li>Testing and witness requirements: routine tests, any type test evidence needed, factory acceptance tests and the records to be supplied.</li>
<li>Documentation: drawings, schematics, bills of materials, manuals, spare parts lists and the file format for each.</li>
</ul>
<p>If a requirement is unclear, ask the manufacturer to list their assumptions in the quotation. Differences in assumptions explain most price gaps between suppliers.</p>`,
      },
      {
        heading: `Standards, testing and documentation`,
        html: `<p>There is no single standard that applies to all electrical equipment. The relevant ones depend on the product type, the voltage level, the intended use and the market of installation. Low-voltage switchgear and controlgear assemblies are commonly built to IEC 61439, electrical equipment of machines to IEC 60204-1, and power transformers to the IEC 60076 series, while regional rules such as CE or UKCA marking and national installation codes sit on top. Each of these has its own scope and its own list of required checks.</p>
<p>Ask the manufacturer which standard they build to, which tests are performed on every unit, which are performed on a design type only, and who holds the evidence. Routine tests on each assembly commonly include visual inspection, insulation and dielectric checks, protective circuit continuity and functional operation, but the exact list depends on the standard and product. Record sheets signed against a serial number are more useful than a generic declaration.</p>
<p>When you are comparing suppliers, the <a href="/industrial/electrical-electronics-manufacturing/electrical-electronic-equipment">electrical and electronic equipment</a> category helps to find manufacturers by product type. Good documentation at handover reduces commissioning time and makes later maintenance far simpler.</p>`,
      },
    ],
    faq: [
      {
        question: 'What is the difference between electrical and electronic equipment?',
        answer:
          'Electrical equipment handles electrical power: generating, distributing, switching, converting and using it. Examples are transformers, switchgear, motors and cables. Electronic equipment controls current with semiconductors and processes signals, and is usually built on printed circuit boards. Many industrial products, such as drives and control panels, combine both.',
      },
      {
        question: 'Which standards apply to industrial electrical equipment?',
        answer:
          'It depends on the product, the voltage level, the intended use and the country of installation. IEC 61439 is commonly used for low-voltage assemblies and IEC 60204-1 for machine electrical equipment, but other products have their own standards, and regional marking and installation rules may add requirements. Confirm the applicable set with the manufacturer for your specific case.',
      },
      {
        question: 'Why does enclosure rating affect cooling?',
        answer:
          'A higher ingress protection rating means a more sealed enclosure, which blocks dust and water but also limits natural airflow. Heat from devices then has to be removed by filtered fans, heat exchangers or air conditioning, or the layout and component derating have to account for it.',
      },
      {
        question: 'Should enclosures be bought from the same supplier as the electrical assembly?',
        answer:
          'Often it is simpler, because one party owns fit, finish and wiring. For large volumes or special materials, a separate fabricator may be cheaper or faster. The key is to agree drawings, tolerances and finish in writing, and to confirm who is responsible for fit at assembly.',
      },
      {
        question: 'What should a quotation for electrical equipment include?',
        answer:
          'It should list the design basis and assumptions, the standard to be applied, the main components with makes and ratings, enclosure details, tests and documents included, lead time and what is excluded. Items such as site installation, commissioning and transport are frequently excluded and should be stated.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Industrial equipment buyer',
        buyerRole: 'Buyer',
        buyerDate: '2026-05-27',
        buyerBody: [
          'We are comparing three quotations for the same distribution boards and the prices differ a lot. The specification was a single-line diagram and a load list. Where should we look first to understand the gap?',
        ],
        expertDate: '2026-05-29',
        expertBody: [
          'Start with assumptions rather than totals. With only a single-line diagram and a load list, each supplier has had to guess several things: the required fault level, the form of internal separation, the make of the main components, the enclosure rating and the tests included. A quotation using a cheaper breaker range or a lower short-circuit rating will look better on price while meeting a different requirement.',
          'Ask each supplier to restate their quotation against the same short sheet: fault level, standard, component makes, enclosure rating, routine tests, documents and exclusions. Once that is done the remaining difference usually comes down to material quality, labour content and what is left out, which is much easier to judge.',
        ],
      },
      {
        buyerAuthor: 'Engineering manager',
        buyerRole: 'Engineering manager',
        buyerDate: '2026-06-03',
        buyerBody: [
          'Is it acceptable to let the manufacturer substitute components if the delivery date is at risk? We have had panels delayed by one missing device before.',
        ],
        expertDate: '2026-06-05',
        expertBody: [
          'It can be acceptable, but only as a controlled change and not as a workshop decision. A substitute needs to match the electrical rating, the breaking capacity, the physical size, the heat dissipation and, where the assembly was verified against a design standard, the verification basis. A device that fits the mounting rail may still change the short-circuit rating of the assembly.',
          'The practical approach is to agree a list of approved alternatives with the manufacturer before the order is confirmed, and to require written approval for anything outside it. Any substitution should then appear on the as-built drawings and in the bill of materials you receive.',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. Electronic manufacturing and PCB assembly
  // ---------------------------------------------------------------------------
  {
    slug: 'electronic-manufacturing-pcb-assembly-processes',
    title:
      'Electronic Manufacturing and PCB Assembly: Printed Circuit Boards, Components and Production Processes',
    h1: 'Electronic Manufacturing and PCB Assembly: Printed Circuit Boards, Components and Production Processes',
    previewTitle: 'Electronic Manufacturing and PCB Assembly Processes',
    previewText:
      'The difference between PCB fabrication and assembly, how surface mount and through-hole lines work, and the inspection, sourcing and design points that decide yield.',
    metaTitle: 'PCB Assembly and Electronics Manufacturing Processes',
    metaDescription:
      'How PCB fabrication and assembly differ, how SMT and through-hole lines work, and which design, sourcing and inspection points decide quality and yield.',
    publishedAt: '2026-06-24',
    image: 'blog-pcb-electronics-manufacturing.jpg',
    alt: 'Populated printed circuit board passing through an automated surface mount production line',
    blogCategorySlugs: ['electrical-electronics-manufacturing', 'pcb-assembly'],
    siteCategorySlugs: ['pcb-assembly', 'electronics-manufacturing'],
    sections: [
      {
        heading: `Three stages that are often confused`,
        html: `<p>When a buyer asks for "PCB manufacturing", the request can mean three different things, and suppliers answer them differently. The first is bare board fabrication: producing the printed circuit board itself from laminate, copper and solder mask, with drilled holes and a surface finish but no components. The second is PCB assembly, often written PCBA: placing and soldering components onto the finished board. The third is full electronic manufacturing, which adds programming, enclosure fitting, cabling, final assembly, test, packaging and sometimes aftersales repair.</p>
<p>These stages use different equipment and different expertise. Board fabricators run chemical, plating and lamination processes. Assemblers run printing, placement and soldering lines. A company can do one or both, or can manage the other stage through a partner. Knowing which stage you are actually buying prevents the usual surprise of a lead time that excludes board delivery or component sourcing.</p>
<p>The wider <a href="/industrial/electrical-electronics-manufacturing/electronics-manufacturing">electronics manufacturing</a> category lists producers across these stages. This article describes how each stage works and where the quality of the result is decided.</p>`,
      },
      {
        heading: `Printed circuit boards: structure and materials`,
        html: `<p>A printed circuit board is a layered structure of copper conductors on an insulating base. The most common base material is glass-reinforced epoxy laminate, usually described as FR-4, though grades differ in glass transition temperature, thermal expansion and dielectric properties. High-frequency designs may need specialised laminates, high-power or LED designs may use metal-core boards, and products that must bend use flexible polyimide circuits, sometimes combined with rigid sections.</p>
<p>Boards range from single-sided to multilayer constructions with many copper layers. Layers are connected by plated through-holes, and denser designs add blind or buried vias and microvias. Copper thickness is chosen according to current and heat, since a power board carrying high current needs thicker copper than a signal board.</p>
<p>The surface finish protects exposed copper and affects solderability and shelf life. Common choices include hot air solder levelling, electroless nickel immersion gold, immersion silver or tin, and organic solderability preservatives. Each has trade-offs in flatness, cost, storage life and suitability for fine-pitch parts or wire bonding, so the choice should follow the assembly process and the product's environment and not just the price.</p>`,
      },
      {
        heading: `How bare boards are fabricated`,
        html: `<p>Board fabrication begins with the design files, normally Gerber or ODB++ data with drill files, a stack-up drawing and a fabrication note. The fabricator's engineering team checks the data against its process limits, such as minimum track width, spacing, hole size, aspect ratio and annular ring, and raises queries before production starts.</p>
<ul>
<li>Inner layers are imaged, etched and inspected, then laminated into a multilayer panel under heat and pressure.</li>
<li>Holes are drilled, cleaned and plated with copper to connect the layers.</li>
<li>Outer layers are imaged, plated and etched to form the final circuit pattern.</li>
<li>Solder mask and legend are applied, and the surface finish is added.</li>
<li>Boards are routed or scored to shape, electrically tested for opens and shorts, inspected and packed.</li>
</ul>
<p>Qualification of rigid boards is often referenced to the IPC-6012 family, and the class chosen, from general electronics to high-reliability, changes inspection criteria. Impedance-controlled designs need the fabricator to confirm the stack-up and measure test coupons. Not every product needs the highest class, and specifying it without need adds cost.</p>`,
      },
      {
        heading: `SMT, through-hole and mixed assembly`,
        html: `<p>Most modern assemblies are built mainly with surface mount technology. Solder paste is printed onto the pads through a stencil, a pick-and-place machine places components from reels and trays, and the board passes through a reflow oven with a controlled temperature profile that melts the paste and forms the joints. Where components are fitted on both sides, the process runs twice, with adhesive or part weight holding the first side in place.</p>
<p>Through-hole components, such as connectors, large capacitors, transformers and power parts, still have a place where mechanical strength or current rating requires it. They are soldered by wave soldering, selective soldering or by hand. Mixed assemblies combine both and need careful sequencing, because each thermal step stresses the components already in place.</p>
<p>Process control sits behind the equipment. Stencil design, paste storage and handling, oven profiles checked against the paste and component limits, nozzle maintenance on placement heads and humidity control for moisture-sensitive parts all influence the yield. When evaluating an assembler, ask how profiles are verified, how often, and what happens to a lot that falls outside limits.</p>`,
      },
      {
        heading: `Inspection and test inside the line`,
        html: `<p>Defects are cheapest to catch near where they are made. A typical line therefore includes inspection after printing, after placement and after reflow. Automated optical inspection compares the assembled board against a programmed reference and flags missing, shifted, reversed or tombstoned parts and many solder defects. X-ray inspection is used for joints that cannot be seen, such as ball grid arrays and bottom-terminated components, and for voiding checks in power pads.</p>
<p>Electrical test then verifies the board. In-circuit test uses a fixture of probes, flying probe test moves probes over the board without a dedicated fixture and suits lower volumes, and functional test powers the board and exercises it as the product will use it. Boundary scan and on-board programming can be combined with these where the design supports them. The choice depends on volume, design access and the cost of a field failure.</p>
<p>It helps to be clear that inspection and testing check different things. Optical and X-ray inspection check the build against the design, and electrical test checks behaviour. Passing one does not guarantee the other, and the test coverage that is actually achieved should be discussed in the quotation stage.</p>`,
      },
      {
        heading: `Components, sourcing and traceability`,
        html: `<p>Component supply is often the largest schedule risk in electronics manufacturing. A bill of materials lists manufacturer part numbers, and approved alternatives should be defined in advance. Long lead times, allocation and end-of-life notices can force a redesign or a requalification, so the supply situation of key parts, especially microcontrollers, memory, power devices and connectors, deserves review before the order. Many of those parts originate in <a href="/industrial/electrical-electronics-manufacturing/semiconductor-manufacturing">semiconductor manufacturing</a>, and their lead times follow that industry's capacity.</p>
<p>Source from franchised distributors or the manufacturer directly wherever possible. Counterfeit and suspect parts are a documented risk in the open market, and a low price on a scarce part is a reason to ask where it came from. Incoming inspection, certificates of conformance and lot traceability reduce the risk.</p>
<p>Moisture-sensitive devices need handling to the manufacturer's moisture sensitivity level, including controlled storage and baking before reflow where required. Lead-free soldering, in line with RoHS restrictions where they apply, runs hotter than tin-lead processes, and the components and boards must be rated for it. Traceability that links a finished serial number to board lot, component lots and process records allows a problem to be contained to a small batch.</p>`,
      },
      {
        heading: `Design for manufacturability`,
        html: `<p>Many production problems begin in the design. A board that is correct electrically can still be difficult to build, and the cheapest time to fix that is before release. Design for manufacturability review covers the practical details that the schematic does not show.</p>
<ul>
<li>Pad and land patterns that match the component datasheets and the assembler's process.</li>
<li>Spacing between components for placement, inspection and rework access.</li>
<li>Fiducials, panelisation and tooling edges so that machines can locate and handle the board.</li>
<li>Thermal relief and copper balance to prevent tombstoning and warp.</li>
<li>Test points and access for in-circuit or functional test, plus programming connectors.</li>
<li>Silkscreen, polarity marking and reference designators that are readable after assembly.</li>
</ul>
<p>Ask a prospective manufacturer whether a DFM review is included and what the output looks like. A written list of queries before the first build is a sign of an engineering-led supplier, while silence followed by problems on the first batch is a warning.</p>`,
      },
      {
        heading: `From board to finished product`,
        html: `<p>Many industrial products need more than an assembled board. Conformal coating protects against humidity, dust and condensation and must be applied and masked properly around connectors. Potting or encapsulation adds protection and mechanical support at the cost of repairability. Cable assemblies, enclosures, labelling, firmware loading, calibration and final test make up what is often called box build.</p>
<p>The finished product also has to meet the rules of its market. Depending on its use and where it is sold, these may include electromagnetic compatibility, electrical safety, radio equipment and hazardous substance requirements. They are product obligations that sit with the brand owner or manufacturer of record, so the contract should define who prepares the technical file and who pays for any testing.</p>
<p>Telecommunications and network products add radio frequency, antenna and protocol requirements; the <a href="/industrial/electrical-electronics-manufacturing/telecommunications-equipment">telecommunications equipment</a> category covers manufacturers in that field. For control products and industrial electronics, the broader <a href="/industrial/electrical-electronics-manufacturing">industrial electronics production</a> page gives the starting point for a supplier search.</p>`,
      },
    ],
    faq: [
      {
        question: 'What is the difference between PCB fabrication and PCB assembly?',
        answer:
          'PCB fabrication produces the bare board from laminate and copper, with drilled holes, solder mask and a surface finish. PCB assembly places and solders components onto that board. They use different processes and are often performed by different companies, so quotations should state which is included.',
      },
      {
        question: 'When is through-hole assembly still needed?',
        answer:
          'Through-hole is used for parts that need mechanical strength or high current capacity, such as connectors, large capacitors, transformers and power components. Many assemblies mix surface mount and through-hole parts, with wave, selective or hand soldering for the latter.',
      },
      {
        question: 'Is automated optical inspection enough to guarantee board quality?',
        answer:
          'No. Optical inspection checks the visible build against a reference, and X-ray covers hidden joints. Neither proves the board behaves correctly. Electrical and functional tests are needed to verify behaviour, and the coverage depends on how the board and test fixtures are designed.',
      },
      {
        question: 'Why does the surface finish of a PCB matter?',
        answer:
          'It protects the copper and determines solderability, shelf life, pad flatness and suitability for fine-pitch components or wire bonding. The right finish depends on the assembly process, storage time and product environment, so it should be chosen with the assembler and not left to default.',
      },
      {
        question: 'Who should be responsible for component sourcing?',
        answer:
          'Either side can, but responsibility must be written down. Turnkey assembly places sourcing with the manufacturer, which simplifies logistics but needs an approved vendor list. Consigned or partial turnkey puts supply with the customer, who then carries the schedule risk for those parts.',
      },
      {
        question: 'What information should be sent to get a PCB assembly quotation?',
        answer:
          'Send the bill of materials with manufacturer part numbers, board data, assembly drawings, quantity and forecast, test requirements, quality class, coating or box build needs and any restrictions such as lead-free or RoHS compliance. Complete data reduces queries and quotation errors.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Electronics manufacturer',
        buyerRole: 'Product developer',
        buyerDate: '2026-06-30',
        buyerBody: [
          'Our first prototype run worked, but pilot batches show a small share of boards failing at functional test. How do we find out whether this is design, components or the assembly process?',
        ],
        expertDate: '2026-07-02',
        expertBody: [
          'Begin by classifying the failures rather than fixing them one by one. Group failed boards by symptom and, where possible, by board lot, component lot, panel position and date of assembly. Patterns usually appear quickly: failures clustering on one panel position point to a process issue such as printing or oven profile, failures tied to a component lot point to supply, and failures spread evenly across all lots often indicate a design margin problem such as timing, tolerance or thermal limits.',
          'Ask the assembler for the inspection and process data for the affected lots, including optical and X-ray results and any profile records. Then take a handful of failed boards for failure analysis, and swap suspect components between good and bad boards to confirm. Keep the assembler and your design team in the same discussion, because each holds half of the evidence.',
        ],
      },
      {
        buyerAuthor: 'Procurement specialist',
        buyerRole: 'Procurement specialist',
        buyerDate: '2026-07-08',
        buyerBody: [
          'A key component is on allocation and the assembler has offered stock from an independent broker. Is that a risk worth taking to save the production schedule?',
        ],
        expertDate: '2026-07-10',
        expertBody: [
          'It is a risk that can be managed but not ignored. Parts from the open market have a higher chance of being counterfeit, remarked or poorly stored, and for a critical device such as a processor or a power transistor, a failure may only show after delivery. The first question is whether the manufacturer can supply or allocate the part directly, or whether an approved equivalent exists that you can qualify.',
          'If the broker route is the only one, agree the controls beforehand: documentation of the supply chain, incoming inspection that may include visual, electrical and in some cases decapsulation checks, limited initial quantities, and enhanced test of the first boards built with those parts. Make the decision in writing and record the lot, so that it can be traced if problems appear later.',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 3. Industrial control systems and power electronics
  // ---------------------------------------------------------------------------
  {
    slug: 'industrial-control-systems-power-electronics-manufacturing',
    title:
      'Industrial Control Systems and Power Electronics Manufacturing: PLCs, Drives and Electrical Automation Equipment',
    h1: 'Industrial Control Systems and Power Electronics Manufacturing: PLCs, Drives and Electrical Automation Equipment',
    previewTitle: 'Industrial Control Systems and Power Electronics Manufacturing',
    previewText:
      'PLCs, drives, power supplies and control panels explained: what each does, how control engineering differs from panel building and site installation, and how to specify them.',
    metaTitle: 'Industrial Control Systems and Power Electronics',
    metaDescription:
      'PLCs, drives, soft starters and power supplies for industry: how control engineering, panel manufacturing and site installation differ and how to specify each.',
    publishedAt: '2026-07-28',
    image: 'blog-industrial-control-power-electronics.jpg',
    alt: 'Control cabinet with a PLC, variable speed drives and terminal rows in a factory electrical room',
    blogCategorySlugs: ['electrical-electronics-manufacturing', 'industrial-control-systems'],
    siteCategorySlugs: ['industrial-control-systems', 'power-electronics'],
    sections: [
      {
        heading: `What industrial control and power electronics do`,
        html: `<p>An industrial control system decides what a machine or process should do and commands it to do so. Power electronics supplies and shapes the electrical energy that makes it happen. A programmable logic controller reads sensors, runs a program and switches outputs. A variable speed drive takes fixed-frequency mains supply and delivers a controlled voltage and frequency to a motor. A power supply converts mains into the stable low-voltage direct current that controllers, sensors and instruments need.</p>
<p>The two disciplines meet inside the control cabinet. Logic and communication sit alongside power conversion and switching, and they interact: drives produce electrical noise that can disturb signal wiring, and drives and supplies produce heat that the cabinet has to remove. Equipment from <a href="/industrial/industrial-machinery-equipment/industrial-automation-components">industrial automation components</a> suppliers is typically combined with fabricated and wired assemblies into a working system.</p>
<p>This article explains the main device families, how they are built, and how to separate the three jobs that are often bundled under one quotation: control engineering, panel manufacturing and site installation.</p>`,
      },
      {
        heading: `Controllers, HMIs and industrial networks`,
        html: `<p>The programmable logic controller is the standard device for machine and process sequencing. Modern PLCs are modular: a processor, input and output modules for digital and analogue signals, communication interfaces and power supply. Programming languages for them are standardised in IEC 61131-3, which covers ladder diagram, function block diagram, structured text and others, though each vendor has its own engineering software and its own dialect.</p>
<p>Larger plants with many control loops may use distributed control systems or supervisory systems on top of PLCs. Smaller machines may use compact controllers or motion controllers integrated with drives. A human-machine interface, usually a touch panel, lets operators see status, alarms and set parameters.</p>
<p>Controllers talk to field devices and to each other over industrial networks such as PROFINET, EtherNet/IP, Modbus, CANopen and IO-Link, among others. The choice is often driven by the installed base and by the device makers a plant already uses. A mixed network is possible, but it requires gateways and extra engineering, so network type should be fixed early. Where a machine is part of a wider cell, the <a href="/industrial/industrial-machinery-equipment/industrial-automation-robotics">industrial automation and robotics</a> category covers the equipment around it.</p>`,
      },
      {
        heading: `Drives, soft starters and motor control`,
        html: `<p>Motors are the largest electrical load in most factories, and how they are started and controlled affects energy use, mechanical wear and process quality. There are several control options with different purposes.</p>
<ul>
<li>Direct-on-line and star-delta starters: simple and inexpensive, suitable where inrush current and mechanical shock are acceptable.</li>
<li>Soft starters: limit starting current and torque by ramping voltage. They do not control speed during running.</li>
<li>Variable frequency drives: control speed and torque continuously, which suits pumps, fans, conveyors, mixers and machine axes. Requirements for adjustable speed electrical power drive systems are covered in the IEC 61800 series.</li>
<li>Servo drives: provide precise position, speed and torque control for motion applications, normally paired with a matched motor and feedback device.</li>
</ul>
<p>Drives have practical installation consequences. They generate harmonic currents on the supply and switching noise on motor cables, so line reactors, filters, shielded motor cable and correct earthing are often needed. Long motor cables and certain motors may call for output filters. Cooling and derating at higher ambient temperature or altitude should be checked against the manufacturer's data. These are engineering topics that decide whether a drive installation runs quietly for years or causes recurring trips.</p>`,
      },
      {
        heading: `Power supplies, converters and conditioning`,
        html: `<p>Power electronics extends beyond drives. Switched-mode power supplies convert alternating current to regulated direct current, usually at 24 V in industrial control. DC-DC converters change voltage levels, inverters create alternating current from batteries or solar sources, rectifiers and chargers supply batteries, and uninterruptible power supplies bridge outages for critical loads.</p>
<p>Selection depends on more than voltage and current. Input range and tolerance to sags, efficiency, heat output, inrush current, redundancy options and the ability to support peak loads all matter. Control power is often backed up, so that a controller can shut a process down safely during a supply failure. Energy storage systems combine batteries and converters, and for these projects the <a href="/industrial/electrical-electronics-manufacturing/batteries-energy-storage-manufacturing">batteries and energy storage manufacturing</a> category shows who supplies cells, modules and systems.</p>
<p>Power electronics are semiconductor-based and are sensitive to temperature. Component life, particularly electrolytic capacitors, falls with heat, so thermal design is a reliability matter. A device specified for 40 degrees Celsius inside a sealed cabinet that reaches 55 will not perform as the datasheet suggests.</p>`,
      },
      {
        heading: `Control engineering, panel manufacturing and site installation`,
        html: `<p>Three distinct activities are frequently sold together, and the contract should say who does what. They require different skills and carry different responsibilities.</p>
<ul>
<li>Control engineering: defining the functional design, writing the electrical schematics, selecting components, programming the controller and HMI, configuring drives and networks, and preparing the documentation. Output is a design and a working program.</li>
<li>Panel manufacturing: building the cabinet to those drawings, with mounting plates, wiring, terminal blocks, busbars, labelling, cooling and testing in a workshop. Output is a tested physical assembly.</li>
<li>Site installation and commissioning: mounting the panel, running and terminating field cables, connecting sensors and motors, checking I/O, tuning loops and proving the system with the process. Output is a system working on site.</li>
</ul>
<p>A panel builder may take a customer's drawings and build exactly to them, with no responsibility for the design. A systems integrator may design and program but outsource the wiring. A single supplier may do all three. None of these arrangements is wrong, but responsibility for errors, change control and documentation has to follow the arrangement. Problems usually appear at the handovers: drawings that do not match the built panel, or software that was never tested with the real devices.</p>
<p>For a manufacturer-side view of these capabilities, the <a href="/industrial/electrical-electronics-manufacturing">electronic equipment and control systems production</a> page is a useful starting point when you need to find who builds panels and who engineers them.</p>`,
      },
      {
        heading: `Building a control panel: what quality looks like`,
        html: `<p>Control panels for machinery are commonly built with reference to IEC 60204-1 for the electrical equipment of machines, and many panels are also assessed against IEC 61439 for low-voltage assemblies, depending on the application and market. Safety of machinery adds functional safety requirements through standards such as ISO 13849-1 or IEC 62061 for safety-related control functions, such as emergency stops and guard interlocks. The scope that applies depends on the machine and where it is used, so ask the panel builder what they build to and who is responsible for the safety function design.</p>
<p>Quality shows in details. Wire sizing that reflects current and grouping, ferrules on stranded conductors, torque-controlled terminals, segregation of power and signal wiring, clear labels on every wire and device that match the schematic, space for heat to leave, and easily reachable terminals for service. A clean, tidy panel is not decoration. Tidy wiring is easier to inspect and fault-find, and it usually reflects a process that is in control.</p>
<p>Specify spare capacity in space, terminals and power supply, as most plants add devices later. The allowance should be set from your real expansion plans rather than a fixed rule.</p>`,
      },
      {
        heading: `Testing, handover and the factory acceptance test`,
        html: `<p>A control system should be proved before it leaves the workshop, because faults found on site cost much more to correct. Panel testing normally includes visual and mechanical inspection against the drawings, wiring verification, insulation and dielectric checks, protective earth continuity and functional tests of power and control circuits. The exact tests depend on the standard and the product.</p>
<p>For systems with programmed logic, a factory acceptance test goes further. The panel is powered up, the program is loaded, inputs are simulated, outputs are checked and sequences, alarms, interlocks and communications are run against an agreed test procedure. Where possible, motors, drives and instruments are connected or simulated. The customer or a representative can witness it, and the signed record becomes part of the handover.</p>
<p>Site acceptance then repeats the critical checks in the real installation. Agree in advance what the test procedures are, who writes them, what counts as a pass and how changes found during testing are recorded. Software versions, backups, passwords and the licences for engineering tools should be delivered at handover and not left with the integrator.</p>`,
      },
      {
        heading: `How to specify and evaluate a supplier`,
        html: `<p>A clear specification saves time and money. Start with a functional description of what the machine or process must do, then a list of inputs and outputs, motor and load data, network and software requirements, and preferred device brands. Include environmental conditions, safety requirements and the standards expected in your market.</p>
<p>When evaluating suppliers, look at the evidence rather than claims. Ask for example schematics and documentation, a description of their testing procedure, a list of component makes they usually use, how they manage software versions and how they handle changes after approval. Ask about service after delivery: spare parts, remote support and response times.</p>
<p>Standardisation helps in the long term. Using the same controller family, drive brand and communication protocol across a plant lowers spare parts inventory and training effort. If you already have a preferred platform, state it. If you do not, choose with support and lifecycle in mind, because a control platform will usually stay in use for many years.</p>`,
      },
    ],
    faq: [
      {
        question: 'What is the difference between a PLC and a variable frequency drive?',
        answer:
          'A PLC is a controller that reads inputs, runs a program and switches outputs. A variable frequency drive is a power electronic converter that controls the speed and torque of an AC motor. In practice the PLC commands the drive over digital signals or a network.',
      },
      {
        question: 'Does a control panel builder also design the control system?',
        answer:
          'Not necessarily. Some panel builders only build to the customer\'s drawings, while others also provide engineering and programming. The contract should state who designs, who programs, who builds and who commissions, along with responsibility for documentation.',
      },
      {
        question: 'Which standards apply to industrial control panels?',
        answer:
          'It depends on the application and the market. IEC 60204-1 is widely used for electrical equipment of machines and IEC 61439 for low-voltage assemblies. Safety functions may fall under ISO 13849-1 or IEC 62061. Regional marking and installation rules also apply, so confirm with the builder for your case.',
      },
      {
        question: 'Why do drives need filters and shielded cables?',
        answer:
          'Drives switch at high frequency, which creates electrical noise and harmonic currents. Line reactors or filters reduce harmonics on the supply, and shielded motor cable with proper earthing limits interference with other equipment. The need depends on the installation and the drive manufacturer\'s guidance.',
      },
      {
        question: 'What is a factory acceptance test?',
        answer:
          'A factory acceptance test is a structured check of the finished panel or system in the manufacturer\'s workshop against an agreed procedure, before shipment. It normally includes inspection, electrical safety checks and functional testing of programmed sequences and alarms, and it can be witnessed by the customer.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Engineering manager',
        buyerRole: 'Engineering manager',
        buyerDate: '2026-08-04',
        buyerBody: [
          'We want to buy a control panel for a new line. A panel builder offered to build from our drawings, while an integrator offered a turnkey package. How do we decide which route fits us?',
        ],
        expertDate: '2026-08-06',
        expertBody: [
          'The deciding factor is where your own competence sits. If you have an in-house control team that can produce complete schematics, a bill of materials and the program specification, building from your drawings gives you control and often a lower price. The panel builder is then responsible for workmanship and testing, and you hold the design responsibility and the risk of errors in the drawings.',
          'A turnkey integrator suits a project where you want one party to be responsible for the function, from design to commissioning. You pay for that responsibility, and you should check the documentation you will receive, the intellectual property terms for the software, and how future changes will be handled. Either route works if the scope and handover documents are clear.',
        ],
      },
      {
        buyerAuthor: 'Industrial equipment buyer',
        buyerRole: 'Buyer',
        buyerDate: '2026-08-12',
        buyerBody: [
          'Our drives trip intermittently after installation on a conveyor line, and the supplier says the installation is at fault. What are the common causes we should check first?',
        ],
        expertDate: '2026-08-14',
        expertBody: [
          'Intermittent trips on new drive installations usually come from a short list of causes. Check the supply for voltage sags and unbalance, the motor cable length and type against the drive manufacturer\'s limits, the earthing and shield terminations at both ends, and the settings for acceleration, current limits and motor data. Ambient temperature and ventilation inside the panel are another frequent cause, since a drive that reaches its thermal limit will trip or derate.',
          'Record the fault codes and the conditions at the time of each trip, because the code usually points to overcurrent, overvoltage, overtemperature or earth fault. Review the drive and motor wiring against the manufacturer\'s installation guide before assigning responsibility, and ask both the panel builder and the installer to confirm in writing what they did.',
        ],
      },
      {
        buyerAuthor: 'Quality manager',
        buyerRole: 'Quality manager',
        buyerDate: '2026-08-20',
        buyerBody: [
          'What should we ask to see at a factory acceptance test, so that it is more than a demonstration?',
        ],
        expertDate: '2026-08-24',
        expertBody: [
          'Agree a written test procedure before the test, with each step linked to a requirement in the functional specification. It should cover safety circuits, emergency stop behaviour, interlocks, alarms, each operating mode, communications with other systems, and the behaviour of the system when power is lost and restored. Where physical devices cannot be connected, the simulation method should be stated and accepted in advance.',
          'Record every step with result, date, name and software version, and keep the list of open issues with agreed owners and deadlines. Ask for a copy of the final program and configuration files on the day. A test that has a signed record and a version-controlled program is a useful baseline for commissioning and for later fault finding.',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 4. Testing and quality control
  // ---------------------------------------------------------------------------
  {
    slug: 'electrical-electronic-equipment-testing-quality-control',
    title:
      'Electrical and Electronic Equipment Testing and Quality Control: Safety, Reliability and Manufacturing Standards',
    h1: 'Electrical and Electronic Equipment Testing and Quality Control: Safety, Reliability and Manufacturing Standards',
    previewTitle: 'Electrical and Electronic Equipment Testing and Quality Control',
    previewText:
      'How testing differs from certification, which routine and type tests apply, how in-process control and reliability testing work, and what a buyer should ask to see.',
    metaTitle: 'Electrical Equipment Testing and Quality Control',
    metaDescription:
      'Safety, EMC and reliability testing for electrical and electronic equipment, how testing differs from certification, and what manufacturers should document.',
    publishedAt: '2026-09-15',
    image: 'blog-electrical-testing-quality.jpg',
    alt: 'Engineer connecting test leads to an electrical assembly on a calibrated test bench',
    blogCategorySlugs: ['electrical-electronics-manufacturing', 'quality-inspection'],
    siteCategorySlugs: ['quality-inspection', 'electrical-equipment'],
    sections: [
      {
        heading: `Testing, inspection and certification are not the same thing`,
        html: `<p>Buyers often read "tested" as "certified" and the reverse, and that confusion produces expensive surprises. The terms describe separate activities with different owners.</p>
<ul>
<li>Inspection checks that a product matches its drawings and workmanship criteria: dimensions, labelling, wiring, solder joints, finish.</li>
<li>Testing measures behaviour: electrical safety, function, performance, environmental resistance. It can be done by the manufacturer, by an independent laboratory or by the customer.</li>
<li>Certification or conformity assessment is a formal decision that a product meets the requirements of a defined standard or regulation. It may rely on test reports, a factory audit and ongoing surveillance, and it is issued by a certification body or declared by the manufacturer, depending on the scheme.</li>
</ul>
<p>A product can be tested thoroughly and never certified. A certificate can cover a product type tested years ago, while a unit delivered today has had nothing but a quick function check. Both facts are normal, and the way to protect yourself is to ask exactly what has been done to your units and what evidence exists.</p>
<p>The range of products involved, from distribution boards to control electronics, is covered in the <a href="/industrial/electrical-electronics-manufacturing/electrical-electronic-equipment">electrical and electronic equipment</a> category. The right test regime differs a lot between them, which is why generic quality promises tell you little.</p>`,
      },
      {
        heading: `Type tests, routine tests and acceptance tests`,
        html: `<p>Most product standards separate tests by purpose and by frequency. Understanding the categories avoids both under-testing and paying for tests that serve no purpose.</p>
<p>Type tests, sometimes called design verification, prove that a design meets the standard. They are performed on a representative sample and can include temperature rise, short-circuit withstand, dielectric strength, mechanical operation and environmental tests. They are expensive and are normally repeated only when the design changes materially. A manufacturer may hold type test reports for the design or for the components used in it, and you can ask for the report and check it applies to the configuration you are buying.</p>
<p>Routine tests, or production tests, are done on every unit or on an agreed sampling basis, to find workmanship faults and material defects. They are quick and aimed at catching the errors of the build. Acceptance tests are agreed between buyer and seller for a particular order, such as a factory acceptance test with witness, and may add performance checks beyond routine tests. Sampling plans, where used, should state the sample size and the rule for rejecting a lot.</p>
<p>The split depends on the product standard, so always ask which standard defines the type tests and which defines the routine ones for your equipment.</p>`,
      },
      {
        heading: `Electrical safety tests in production`,
        html: `<p>Electrical safety testing aims to confirm that the equipment will not harm a person or start a fire under normal use and foreseeable faults. The typical production checks are well established, even though limits and methods depend on the product standard.</p>
<ul>
<li>Protective earth continuity: verifies that exposed conductive parts are connected to the earth terminal with low resistance.</li>
<li>Insulation resistance: measures the resistance of insulation between live parts and earth, which indicates contamination, moisture or damage.</li>
<li>Dielectric withstand, often called hi-pot: applies a high test voltage between circuits and to earth to confirm that insulation can withstand overvoltage without breakdown.</li>
<li>Leakage and touch current measurement for equipment where limits apply.</li>
<li>Functional checks of protective devices, interlocks and emergency stops.</li>
</ul>
<p>High-voltage testing must be done by trained people in a controlled test area, and sensitive electronics can be damaged if the test is applied to circuits that were not meant to take it. Test procedures therefore state what to disconnect or bridge. Ask whether the manufacturer's test equipment is calibrated, and how often. Insulation testers and earth bond testers whose calibration has lapsed produce numbers that look reassuring and mean nothing.</p>`,
      },
      {
        heading: `In-process control for electronic assemblies`,
        html: `<p>For electronics, quality control starts well before final test. Incoming inspection checks components and boards against the purchase order, with verification of lot codes, packaging condition and, for critical parts, sample testing. Storage control covers humidity-sensitive devices and static protection, since electrostatic discharge can damage devices without any visible mark. Handling in an ESD protected area is commonly managed with reference to IEC 61340-5-1.</p>
<p>Inspection and testing then follow the process: optical inspection after printing and reflow, X-ray for hidden joints, in-circuit or flying probe test, functional test and final inspection. Acceptability of soldered assemblies is commonly judged to IPC-A-610 and soldering requirements to J-STD-001, with the product class, from general to high-performance, agreed with the customer. Class selection changes the criteria for joints, cleanliness and workmanship, and it drives cost, so specify it deliberately.</p>
<p>Many shops also use statistical process control on critical parameters, track first-pass yield and defect type by station and apply corrective action when a trend appears. Ask to see an example of a corrective action record, since it shows how the supplier deals with problems and not only how it reports success.</p>`,
      },
      {
        heading: `Electromagnetic compatibility and environmental testing`,
        html: `<p>Electronic and many electrical products must neither emit disturbances that affect other equipment, nor malfunction when exposed to normal disturbances. Electromagnetic compatibility testing covers emissions, both radiated and conducted, and immunity to electrostatic discharge, fast transients, surges, radio frequency fields and supply variations. The IEC 61000 series defines many of the test methods, and the requirements for a given product come from product or generic standards and from the market rules where it is sold.</p>
<p>Formal EMC measurement needs a suitable facility with a controlled environment. For an example of the facility side of this field, see the <a href="/case-studies/vimpel-engineering-anechoic-chambers">Vimpel Engineering anechoic chambers case study</a>. Many manufacturers run pre-compliance checks in their own labs during development to reduce the chance of a failed formal test, but a pre-compliance result is not a formal one.</p>
<p>Environmental testing checks behaviour under conditions of use. This includes temperature extremes and cycling, damp heat, vibration and shock, dust and water ingress against the IP rating, salt mist for coastal or marine equipment, and sometimes altitude. The test levels should come from the real use environment and the applicable standard, not from habit. Over-specifying adds cost, and under-specifying results in field failures.</p>`,
      },
      {
        heading: `Reliability: burn-in, life testing and what MTBF really means`,
        html: `<p>Reliability describes how long equipment keeps working correctly in service. Manufacturing can influence it through screening, and design determines the rest. Burn-in or environmental stress screening operates units, often at elevated temperature or with temperature cycling, to trigger early failures in a factory and not at a customer's site. It is more commonly applied to complex electronics, power supplies and high-reliability products than to simple assemblies.</p>
<p>Life tests and accelerated tests on samples estimate wear-out behaviour, for example of capacitors, relays, connectors or fans, under stress that is higher than normal. Interpretation needs care, because acceleration models are based on assumptions about failure mechanisms.</p>
<p>Mean time between failures is often quoted in datasheets. It is a statistical figure for a population, usually calculated from component failure rate data under stated conditions or derived from testing. It is not a guaranteed life for one unit and cannot be compared across suppliers unless the same method and conditions were used. When a supplier quotes MTBF, ask for the method, the temperature and the environment assumed. Warranty terms, repair statistics and the manufacturer's field return process often say more about reliability than the number alone.</p>`,
      },
      {
        heading: `Traceability, calibration and records`,
        html: `<p>Testing is only useful if its results can be trusted and traced. Calibration of measuring and test equipment against reference standards, with records and intervals, is a basic requirement of a quality system. Accredited laboratories work to ISO/IEC 17025, and where a test report from an independent laboratory matters, check that its accreditation covers the specific test.</p>
<p>Traceability links a finished serial number to its materials, process steps, test results and the people or stations involved. When a field problem appears, this lets the manufacturer find all units that share the same cause, contain the issue and avoid a broad recall. For high-value or safety-related products, traceability is a requirement rather than a luxury.</p>
<p>A quality management system certified to ISO 9001 shows that processes are defined, audited and improved, but it does not say anything by itself about product safety or performance. Treat it as a base. Sector requirements, such as those for automotive, medical or railway products, add their own standards, and apply only if your product belongs to that sector.</p>`,
      },
      {
        heading: `Failure analysis, corrective action and what to ask a supplier`,
        html: `<p>Even good processes produce defects, so the way a manufacturer responds to them is a better indicator than a claim of zero defects. A solid process isolates the failed unit, analyses the cause, with visual, electrical and sometimes microscopic or cross-section methods, identifies the root cause and not only the symptom, and implements a corrective action that is checked later.</p>
<p>When evaluating a manufacturer's test and quality capability, these requests give a quick picture:</p>
<ul>
<li>The test plan for your product, listing routine, type and any acceptance tests, with the standard each refers to.</li>
<li>Type test reports or certificates that relate to your configuration, and who issued them.</li>
<li>Calibration records for the test equipment used on your product.</li>
<li>Sample test record for a delivered unit, with serial number, date, result and operator or station.</li>
<li>First-pass yield and the way nonconforming product is controlled and recorded.</li>
<li>An example of a corrective action report with root cause and follow-up.</li>
</ul>
<p>For power and control hardware, <a href="/industrial/electrical-electronics-manufacturing">electrical and electronic manufacturing</a> suppliers who build to a defined test plan will usually answer these without difficulty. Hesitation is useful information.</p>`,
      },
    ],
    faq: [
      {
        question: 'What is the difference between testing and certification?',
        answer:
          'Testing measures how a product behaves, for example its insulation strength or electromagnetic emissions. Certification or conformity assessment is a formal decision that a product meets the requirements of a standard or regulation, and it may rely on test reports, audits and surveillance. A tested product is not necessarily certified.',
      },
      {
        question: 'What is a type test and what is a routine test?',
        answer:
          'A type test proves that a design meets a standard and is performed on a sample, usually once per design. A routine test is carried out on each unit or on a sampling basis during production to find workmanship and material faults. Product standards define which tests belong to which group.',
      },
      {
        question: 'What does a hi-pot test check?',
        answer:
          'A dielectric withstand test applies a high voltage between live circuits and earth, or between separate circuits, to check that insulation can withstand overvoltage without breaking down. It must be done to the product standard\'s procedure, because electronics that are not designed for it can be damaged.',
      },
      {
        question: 'Is MTBF a guaranteed service life?',
        answer:
          'No. MTBF is a statistical estimate for a population under stated conditions, often calculated from component data. It does not describe the life of one unit. Ask for the method and conditions behind it, and consider warranty terms and field return data as well.',
      },
      {
        question: 'Does ISO 9001 certification mean the product is safe?',
        answer:
          'No. ISO 9001 certifies that a quality management system meets a standard for process control and improvement. Product safety and performance depend on design, product standards, testing and the applicable regulations, which are separate from the management system.',
      },
      {
        question: 'Should I ask for an independent test report?',
        answer:
          'For safety-critical, regulated or new designs, yes. An independent laboratory report adds credibility, provided the laboratory is competent and its scope covers the test. For routine production, the manufacturer\'s own calibrated test records with traceability are usually the working evidence.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Quality manager',
        buyerRole: 'Quality manager',
        buyerDate: '2026-09-21',
        buyerBody: [
          'A supplier sent a certificate for their product family, but the units we bought have a different configuration. How do we know whether the certificate covers what we receive?',
        ],
        expertDate: '2026-09-23',
        expertBody: [
          'Read the certificate and its attached test report for scope. They normally list the product model or range, the ratings, the standard and edition, the manufacturing site and the configurations covered. If your configuration has different ratings, other main components or a different enclosure, it may fall outside the verified design, even if the model name looks the same.',
          'Ask the supplier in writing to confirm how your configuration relates to the certified design, and request the report sections that support it. If the answer is unclear, additional verification may be needed. Also check the certificate date and whether the standard has since been revised, since the market may expect conformity to the current edition.',
        ],
      },
      {
        buyerAuthor: 'Electronics manufacturer',
        buyerRole: 'Quality engineer',
        buyerDate: '2026-09-29',
        buyerBody: [
          'Our product passed its first EMC test in a laboratory, but a later production batch failed an emissions check. What could have changed?',
        ],
        expertDate: '2026-10-01',
        expertBody: [
          'EMC performance is sensitive to small changes, so the first step is a comparison between the tested sample and the failed batch. Look at component substitutions, especially switching regulators, capacitors, ferrites and connectors, changes in board revision or layer stack, cable type and routing, enclosure seams and earthing, and the firmware versions that alter clock or switching behaviour.',
          'Then repeat the measurement on the failed units and on a retained unit from the original sample, in the same setup. If the original passes and the batch does not, the difference is in the product. If both fail, the test setup or the cable arrangement may differ. Putting a change control process in place for EMC-relevant parts prevents a repeat.',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 5. Choosing a manufacturer
  // ---------------------------------------------------------------------------
  {
    slug: 'choosing-electrical-electronics-manufacturer-supplier-evaluation',
    title:
      'Choosing an Electrical and Electronics Manufacturer: Technical Specifications, Quality, Certification and Supplier Evaluation',
    h1: 'Choosing an Electrical and Electronics Manufacturer: Technical Specifications, Quality, Certification and Supplier Evaluation',
    previewTitle: 'How to Choose an Electrical and Electronics Manufacturer',
    previewText:
      'A buyer\'s framework for supplier selection: preparing a specification, checking capability and certification, assessing sourcing and engineering support, and managing risk.',
    metaTitle: 'How to Choose an Electrical and Electronics Manufacturer',
    metaDescription:
      'A practical framework for evaluating electrical and electronics manufacturers: specification, capability, certification, sourcing, samples and supplier risk.',
    publishedAt: '2026-10-21',
    image: 'blog-choose-electrical-electronics-supplier.jpg',
    alt: 'Buyer and engineer reviewing a printed circuit board and technical drawings during a factory visit',
    blogCategorySlugs: ['electrical-electronics-manufacturing', 'supplier-discovery'],
    siteCategorySlugs: ['supplier-discovery', 'procurement-buyer-acquisition'],
    sections: [
      {
        heading: `Start with what you are actually buying`,
        html: `<p>Supplier selection goes wrong most often because the buying task was never defined clearly. "An electrical manufacturer" could mean a company that builds switchgear, one that assembles circuit boards, one that engineers and programs control systems, or one that supplies a standard product from stock. They are different businesses with different strengths.</p>
<p>Write down the category first. Are you buying a build-to-print product from your own drawings, a product to a functional specification where the supplier does the design, or a standard catalogue product with some customisation? Each case puts the design responsibility in a different place, and with it the risk, the intellectual property position and the way you assess a supplier.</p>
<p>Next, define the volume pattern. A prototype, a short pilot series, a stable annual volume and a project delivered once need different suppliers. A shop that is excellent at high-volume electronics may not welcome a batch of ten, and a project-oriented panel builder may have no process for repeat orders over several years. The <a href="/industrial/electrical-electronics-manufacturing">electrical and electronics manufacturing</a> industry pages can narrow the field by product type, but the first filter is always your own requirement.</p>`,
      },
      {
        heading: `Preparing a technical package that suppliers can quote`,
        html: `<p>A complete enquiry makes suppliers' answers comparable and shows which of them ask intelligent questions. It should contain what a competent engineer needs to build and test the product, and nothing vague.</p>
<ul>
<li>Drawings and data: schematics, assembly drawings, board data, bills of materials with manufacturer part numbers, firmware or programs where relevant.</li>
<li>Performance requirements: electrical ratings, environmental conditions, expected life and duty cycle.</li>
<li>Applicable standards and the destination market, with a statement of who holds the responsibility for conformity and marking.</li>
<li>Test requirements: routine tests, special tests, witness points and the records to be supplied.</li>
<li>Quantities: first order, annual forecast and the flexibility expected on schedule.</li>
<li>Packaging, labelling, delivery terms and documents that must accompany shipments.</li>
<li>Commercial terms to be quoted: price breaks, tooling and non-recurring costs, payment terms, warranty.</li>
</ul>
<p>Keep a short list of questions for the suppliers, for example which items of the specification they would change, which they see as risky and what they assume where the data is silent. The suppliers whose answers contain engineering content are usually the ones worth pursuing.</p>`,
      },
      {
        heading: `Assessing real capability`,
        html: `<p>Brochures describe what a company wishes it could do. Evidence describes what it does. The assessment should cover three things: which processes the supplier has in house, which it outsources, and how it controls the outsourced ones.</p>
<p>For electronics, look at the surface mount lines and their placement accuracy range, the soldering capability for through-hole and fine-pitch parts, inspection equipment such as optical and X-ray, test capability, and cleanliness and ESD control. For electrical equipment, look at winding, metalworking and finishing capacity, the assembly and wiring floor, high-voltage and functional test equipment, and lifting and handling for large units. For control systems, ask about engineering staff, software tools used and how projects are managed.</p>
<p>Outsourcing is normal and not a fault. A panel builder buying enclosures from a metal fabricator, or an assembler using an outside board fabricator, is common practice. What matters is that the supplier knows its subcontractors, audits them and takes responsibility for the result. Where metal enclosures and frames form a large share of your product, the <a href="/industrial/metalworking-metal-manufacturing">metalworking and metal manufacturing</a> category can also help you find a fabricator directly, if you prefer to control that part of the chain.</p>`,
      },
      {
        heading: `Quality systems, certificates and how to verify them`,
        html: `<p>Certification is evidence worth checking, but it is only useful if you understand what it covers. A management system certificate such as ISO 9001 states that the company's processes are audited against a quality standard. Sector-specific schemes for automotive, medical or railway work add further requirements, and they matter only if your product belongs to that sector. Environmental and safety management certificates describe the company and not your product.</p>
<p>Product approvals are different. Conformity marks, laboratory reports and listings relate to a specific product, standard and sometimes a manufacturing site. Which ones you need depends on the product type, voltage, use and market. There is no universal list, and a supplier who claims every certificate for every product deserves a question or two. Ask which certificates apply to your product, request copies, and read the scope, the validity dates, the issuing body and the standard edition.</p>
<p>Certificates can be verified. Most certification bodies keep public databases, and the certificate number should match. A supplier who is slow to provide copies or who offers a certificate in another company's name should be treated carefully. Remember that inspection visits, even short ones, tell you more than documents: look at the state of the floor, the way nonconforming material is segregated, the calibration labels on instruments and whether the staff can explain their own procedures.</p>`,
      },
      {
        heading: `Engineering support, sourcing and lifecycle`,
        html: `<p>A manufacturer is more than a machine park. Engineering support affects first-time success, particularly on new designs. Ask whether a design for manufacturability review is part of the process, how engineering queries are raised and answered, and who in the company will be your technical contact. Review how changes are controlled: a request for change, an assessment, approval and a recorded update of drawings and the bill of materials.</p>
<p>Sourcing capability deserves a direct discussion. Which components does the supplier buy from the manufacturers or franchised distributors, how does it handle allocation and obsolescence, what is its policy on substitutions, and how does it protect against counterfeit parts? For products with a long service life, ask what happens when a component goes out of production. Semiconductors and specialist parts follow the <a href="/industrial/electrical-electronics-manufacturing/semiconductor-manufacturing">semiconductor manufacturing</a> market cycle, and long-lifecycle products need a plan for last-time buys, alternatives and redesign.</p>
<p>Spare parts and repair support matter after delivery. Ask how long the supplier will hold spares, who repairs returned units, what the typical turnaround is and what documents it provides to your maintenance team. The cheapest quotation can become the most expensive if a failed unit takes weeks to repair and there is no replacement.</p>`,
      },
      {
        heading: `Samples, pilot orders and audits`,
        html: `<p>Do not commit full volume on documents alone. A staged approach limits risk. Start with a prototype or sample order that tests the supplier's understanding of the design, then a pilot batch that exercises production processes and tests, and only then the full run.</p>
<p>When samples arrive, inspect them against the specification, and not just for function. Check the markings, documents, packaging, test records and conformity with the bill of materials. Open one unit if allowed, and examine workmanship, torque marks, wire dressing and solder quality. Record every deviation and require a formal reply with corrective action.</p>
<p>An audit can be done by the buyer, a third party or, for small orders, by questionnaire and video review. It should cover the quality system, process control, incoming inspection, calibration, traceability, handling of nonconforming product, and how the supplier treats corrective actions. If you cannot visit, ask for photographs and records from the production of your own product. If you are looking for suppliers at an early stage, comparing several companies in the <a href="/industrial/electrical-electronics-manufacturing/electrical-electronic-equipment">electrical and electronic equipment</a> category lets you shortlist before spending on visits.</p>`,
      },
      {
        heading: `Commercial terms, intellectual property and risk`,
        html: `<p>The technical decision sits alongside a contract, and the contract should deal with the risks that technical teams sometimes neglect. Intellectual property terms must say who owns the design, tooling, test fixtures and firmware, and what the manufacturer may or may not do with them. A confidentiality agreement should be in place before drawings are shared.</p>
<p>Warranty needs a clear scope: duration, what counts as a defect, who pays for removal and reinstallation, and response times. Specify the process for returns and failure analysis. Delivery terms, including the incoterm, packaging suitable for the route, insurance and the documents to travel with the goods, should be stated, along with penalties or remedies for late delivery if the project needs them.</p>
<p>Think about concentration risk too. A sole-source supplier of a critical product, single-sourced key components, or a supplier whose capacity is almost fully used by a larger customer can all affect your schedule. Where the volume justifies it, qualify a second source, or at least hold design data in a form that allows transfer. Payment terms, advance payments for tooling and the financial position of the supplier belong in the same discussion, particularly for custom projects.</p>`,
      },
      {
        heading: `Red flags and a practical shortlist process`,
        html: `<p>Several signals consistently predict trouble. A supplier that quotes quickly with no questions has probably not read the specification. One who agrees to every requirement without comment may not understand them. Reluctance to show test records, vague answers on subcontracting, certificates that do not match the product, unusually low prices on parts that are known to be scarce and pressure to confirm an order before your questions are answered are all reasons to slow down.</p>
<p>A practical process keeps selection orderly. First define the category and the specification package. Then identify perhaps five to eight candidates from directories, referrals and industry contacts, and send the same enquiry to all of them. Score the replies on technical understanding, capability evidence, quality system, certification fit, sourcing approach and commercial terms. Visit or audit the top two or three, run a sample order, and decide after you have seen the product and the paperwork.</p>
<p>The same approach works for different product types. Whether you are looking for <a href="/industrial/electrical-electronics-manufacturing/telecommunications-equipment">telecommunications equipment</a>, control panels or assembled boards, and whether you seek <a href="/industrial/electrical-electronics-manufacturing">electrical equipment manufacturing capabilities</a> for a one-off project or for series production, the chain of definition, evidence and staged commitment is what reduces risk.</p>`,
      },
    ],
    faq: [
      {
        question: 'What should I prepare before asking manufacturers for a quotation?',
        answer:
          'Prepare drawings and schematics, a bill of materials with manufacturer part numbers, performance and environmental requirements, applicable standards and the destination market, test requirements, quantities and forecast, packaging and delivery needs and the commercial terms you want quoted.',
      },
      {
        question: 'How can I check whether a supplier\'s certificate is genuine?',
        answer:
          'Check the certificate number, scope, validity dates and issuing body, and confirm it in the certification body\'s public database where one exists. Make sure the certificate names the supplier and, for product approvals, covers your product, standard edition and manufacturing site.',
      },
      {
        question: 'Do I need a supplier with every possible certification?',
        answer:
          'No. The relevant certifications depend on the product, voltage, intended use and market. A management system certificate such as ISO 9001 is a common baseline, and product approvals are required only where the product and market call for them. Ask what applies to your case.',
      },
      {
        question: 'Is it a problem if the manufacturer outsources part of the process?',
        answer:
          'Not by itself. Outsourcing of board fabrication, metalwork or finishing is common. The questions are whether the supplier controls and audits its subcontractors, tells you about them where relevant and takes full responsibility for the delivered product.',
      },
      {
        question: 'Why start with samples or a pilot batch?',
        answer:
          'Samples and pilot batches test whether the supplier understands the design and whether production and test processes work, before volume is committed. They reveal problems with documentation, components, workmanship and communication at a stage when correction is cheap.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Procurement specialist',
        buyerRole: 'Procurement specialist',
        buyerDate: '2026-10-27',
        buyerBody: [
          'We have three shortlisted suppliers with similar prices. One has more certificates, one is closest to us and one offered the fastest lead time. How should we weigh these?',
        ],
        expertDate: '2026-10-29',
        expertBody: [
          'Treat those three as secondary criteria until the technical fit is confirmed. Number of certificates says little unless they cover your product and market. Distance is helpful for audits and logistics but does not improve quality, and a fast lead time is only valuable if the supplier has real capacity and supply for the components you need. A lead time that depends on parts the supplier has not yet ordered is a promise with no basis.',
          'Score each supplier on the same list: understanding of your specification, evidence of capability for your product type, quality records, sourcing approach, engineering support and commercial terms. Add the risk factors, such as dependence on one customer or single-source parts. A sample order or a visit usually settles the choice better than any desk comparison.',
        ],
      },
      {
        buyerAuthor: 'Industrial equipment buyer',
        buyerRole: 'Buyer',
        buyerDate: '2026-11-03',
        buyerBody: [
          'We are moving a control cabinet design from one supplier to another. What should we make sure we receive from the first supplier before the transfer?',
        ],
        expertDate: '2026-11-05',
        expertBody: [
          'The contract should have defined this earlier, but it is not too late to ask. You need the complete current documentation: electrical schematics in editable format, panel layout drawings, bills of materials with manufacturer part numbers and approved alternatives, wire and cable lists, labelling schemes and the test procedures and records.',
          'For programmed equipment, request the controller and HMI programs, drive parameter files, software versions, licence information and any passwords. Compare the documents against one built panel, because as-built differences are common. Then ask the new supplier to review the package, raise queries and build a pilot unit that you check before the full transfer.',
        ],
      },
    ],
  },
]
